# Troubleshooting a Private Cloud's Ceph Cluster

## Introduction

In this guide, we explain how to get started troubleshooting issues with
your Private Cloud's Ceph cluster. A goal of this guide is to collect
common troubleshooting scenarios and outline a method of addressing
them.

## Table of Contents

1.    - [Prerequisites](ceph#prerequisites)
        
        1.  [Root Access to OpenStack Control
            Plane](ceph#root-access-to-openstack-control-plane)

2.  [Get Ceph's
    Status](ceph#get-ceph-s-status)

3.  [Ceph Log
    Files](ceph#ceph-log-files)

4.    - [Common
        Issues](ceph#common-issues)
        
        1.    - [Clock
                Skew](ceph#clock-skew)
                
                1.  [Confirm Ceph's
                    Health](ceph#confirm-ceph-s-health)
                2.  [Examine Chrony
                    Logs](ceph#examine-chrony-logs)
                3.  [Addressing Clock
                    Skew](ceph#addressing-clock-skew)

5.  [References](ceph#reference)

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
        id:     34fa49b3-fff8-4702-8b17-4e8d873c845f
        health: HEALTH_WARN
                clock skew detected on mon.focused-capybara, mon.lovely-ladybug
                2 daemons have recently crashed
    
      services:
        mon: 3 daemons, quorum relaxed-flamingo,focused-capybara,lovely-ladybug (age 5d)
        mgr: relaxed-flamingo(active, since 5d), standbys: focused-capybara, lovely-ladybug
        osd: 4 osds: 4 up (since 5d), 4 in (since 13d)
        rgw: 3 daemons active (focused-capybara.rgw0, lovely-ladybug.rgw0, relaxed-flamingo.rgw0)
    
      task status:
    
      data:
        pools:   13 pools, 337 pgs
        objects: 110.16k objects, 388 GiB
        usage:   1.1 TiB used, 11 TiB / 12 TiB avail
        pgs:     337 active+clean
    
      io:
        client:   381 KiB/s rd, 1.2 MiB/s wr, 444 op/s rd, 214 op/s wr

## Ceph Log Files

Ceph's log files are stored in `/var/log/ceph/` within each control
plane node.

For example, listed are all log files for host `focused-capybara`:

    # ls -1 /var/log/ceph/*.log
    /var/log/ceph/ceph.audit.log
    /var/log/ceph/ceph.log
    /var/log/ceph/ceph-mgr.focused-capybara.log
    /var/log/ceph/ceph-mon.focused-capybara.log
    /var/log/ceph/ceph-osd.1.log
    /var/log/ceph/ceph-rgw-focused-capybara.rgw0.log
    /var/log/ceph/ceph-volume.log

A OpenMetal Ceph cluster is comprised of several services: Ceph's
Manager, Monitor, OSD, and RADOSGW

Ceph has a primary log file, log files for each service, and additional
log files.

For example:

  - **Primary Log File**: `/var/log/ceph/ceph.log`
  - **Ceph Monitor Log File**:
    `/var/log/ceph/ceph-mon.focused-capybara.log`
  - **Ceph RADOSGW Log File**:
    `/var/log/ceph/ceph-rgw-focused-capybara.rgw0.log`

If you are unsure which Ceph service's log to look through, consider
starting with the primary log file, `/var/log/ceph/ceph.log`.

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
              clock skew detected on mon.focused-capybara, mon.lovely-ladybug
    [...output truncated...]

Alternatively, execute `ceph health detail` to only see the status of
health checks.

For example:

    HEALTH_WARN clock skew detected on mon.focused-capybara, mon.lovely-ladybug
    [WRN] MON_CLOCK_SKEW: clock skew detected on mon.focused-capybara, mon.lovely-ladybug
        mon.focused-capybara clock skew 0.663159s > max 0.05s (latency 0.000399254s)
        mon.lovely-ladybug clock skew 0.368233s > max 0.05s (latency 0.000385143s)

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
