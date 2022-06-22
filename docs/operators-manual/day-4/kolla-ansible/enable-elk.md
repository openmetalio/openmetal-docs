# How to Enable Elasticsearch and Kibana using Kolla Ansible

## Introduction

An OpenStack cloud generates a large quantity of log messages. By
default, there's no way to visually see a Private Cloud's log messages.
To diagnose issues in logs requires using SSH and `grep`, which can be
cumbersome due to the number of hosts and number of OpenStack services.
Elasticsearch and Kibana (ELK) could be leveraged to see all of your
cloud's log files from a single location in your browser. This feature
set is not enabled by default. In this guide we walk you through how to
enable the ELK stack for your Private Cloud using Kolla Ansible.

1. - [Prerequisites](enable-elk#prerequisites)

        1. [Prepare Kolla
            Ansible](enable-elk#prepare-kolla-ansible)
        2. [Root Access to OpenStack Control
            Plane](enable-elk#root-access-to-openstack-control-plane)

2. - [How to Enable Central
        Logging](enable-elk#how-to-enable-central-logging)

        1. [Prevent Root Disk from
            Filling](enable-elk#prevent-root-disk-from-filling)

3. [Reference](enable-elk#reference)

## Prerequisites

### Prepare Kolla Ansible

This guide explains how to configure your cloud using Kolla Ansible. Any
time you work with Kolla Ansible, you must prepare a shell environment.
For more, see [How to Prepare and Use Kolla
Ansible](./).

All commands are to be executed from the control plane node in which
Kolla Ansible has been prepared.

### Root Access to OpenStack Control Plane

Root access to your cloud's control plane nodes is required.

## How to Enable Central Logging

To enable the ELK stack, in `/etc/kolla/globals.yml` ensure the
following is set:

    enable_central_logging: 'yes'

To enforce data retention policies, enable Elasticseach Curator with:

    enable_elasticsearch_curator: 'yes'

**Note\!** -- Enabling Elasticseach Curator can help prevent your
cloud's local disks from filling up by enforcing retention policies for
Elasticsearch data.

Kolla Ansible generates a default configuration for Elasticsearch
Curator which can later be found in the `elasticsearch_curator` Docker
container as
`elasticsearch_curator:/etc/elasticsearch-curator/actions.yml`.

Next, to deploy the configuration changes, use:

    # kolla-ansible -i /etc/fm-deploy/kolla-ansible-inventory reconfigure

### Prevent Root Disk from Filling

You can enable Elasticsearch Curator to enforce disk retention polices
to prevent your cloud's disks from filling up.

## Reference

Kolla Ansible's [Central
Logging](https://docs.openstack.org/kolla-ansible/victoria/reference/logging-and-monitoring/central-logging-guide.html)
guide.
