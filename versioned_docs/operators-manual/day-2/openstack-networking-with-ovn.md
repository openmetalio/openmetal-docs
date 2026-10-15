---
sidebar_position: 6
---
# OpenStack Networking with OVN

PCC v4 deploys Neutron with OVN. Earlier releases used OVS. OVN moves the logical network model into its own databases and programs flows on each hypervisor.

The backend is set at deploy time and cannot be changed afterwards. There is no migration path from OVN to OVS; changing it means rebuilding the cloud.

:::danger
The backend also decides which Octavia load balancer provider the cloud gets. Amphora load balancers are not available on an OVN cloud. See [Load Balancers and Octavia](./load-balancers-and-octavia.md).
:::

## Why OVN

Under OVS, Neutron ran a set of Python agents on every node and drove them over RPC. OVN replaces those agents with its own databases and one controller per node, which programs flows locally.

| | OVS | OVN |
|---|---|---|
| Neutron agents per node | openvswitch, L3, DHCP, metadata | OVN, metadata, metering |
| Routing | centralised, unless DVR is enabled | distributed |
| Router failover | L3 agent HA, off by default | built in |
| Tenant network type | VXLAN | Geneve |

Routing and DHCP are answered from flows on the hypervisor rather than by agents on a network node, so there is no central forwarding bottleneck and no agent to fail over. State reaches each node through the southbound database instead of RPC, which takes that traffic off RabbitMQ.

## What runs

| Container | Role |
|---|---|
| `ovn_northd` | Translates the northbound database into logical flows |
| `ovn_nb_db` | Northbound database, the logical network model |
| `ovn_sb_db` | Southbound database, the flows each node consumes |
| `ovn_sb_db_relay` | Scales southbound reads for larger clouds |
| `ovn_controller` | Runs on every node and programs local flows |
| `neutron_ovn_agent` | Runs Neutron's OVN agent extensions on each node |
| `neutron_ovn_metadata_agent` | Serves instance metadata |
| `neutron_metering_agent` | Measures L3 traffic for metering |
| `neutron_ovn_maintenance_worker` | Reconciles Neutron state into OVN |

## Logs

The OVN-specific logs under `/var/log/kolla/neutron/` are:

```text
neutron-ovn-agent.log
neutron-ovn-maintenance-worker.log
neutron-ovn-metadata-agent.log
neutron-ovn-vpn-agent.log
```

For the full listing and how to search it, see [Guidelines for Searching through Logs](../day-4/troubleshooting/log-filtering.md).

## Inspect OVN

Run from a control plane node.

```shell
docker exec ovn_nb_db ovn-nbctl --no-leader-only --db unix:/var/run/ovn/ovnnb_db.sock show
docker exec ovn_sb_db ovn-sbctl --no-leader-only --db unix:/var/run/ovn/ovnsb_db.sock show
docker exec openvswitch_db ovs-vsctl show
```

`ovn-nbctl show` lists logical switches and routers as Neutron defined them. `ovn-sbctl show` lists the chassis each hypervisor registered. `ovs-vsctl show` lists the local bridges, and runs against `openvswitch_db` rather than an OVN container.
