# How to Check Ceph's Status and Disk Usage

## Introduction

Ceph was selected as the storage solution for Private Cloud Core
OpenStack clouds due to its ability store data in a replicated fashion.
The data stored in the Ceph cluster is accessible from any of your
cloud's control plane nodes. The storage is considered shared across all
nodes, which can make recovering an instance and its data trivial. As an
administrator of this cloud, we aim to provide you information about how
you can check the status of your Ceph cluster and see available disk
usage using the command line.

## Table of Contents

1.  [Prerequisites](operators_manual/day-2/check-ceph-status-disk-usage.md#prerequisites)
2.  [Check Ceph
    Status](operators_manual/day-2/check-ceph-status-disk-usage.md#check-ceph-status)
3.  [Check Ceph Disk
    Usage](operators_manual/day-2/check-ceph-status-disk-usage.md#check-ceph-disk-usage)

## Prerequisites

  - Root access to your cloud's control plane nodes

## Check Ceph Status

To check the status of your Ceph cluster, use `ceph status`.

For example:

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

## Check Ceph Disk Usage

To check the available disk space in your Ceph cluster, use `ceph df`.

For example:

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
