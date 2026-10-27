# Custom S3 Subdomain with SSL on kolla-ansible OpenStack Clouds

## Overview

This guide covers setting up a custom S3 subdomain (e.g. `s3.example.com`)
with a Let's Encrypt SSL cert on a kolla-ansible OpenStack cloud, fronted
by haproxy. Optionally covers wildcard cert for virtual-hosted-style bucket
addressing (e.g. `mybucket.s3.example.com`).

---

## Prerequisites

- SSH access to one of the control nodes of the target cloud
- DNS control over the domain being used
- RGW is running on all three control nodes on port 8080
- `certbot` installed on the control node (`dnf install certbot -y`)

---

## Step 1 - DNS Records

### Path-style only (`s3.example.com/bucketname`)

Create one A record pointing to the IP of any one of the three control nodes:

```bash
s3.example.com → <control-node IP>
```

### With virtual-hosted style (`bucketname.s3.example.com`)

Create two A records:

```bash
s3.example.com      → <control-node IP>
*.s3.example.com    → <control-node IP>
```

Verify propagation before proceeding:

```bash
dig +short s3.example.com
dig +short test.s3.example.com   # for wildcard
```

---

## Step 2 - Verify Node Readiness

SSH into the control node whose IP the domain points to and run the following
checks.

Confirm the IP is bound on the interface:

```bash
ip -br a | grep <control-node IP>
```

Confirm `:443` is not already bound on that IP. The VIP will
have `:443` - that's expected. The control node's own IP should be free:

```bash
ss -tnlp | grep -E ':443|:80 '
```

Confirm RGW is listening on `:8080`:

```bash
ss -tnlp | grep 8080
```

Note the IPs of all three control nodes from the haproxy RGW
config - you'll need them later:

```bash
cat /etc/kolla/haproxy/services.d/ceph-rgw.cfg
```

---

## Step 3 - Issue Let's Encrypt Certificate

### Path-style only (HTTP-01 challenge)

Simpler option - certbot binds temporarily to the control node's IP
on `:80`. Auto-renews via systemd timer.

```bash
certbot certonly --standalone --http-01-address <control-node IP> \
  --agree-tos -m you@example.com -d s3.example.com
```

### With wildcard (DNS-01 challenge)

Required for wildcard certs. Does **not** auto-renew - must be repeated
manually every 90 days.

```bash
certbot certonly --manual --preferred-challenges dns \
  --agree-tos -m you@example.com \
  -d s3.example.com -d *.s3.example.com
```

Certbot will pause twice and ask you to add TXT records
at `_acme-challenge.s3.example.com`. Add both records (same name, two values),
verify propagation, then press Enter each time:

```bash
dig +short TXT _acme-challenge.s3.example.com
```

Both values should be returned before continuing.

**Note:** If a single-domain cert already exists for `s3.example.com`, certbot
will ask to Expand - select `E`.

---

## Step 4 - Assemble and Deploy the Cert

Assemble fullchain + privkey into a single pem file that haproxy expects:

```bash
cat /etc/letsencrypt/live/s3.example.com/fullchain.pem \
    /etc/letsencrypt/live/s3.example.com/privkey.pem \
    > /etc/kolla/certificates/s3.example.com.pem
```

Copy into the Docker volume that the haproxy container reads from:

```bash
cp /etc/kolla/certificates/s3.example.com.pem \
   /var/lib/docker/volumes/letsencrypt_certificates/_data/
```

The in-container path is `/etc/haproxy/certificates/` - this is what the
haproxy config references.

---

## Step 5 - Add HAProxy Frontend Config

Create `/etc/kolla/haproxy/services.d/s3-public.cfg`:

```bash
frontend radosgw_external_front_ssl
    mode http
    http-request deny if { path -i -m beg /server-status }
    http-request del-header X-Forwarded-Proto
    option httplog
    option forwardfor
    http-request set-header X-Forwarded-Proto https if { ssl_fc }
    bind <control-node IP>:443 ssl crt /etc/haproxy/certificates/s3.example.com.pem alpn h2,http/1.1
    default_backend radosgw_external_back_ssl

backend radosgw_external_back_ssl
    mode http
    server <control-node-1 IP> <control-node-1 IP>:8080 check inter 2000 rise 2 fall 5
    server <control-node-2 IP> <control-node-2 IP>:8080 check inter 2000 rise 2 fall 5
    server <control-node-3 IP> <control-node-3 IP>:8080 check inter 2000 rise 2 fall 5
```

Restart haproxy:

```bash
docker restart haproxy
```

Wait a few seconds for it to come back up, then test:

```bash
curl -I https://s3.example.com
```

---

## Step 6 - Enable Virtual-Hosted Style Bucket Addressing (Optional)

For `bucketname.s3.example.com` style URLs, RGW needs to know the S3 domain
via `rgw_dns_name`. Without this, RGW won't parse the bucket name out of
the subdomain.

Set the config (cluster-wide, run from any control node):

```bash
ceph config set client.rgw rgw_dns_name s3.example.com
```

Verify it was set:

```bash
ceph config get client.rgw rgw_dns_name
```

Restart RGW on **all three control nodes** - the config change is stored in
the cluster DB but each daemon only reads it on startup:

```bash
docker ps | grep rgw   # get container name
docker restart <rgw_container_name>
```

Test virtual-hosted style:

```bash
curl -I https://mybucket.s3.example.com
curl -I https://mybucket.s3.example.com/object.jpg
```

---

## Upgrading from Path-Style to Wildcard

If a single-domain cert was issued first and wildcard is needed later:

1. Ensure `*.s3.example.com` DNS A record is live and propagated
2. Run the certbot DNS-01 command from Step 3 - it will ask to Expand
3. Reassemble the pem, copy to the Docker volume, restart haproxy (Steps 4-5)
4. No changes needed to `s3-public.cfg`
