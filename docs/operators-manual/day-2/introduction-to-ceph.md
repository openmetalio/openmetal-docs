---
sidebar_position: 2
---
# Introduction to Ceph

## Introduction

Ceph is an open-source, distributed storage system that provides object,
block and file storage interfaces from a single cluster. In this guide
we give a high-level overview of Ceph's services and how they are used
in your OpenMetal Private Cloud.

## Advantages of Ceph

See [Ceph's Benefits page](https://ceph.io/en/discover/benefits/) for a
more complete understanding of the benefits Ceph provides.

### Data Resiliency

With Ceph, your data storage is resilient either through the use of
replication or erasure coding. In our configuration, replication is used
to create multiple copies of data. Data is replicated at the host level.
A Private Cloud is deployed with three hosts. With our Ceph
configuration, you could lose two hosts and still have all of your Ceph
cluster's data.

### Ceph Scales Extremely Well

Ceph is designed to scale horizontally into Petabyte figures.

## Disadvantages of Ceph

Data access times are not as quick compared to accessing data directly
from a disk. Should your workload require very fast disk reads and
writes, consider using a compute only node, where instances can be spun
up on local, LVM-backed storage.

For more, see [Spin up an Instance with Ephemeral
Storage](https://openmetal.io/docs/manuals/tutorials/ephemeral_storage).

## Ceph Version Used by Private Clouds

With current Private Cloud deployments, Ceph's [Octopus
release](https://docs.ceph.com/en/latest/releases/octopus/) is used.

## View Disk Usage of the Ceph Cluster

For more, see the guide on [How to Check Ceph's Status and Disk
Usage](check-ceph-status-disk-usage).

## Default Configuration for the Ceph Cluster

Core Ceph services are deployed to each control plane node upon initial
cloud deployment. This means each node comes installed with Ceph's
Monitor, Manager, Object Gateway (RADOSGW), and Object Storage Daemon
(OSD) services. Each node's secondary NVMe drive backs a Ceph OSD. Our
Ceph deployments are configured with host-level replication of data.
Your cloud can lose all but one host and still retain all of the Ceph
cluster's data.

### Default Ceph Pools

By default, your Ceph cluster's data storage is logically divided into
pools, a concept associated with Ceph.

From a control plane node as root, we use `ceph osd lspools` to list the
default pools associated with a Private Cloud:

    1 device_health_metrics
    2 images
    3 volumes
    4 vms
    5 backups
    6 metrics
    7 manila_data
    8 manila_metadata
    9 .rgw.root
    10 default.rgw.log
    11 default.rgw.control
    12 default.rgw.meta
    13 default.rgw.buckets.index

Next, we explain the purpose of some of the Ceph pools.

#### Pool: images

Operating System images maintained by Glance are stored in this pool

#### Pool: volumes

Cinder stores any volumes created by your cloud in this pool.

#### Pool: vms

When you spin up a volume-backed instance, Nova is configured to create
a volume for that instance in this pool.

#### Pool: backups

Cinder stores volume backups within this pool.

## Swift and Cinder Ceph Configuration

With Private Clouds, Swift and Cinder are the services configured to
connect to Ceph.

Swift, OpenStack's Object Storage service, connects directly to the Ceph
cluster. With our setup you will not see configuration for Swift in a
place like `/etc/kolla/swift`. This configuration is instead handled by
Ceph directly and can be viewed through `/etc/ceph/ceph.conf`.

Cinder, OpenStack's Block Storage service, is also configured to connect
to Ceph. With Cinder, the are several services, of which `cinder-volume`
and `cinder-backup` are connected to Ceph. The Ceph configuration for
each service can be viewed through
`/etc/kolla/cinder-volume/cinder.conf` and
`/etc/kolla/cinder-backup/cinder.conf`.

## Reconfiguring your Ceph Cluster

**WARNING\!** -- Our current deployment system deploys a Private Cloud
with a known working state. Should you deviate from this state by
adjusting your cloud's Ceph configuration you can no longer safely use
the functions in OpenMetal Central to add nodes to your cloud or add IP
blocks. Should you use these functions, any custom configurations to
Ceph will be reverted. We are working on rolling out a new deployment
system allowing custom cloud configurations. We can still add new nodes
and IP blocks to your cloud but must do so manually. Please reach out to
your Account Manager should this apply to you.

Your Ceph cluster was deployed using Ceph Ansible. Any configuration
changes must be made using Ceph Ansible. For more information, see [How
to Prepare and Use Ceph
Ansible](../day-4/ceph-ansible).
