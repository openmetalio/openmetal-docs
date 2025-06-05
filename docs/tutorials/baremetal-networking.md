# VLAN Configuration on OpenMetal Nodes

## Overview

At OpenMetal, all bare metal nodes come preconfigured with bonded network
interfaces using LACP (802.3ad). This setup forms a `bond0` interface
combining two physical NICs, giving your server both redundancy and
additional bandwidth.

Every switchport connected to your node is configured as a **trunk port**,
allowing multiple VLANs to pass through. This makes it easy to layer
additional VLANs on top of the existing bond interface without needing
physical changes.

> 💡 You can view your cluster’s assigned VLANs and IP prefixes in  
> **Central → Assets → Networking**.

---

## Use Case

You’ve added a new VLAN to your project via OpenMetal Central  
(e.g., VLAN ID `1993` with IP range `192.168.10.0/24`) and want to configure  
it on an existing node. Since `bond0` is already in place, you’ll simply  
attach the new VLAN as a subinterface.

---

## Option 1: Manual (Linux CLI)

```bash
ip link add link bond0 name bond0.1993 type vlan id 1993
ip addr add 192.168.10.5/24 dev bond0.1993
ip link set bond0.1993 up
````

If a gateway is needed:

```bash
ip route add default via 192.168.10.1
```

---

## Option 2: Using NetworkManager (RHEL/CentOS)

```bash
nmcli con add type vlan dev bond0 id 1993 \
  ifname bond0.1993 con-name vlan-custom \
  mtu 1500 ipv4.method manual \
  ipv4.addresses 192.168.10.5/24
```

Add gateway and DNS (if needed):

```bash
nmcli con mod vlan-custom ipv4.gateway 192.168.10.1
nmcli con mod vlan-custom ipv4.dns "1.1.1.1,8.8.8.8"
```

Activate the new connection:

```bash
nmcli con up vlan-custom
```

---

## Option 3: Netplan (Ubuntu)

Edit your Netplan config file (e.g., `/etc/netplan/50-cloud-init.yaml`):

```yaml
network:
  version: 2
  vlans:
    bond0.1993:
      id: 1993
      link: bond0
      addresses: [192.168.10.5/24]
      gateway4: 192.168.10.1
      nameservers:
        addresses: [1.1.1.1, 8.8.8.8]
```

Apply the configuration:

```bash
netplan apply
```

---

## Notes and Reminders

- VLANs must be provisioned in **OpenMetal Central** before use.
- Only VLANs assigned to your cluster will pass through trunked interfaces.
- If you need help provisioning a VLAN, OpenMetal support can assist.

**Tip:** For routed public IPs, request prefixes be attached to
VLANs like `bond0.1001` or `bond0.1006`.
