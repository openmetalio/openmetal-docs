---
sidebar_position: 6
---
# OpenStack Networking with OVN

PCC v4 deploys Neutron with OVN. Earlier releases used OVS.

OVN moves the logical network model into its own databases and programs flows on each hypervisor.

`neutron_l3_agent` does not run on an OVN cloud. `neutron_dhcp_agent` does not run either unless `neutron_ovn_dhcp_agent` is turned on, which is off by default.

## The plugin choice is made once

`neutron_plugin_agent` in `/etc/kolla/globals.yml` selects the backend:

```yaml
neutron_plugin_agent: ovn
```

It accepts `ovn` or `openvswitch`, and must be set before the first main Kolla Ansible configuration run.

:::danger
A cloud deployed on OVN cannot be converted to OVS afterwards. There is no supported migration path. The only way to change it is to rebuild the cloud.

This choice also decides which Octavia load balancer provider you get. See [Load Balancers and Octavia](./load-balancers-and-octavia.md) before deploying.
:::

## What runs

| Container | Role |
|---|---|
| `ovn_northd` | Translates the northbound database into logical flows |
| `ovn_nb_db` | Northbound database, the logical network model |
| `ovn_sb_db` | Southbound database, the flows each node consumes |
| `ovn_sb_db_relay` | Scales southbound reads for larger clouds |
| `ovn_controller` | Runs on every node and programs local flows |
| `neutron_ovn_metadata_agent` | Serves instance metadata |
| `neutron_ovn_maintenance_worker` | Reconciles Neutron state into OVN |

`neutron_openvswitch_agent` runs only when `neutron_plugin_agent` is not `ovn`.

## Logs

The OVN-specific logs under `/var/log/kolla/neutron/` are:

```text
neutron-ovn-agent.log
neutron-ovn-maintenance-worker.log
neutron-ovn-metadata-agent.log
neutron-ovn-vpn-agent.log
```

`neutron-l3-agent.log` and `neutron-openvswitch-agent.log` do not exist on an OVN cloud. Some log files are created whether or not their agent runs, so presence of a file is not proof a service is active. Check `docker ps` for that.

For the full listing and how to search it, see [Guidelines for Searching through Logs](../day-4/troubleshooting/log-filtering.md).

## Inspect OVN

Run from a control plane node.

```shell
docker exec ovn_nb_db ovn-nbctl --db unix:/var/run/ovn/ovnnb_db.sock show
docker exec ovn_sb_db ovn-sbctl --db unix:/var/run/ovn/ovnsb_db.sock show
docker exec openvswitch_db ovs-vsctl show
```

`ovn-nbctl show` lists logical switches and routers as Neutron defined them. `ovn-sbctl show` lists the chassis each hypervisor registered. `ovs-vsctl show` lists the local bridges, and runs against `openvswitch_db` rather than an OVN container.

## Upgrading a v3 cloud

v3 clouds were deployed with OVS. A v3 cloud that should stay on OVS needs `neutron_plugin_agent: openvswitch` set explicitly in the Kolla Ansible environment in OpenMetal Central.

Keeping `openvswitch` also keeps Amphora available as the Octavia provider. Moving to OVN switches Octavia to the OVN provider and its limits, and any existing Amphora load balancers have to be rebuilt as OVN load balancers.
