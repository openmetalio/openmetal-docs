# How Private Clouds are Deployed

## Introduction

This section details how your Private Cloud was deployed and provides
supplemental information regarding your environment. OpenStack can be
deployed in several different ways and this section highlights the
characteristics of your Private Cloud. We also explain some of the
advantages for this type of deployment and areas that are unique to
OpenMetal.

## Initial Deployment

In OpenMetal, OpenStack is containerized through Docker using Kolla
Ansible. This is done through an initial deployment container called
FM-Deploy. FM-Deploy provides the initial setup changes during the
provisioning process of your Private Cloud. The FM-Deploy Container is a
necessary part of the current architecture of your Private Cloud. The
FM-Deploy Container should remain running in your Private Cloud as it is
used by our systems in the event you want to add or remove nodes from
your cloud.

## Containerization of OpenStack

OpenMetal uses Kolla Ansible to set up Docker containers for all running
services. Should you need to make any configuration changes to your
nodes, Kolla Ansible should be used to push these changes. If Kolla
Ansible is not used then there is a risk of these changes being reverted
during any system updates.

### Advantages of Containerization Through Docker

  - Containers create an isolated environment reducing software
    dependencies
  - Containers can be scaled and allow for services to balance across
    your cluster
  - Containers provide increased flexibility for test releases, patches,
    and automation
  - Containers have a consistent and repeatable deployment and a shorter
    initialization time

## Disk Storage and Ceph

In OpenMetal, disk storage is provided through Ceph. Ceph is an object
storage interface that can provide interfaces for multiple different
storage types on a single cluster. In OpenMetal Ceph is comprised of two
elements object storage and block storage:

### Object Storage

Ceph Object storage utilizes Ceph Object Storage Gateway daemon
(RADOSGW). With OpenMetal clouds, Ceph's RGW replaces Swift so there is
no Docker container for Swift. Instead, Swift endpoints are connected
directly to the RGW. Authentication for RGW is handled through Keystone
in `/etc/ceph/ceph.conf`.

### Block Storage

Ceph Block storage connects to the Cinder service utilizing Ceph's RADOS
Block Device. Within your cloud, those objects are stored in Ceph pools.
Ceph provides a layer of abstraction that allows objects to be
recognized as blocks.

### Advantages of using Ceph

  - Data is self-healing and will redistribute data across your cluster
    in the event of power, hardware, or connectivity issues
  - Data is replicated and highly available
  - Ceph has the ability to run on commodity hardware and to mix
    hardware from different vendors
