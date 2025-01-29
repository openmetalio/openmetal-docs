# **VPN Troubleshooting Guide**

## **Introduction**

This guide will help you troubleshoot common issues with site-to-site VPN connections
when using OpenStack's VPN as a Service (VPNaaS). VPNaaS enables secure tunnels
between networks, such as an OpenStack cloud and an external location.

## **Step 1: Verify VPN Service Configuration**

**List VPN services**:

```bash
   openstack vpn service list
```

**Inspect the VPN service**:

```bash
   openstack vpn service show <VPN_SERVICE_UUID>
```

- Note the **router UUID** and **external IPv4 address**.

---

## **Step 2: Check VPN Daemon**

1. **Locate the running IPsec daemon**:

```bash
   ps aux | grep ipsec
```

- Look for `pluto` (LibreSwan) or `charon` (StrongSwan) processes.

**Access the Neutron L3 container**:

```bash
   docker exec -u root -it neutron_l3_agent bash
```

**Check the IPsec directory**:

```bash
   ls /var/lib/neutron/kolla/ipsec/<ROUTER_UUID>
   ```

## **Step 3: Check VPN Status**

- **For StrongSwan**:

```bash
   chroot /proc/$(cat /var/lib/neutron/kolla/ipsec/<ROUTER_UUID>/var/run/charon.pid)/cwd ipsec status
```

**For LibreSwan**:

```bash
   ipsec --rundir /var/lib/neutron/kolla/ipsec/<ROUTER_UUID>/var/run/pluto whack --status
```

Look for:

- **Security Associations**: Status should be `ESTABLISHED`.
- **Routed Connections**: Should show `ROUTED, TUNNEL`.

---

## **Step 4: Verify Connectivity**

1.**Identify the network namespace (netns)**:

```bash
   ip netns ls | grep <ROUTER_UUID>
```

2.**Ping a remote address or gateway**:

```bash
   ip netns exec <NETNS> ping <REMOTE_IP>
 ```

3.**Check routing for a specific IP**:

```bash
   ip netns exec <NETNS> ip route get <TARGET_IP>
```

## **Step 5: Verify Traffic**

1. **Check conntrack entries**:

```bash
   ip netns exec <NETNS> conntrack -L | grep <REMOTE_IP>
```

- Ensure traffic is being routed correctly through the tunnel.

---

## **Step 6: Check IPtables Rules**

1.**View current rules**:

```bash
   ip netns exec <NETNS> iptables-save
```

2.Ensure POSTROUTING rules exist for source/destination network pairs.

---

## **Step 7: Common Issues**

- **No traffic crossing the VPN**:

- Check for misconfigured IPsec settings on both ends.

- Verify connectivity with `ping` or routing checks.

- **VPN status shows `INSTALLED` but not `ESTABLISHED`**:

- Ensure the remote peer is reachable.

- Verify shared secrets and tunnel configuration.

---

## **Need More Help?**

If you are unable to resolve the issue, contact support with:

- VPN service UUID

- Router UUID

- Any error messages or logs from the above steps.
