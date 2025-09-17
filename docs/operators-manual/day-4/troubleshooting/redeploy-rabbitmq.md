---
sidebar_position: 2
---
# How to Redeploy OpenStack's RabbitMQ Cluster using Kolla Ansible

## Introduction

As a last resort, it is possible to address issues with a cloud's
RabbitMQ cluster by redeploying the service using Kolla Ansible. In this
guide, we explain how to redeploy a private cloud's RabbitMQ cluster
using Kolla Ansible.

## Prerequisites

### Prepare Kolla Ansible

This guide explains how to configure your cloud using Kolla Ansible. Any
time you work with Kolla Ansible, you must prepare a shell environment.
For more, see [How to Prepare and Use Kolla Ansible](../kolla-ansible/prepare-kolla-ansible).

All commands are to be executed from the control plane node in which
Kolla Ansible has been prepared.

### Root Access to OpenStack Control Plane

Root access to your cloud's control plane nodes is required.

## How to Redeploy RabbitMQ

For each RabbitMQ cluster member, run:

    docker stop rabbitmq
    cp -Rv /var/lib/docker/volumes/rabbitmq/_data/mnesia{,.bk$(date +%F)}
    rm -rfv /var/lib/docker/volumes/rabbitmq/_data/mnesia/

Then, use Kolla Ansible's `deploy` function, targeting RabbitMQ:

    kolla-ansible -i inventory.yml -i ansible/inventory/multinode deploy --tags rabbitmq
