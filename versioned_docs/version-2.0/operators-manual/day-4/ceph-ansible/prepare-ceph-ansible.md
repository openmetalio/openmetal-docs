# How to Prepare and Use Ceph Ansible

## Introduction

Should you want to reconfigure your Private Cloud's Ceph cluster, you
can do so using Ceph Ansible. In this guide, we explain how to prepare
an environment from which Ceph Ansible can be used. Making specific
configuration changes to your Ceph cluster is outside the scope of this
guide.

## Prerequisites

### Root Access to OpenStack Control Plane

Root access to your cloud's control plane nodes is required.

### Path to the Ceph Configuration Files

* Ceph Ansible Inventory: `/opt/ceph-ansible-cli/inventory.yml`
* Ceph Ansible Config: `/opt/ceph-ansible-cli/group_vars/all.yml`

## Preparation

### Add SSH key for Ceph Ansible

Before running Ceph Ansible, the deployment host must be able to connect over
SSH to each of the inventory hosts.

Create an Ansible deployment SSH keypair with:

    ssh-keygen -t ed25519 -C "ceph-ansible"

Add the public key using OpenMetal Central under **Settings -> Add SSH Key**.

To prepare Ceph Ansible:

    cd /opt/ceph-ansible-cli
    virtualenv .venv
    source .venv/bin/activate
    pip install 'ansible-core<2.17,netaddr,setuptools,six'

Deploy a Ceph Cluster:

    ansible-playbook \
        -i /opt/ceph-ansible-cli/inventory.yml \
        --private-key $CEPH_ANSIBLE_DEPLOY_KEY \
        /opt/ceph-ansible-cli/site.yml

`$CEPH_ANSIBLE_DEPLOY_KEY` is the private SSH key created prior to running
`ansible-playbook`. The public portion should exist on each of the deployment
hosts.