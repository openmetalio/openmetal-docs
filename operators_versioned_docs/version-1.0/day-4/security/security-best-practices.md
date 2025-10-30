# Security and Your OpenMetal Private Cloud

## Introduction

This article provides further information for the security best
practices for your OpenMetal Cloud. Although OpenStack is a
security-focused architecture, it is important to follow the concepts of
least privilege as well as perform regular maintenance updates to
prevent security vulnerabilities from emerging. This article details how
users and groups can be leveraged to segment your network and improve
security through reduced privileges. Finally, additional documentation
is provided for the OpenStack Security Center for analysis on current
threats.

## Principle of Least Privilege

The philosophy around the principle of least privilege is a user account
should only have privileges necessary to perform its intended function.
For example, a financial analyst does not require admin rights or a
software engineer should not need to access financial records.

The benefits of operating a system using the principle of least
privilege are:

- **System stability** - Limiting the scope of changes reduces adverse
    effects of applications running on your system. This means that
    programs are less likely to perform actions that could crash your
    machine.
- **System security** - Limiting the system-wide changes can reduce
    blast radius. The blast radius is the maximum amount of damage an
    intruder can inflict after gaining access to your system.
- **Ease of deployment** - As a general rule, the fewer privileges an
    application needs to run, the easier it is to deploy to a larger
    environment.

When implementing the principles of least privilege, routine audits are
important to maintain the security of your system and avoid privilege
creep. Privilege creep is when a user or program is given more access or
rights beyond what is necessary to their job. In addition to conducting
regular audits, consider starting all user and system accounts with the
least privilege and enforcing the separation of privileges.

### Users, Groups, Projects, and Roles

Within OpenStack, there is the ability to set individual access
controls. These controls have different levels of granularity from
setting a project and allocating resources to managing groups of
individuals. There is even the ability to manage down to an individual
user.

For information about how to create a user and project, see
[Create an OpenStack User and Project in Horizon](../../day-1/horizon/create-user-project).

#### Users

When working in OpenStack, there is only one administrative user. Using
the principle of least privilege, you should create additional users
when handling various tasks within your private cloud environment.

#### Groups

Groups are a collection of Users within OpenStack. Groups allow an
administrator to manage permissions for several individual users at the
same time. This method for managing access helps to avoid privilege
creep as individuals can be removed from groups as their roles change
within an organization.

#### Projects

Projects allow you to allocate resources within your private cloud. You
can isolate users and individual projects to further control access to
cloud resources.

#### Roles

Keystone roles are rights and privileges given to a user to perform
tasks. Each service can require different types of roles to perform
different actions. In addition, existing roles can be modified through
the services policy.json file. Due to the containerization of OpenStack
services these policy files will be found within the docker container of
the service in /etc/service\_name/policy.json. To find out more
information about creating and managing roles visit [Create and manage
roles](https://docs.openstack.org/horizon/latest/admin/admin-manage-roles.html).

## Updating Software

All software running your Private Cloud is open source. Maintaining
up-to-date software is important for the security of your private cloud.
Among the major areas that require updating are individual instances,
images, and the control plane nodes. Both operating system packages and
applications require software updates over time as changes are made.

### Update Individual Instances

For any instances your cloud contains, ensure the software within is
kept up to date. This includes the operating system's software and the
applications running within the instance. This software is typically
managed through a package manager like `apt` or `dnf`.

Updating the software in individual instances can be accomplished by
connecting to the instance through SSH. Once inside the instance,
updates can be run using the package manager of the Linux distribution
and rebooting.

### Update Glance Images

Glance is the service in OpenStack responsible for managing operating
system images. Once your private cloud is deployed, these images are not
updated. Over time, these images can become vulnerable as it becomes
necessary to maintain security updates and patches. We recommend
routinely updating and managing these images within your existing
OpenStack cluster. For further information on how to upload images visit
[Manage and Upload Images in Horizon](../../day-1/horizon/images.md)

### Update Control-Plane Nodes

For each hardware node, your cloud has, operating system updates should
be performed as part of routine maintenance. These updates are best
handled by the operating system's package manager, which for Private
Clouds running CentOS 8, is `dnf`. For more information on how to update
control plane nodes visit [OpenStack Hardware Node
Maintenance](../../day-2/maintenance).

## Enabling TLS

TLS stands for Transport Layer Security protocol and is the successor to
the SSL. Both TLS and SSL work in much the same way, using encryption to
protect the transfer of information and data between two systems. Within
OpenMetal, enabling TLS is very important for protecting login
credentials for your Horizon Dashboard.

For more information on how to enable TLS within Horizon, visit [How to
Enable TLS for OpenStack using Kolla
Ansible](../kolla-ansible/enable-tls).

## Security Groups

In your private cloud, security groups act as a firewall to control
inbound and outbound traffic to your instances. OpenStack has many
different configurations for security groups that allow you to control
the type of traffic to your instance as well as the port. The
configuration options are known as rules. Rules define the types of
ports that are available on your instance as well as the IP addresses
that can connect to these specific ports.

For more information on how to create and manage security groups, see
the title heading [Security Groups](../../day-1/horizon/create-first-instance.md#security-groups)
in the [How to Create an Instance in OpenStack Horizon](../../day-1/horizon/create-first-instance)
guide.

## SSH Authentication

Authentication in your private cloud is handled by SSH keys. These keys
are injected into your control plane nodes from the moment of deployment
of your cloud. Authentication keys can also be added to instances before
being deployed. For additional security, consider restricting access to
port 22 and limiting SSH access to control plane nodes.

## OpenStack Security Advisor and Further Resources

OpenStack uses two different means for communicating security-related
information: Advisories and Notes. OpenStack Security Advisories (OSSA)
help to communicate fixes to severe security issues. OpenStack Security
Notes (OSSN) provide general notices for potential vulnerabilities in
design, deployment, and configuration. OpenStack does have a
Vulnerability Management Team (VMT) for further information on how to
contact visit [OpenStack Security](https://security.openstack.org/).

A list of current Security Advisories for OpenStack can be found
[Here](https://security.openstack.org/ossalist.html).

For a more in-depth look into current best practices with OpenStack see
[OpenStack Security Guide](https://docs.openstack.org/security-guide/).
