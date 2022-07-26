# How to Prepare and Use Ceph Ansible

## Introduction

Should you want to reconfigure your Private Cloud's Ceph cluster, you
can do so using Ceph Ansible. In this guide, we explain how to prepare
an environment from which Ceph Ansible can be used. Making specific
configuration changes to your Ceph cluster is outside the scope of this
guide.

## Before Proceeding

**WARNING\!** -- Our current deployment system deploys a Private Cloud
with a known working state. Should you deviate from this state by
adjusting your cloud's Ceph configuration you can no longer safely use
the functions in OpenMetal Central to add nodes to your cloud or add IP
blocks. Should you use these functions, any custom configurations to
Ceph will be reverted. We are working on rolling out a new deployment
system allowing custom cloud configurations. We can still add new nodes
and IP blocks to your cloud but must do so manually. Please reach out to
your Account Manager should this apply to you.

## Prerequisites

### Root Access to OpenStack Control Plane

Root access to your cloud's control plane nodes is required.

## Preparation

To prepare Ceph Ansible:

    docker cp fm-deploy:/opt/ceph-ansible /opt/ceph-ansible
    chmod 700 /opt/ceph-ansible
    cd /opt/ceph-ansible
    virtualenv .venv
    source .venv/bin/activate
    pip install -r requirements.txt
    pip install six

Deploy a Ceph Cluster:

    ansible-playbook \
        -i /etc/fm-deploy/ceph-inventory.yml \
        --private-key /root/.ssh/fm-deploy \
        /opt/ceph-ansible/site.yml

Attempt to repair a broken Ceph cluster:

    ansible-playbook \
        -i /etc/fm-deploy/ceph-inventory.yml \
        --private-key /root/.ssh/fm-deploy \
        /opt/ceph-ansible/site.yml
