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

Ceph has a health check for clock skew between Monitors, called `MON_CLOCK_SKEW`. For more, see Ceph's [Health Checks](https://docs.ceph.com/en/squid/rados/operations/health-checks/) guide. Each node keeps its clock in sync with `chrony`, which runs on the host as a systemd service.

#### Confirm Ceph's Health

Run `ceph health detail`:

    # ceph health detail
    HEALTH_WARN clock skew detected on mon.little-pelican, mon.successful-magpie
    [WRN] MON_CLOCK_SKEW: clock skew detected on mon.little-pelican, mon.successful-magpie
        mon.little-pelican clock skew 0.663159s > max 0.05s (latency 0.000399254s)
        mon.successful-magpie clock skew 0.368233s > max 0.05s (latency 0.000385143s)

To see the skew Ceph measures for each Monitor, use `ceph time-sync-status`.

#### Check chrony

On each node listed in the warning, check that `chrony` is running and synchronized:

    # systemctl status chrony
    # chronyc tracking
    # chronyc sources

`chronyc tracking` shows the current offset under **System time**. `chronyc sources` lists the NTP servers in use; a reachable, selected source is marked `^*`.

`chrony` logs to the systemd journal:

    # journalctl -u chrony

#### Address Clock Skew

Restart `chrony` on each affected node:

    # systemctl restart chrony

To step the clock immediately rather than slewing it gradually, run:

    # chronyc makestep

Then confirm the warning has cleared:

    # ceph health detail
    HEALTH_OK

## References

- Ceph's
    [Troubleshooting](https://docs.ceph.com/en/latest/rados/troubleshooting/index.html)
- Ceph's [Troubleshooting
    Monitors](https://docs.ceph.com/en/latest/rados/troubleshooting/troubleshooting-mon/)
