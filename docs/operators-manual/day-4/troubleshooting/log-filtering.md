# Guidelines for Searching through OpenStack Logs

## Introduction

OpenMetal private clouds generate a large quantity of log files. It can
be daunting knowing which log and on which host to look in to diagnose
an issue. In this guide, we present strategies for extracting
information from a private cloud's log files to determine the root cause
of a failure.

## Table of Contents

1. [Prerequisites](log-filtering#prerequisites)

    1. [Root Access to OpenStack Control
        Plane](log-filtering#root-access-to-openstack-control-plane)

2. [Elasticsearch and
    Kibana](log-filtering#elasticsearch-and-kibana)

3. [Kolla Ansible Log
    Locations](log-filtering#kolla-ansible-log-locations)

4. [Determining the Correct
    Log](log-filtering#determining-the-correct-log)

5. [Determining the Correct
    Host](log-filtering#determining-the-correct-host)

6. [Viewing
    Logs](log-filtering#viewing-logs)

## Prerequisites

### Root Access to OpenStack Control Plane

Root access to your cloud's control plane nodes is required.

## Elasticsearch and Kibana

This guide focuses on how to manually look through logs, however
Elasticsearch and Kibana, commonly referred to as an ELK stack, are
often used to aggregate and view logs in a visual manner. With a
properly configured ELK stack, you can view all of your cloud's logs
from a single location, visually.

For more information about enabling an ELK stack in your cloud, see [How
to Enable Elasticsearch and Kibana using Kolla
Ansible](../../day-4/kolla-ansible/enable-elk).

## Kolla Ansible Log Locations

Private Clouds are deployed using Kolla Ansible, an OpenStack deployment
system. This system deploys all OpenStack services into Docker
containers. Each service's log file is then stored as
`/var/log/kolla/<service-name>`, where `<service-name>` is an OpenStack
service, like Neutron for example.

For example, to see all logs associated with the Neutron service, `ls`
the directory `/var/log/kolla/neutron`:

    # ls /var/log/kolla/neutron/*.log
    /var/log/kolla/neutron/dnsmasq.log
    /var/log/kolla/neutron/neutron-dhcp-agent.log
    /var/log/kolla/neutron/neutron-l3-agent.log
    /var/log/kolla/neutron/neutron-metadata-agent.log
    /var/log/kolla/neutron/neutron-metering-agent.log
    /var/log/kolla/neutron/neutron-netns-cleanup.log
    /var/log/kolla/neutron/neutron-openvswitch-agent.log
    /var/log/kolla/neutron/neutron-server.log
    /var/log/kolla/neutron/privsep-helper.log

## Determining the Correct Log

How do you know which log to look in for an issue? Which host should you
be in? It is generally useful to know which OpenStack services are
running and what their purposes are before determining which log file to
examine to troubleshoot an issue. For a list of OpenStack services and
their purpose, see the [OpenStack
Components](https://www.openstack.org/software/project-navigator/openstack-components#openstack-services)
page.

When diagnosing issues, consider the services associated with the action
that may be failing. For example, if looking into an issue with creating
a volume, consider looking at Cinder's various logs.

## Determining the Correct Host

By default, your cloud has three control plane nodes. Each of these
nodes has very similar logs, and typically, only one of the nodes is
recording log events for a specific service. Due to this, you may need
to examine all three host's logs in real time, replicate the issue, then
see if any of those logs recorded any events.

To view the logs for all hosts at the same time, consider using a
terminal multiplexer, especially one where you can issue the same
commands in multiple SSH connections. The application `tmux` is an
example of a terminal multiplexer.

## Viewing Logs

There are several native ways to view the contents of a log file.

Applications like `less`, `nano`, and `vim` will suffice. For more
colorful output, consider using an application like `lnav`, which has
proven especially useful for examining unfamiliar logs.
