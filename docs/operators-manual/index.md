# OpenStack Operator's Manual - Private Cloud Core

![image](images/intro.jpg)

## Introduction

Welcome to the OpenStack Operator's Manual for your OpenMetal Private
Cloud\! There are several phases of creating an OpenStack cloud and most
of the public documentation focuses on the initial creation of a cloud.
With OpenMetal, we provide a full private OpenStack cloud where you
start as an **Operator**. This manual, with a few noted exceptions,
applies to any OpenStack that has been provisioned to OpenStack.org's
[RefStack](https://docs.openstack.org/refstack) standard. If you are
reading this, it assumed you have followed the OpenMetal Central Process
to provision your cloud already. Visit [OpenMetal Central to sign up or
sign in](https://central.openmetal.io/). For product details please
visit the [Private
Cloud](https://openmetal.io/products/private-cloud/hosted/) page.

## Getting Started with the Operator's Manual

Guides are grouped into **Days**, of which there are four. A description
of each day and their associated guides follows in the Table of
Contents.

### Why Days?

Days have been selected to break down the information covered in this
manual into categories. Loosely speaking, Day 1 is allocated for initial
set up and configuration. Day 2 is for operations and maintenance. Day 3
has to do with scaling a cloud, ensuring your data is backed up, and how
to restore it. Day 4 is for more advanced administration topics,
introducing how to make general changes to your cloud using Kolla
Ansible, and other topics.

### Brief Summary of each Day

  - Day 1: Initial setup of cloud
  - Day 2: Cloud administration and maintenance
  - Day 3: Scaling the cloud and disaster recovery
  - Day 4: Advanced administration, introducing Kolla Ansible

### Operator's Manual Audience

The audience for this manual is experienced Linux System Administrators
who are new to OpenStack.

## Table of Contents

### Day 1

Day 1 generally refers to initial setup, which in our case is the
process of getting started with a Private Cloud Core OpenStack Cloud. We
introduce you to OpenMetal Central, how to view the assets that comprise
your cloud, and how to get support from our staff.

1.  [Introduction to OpenMetal and your Private Cloud
    Core](operators_manual/day-1/intro-to-openmetal-private-cloud.md)
2.  [Getting Started with OpenStack
    Horizon](operators_manual/day-1/horizon/getting-started-with-horizon.md)
3.  [Create an OpenStack User and Project in
    Horizon](operators_manual/day-1/horizon/create-user-project.md)
4.  [Manage and Upload Images in OpenStack
    Horizon](operators_manual/day-1/horizon/images.md)
5.  [How to Create an Instance in OpenStack
    Horizon](operators_manual/day-1/horizon/create-first-instance.md)
6.  [How to Install and Use
    OpenStackClient](operators_manual/day-1/command-line/openstackclient.md)
7.  [Create SSH Key Pair for an OpenStack Control Plane
    Node](operators_manual/day-1/command-line/create-ssh-key.md)

### Day 2

Day 2 initially explains briefly how your Private Cloud was deployed.
Next we cover OpenStack administration by explaining how to perform
maintenance tasks for your cluster's hardware nodes.

1.  [How Private Clouds are
    Deployed](operators_manual/day-2/private-cloud-deployment-overview.md)
2.  [Introduction to
    Ceph](operators_manual/day-2/introduction-to-ceph.md)
3.  [How to Check Ceph's Status and Disk
    Usage](operators_manual/day-2/check-ceph-status-disk-usage.md)
4.  [Maintaining OpenStack Software
    Updates](operators_manual/day-2/maintenance.md)
5.  [View OpenStack Resource
    Usage](operators_manual/day-2/resource-usage/cloud-resource-usage.md)
6.  [How to Live Migrate
    Instances](operators_manual/day-2/live-migrate-instances.md)

### Day 3

Day 3 has to do with how you can scale your cloud by adding more
hardware nodes to it. Next we get into preparing for disaster recovery
by explaining best practices relating to keeping your data safe. We
provide a general outline for how you can recover from a disaster.

1.  [How to Add or Remove Hardware
    Nodes](operators_manual/day-3/add-remove-hardware-nodes.md)
2.  [How to Add Additional Provider IP
    Blocks](operators_manual/day-3/add-provider-ips.md)
3.  [Create and Restore Volume
    Backups](operators_manual/day-3/create-volume-backups.md)
4.  [How to Create OpenStack Service Configuration
    Backups](operators_manual/day-3/create-openstack-service-backups.md)
5.  [OpenStack Disaster Planning, Testing, and
    Recovery](operators_manual/day-3/disaster-recovery.md)

### Day 4

In Day 4, we cover advanced OpenStack administration through Kolla
Ansible, the primary system used to deploy a Private Cloud. Through this
system, we explain how configuration changes to your cloud can be made.
Next, we detail a few common troubleshooting scenarios and their
solutions. Finally we briefly cover automation techniques possible in
your cloud through the use of OpenStack's Heat service and through
HashiCorp's Terraform application.

1.  [How to Prepare and Use Kolla
    Ansible](operators_manual/day-4/kolla-ansible/kolla-ansible.md)
2.  [Enable TLS Using Kolla
    Ansible](operators_manual/day-4/kolla-ansible/enable-tls.md)
3.  [Enable ElasticSearch and Kibana Logging using Kolla
    Ansible](operators_manual/day-4/kolla-ansible/enable-elk.md)
4.  [Security and Your OpenMetal Private
    Cloud](operators_manual/day-4/security/security-best-practices.md)
5.  [How to Prepare and Use Ceph
    Ansible](operators_manual/day-4/ceph-ansible/ceph-ansible.md)
6.  [OpenStack Watcher
    Demonstration](operators_manual/day-4/watcher/watcher-demo.md)
7.  [Troubleshooting
    RabbitMQ](operators_manual/day-4/troubleshooting/rabbitmq.md)
8.  [How to Redeploy RabbitMQ using Kolla
    Ansible](operators_manual/day-4/kolla-ansible/redeploy-rabbitmq.md)
9.  [Troubleshooting
    Ceph](operators_manual/day-4/troubleshooting/ceph.md)
10. [Guidelines for Searching through
    Logs](operators_manual/day-4/troubleshooting/log-filtering.md)
11. [OpenStack Automation through
    Heat](operators_manual/day-4/automation/heat.md)
12. [Automate Infrastructure using
    Terraform](operators_manual/day-4/automation/terraform.md)
