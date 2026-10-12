---
sidebar_position: 7
---
# Load Balancers and Octavia

Octavia provides load balancing as a service. Which provider driver you get is decided by the Neutron plugin, not by a separate setting.

| `neutron_plugin_agent` | Octavia provider |
|---|---|
| `ovn` | OVN |
| `openvswitch` | Amphora |

v4 defaults to `ovn`, so a v4 cloud gets the OVN provider unless it was deployed otherwise.

:::danger Amphora load balancers are not available on an OVN cloud
The OVN provider is L4 only. It has no TLS termination, no L7 routing, no HTTP health checks, and no session persistence.

The provider follows `neutron_plugin_agent`, which is a deploy-time, one-way decision. A cloud deployed on OVN cannot be converted to OVS afterwards, so the only way to get Amphora is to rebuild the cloud.

If a customer needs Amphora features, set `neutron_plugin_agent: openvswitch` before the first main Kolla Ansible configuration run.
:::

## OVN provider

The load balancer is a set of logical flows programmed into OVN and distributed across the hypervisors. Nothing is booted.

- No tenant quota consumed and no instances to manage
- Comes up in seconds
- HA by default, with nothing to fail over
- No amphora image or certificates to maintain

It is a plain L4 packet balancer. TCP and UDP only, `SOURCE_IP_PORT` as the only algorithm, and TCP or UDP-CONNECT health monitors.

## Amphora provider

Octavia boots one HAProxy instance per load balancer, or two in `ACTIVE_STANDBY` topology, onto the load balancer management network and drives it through the health manager.

This is the full-feature option: L7 routing, TLS termination through Barbican, every balancing algorithm, HTTP and HTTPS health monitors, session persistence, member weights, and flavors.

The cost is operational and tenant-visible. Each load balancer consumes compute resources and project quota, creation takes minutes, a failed amphora causes a brief outage while the health manager rebuilds it, and OpenMetal maintains the amphora image and rotates the Octavia certificates.

## Feature support

Upstream maintains a per-API-field support matrix. Use it rather than a summary, which will drift.

- [Octavia provider feature matrix](https://docs.openstack.org/octavia/2026.1/user/feature-classification/index.html)
- [OVN provider driver documentation](https://docs.openstack.org/ovn-octavia-provider/2026.1/admin/driver.html)

## Choosing

Customers who spread L4 traffic across a pool of backends are served by the OVN provider.

Customers who terminate TLS at the load balancer, route by hostname or path, or rely on cookie-based session persistence need Amphora, and therefore need an OVS cloud. Confirm this before deployment.
