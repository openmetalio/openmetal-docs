---
slug: getting-started-with-ceilometer-and-gnocchi
sidebar_position: 3
---
# Getting Started with Ceilometer and Gnocchi

## Introduction

With our latest update to Private Cloud Core comes two new OpenStack
services: Ceilometer and Gnocchi. These services are part of OpenStack's
[Telemetry Project](https://wiki.openstack.org/wiki/Telemetry) and serve
to collect data. That data then can be acted upon using the OpenStack
alarming service [Aodh](https://docs.openstack.org/aodh/latest/).

The purpose of this guide is to briefly explain the function of
Ceilometer, Gnocchi, and Aodh. We also demonstrate a way to collect
instance resource usage metrics provided by Ceilometer using
OpenStackClient.

-----

## What is Ceilometer?

Ceilometer is an OpenStack service that provides cloud metrics. The data
this service provides can be used for customer billing, resource usage
analysis, and to send alerts.

**Reference**: [Ceilometer
Documentation](https://docs.openstack.org/ceilometer/latest/)

## What is Gnocchi?

Gnocchi, part of the bigger Telemetry project in OpenStack, addresses
the problem of storage and collection of time series data. Gnocchi
provides time series database as a service.

**Reference**: [Gnocchi Wiki](https://wiki.openstack.org/wiki/Gnocchi)

## What is Aodh?

Aodh is an OpenStack alarming service that can provide alerts and
trigger actions based on the metrics collected by Ceilometer and
Gnocchi.

**Reference**: [Aodh
Documentation](https://docs.openstack.org/aodh/latest/)

## How can I work with Ceilometer and collect metrics?

This section describes software that makes use of Ceilometer and Gnocchi
and also a way to collect instance usage metric data.

-----

An example of software that can be installed to an OpenStack cloud is
[Fleio](https://fleio.com/). This is software that makes use of metric
collecting services like Ceilometer and Gnocchi to provide a billing
system and self-service portal.

**Note\!** -- Fleio is third party software and is not part of the
default software installed to a Private Cloud Core cloud.

### Collect Instance Metrics using OpenStackClient

Using the Ceilometer command line client, you can collect instance
resource usage metrics like CPU time, memory, and disk space used.

This section demonstrates how you can use OpenStackClient to collect
instance resource usage metrics.

#### Required Command Line Clients

Before proceeding, the required command line clients must be installed.

To work with Gnocchi, Ceilometer, and Aodh over the command line, the
following packages must be installed to your OpenStackClient virtual
environment:

- `gnocchiclient`
- `python-ceilometerclient`
- `aodhclient`

#### How to Collect Instance Metrics from Ceilometer

**Step 1** -- Install required command line client

This section requires `python-ceilometerclient` to be installed and an
OpenStack cloud that has at least one instance using resources within
the cloud.

To install this package, ensure you have a [prepared OpenStackClient
environment](../operators-manual/day-1/command-line/openstackclient), then install
the package using pip.

For example:

    pip install python-ceilometerclient

**Step 2** -- List instances

Use `openstack server list` to list instances.

For example:

    $ openstack server list
    +--------------------------------------+----------------------------+--------+---------------------------------------+------------------------------------------------------+----------+
    | ID                                   | Name                       | Status | Networks                              | Image                                                | Flavor   |
    +--------------------------------------+----------------------------+--------+---------------------------------------+------------------------------------------------------+----------+
    | 1d6e3cd6-2a2d-4603-b854-47966e4d0eef | instance-1                 | ACTIVE | demo-net=173.231.254.73, 192.168.1.87 | N/A (booted from volume)                             | c1.small |
    | 52e3a93f-a593-404e-91fd-53ee7ebc6d86 | test-4j5gttlkz52p-node-2   | ACTIVE | test=10.0.0.233, 173.231.254.75       | Fedora CoreOS (fedora-coreos-33.20210412.3.0-stable) | m1.small |
    | e4d67716-4d1a-4460-9276-bd0da12f3cca | test-4j5gttlkz52p-node-1   | ACTIVE | test=10.0.0.143, 173.231.254.70       | Fedora CoreOS (fedora-coreos-33.20210412.3.0-stable) | m1.small |
    | ef263252-54a7-40a9-9d6a-14814c5ed66c | test-4j5gttlkz52p-node-0   | ACTIVE | test=10.0.0.188, 173.231.254.78       | Fedora CoreOS (fedora-coreos-33.20210412.3.0-stable) | m1.small |
    | ccea9641-879e-434d-ab69-f538dc291d34 | test-4j5gttlkz52p-master-2 | ACTIVE | test=10.0.0.148, 173.231.254.71       | Fedora CoreOS (fedora-coreos-33.20210412.3.0-stable) | m1.small |
    | 3f108ea3-12bc-494c-83bf-16f3be3f839a | test-4j5gttlkz52p-master-1 | ACTIVE | test=10.0.0.88, 173.231.254.76        | Fedora CoreOS (fedora-coreos-33.20210412.3.0-stable) | m1.small |
    | b989247d-a879-4ad9-bdb7-dae219039b33 | test-4j5gttlkz52p-master-0 | ACTIVE | test=10.0.0.117, 173.231.254.72       | Fedora CoreOS (fedora-coreos-33.20210412.3.0-stable) | m1.small |
    +--------------------------------------+----------------------------+--------+---------------------------------------+------------------------------------------------------+----------+

From this output, you need the instance's UUID. Copy this for the next
step.

**Step 3** -- List metrics for an instance

With the instance UUID, use
`openstack metric list -c resource_id -c name -c unit | grep <instance-uuid>`
to list metrics.

For example:

    $ openstack metric list -c resource_id -c name -c unit | grep 1d6e3cd6-2a2d-4603-b854-47966e4d0eef
    | cpu                             | ns      | 1d6e3cd6-2a2d-4603-b854-47966e4d0eef |
    | memory.usage                    | MB      | 1d6e3cd6-2a2d-4603-b854-47966e4d0eef |
    | vcpus                           | vcpu    | 1d6e3cd6-2a2d-4603-b854-47966e4d0eef |
    | compute.instance.booting.time   | sec     | 1d6e3cd6-2a2d-4603-b854-47966e4d0eef |
    | disk.ephemeral.size             | GB      | 1d6e3cd6-2a2d-4603-b854-47966e4d0eef |
    | memory                          | MB      | 1d6e3cd6-2a2d-4603-b854-47966e4d0eef |
    | disk.root.size                  | GB      | 1d6e3cd6-2a2d-4603-b854-47966e4d0eef |

Listed in the left-most column are the names of the metrics. The column
immediately following this one contains the units in which the metrics
are measured.

**Step 4** -- List CPU usage metrics

This step demonstrates collecting the CPU usage for an instance.

To collect CPU usage, use
`openstack metric measures show --resource-id=<instance-uuid> cpu`.

For example:

    $ openstack metric measures show --resource-id=1d6e3cd6-2a2d-4603-b854-47966e4d0eef cpu
    +---------------------------+-------------+----------------+
    | timestamp                 | granularity |          value |
    +---------------------------+-------------+----------------+
    | 2021-09-09T18:00:00-04:00 |       300.0 |  20340000000.0 |
    | 2021-09-09T18:05:00-04:00 |       300.0 |  20680000000.0 |
    | 2021-09-09T18:10:00-04:00 |       300.0 |  21010000000.0 |
    | 2021-09-09T18:15:00-04:00 |       300.0 |  21440000000.0 |
    | 2021-09-09T18:20:00-04:00 |       300.0 |  21880000000.0 |
    | 2021-09-09T18:25:00-04:00 |       300.0 |  22290000000.0 |
    | 2021-09-09T18:30:00-04:00 |       300.0 |  22590000000.0 |
    | 2021-09-09T18:35:00-04:00 |       300.0 |  22870000000.0 |
    [... output truncated...]

## Conclusion

Beyond this, Aodh can be used to act on metrics, by providing alarms or causing
specific actions to occur. For more on setting up alarms using Aodh, see [Using
Alarms](https://docs.openstack.org/aodh/2023.2/admin/telemetry-alarms.html#using-alarms),
from the OpenStack documentation page. Setting up alarms or causing specific
actions to occur is beyond the scope of this guide.
