---
sidebar_position: 1
---
# How to Prepare and Use Kolla Ansible

## Introduction

Our Private Cloud Core deployments provide workload orchestration
through the use of [Kolla
Ansible](https://github.com/openstack/kolla-ansible) which deploys
OpenStack services and infrastructure components in Docker containers.
Should you want to make a change to an OpenStack service's
configuration, add a new OpenStack service, or even repair your
OpenStack cluster, you can do so using Kolla Ansible. In this guide, we
explain how to prepare a Kolla Ansible environment, from which
configuration changes can be made.

## Before Proceeding

**WARNING\!** -- Our current deployment system deploys a Private Cloud
with a known working state. Should you deviate from this state by
adjusting your cloud's OpenStack configuration you can no longer safely
use the functions in OpenMetal Central to add nodes to your cloud or add
IP blocks. Should you use these functions, any custom configurations
will be reverted. We are working on rolling out a new deployment system
allowing custom cloud configurations. We can still help you modify your
cloud, but must do so manually. Please reach out to your Account Manager
should this apply to you.

## Prerequisites

- Root access to your cloud's control plane nodes is required.
- Experience using [Ansible](https://www.ansible.com/).

## Using Kolla Ansible

**Caution\!** Ensure the node from which you are working contains the
directory `/etc/kolla/config`. This directory exists in the control plane nodes
and is used to provide our custom configuration to OpenStack services. Control
plane nodes are labeled as "Cloud Core" in the Assets page of your cloud in
OpenMetal Central.

### Add SSH key for Kolla Ansible

You must add an SSH public key to your cloud's nodes. This public key can be added
using OpenMetal Central under **Settings -> Add SSH Key**.

Create an Ansible deployment SSH keypair with:

    ssh-keygen -t ed25519 -C "kolla-ansible"

### Prepare Kolla Ansible Quick Start

    cd /opt/kolla-ansible-cli
    virtualenv .venv
    source .venv/bin/activate
    pip install --upgrade pip
    pip install -r requirements.txt
    kolla-ansible install-deps

- Kolla Ansible Inventory: `/opt/kolla-ansible-cli/inventory.yml`
- Kolla Ansible Multinode Inventory: `/opt/kolla-ansible-cli/ansible/inventory/multinode`
- Kolla Ansible Main Configuration: `/etc/kolla/globals.yml`

### General Usage

    kolla-ansible -i inventory.yml -i ansible/inventory/multinode <command>

For a full list of available commands, see [Kolla Ansible CLI](https://docs.openstack.org/kolla-ansible/latest/user/operating-kolla.html#kolla-ansible-cli).

### Prepare Kolla Ansible

In this section, we explain the steps needed to create an environment
from which Kolla Ansible can be executed. The steps in this section
should be performed from the node in your cloud that contains the path
`/etc/kolla/config`. This directory exists on a single node and is used
to provide our custom configuration to OpenStack services.

### Kolla Ansible Configuration Files

First, we introduce you to the files required for adjusting Kolla
Ansible's configuration. These files are used when preparing Kolla
Ansible.

- Kolla Ansible Inventory: `/opt/kolla-ansible-cli/inventory.yml`
- Kolla Ansible Multinode Inventory: `/opt/kolla-ansible-cli/ansible/inventory/multinode`
- Kolla Ansible Main Configuration: `/etc/kolla/globals.yml`

Both inventory files must be passed when using Kolla Ansible.
`/opt/kolla-ansible-cli/inventory.yml` contains your cloud's specific hosts
whereas `/opt/kolla-ansible-cli/ansible/inventory/multinode` groups the hosts as
required by Kolla Ansible.

**Caution\!** Read over `/opt/kolla-ansible-cli/inventory.yml` to ensure the
*hosts specified within match the hosts you intend to make changes to.

#### Missing Inventory

Should you not find the inventory files in your cloud as specified in the
previous step, your cloud may be running an older release. Ideally your cloud
should be updated to our latest release, so reach out to us to help facilate
this.

#### Before Making Changes

Before any changes are made to the Kolla Ansible configuration, the
following variables in `/etc/kolla/globals.yml` should not be modified,
otherwise they will be overwritten:

    api_interface
    cluster_interface
    dns_interface
    docker_registry_insecure
    kolla_enable_tls_external
    kolla_external_fqdn
    kolla_external_vip_address
    kolla_internal_vip_address
    migration_interface
    network_interface
    neutron_external_interface
    openstack_region_name
    storage_interface
    tunnel_interface

For more information, see the section titled [Before
Proceeding](#before-proceeding) at the top of this guide.

### Prepare Kolla Ansible Environment

#### **Step 1** - Prepare environment

First ensure the node you are logged into over SSH contains the
directory `/etc/kolla/config`. This directory exists in the control plane nodes
and is used to provide our custom configuration to OpenStack services. Control
plane nodes are labeled as "Cloud Core" in the Assets page of your cloud in
OpenMetal Central.

Next, navigate to the folder `/opt/kolla-ansible-cli` which contains required
Kolla Ansible configuration: 

    cd /opt/kolla-ansible-cli

#### **Step 2** -- Prepare Python virtual environment

Create a Python virtual environment and activate it:

    cd /opt/kolla-ansible
    virtualenv .venv
    source .venv/bin/activate

#### **Step 3** -- Update pip

Update the virtual environment's `pip` to the latest version, otherwise
packages may not install as expected.

Update `pip` using:

    pip install --upgrade pip

#### **Step 4** -- Install Kolla Ansible

With the virtual environment prepared, we can now install Kolla Ansible
and Ansible using `pip`.

Install Kolla Ansible and its dependencies:

    pip install -r requirements.txt

Should `requirements.txt` not exist, you can ask us to sync that file to your
cloud.

For our latest deployments running OpenStack 2023.2, `requirements.txt` should contain:

    ansible-core==2.15.*
    kolla-ansible==17.3.*

#### **Step 5** -- Install Ansible Galaxy dependencies

Install Ansible Galaxy dependencies using:

    kolla-ansible install-deps

#### **Step 6** -- Kolla Ansible is Ready for Use

At this step, you have everything prepared to use Kolla Ansible. Before
proceeding, familiarize yourself with the available Kolla Ansible
commands by running `kolla-ansible --help`. There are a number of
functions possible, including maintenance tasks or making configuration
changes to your Private Cloud.

**Caution\!** -- Kolla Ansible's configuration is set through the file
`/etc/kolla/globals.yml` where some variables should not be changed. See
the section titled [Before Making
Changes](prepare-kolla-ansible#before-making-changes)
at the top of this guide for more information.

An example configuration change made at this step is to enable TLS for
Horizon. Enabling TLS falls outside the scope of this guide. For
instruction on how to do so, see [How to Enable TLS for
OpenStack](enable-tls).

For complete documentation regarding available Kolla Ansible commands,
see [Operating
Kolla](https://docs.openstack.org/kolla-ansible/latest/user/operating-kolla.html).

## References

- [OpenStack Kolla Ansible
    documentation](https://docs.openstack.org/kolla-ansible/latest/)
- [Kolla Ansible Quick
    Start](https://docs.openstack.org/kolla-ansible/latest/user/quickstart.html)
