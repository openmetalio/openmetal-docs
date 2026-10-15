---
sidebar_position: 3
---
# Troubleshooting a Private Cloud's Ceph Cluster

## Introduction

In this guide, we explain how to get started troubleshooting issues with
your Private Cloud's Ceph cluster. A goal of this guide is to collect
common troubleshooting scenarios and outline a method of addressing
them.

## Prerequisites

### Root Access to OpenStack Control Plane

Root access to your cloud's control plane nodes is required.

## Get Ceph's Status

In most troubleshooting cases, you can get an overview of your Ceph
cluster by checking its status. To check your Ceph cluster's status, use
`ceph status`.

For example:

    # ceph status
      cluster:
        id:     784024f5-a70c-11f1-8d14-3cecef4000ec
        health: HEALTH_OK

      services:
        mon: 3 daemons, quorum infallible-eagle,little-pelican,successful-magpie (age 6w)
        mgr: infallible-eagle.kenzmu(active, since 6w), standbys: little-pelican.zdakcx, successful-magpie.jdspzd
        osd: 3 osds: 3 up (since 6w), 3 in (since 6w)
        rgw: 3 daemons active (3 hosts, 1 zones)

      data:
        pools:   10 pools, 227 pgs
        objects: 3.01k objects, 20 GiB
        usage:   60 GiB used, 4.3 TiB / 4.4 TiB avail
        pgs:     227 active+clean

## Ceph Log Files

Ceph runs in containers managed by cephadm. Log files are stored in `/var/log/ceph/<fsid>/` on each control plane node, where `<fsid>` is the cluster ID shown by `ceph status`:

    # ls -1 /var/log/ceph/784024f5-a70c-11f1-8d14-3cecef4000ec/
    ceph-osd.1.log
    ceph-volume.log

The Monitor, Manager, and RADOS Gateway daemons log to the systemd journal. List the daemons on a node:

    # cephadm ls --no-detail | grep '"name"'

Then view a daemon's log:

    # cephadm logs --name mon.little-pelican

## Common Issues

### Clock Skew

Ceph has a number of health checks, including one for clock skew, called
`MON_CLOCK_SKEW`. For more, see Ceph's [Health
Checks](https://docs.ceph.com/en/latest/rados/operations/health-checks/)
guide and look for the text **MON\_CLOCK\_SKEW**. Ceph in our
configuration uses `chronyd` to sync each node's clock. Kolla Ansible is
responsible for installing and configuring `chronyd` into a Docker
container for each Ceph Monitor node. To administer `chronyd` you must
do so through Docker.

#### Confirm Ceph's Health

To confirm the status of this health check, execute `ceph status` and
examine the output.

For example:

    cluster:
      id:     34fa49b3-fff8-4702-8b17-4e8d873c845f
      health: HEALTH_WARN
              clock skew detected on mon.little-pelican, mon.successful-magpie
    [...output truncated...]

Alternatively, execute `ceph health detail` to only see the status of
health checks.

For example:

    HEALTH_WARN clock skew detected on mon.little-pelican, mon.successful-magpie
    [WRN] MON_CLOCK_SKEW: clock skew detected on mon.little-pelican, mon.successful-magpie
        mon.little-pelican clock skew 0.663159s > max 0.05s (latency 0.000399254s)
        mon.successful-magpie clock skew 0.368233s > max 0.05s (latency 0.000385143s)

#### Examine Chrony Logs

From here, you may want to examine the logs for each `chrony` Docker
instance running.

For example:

    docker logs chrony

Alternatively, consider viewing logs on the local file system for
`chrony` via `/var/log/kolla/chrony/`.

#### Addressing Clock Skew

There may be a number of methods to addressing clock skew. In this
example, we outline addressing this issue by restarting `chrony` for
each node.

To address the `MON_CLOCK_SKEW` for the example output in this section,
the Docker container `chrony` was restarted for each node. For example:

    # docker restart chrony
    chrony

Next, perform the same Ceph health check as before to confirm the
status. For example:

    # ceph health detail
    HEALTH_OK

If the clock skew issue is no longer present, you should see the status
of `HEALTH_OK` assuming there are no other issues with the Ceph cluster.

**Note\!** -- Restarting `chrony` may be a heavy handed approach to
addressing the issue. Consider alternatively making using of `chronyc`'s
`tracking`, `sources`, and `sourcestats` subcommands to diagnose clock
skew issues.

## References

- Ceph's
    [Troubleshooting](https://docs.ceph.com/en/latest/rados/troubleshooting/index.html)
- Ceph's [Troubleshooting
    Monitors](https://docs.ceph.com/en/latest/rados/troubleshooting/troubleshooting-mon/)
