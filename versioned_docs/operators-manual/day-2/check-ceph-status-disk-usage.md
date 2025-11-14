---
sidebar_position: 3
---
# How to Check Ceph's Status and Disk Usage

## Introduction

Ceph was selected as the storage solution for Private Cloud Core
OpenStack clouds due to its ability store data in a replicated fashion.
The data stored in the Ceph cluster is accessible from any of your
cloud's control plane nodes. The storage is considered shared across all
nodes, which can make recovering an instance and its data trivial. As an
administrator of this cloud, we aim to provide you information about how
you can check the status of your Ceph cluster and see available disk
usage using the Ceph dashboard and the command line.

## Prerequisites

- Root access to your cloud's control plane nodes

## Ceph Dashboard

The Ceph dashboard is available on port 8443 over HTTPS through the Horizon IP
or URL. Access the dashboard via `https://[Horizon-IP-or-URL]:8443`.

### Creating a Dashboard User

A user needs to be created to access the dashboard. The user will need to be
created by the root user using SSH from one of the cloud's control plane nodes.

To create a user with the administrator role:

```sh
ceph dashboard ac-user-create <username> -i <file-containing-password> administrator
```

The dashboard landing page shows the overall disk usage and cluster status among
other metrics. By default, we set a replication level of 3 on all pools. The
capacity displayed is the overall capacity and should be divided by 3 to get a
better sense of available disk space.

For more information see [Overview of the Dashboard Landing Page](https://docs.ceph.com/en/reef/mgr/dashboard/#overview-of-the-dashboard-landing-page).

## Check Ceph Status

To check the status of your Ceph cluster, use `ceph status`.

For example:

```sh
# ceph status
  cluster:
    id:     34fa49b3-fff8-4702-8b17-4e8d873c845f
    health: HEALTH_OK

  services:
    mon: 3 daemons, quorum relaxed-flamingo,focused-capybara,lovely-ladybug (age 2w)
    mgr: relaxed-flamingo(active, since 2w), standbys: focused-capybara, lovely-ladybug
    osd: 4 osds: 4 up (since 3d), 4 in (since 3d)
    rgw: 3 daemons active (focused-capybara.rgw0, lovely-ladybug.rgw0, relaxed-flamingo.rgw0)

  task status:

  data:
    pools:   13 pools, 337 pgs
    objects: 69.28k objects, 250 GiB
    usage:   724 GiB used, 11 TiB / 12 TiB avail
    pgs:     337 active+clean

  io:
    client:   121 KiB/s rd, 1.2 MiB/s wr, 137 op/s rd, 232 op/s wr
```

The main things to watch are for the status of health and that all services are up.
Errors will appear in this output as well to provide context for troubleshooting.

## Check Ceph Disk Usage

To check a cluster’s data usage and data distribution among pools,
use the `df` option. It is similar to the Linux `df` command. You can run either
the `ceph df` command or `ceph df detail` command.

For example:

```sh
# ceph df
--- RAW STORAGE ---
CLASS  SIZE    AVAIL   USED     RAW USED  %RAW USED
ssd    12 TiB  11 TiB  720 GiB   724 GiB       6.08
TOTAL  12 TiB  11 TiB  720 GiB   724 GiB       6.08

--- POOLS ---
POOL                       ID  PGS  STORED   OBJECTS  USED     %USED  MAX AVAIL
device_health_metrics       1    1  286 KiB        4  858 KiB      0    3.4 TiB
images                      2   32  7.6 GiB    1.02k   23 GiB   0.22    3.4 TiB
volumes                     3   32   88 GiB   23.61k  264 GiB   2.45    3.4 TiB
vms                         4   32  144 GiB   39.92k  433 GiB   3.96    3.4 TiB
backups                     5   32      0 B        0      0 B      0    3.4 TiB
metrics                     6   32   25 MiB    4.49k  127 MiB      0    3.4 TiB
manila_data                 7   32      0 B        0      0 B      0    3.4 TiB
manila_metadata             8   32      0 B        0      0 B      0    3.4 TiB
.rgw.root                   9   32  3.6 KiB        8   96 KiB      0    3.4 TiB
default.rgw.log            10   32  3.4 KiB      207  384 KiB      0    3.4 TiB
default.rgw.control        11   32      0 B        8      0 B      0    3.4 TiB
default.rgw.meta           12    8    954 B        4   36 KiB      0    3.4 TiB
default.rgw.buckets.index  13    8  2.2 MiB       11  6.6 MiB      0    3.4 TiB
```

The RAW STORAGE section of the output provides an overview of the amount of storage
the storage cluster uses for data.

SIZE: The overall storage capacity managed by the storage cluster.

In the above example, if the SIZE is 90 GiB, it is the total size without the
replication factor, which is three by default. The total available capacity with
the replication factor is 90 GiB/3 = 30 GiB. Based on the full ratio, which is
0.85% by default, the maximum available space is 30 GiB * 0.85 = 25.5 GiB

AVAIL: The amount of free space available in the storage cluster.

In the above example, if the SIZE is 90 GiB and the USED space is 6 GiB, then
the AVAIL space is 84 GiB. The total available space with the replication factor,
which is three by default, is 84 GiB/3 = 28 GiB

USED: The amount of used space in the storage cluster consumed by user data,
internal overhead, or reserved capacity.

## Check Ceph OSD individual Disk Usage

To view OSD utilization statistics use, `ceph osd df`

For example:

```sh
# ceph osd df
ID  CLASS  WEIGHT   REWEIGHT  SIZE     RAW USE  DATA     OMAP    META     AVAIL    %USE  VAR   PGS  STATUS
2    ssd  0.87329   1.00000  894 GiB   77 GiB   75 GiB  17 KiB  1.2 GiB  818 GiB  8.57  1.00  227      up
0    ssd  0.87329   1.00000  894 GiB   77 GiB   75 GiB  17 KiB  1.2 GiB  818 GiB  8.57  1.00  227      up
1    ssd  0.87329   1.00000  894 GiB   77 GiB   75 GiB  17 KiB  1.2 GiB  818 GiB  8.57  1.00  227      up
                      TOTAL  2.6 TiB  230 GiB  226 GiB  52 KiB  3.6 GiB  2.4 TiB  8.57                   
MIN/MAX VAR: 1.00/1.00  STDDEV: 0
```
