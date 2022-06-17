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

## Table of Contents

1.  [Software that can be
    Updated](operators_manual/day-2/maintenance.rst#software-that-can-be-updated)

2.  [Updating Kolla Ansible Docker
    Images](operators_manual/day-2/maintenance.rst#updating-kolla-ansible-docker-images)

3.    - [Performing Package Manager
        Updates](operators_manual/day-2/maintenance.rst#performing-package-manager-updates)
        
        1.  [Migrate
            Workload](operators_manual/day-2/maintenance.rst#migrate-workload)
        2.  [Update One Node at a
            Time](operators_manual/day-2/maintenance.rst#update-one-node-at-a-time)
        3.  [Disable
            Docker](operators_manual/day-2/maintenance.rst#disable-docker)
        4.  [Upgrade Host OS
            Packages](operators_manual/day-2/maintenance.rst#upgrade-host-os-packages)
        5.  [Determine Reboot
            Need](operators_manual/day-2/maintenance.rst#determine-reboot-need)
        6.  [Ceph
            Maintenance](operators_manual/day-2/maintenance.rst#ceph-maintenance)
        7.  [Reboot if
            Required](operators_manual/day-2/maintenance.rst#reboot-if-required)
        8.  [Verify Successful
            Reboot](operators_manual/day-2/maintenance.rst#verify-successful-reboot)

## Software that can be Updated

The software of an OpenMetal cloud that can be updated include each
hardware node's package manager and the Kolla Ansible Docker images.
Ceph updates are handled through the node's package manager.

## Updating Kolla Ansible Docker Images

Refer to Kolla Ansible's
[documentation](https://docs.openstack.org/kolla-ansible/latest/user/operating-kolla.html#upgrade-procedure)
for more information regarding updating images.

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
    CONTAINER ID   IMAGE                                                                        COMMAND                  CREATED        STATUS                          PORTS     NAMES
    6f7590bc2191   harbor.imhadmin.net/kolla/centos-binary-telegraf:victoria                    "dumb-init --single-…"   20 hours ago   Restarting (1) 14 seconds ago             telegraf
    67a4d47e8c78   harbor.imhadmin.net/kolla/centos-binary-watcher-api:victoria                 "dumb-init --single-…"   3 days ago     Up 6 minutes                              watcher_api
    af815b1dcb5d   harbor.imhadmin.net/kolla/centos-binary-watcher-engine:victoria              "dumb-init --single-…"   3 days ago     Up 6 minutes                              watcher_engine
    a52ab61933ac   harbor.imhadmin.net/kolla/centos-binary-watcher-applier:victoria             "dumb-init --single-…"   3 days ago     Up 6 minutes                              watcher_applier
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
