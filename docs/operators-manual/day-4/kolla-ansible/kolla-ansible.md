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

## Table of Contents

1.  [Prerequisites](operators_manual/day-4/kolla-ansible/kolla-ansible#prerequisites)

2.  [Using Kolla Ansible Quick
    Start](operators_manual/day-4/kolla-ansible/kolla-ansible#using-kolla-ansible-quick-start)

3.    - [Prepare Kolla Ansible for
        Use](operators_manual/day-4/kolla-ansible/kolla-ansible#prepare-kolla-ansible-for-use)
        
        1.  [Kolla Ansible Configuration
            Files](operators_manual/day-4/kolla-ansible/kolla-ansible#kolla-ansible-configuration-files)
        2.  [Before Making
            Changes](operators_manual/day-4/kolla-ansible/kolla-ansible#before-making-changes)
        3.  [Prepare Kolla Ansible
            Environment](operators_manual/day-4/kolla-ansible/kolla-ansible#prepare-kolla-ansible-environment)

4.  [References](operators_manual/day-4/kolla-ansible/kolla-ansible#references)

5.  [Next
    Steps](operators_manual/day-4/kolla-ansible/kolla-ansible#next-steps)

## Prerequisites

  - Root access to your cloud's control plane nodes is required.
  - Experience using [Ansible](https://www.ansible.com/).

## Using Kolla Ansible Quick Start

**Caution\!** Ensure the node from which you are working contains the
directory `/etc/kolla/config`. This directory exists on a single node
and is used to provide our custom configuration to OpenStack services.

Follow this section for a summary of the commands required to prepare
Kolla Ansible. For more detailed instruction, see the section labeled
[Prepare Kolla Ansible for Use](#prepare-kolla-ansible-for-use) within
this guide.:

    # Create a folder for your Kolla Ansible environment
    $ mkdir /opt/kolla-ansible
    
    # Navigate to folder
    $ cd /opt/kolla-ansible
    
    # Initialize a Python virtual environment
    $ virtualenv .venv
    
    # Activate the virtual environment
    $ source .venv/bin/activate
    
    # Update pip
    pip install --upgrade pip
    
    # Install Kolla Ansible and Ansible
    $ pip install git+https://github.com/inmotionhosting/kolla-ansible@stable/victoria
    $ pip install 'ansible>=2.9,<2.10,!=2.9.10'

Kolla Ansible, being built off of Ansible, is executed against an
inventory file. Each node in your cloud has a copy of the Kolla Ansible
inventory used during cloud deployment, located as
`/etc/fm-deploy/kolla-ansible-inventory`.

**Caution\!** Read over the inventory file to ensure the hosts specified
within match the hosts you intend to make changes to.

For a full list of available commands, see [Kolla Ansible
CLI](https://docs.openstack.org/kolla-ansible/latest/user/operating-kolla.html#kolla-ansible-cli).

## Prepare Kolla Ansible for Use

In this section, we explain the steps needed to create an environment
from which Kolla Ansible can be executed. The steps in this section
should be performed from the node in your cloud that contains the path
`/etc/kolla/config`. This directory exists on a single node and is used
to provide our custom configuration to OpenStack services.

Kolla Ansible Configuration Files
\~\~\~\~\~\~\~\~\~\~\~\~\~\~\~\~\~\~\~\~\~\~\~\~\~\~\~\~\~\~\~\~

First, we introduce you to the files required for adjusting Kolla
Ansible's configuration. These files are used when preparing Kolla
Ansible.

  - Kolla Ansible Inventory: `/etc/fm-deploy/kolla-ansible-inventory`
  - Kolla Ansible Main Configuration: `/etc/kolla/globals.yml`

**Note\!** It is possible `/etc/fm-deploy/kolla-ansible-inventory`
exists on a single node instead of being synced across all nodes. We
recently corrected a bug where the contents in `/etc/fm-deploy` were not
being synced across all nodes at the end of a deployment.

Before Making Changes \~\~\~\~\~\~\~\~\~\~\~\~\~\~\~\~\~\~\~\~

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

Prepare Kolla Ansible Environment
\~\~\~\~\~\~\~\~\~\~\~\~\~\~\~\~\~\~\~\~\~\~\~\~\~\~\~\~\~\~\~\~

**Step 1** - Prepare environment

First ensure the node you are logged into over SSH contains the
directory `/etc/kolla/config`. This directory exists on a single node
and is used to provide our custom configuration to OpenStack services.

Next, create a folder where you will install Kolla Ansible and its
dependency, Ansible. For example:

    $ mkdir /opt/kolla-ansible

**Step 2** -- Prepare Python virtual environment

Navigate into the folder created previously, create a Python virtual
environment and activate it:

    $ cd /opt/kolla-ansible
    $ virtualenv .venv
    $ source .venv/bin/activate

**Step 3** -- Update pip

Update the virtual environment's `pip` to the latest version, otherwise
packages may not install as expected.

Update `pip` using:

    $ pip install --upgrade pip

**Step 4** -- Install Kolla Ansible

With the virtual environment prepared, we can now install Kolla Ansible
and Ansible using `pip`.

Install Kolla Ansible, and its dependency Ansible, using these specified
versions:

    $ pip install git+https://github.com/inmotionhosting/kolla-ansible@stable/victoria
    $ pip install 'ansible>=2.9,<2.10,!=2.9.10'

**Caution\!** -- It is important the version of Kolla Ansible installed
during this step match your cloud's OpenStack version. Your cloud's
OpenStack version can be determined by looking at the Docker image tags
associated with the Kolla containers from the output of `docker image
ls`, for example.

**Step 5** -- Kolla Ansible is Ready for Use

At this step, you have everything prepared to use Kolla Ansible. Before
proceeding, familiarize yourself with the available Kolla Ansible
commands by running `kolla-ansible --help`. There are a number of
functions possible, including maintenance tasks or making configuration
changes to your Private Cloud.

**Caution\!** -- Kolla Ansible's configuration is set through the file
`/etc/kolla/globals.yml` where some variables should not be changed. See
the section titled [Before Making
Changes](operators_manual/day-4/kolla-ansible/kolla-ansible#before-making-changes)
at the top of this guide for more information.

An example configuration change made at this step is to enable TLS for
Horizon. Enabling TLS falls outside the scope of this guide. For
instruction on how to do so, see [How to Enable TLS for
OpenStack](operators_manual/day-4/kolla-ansible/enable-tls).

For complete documentation regarding available Kolla Ansible commands,
see [Operating
Kolla](https://docs.openstack.org/kolla-ansible/latest/user/operating-kolla.html).

## References

  - [OpenStack Kolla Ansible
    documentation](https://docs.openstack.org/kolla-ansible/latest/)
  - [Kolla Ansible Quick
    Start](https://docs.openstack.org/kolla-ansible/latest/user/quickstart.html)

## Next Steps

The following guides go into detail about specific things you can
configure using Kolla Ansible, such enabling TLS for Horizon or enabling
Central Logging with an ELK stack:

  - [Enable TLS for
    Horizon](operators_manual/day-4/kolla-ansible/enable-tls)
  - [Enable Central Logging using
    ELK](operators_manual/day-4/kolla-ansible/enable-elk)
