---
sidebar_position: 8
---

# Create an HTTPS-Terminated Load Balancer

This guide covers the steps needed to create an HTTPS-terminated load balancer
using the command line.

This guide applies to OpenMetal clouds running OpenStack Yoga with Barbican enabled.

Before starting there are few things to prepare:

- A Python [virtual environment with OpenStackClient installed](docs/operators-manual/day-1/command-line/openstackclient.md)
- Obtain a TLS certificate from an external certficate authority
- Create 2 VMs, ensuring they are on the same network.

Two VMs have been created on a network called `private_net_1`, reachable by
`10.0.0.57` and `10.0.0.250`. NGINX has been installed to each and is listening
on port 80. Security groups for ICMP and HTTP have been added to each VM. A TLS
certificate from an external certificate authority has been acquired.

## Initial Preparation

In your virtual environment, install the `stable/yoga` branch of `python-octaviaclient`:

```sh
pip install git+https://github.com/openstack/python-octaviaclient@stable/yoga
```

The CA certificate chain, TLS certificate, and private key are layed out in a
directory like so:

```sh
$ ls cert
ca-certs.pem  server.crt  server.key
```

## Procedure

Create a copy of the certificate in PKCS#12 format using `openssl`:

```sh
openssl \
  pkcs12 -export \
  -inkey server.key \
  -in server.crt \
  -certfile ca-chain.crt \
  -passout pass: \
  -out server.p12
```

Store the SSL certificate as a secret using Barbican:

```sh
openstack secret store \
  --name='tls_secret1' \
  -t 'application/octet-stream' \
  -e 'base64' \
  --payload="$(base64 < server.p12)"
```

Create the load balancer and ensure it is on the same network as your VMs:

```sh
openstack loadbalancer create \
  --name lb1 \
  --vip-subnet-id private_net_1
```

Create a listener with protocol `TERMINATED_HTTPS`, listening on port `443`,
using the certificate secret uploaded earlier:

```sh
openstack loadbalancer listener create \
  lb1 \
  --protocol TERMINATED_HTTPS \
  --protocol-port 443 \
  --name listener1 \
  --default-tls-container-ref $(openstack secret list | awk '/ tls1 / {print $2}')
```

Create a `ROUND_ROBIN` pool using the `HTTP` protocol:

```sh
openstack loadbalancer pool create \
  --name pool1 \
  --lb-algorithm ROUND_ROBIN \
  --listener listener1 \
  --protocol HTTP
```

Create 2 members using the appropriate IPs for your VMs:

```sh
openstack loadbalancer member create \
  --subnet-id private_net_1 \
  --address 10.0.0.250 \
  --protocol-port 80 \
  pool1
openstack loadbalancer member create \
  --subnet-id private_net_1 \
  --address 10.0.0.57 \
  --protocol-port 80 \
  pool1
```

Associate a floating IP to the VIP address of the load balancer:

```sh
openstack floating ip set --port d77f97aa-9d33-40c1-b191-1ca549a95075 173.231.202.91
```

Show the details of the load balancer:

```sh
$ openstack loadbalancer show lb1
+---------------------+--------------------------------------+
| Field               | Value                                |
+---------------------+--------------------------------------+
| admin_state_up      | True                                 |
| availability_zone   | None                                 |
| created_at          | 2023-10-10T14:41:53                  |
| description         |                                      |
| flavor_id           | None                                 |
| id                  | 5028cbc9-1c72-4873-b423-ffcb1c2f1887 |
| listeners           | 75e82ae6-f1a4-43e3-a7ea-9909afc5ae59 |
| name                | lb1                                  |
| operating_status    | ONLINE                               |
| pools               | 6ae46b29-0d27-45f5-9d8e-23e2ef82fe84 |
| project_id          | 4993ac59480646b6b15ae7727279ca11     |
| provider            | amphora                              |
| provisioning_status | ACTIVE                               |
| updated_at          | 2023-10-10T18:22:46                  |
| vip_address         | 10.0.0.132                           |
| vip_network_id      | 0d23b204-993b-4876-8604-a4d0ec76e6ad |
| vip_port_id         | d77f97aa-9d33-40c1-b191-1ca549a95075 |
| vip_qos_policy_id   | None                                 |
| vip_subnet_id       | ad266069-6fa0-4c4d-830d-5d5b913279e2 |
| tags                |                                      |
+---------------------+--------------------------------------+
```

## Conclusion

Update the DNS for your FQDN to point to the floating IP address and verify the
load balancer works as expected.
