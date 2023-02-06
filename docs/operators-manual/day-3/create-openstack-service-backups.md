---
sidebar_position: 4
---
# How to Copy and Restore OpenStack Service Configuration

## Introduction

Your OpenMetal private cloud is comprised of OpenStack services, which
like the applications and services you might deploy inside of it, should
be backed up on a regular interval so you can recover from catastrophic
events. In this guide, we explain how to copy your cloud's configuration
files and OpenStack service databases as well as how to restore these
items.

## Before Proceeding with this Guide

This guide introduces potentially harmful commands and actions that
could cause the cloud to become inoperable or be in an unexpected state.
Read commands carefully before executing them.

## Kolla Ansible and Ceph Ansible

Kolla Ansible is responsible for deploying a Private Cloud's OpenStack
services. Ceph Ansible then handles deployment of the cloud's Ceph
cluster. These two systems deploy all OpenStack and Ceph services
required for a Private Cloud, including their configurations.

### Prepare Kolla Ansible and Ceph Ansible Environment

Before working with either Kolla Ansible or Ceph Ansible, you must
prepare an environment in your shell:

- [How to Prepare and Use Kolla Ansible](../day-4/kolla-ansible/prepare-kolla-ansible)
- [How to Prepare and Use Ceph Ansible](../day-4/ceph-ansible/prepare-ceph-ansible)

### Where are my Private Cloud's Configuration Files?

:::info New Clouds

On clouds provisioned ***after* Dec 2022** you will need to open a
[support ticket](../day-1/intro-to-openmetal-private-cloud.md#how-to-submit-a-support-ticket)
to have the configuration saved to your nodes.

:::

When a cloud finishes deploying, the Ansible configurations used to
deploy the cloud are exported into each of the control plane nodes
within the folders `/etc/fm-deploy` and `/etc/kolla`. This section
explains where configuration files are located and their purpose.

#### Kolla Ansible Configuration Files

The information in these files was used to deploy your Private Cloud's
core OpenStack services into Docker containers:

- Kolla Ansible Inventory: `/etc/fm-deploy/kolla-ansible-inventory`
- Kolla Ansible Main Configuration: `/etc/kolla/globals.yml`

#### Ceph Ansible Configuration Files

The information in these files was used to deploy your Private Cloud's
Ceph cluster:

- Ceph Ansible Inventory: `/etc/fm-deploy/ceph-inventory.yml`
- Ceph Ansible Main Configuration: `/etc/fm-deploy/ceph-vars.yml`

#### FM-Deploy Configuration File

FM-Deploy is a part of the system used to deploy your Private Cloud.
Information about this deployment system is provided for the sake of
completely explaining the configuration files found within
`/etc/fm-deploy`.

- FM-Deploy Main Configuration: `/etc/fm-deploy/config.yml`

#### Network Ansible Configuration File

The following defines the initial networking configuration for your
Private Cloud. This file was used upon initial cloud deployment.

- Inventory: `/etc/fm-deploy/network-inventory.yml`

### Keep a Backup Copy a Private Cloud's Configuration Files

In case something unexpected happens to these files, you should keep
copies of them off site. To preserve the configuration of OpenStack
services and Ceph, copy the directories `/etc/fm-deploy`, `/etc/kolla`
and `/etc/ceph` somewhere outside of the cloud, in a secure, private
location. These folders contain sensitive information about your cloud
so the information within should only be accessible to those you trust
or yourself.

## How to Restore a Private Cloud's Configuration Files

There are two primary ways a Private Cloud's configuration file can be
restored: Copy a known good configuration file from an off site location
or use Ansible. This section explains how you can use Kolla Ansible and
Ceph Ansible to recover a Private Cloud's configuration files.

### Example: Recover Neutron's Configuration File using Kolla Ansible

For example, consider an event where one of your control plane nodes
loses its Neutron server configuration file. This section explains how
to recover this configuration by using Kolla Ansible.

#### Prerequisite: Prepare a Kolla Ansible Environment

Before proceeding, a Kolla Ansible environment needs to be prepared. For
information about preparing a Kolla Ansible environment, see
[How to Prepare and Use Kolla Ansible](../day-4/kolla-ansible/prepare-kolla-ansible)
Once the environment is prepared, navigate back to this section.

#### Regenerate an OpenStack Service's Configuration File using Kolla Ansible

In this example, we outline restoring the Neutron server configuration
file for the control plane node `relaxed-flamingo`.

In the Kolla Ansible inventory file,
`/etc/fm-deploy/kolla-ansible-inventory`, the following hosts are
defined as control plane nodes under the heading `[control]`:

    [control]
    relaxed-flamingo ansible_host=10.204.28.7
    focused-capybara ansible_host=10.204.30.158
    lovely-ladybug ansible_host=10.204.25.253

To restore the Neutron server configuration file for `relaxed-flamingo`,
first ensure you have [prepared a Kolla Ansible environment](../day-4/kolla-ansible/prepare-kolla-ansible)

Next, use Kolla Ansible's `reconfigure` function, targeting only the
Neutron service by using the flag `--tags neutron` and limit the run to
the host `relaxed-flamingo` by specifying the flag `--limit control[0]`.

For example:

    kolla-ansible \
        -i /etc/fm-deploy/kolla-ansible-inventory \
        reconfigure \
        --tags neutron \
        --limit control[0]
