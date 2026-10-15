---
sidebar_position: 7
---
# Load Balancers and Octavia

Octavia provides load balancing as a service. v4 clouds use OVN networking, so load balancers use Octavia's OVN provider.

:::danger Amphora load balancers are not available on an OVN cloud
The OVN provider is L4 only. It has no TLS termination, no L7 routing, no HTTP health checks, and no session persistence.

Amphora requires a cloud built with OVS networking, and an OVN cloud cannot be converted to OVS. If you need Amphora, contact us before you deploy workloads. We rebuild the cloud with OVS and the Amphora provider.
:::

## OVN provider

The load balancer is a set of logical flows programmed into OVN and distributed across the hypervisors. Nothing is booted.

- No tenant quota consumed and no instances to manage
- Comes up in seconds
- HA by default, with nothing to fail over
- No amphora image or certificates to maintain

It is a plain L4 packet balancer. TCP and UDP only, `SOURCE_IP_PORT` as the only algorithm, and TCP or UDP-CONNECT health monitors.

## Amphora provider

On an OVS cloud, Octavia boots one HAProxy instance per load balancer, or two in `ACTIVE_STANDBY` topology, onto the load balancer management network and drives it through the health manager.

This is the full-feature option: L7 routing, TLS termination through Barbican, every balancing algorithm, HTTP and HTTPS health monitors, session persistence, member weights, and flavors.

The cost is operational and tenant-visible. Each load balancer consumes compute resources and project quota, creation takes minutes, a failed amphora causes a brief outage while the health manager rebuilds it, and OpenMetal maintains the amphora image and rotates the Octavia certificates.

## Feature support

Upstream maintains a per-API-field support matrix. Use it rather than a summary, which will drift.

- [Octavia provider feature matrix](https://docs.openstack.org/octavia/2026.1/user/feature-classification/index.html)
- [OVN provider driver documentation](https://docs.openstack.org/ovn-octavia-provider/2026.1/admin/driver.html)

## Choosing

The OVN provider covers spreading L4 traffic across a pool of backends.

Terminating TLS at the load balancer, routing by hostname or path, or cookie-based session persistence needs Amphora. Contact us before deployment.
