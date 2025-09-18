---
slug: /engineers-notes/vpc-in-the-context-of-openstack
description: A comparison of the private cloud VPC concept in the context of an OpenStack private cloud.
---
# VPC in the Context of OpenStack

## Overview

Many public cloud providers allow you to utilize Virtual Private Clouds (VPC).
In this context a VPC is a logically isolated virtual network dedicated to a
private cloud account.

While there is currently no 1:1 comparison in OpenStack a simplified version
would be as follows.

| VPC Features    | OpenStack Features |
|:---------------:|:------------------:|
| VPC             | Project            |
| Subnets         | Networks           |
| DHCP options    | IPAM               |
| Elastic IP      | Floating IP        |
| Network ACLs    | Network ACLs       |
| Security groups | Security groups    |
| Route Table     | Route Table        |

The OpenStack community has a blueprint in place with the goal of creating
additional parity with the VPC concept which can be reviewed on the
[OpenStack Wiki](https://wiki.openstack.org/wiki/Blueprint-VPC)

There is also an ongoing efforts to expand the [OpenStack EC2 API](https://wiki.openstack.org/wiki/Blueprint-aws-vpc-support)
and [Heat project](https://wiki.openstack.org/wiki/Heat/VPC_Resources_Support)
to that same end.

In future articles we will be delving deeper into OpenStack private cloud
resource isolation, and it's relation to public cloud VPCs.

## VPC using OpenStack

### Projects

Projects in OpenStack separate your cloud infrastructure from other workloads.
If you have multiple DevOps teams with varying workloads and use cases each team
can be provided a project tailored to their resource requirements.

### Users

In this context users are any entity requiring access to resources. This may be
administrators, regular users or automated tasks and actions requiring varying
levels of access to cloud infrastructure. In combination with projects and
quotas you are provided with fine-grained control of who and what can access
resources while maintaining accountability with comprehensive logging.

Refer to the OpenStack documentation for additional information regarding
[Managing Projects and Users](https://docs.openstack.org/operations-guide/ops-projects-users.html).

### Quotas

Quotas are operational limits you can use to prevent system capacity exhaustion
without notification. Quotas are currently enforced at the project, rather than
user, level and are broken down to Image, Compute, and Storage (Object and Block).

The table below (extracted from the OpenStack documentation) summarizes available
options for the most commonly implemented limits, Compute Service quotas.

| Quota | Description | Property name |
|-------|-------------|---------------|
| Fixed IPs | Number of fixed IP addresses allowed per project. This number must be equal to or greater than the number of allowed instances. | `fixed-ips` |
| Floating IPs | Number of floating IP addresses allowed per project. | `floating-ips`{.docutils .literal} |
| Injected file content bytes | Number of content bytes allowed per injected file. | `injected-file-conten t-bytes` |
| Injected file path bytes | Number of bytes allowed per injected file path. | `injected-file-path-bytes` |
| Injected files | Number of injected files allowed per project. | `injected-files`{.docutils .literal} |
| Instances | Number of instances allowed per project. | `instances` |
| Key pairs | Number of key pairs allowed per user. | `key-pairs` |
| Metadata items | Number of metadata items allowed per instance. | `metadata-items`{.docutils .literal} |
| RAM | Megabytes of instance RAM allowed per project. | `ram` |
| Security group rules | Number of security group rules per project. | `security-group-rules` |
| Security groups | Number of security groups per project. | `security-groups`{.docutils .literal} |
| VCPUs | Number of instance cores allowed per project. | `cores` |
| Server Groups | Number of server groups per project. | `server_groups`{.docutils .literal} |
| Server Group Members | Number of servers per server group. | `server_group_members` |

See the [upstream documentation](https://wiki.openstack.org/wiki/Quotas) for
additional information on quota management.

## Recap

In OpenStack a project provides logical isolation of all resources generated
within. Users and roles can be used to provide fine-grained access to specific
resources within a project for further isolation. As projects can span resources
across all accessible availability zones they provide the core isolation
inherent in the virtual private cloud concept.
