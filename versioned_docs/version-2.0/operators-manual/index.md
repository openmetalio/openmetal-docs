---
sidebar_class_name: hidden
---

# OpenStack Operator's Manual - Private Cloud Core

![image](/img/operators-manual/intro.jpg)

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
visit the [Private Cloud](https://openmetal.io/products/private-cloud/hosted/)
page.

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

### Day 1

Day 1 generally refers to initial setup, which in our case is the
process of getting started with a Private Cloud Core OpenStack Cloud. We
introduce you to OpenMetal Central, how to view the assets that comprise
your cloud, and how to get support from our staff.

### Day 2

Day 2 initially explains briefly how your Private Cloud was deployed.
Next we cover OpenStack administration by explaining how to perform
maintenance tasks for your cluster's hardware nodes.

### Day 3

Day 3 has to do with how you can scale your cloud by adding more
hardware nodes to it. Next we get into preparing for disaster recovery
by explaining best practices relating to keeping your data safe. We
provide a general outline for how you can recover from a disaster.

### Day 4

In Day 4, we cover advanced OpenStack administration through Kolla
Ansible, the primary system used to deploy a Private Cloud. Through this
system, we explain how configuration changes to your cloud can be made.
Next, we detail a few common troubleshooting scenarios and their
solutions. Finally we briefly cover automation techniques possible in
your cloud through the use of OpenStack's Heat service and through
HashiCorp's Terraform application.