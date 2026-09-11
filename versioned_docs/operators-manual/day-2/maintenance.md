---
sidebar_position: 4
---
# Maintaining OpenStack Software Updates

## Introduction

Software in the OpenStack ecosystem evolves over time, either through
new feature additions, bug fixes, or when vulnerabilities are patched.
Part of operating an OpenStack cloud involves maintaining its software
through updates. In this guide, we point out the sections in an
OpenMetal cloud where software updates occur and explain best practices
when performing updates.

## Prerequisites

Before getting started, it is beneficial to have experience with Docker.

To follow this guide, ensure you have:

- Root access to your cloud's control plane

## Software that can be Updated

The software of an OpenMetal cloud that can be updated include each
hardware node's package manager and the Kolla Ansible Docker images.
Ceph updates are handled through the node's package manager.

## Updating Kolla Ansible Docker Images

See [Update Kolla Images](update-kolla-images.md)
for the steps needed to update your cloud.

## Performing Package Manager Updates

### Migrate Workload

Package manager updates requiring a server reboot to an OpenMetal
control plane node can be disruptive to any workload running on it.
Prior to performing disruptive actions, it may be possible to migrate
instances another node running the Compute service. For information on
how to migrate instances, see OpenStack Nova's
[documentation](https://docs.openstack.org/nova/latest/admin/live-migration-usage.html).

### Update One Node at a Time

While performing package manager updates, ensure updates occur
successfully for one hardware node before updating another node.

### Disable Docker

Before updating the package manager, ensure the Docker socket and
service within SystemD are stopped and disabled. For example:

    systemctl disable docker.socket
    systemctl stop docker.socket
    systemctl disable docker.service
    systemctl stop docker.service

### Upgrade Host OS Packages

After verifying the Docker socket and service are stopped, perform the
package manager updates.:

    dnf upgrade

### Determine Reboot Need

Once package manager completes, check if a reboot is required with
dnf-utils `needs-restarting` and the reboot hint flag (-r):

    $ needs-restarting -r
    Core libraries or services have been updated since boot-up:
      * kernel
      * systemd
    Reboot is required to fully utilize these updates.
    More information: https://access.redhat.com/solutions/27943
    $

### Ceph Maintenance

**Warning\!** This step is optional and only required if the node needs
to be rebooted.

Prior to reboot, if the node is part of the Ceph cluster automatic OSD
removal and data rebalance should be temporarily suspended. To do so,
perform:

    ceph osd set noout
    ceph osd set norebalance

This will reduce rebuild time and help ensure the node rejoins the
cluster automatically.

Once the node reboots and a healthy Ceph cluster is confirmed, these
parameters must be unset. To unset this configuration, perform:

    ceph osd unset noout
    ceph osd unset norebalance

### Reboot if Required

Reboot the node if required:

    shutdown -r now

### Verify Successful Reboot

When the node comes back online, SSH into it to verify the OpenStack
Docker containers have started. Additionally, if this node was part of
the Ceph cluster, check Ceph's cluster status.

To verify the Docker containers have started, use `docker ps`. You
should see a number of Docker containers running. Under the **STATUS**
column, each container should reflect the status `Up`.

For example:

    [root@smiling-pelican ~]# docker ps
    CONTAINER ID   IMAGE                                                                        COMMAND                  CREATED        STATUS                    PORTS     NAMES
    62e119179bb4   registry.flexmetal.net/kolla/skyline-console:2026.1-ubuntu-noble             "dumb-init --single-…"   44 hours ago   Up 44 hours (healthy)               skyline_console
    b3767f16dead   registry.flexmetal.net/kolla/skyline-apiserver:2026.1-ubuntu-noble           "dumb-init --single-…"   44 hours ago   Up 44 hours (healthy)               skyline_apiserver
    fb570dbaae96   registry.flexmetal.net/kolla/octavia-worker:2026.1-ubuntu-noble              "dumb-init --single-…"   44 hours ago   Up 44 hours (healthy)               octavia_worker
    66a3068fda74   registry.flexmetal.net/kolla/barbican-worker:2026.1-ubuntu-noble             "dumb-init --single-…"   44 hours ago   Up 44 hours (healthy)               barbican_worker
    [...output truncated...]

Next, if this node is part of a Ceph cluster, check Ceph's status using
`ceph status`.

For example:

    [root@smiling-pelican ~]# ceph status
      cluster:
        id:     06bf4555-7c0c-4b96-a3b7-502bf8f6f213
        health: HEALTH_OK
    [...output truncated...]

The above output shows the status as `HEALTH_OK`, indicating the Ceph
cluster is healthy. Ceph is naturally resilient and should recover from
a node being rebooted.
