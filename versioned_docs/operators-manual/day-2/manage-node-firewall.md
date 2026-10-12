---
sidebar_position: 8
---
# Manage the Node Firewall

PCC v4 deploys a host firewall to every node. It is built from `ufw` and `ipset` by the [firewall-ansible](https://github.com/openmetalio/firewall-ansible) role and is applied by default. There is nothing to install.

## Default policy

| Interface | Policy |
|---|---|
| External, internet-facing | Deny inbound. SSH on port 22 is open and rate-limited. |
| Management, `bond0.8` | Deny inbound. The first four usable addresses of its subnet are whitelisted. |
| All other VLANs | Allow all traffic. |

Control, storage, tunnel, compute, and any cross-cluster link to a sibling PCC cluster fall under "all other VLANs". There is no restricted middle tier. An interface is either external or fully trusted.

IPv6 is disabled in `ufw`. Logging is set to `low`.

![Cloud networking VLANs](images/networking-vlans.png)

## Whitelists

Two ipsets hold the addresses allowed past the default deny policy.

| Set | Contents | Managed from |
|---|---|---|
| `customer_whitelist` | Subnets you trust | Central's Firewall UI |
| `omi_whitelist` | OpenMetal VPN endpoints, pod ranges, and the pod management hosts | `firewall-ansible` role defaults and inventory |

An entry in either set gets unrestricted access to every port and protocol on the node, not only the ports `ufw` opens. Treat a whitelist entry as a fully trusted host.

`omi_whitelist` is not editable from Central. Changing it means editing the role or inventory and re-running the playbook.

## Inspect the firewall

```shell
ufw status verbose
ipset list omi_whitelist
ipset list customer_whitelist
```

## Persistence

Manual `ipset add` and `ipset del` take effect immediately and are lost on the next deployment run or node boot. Both sets are rebuilt from their managed source:

- Ansible re-renders them under `/etc/firewall-ansible/` on every run.
- The `firewall-ansible-ipsets.service` systemd unit restores them at boot, before `ufw` starts.

Changes that need to survive belong in Central for `customer_whitelist`, or in the role and inventory for `omi_whitelist`.

## Open an additional port

`firewall_additional_rules` opens ports on the external interface beyond SSH. Each rule takes a source of `any`, `omi_whitelist`, or `customer_whitelist`. Set it in inventory and re-run the playbook.
