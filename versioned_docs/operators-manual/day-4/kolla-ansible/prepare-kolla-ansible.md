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

:::danger
Later deployments revert configuration changes that OpenMetal has not recorded, including the deployment that runs when you add a node in Central. [Submit a support ticket](../../day-1/intro-to-openmetal-private-cloud.md#submit-a-support-ticket) before you change your cloud's configuration.
:::

## Prerequisites

- Root access to your cloud's control plane nodes is required.
- Experience using [Ansible](https://www.ansible.com/).

## Using Kolla Ansible

:::danger
Work from a control plane node that contains `/etc/kolla/config`. Control plane nodes are labeled **Cloud Core** on your cloud's **Assets** page in OpenMetal Central.
:::

### Add SSH key for Kolla Ansible

You must add an SSH public key to your cloud's nodes. This public key can be added
using OpenMetal Central under **Settings -> Add SSH Key**.

Create an Ansible deployment SSH keypair with:

    ssh-keygen -t ed25519 -C "kolla-ansible"

### Prepare Kolla Ansible Quick Start

    cd /opt/kolla-ansible-cli
    python3 -m venv .venv
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

Double check the hosts specified in `/opt/kolla-ansible-cli/inventory.yml`
match the hosts listed in the Assets page of your cloud in OpenMetal Central.

#### Missing Inventory

Should you not find the inventory files in your cloud as specified in the
previous step, your cloud may be running an older release. Ideally your cloud
should be updated to our latest release, so reach out to us to help facilate
this.

#### Before Making Changes

`/etc/kolla/globals.yml` is regenerated on every OpenMetal deployment run, so edits made to it directly are lost. OpenMetal records the settings where your cloud differs from our defaults, and those are kept.

Per-cloud values are set in `/etc/kolla/globals.d/custom-globals.yml`. Do not modify this file.

Changes to OpenStack service configuration files under `/etc/kolla/config` are not yet tracked and can be lost in the same way.

To change your cloud's configuration, [submit a support ticket](../../day-1/intro-to-openmetal-private-cloud.md#submit-a-support-ticket) and our team makes the change.

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

    cd /opt/kolla-ansible-cli
    python3 -m venv .venv
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

#### **Step 5** -- Install Ansible Galaxy dependencies

Install Ansible Galaxy dependencies using:

    kolla-ansible install-deps

#### **Step 6** -- Kolla Ansible is Ready for Use

At this step, you have everything prepared to use Kolla Ansible. Before
proceeding, familiarize yourself with the available Kolla Ansible
commands by running `kolla-ansible --help`. There are a number of
functions possible, including maintenance tasks or making configuration
changes to your Private Cloud.

:::danger
The next deployment overwrites edits to `/etc/kolla/globals.yml`. See [Before Making Changes](#before-making-changes).
:::

An example configuration change made at this step is to enable TLS.
Enabling TLS falls outside the scope of this guide. For
instruction on how to do so, see [How to Enable TLS for
OpenStack](enable-tls).

For complete documentation regarding available Kolla Ansible commands,
see [Operating
Kolla](https://docs.openstack.org/kolla-ansible/latest/user/operating-kolla.html).

## References

- [OpenStack Kolla Ansible
    documentation](https://docs.openstack.org/kolla-ansible/2026.1/)
- [Kolla Ansible Quick
    Start](https://docs.openstack.org/kolla-ansible/2026.1/user/quickstart.html)
