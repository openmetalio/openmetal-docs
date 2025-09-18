---
sidebar_position: 3
---
# How to Enable OpenSearch using Kolla Ansible

## Introduction

An OpenStack cloud generates a large quantity of log messages. By default,
there's no way to visually see a Private Cloud's log messages.  To diagnose
issues in logs requires using SSH and `grep`, which can be cumbersome due to the
number of hosts and number of OpenStack services.  OpenSearch could be leveraged
to see all of your cloud's log files from a single location in your browser.
This feature set is not enabled by default. In this guide we walk you through
how to enable OpenSearch for your Private Cloud using Kolla Ansible.

## Prerequisites

### Prepare Kolla Ansible

This guide explains how to configure your cloud using Kolla Ansible. Any
time you work with Kolla Ansible, you must prepare a shell environment.
For more, see [How to Prepare and Use Kolla Ansible](./prepare-kolla-ansible).

All commands are to be executed from the control plane node in which
Kolla Ansible has been prepared.

### Root Access to OpenStack Control Plane

Root access to your cloud's control plane nodes is required.

## How to Enable Central Logging

To enable OpenSearch, in `/etc/kolla/globals.yml` ensure the following is set:

    enable_central_logging: 'yes'

Adjust data retention policies with:

    opensearch_apply_log_retention_policy
    opensearch_soft_retention_period_days
    opensearch_hard_retention_period_days

> Note - By default the soft and hard retention periods are 30 and 60 days respectively.

Next, to deploy the configuration changes, use:

    # kolla-ansible -i inventory.yml -i ansible/inventory/multinode reconfigure

## Reference

Kolla Ansible's [Central
Logging](https://docs.openstack.org/kolla-ansible/2023.2/reference/logging-and-monitoring/central-logging-guide.html)
guide.
