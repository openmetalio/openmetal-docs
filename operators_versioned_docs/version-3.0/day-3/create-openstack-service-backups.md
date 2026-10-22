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

## Kolla Ansible and Cephadm

Kolla Ansible is responsible for deploying a Private Cloud's OpenStack
services. Cephadm then handles the deployment of the cloud's Ceph
cluster. These two systems deploy all OpenStack and Ceph services
required for a Private Cloud, including their configurations.

### Prepare a Kolla Ansible Environment

Before working with Kolla Ansible you must prepare an environment in your shell:

- [How to Prepare and Use Kolla Ansible](../day-4/kolla-ansible/prepare-kolla-ansible)

### Where are my Private Cloud's Configuration Files?

When a cloud finishes deploying, the Ansible configurations used to deploy the
cloud are exported into each of the control plane nodes within the folders
`/opt/kolla-ansible-cli` and `/etc/kolla`. The Ceph configuration is stored in
`/etc/ceph/spec.yaml`. This section explains where configuration files are
located and their purpose.

#### Kolla Ansible Configuration Files

The information in these files was used to deploy your Private Cloud's
core OpenStack services into Docker containers:

- Kolla Ansible Inventory:
  - `/opt/kolla-ansible-cli/inventory.yml`
  - `/opt/kolla-ansible-cli/ansible/inventory/multinode`
- Kolla Ansible Main Configuration: `/etc/kolla/globals.yml`

#### Cephadm Configuration

The information in this file was used to deploy your Private Cloud's
Ceph cluster:

- Cephadm spec.yaml: `/etc/ceph/spec.yaml`

### Keep a Backup Copy a Private Cloud's Configuration Files

In case something unexpected happens to these files, you should keep copies of
them off site. To preserve the configuration of OpenStack services and Ceph,
copy the directories `/opt/kolla-ansible-cli/`, `/etc/kolla` and `/etc/ceph`
somewhere outside of the cloud, in a secure, private location. These folders
contain sensitive information about your cloud so the information within should
only be accessible to those you trust or yourself.

## How to Restore a Private Cloud's Configuration Files

There are two primary ways a Private Cloud's configuration file can be restored:
Copy a known good configuration file from an off site location or use Ansible.
This section explains how you can use Kolla Ansible to recover a Private Cloud's
OpenStack configuration files.

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
`/opt/kolla-ansible-cli/inventory.yml`, the following hosts are
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
        -i /opt/kolla-ansible-cli/inventory.yml -i /opt/kolla-ansible-cli/ansible/inventory/multinode \
        reconfigure \
        --tags neutron \
        --limit control[0]
