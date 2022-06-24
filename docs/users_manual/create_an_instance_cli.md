---
sidebar_position: 9
---
# Create an Instance

Instances in OpenStack comprise the cloud's computing power. This guide
demonstrates how to make an instance using OpenStackClient.

You will also learn how to upload or create an SSH key pair, assign
storage using a volume, and create a security group. Each of these
components will be added to the instance.

-----

## **Table of Contents**

1. [Before Creating an
    Instance](create_an_instance_cli#before-creating-an-instance)
2. [SSH Key
    Pairs](create_an_instance_cli#ssh-key-pairs)
3. [Security
    Groups](create_an_instance_cli#security-groups)
4. [Add a Volume](create_an_instance_cli#add-a-volume)
5. [How to Create an
    Instance](create_an_instance_cli#how-to-create-an-instance)

-----

## **Before Creating an Instance**

Before creating an instance, several pieces need to be in place.

Generally speaking, these items should exist before creating an
instance:

- An SSH public key -- The public portion of an SSH key pair
- A security group -- Defines network traffic rules
- A flavor -- Defines resources, like vCPUs, RAM, and disk storage
- An image -- This is a bootable operating system
- A network -- This is typically a private network

Each item will be explained throughout this guide.

-----

## **SSH Key Pairs**

An SSH key pair is required to access any instances over SSH. Password
authentication is by default disabled in the operating system images.

You can either create an SSH key pair within OpenStack or upload your
public key.

-----

### **Create an SSH key pair**

SSH keys can be managed, created, and uploaded through the command line
using OpenStackClient.

This section will explain the steps needed to create an SSH key pair
within OpenStack.

-----

To make a key pair, use:

    openstack keypair create KEY_NAME

**KEY\_NAME** is the name of the SSH key pair.

-----

Create key pair called **ssh-1**:

    openstack keypair create ssh-1

This generates a key pair and returns the private key. The private key
should be kept somewhere safe and be inaccessible to others.

### Upload SSH Key

If you have an existing SSH key pair to use, you can upload it to the
cloud instead of making a new one. This section demonstrates how to do
this.

-----

To upload your public key, use:

    openstack keypair create --public-key PATH_TO_PUBLIC_KEY KEY_NAME

**KEY\_NAME** is the name of the SSH key pair and
**PATH\_TO\_PUBLIC\_KEY** is the path on the filesystem to the public
key.

-----

Here's an example uploading an SSH public key:

    $ openstack keypair create --public-key ~/.ssh/ssh_key.pub ssh_key_2
    +-------------+-------------------------------------------------+
    | Field       | Value                                           |
    +-------------+-------------------------------------------------+
    | fingerprint | ff:a4:81:c7:59:07:aa:54:43:39:52:cd:b2:12:aa:fb |
    | name        | ssh_key_2                                       |
    | user_id     | 43317575cccc440fbcb38a1f23b45125                |
    +-------------+-------------------------------------------------+

-----

## **Security Groups**

A security group in OpenStack controls inbound and outbound network
access. OpenStack, by default, assigns a security group to each instance
that restricts all incoming traffic. It is up to you to determine what
traffic should or should not be allowed to or from an instance. This can
be accomplished by creating the required security groups for your
instance traffic.

This section demonstrates creating a security group allowing inbound SSH
traffic for a specific IP address.

-----

**Step 1** -- Create a security group

There are several steps needed to create a security group using
OpenStackClient. The group first needs to be created, then additional
commands are used to add rules to it. Finally, you can list the security
group's details to ensure it has been configured appropriately.

The command to create a security group is:

    openstack security group create SECURITY_GROUP

**SECURITY\_GROUP** is the name of the security group.

-----

Create an SSH security group:

    openstack security group create ssh

**Step 2** -- Add rules

Next, rules need to be added to allow SSH access.

The base command to do this is:

    $ openstack security group rule create SECURITY_GROUP --remote-ip
    REMOTE_IP --dst-port 22:22 --ingress --protocol tcp

**SECURITY\_GROUP** is the name of the group, which in this case is
called **ssh**. **REMOTE\_IP** is the IP address for which traffic
should be allowed. The remaining flags specify the rule is for ingress
TCP traffic over port 22.

-----

Create rule allowing SSH from 192.168.1.20 (arbitrary IP):

    $ openstack security group rule create ssh --remote-ip 192.168.1.20
    --dst-port 22:22 --ingress --protocol tcp

**Step 3** -- Confirm security group details

Finally, confirm the previous steps were successful by listing the
details of the **ssh** security group.

-----

### List security groups

List security groups using:

    $ openstack security group list
    +--------------------------------------+---------+------------------------+----------------------------------+------+
    | ID                                   | Name    | Description            | Project                          | Tags |
    +--------------------------------------+---------+------------------------+----------------------------------+------+
    | 42989271-94b4-4209-8a81-5b7f370cbb22 | default | Default security group | fece7ddb8663497bb99ee0988719143c | []   |
    | cdf392cd-0f8a-409c-837b-b8409981da93 | ssh     | ssh                    | fece7ddb8663497bb99ee0988719143c | []   |
    +--------------------------------------+---------+------------------------+----------------------------------+------+

### Show details

Show the details of the group:

    $ openstack security group show cdf392cd-0f8a-409c-837b-b8409981da93
    +-----------------+--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
    | Field           | Value                                                                                                                                                                                                                                                  |
    +-----------------+--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
    | created_at      | 2021-05-19T21:38:19Z                                                                                                                                                                                                                                   |
    | description     | ssh                                                                                                                                                                                                                                                    |
    | id              | cdf392cd-0f8a-409c-837b-b8409981da93                                                                                                                                                                                                                   |
    | name            | ssh                                                                                                                                                                                                                                                    |
    | project_id      | fece7ddb8663497bb99ee0988719143c                                                                                                                                                                                                                       |
    | revision_number | 4                                                                                                                                                                                                                                                      |
    | rules           | created_at='2021-05-19T21:38:19Z', direction='egress', ethertype='IPv4', id='4a0d26d8-7e9d-4eac-9e19-94cb66cda54f', updated_at='2021-05-19T21:38:19Z'                                                                                                  |
    |                 | created_at='2021-05-19T21:38:19Z', direction='egress', ethertype='IPv6', id='80fcfd69-bc4e-44ad-bbdc-c5049b1a7472', updated_at='2021-05-19T21:38:19Z'                                                                                                  |
    |                 | created_at='2021-05-19T21:47:46Z', direction='ingress', ethertype='IPv4', id='ba39298c-7713-4975-a882-2335bdded8c1', port_range_max='22', port_range_min='22', protocol='tcp', remote_ip_prefix='192.168.1.20/32', updated_at='2021-05-19T21:47:46Z' |
    | stateful        | True                                                                                                                                                                                                                                                   |
    | tags            | []                                                                                                                                                                                                                                                     |
    | updated_at      | 2021-05-19T21:47:46Z                                                                                                                                                                                                                                   |
    +-----------------+--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

In the above output, the rule allowing SSH traffic from **192.168.1.20**
is visible.

-----

## **Add a Volume**

Additional disk space can be added to instances through volumes. A
volume in OpenStack is like a removable USB drive that can be attached
to instances as seen fit. Cinder is the OpenStack block storage service
that allows volumes to be created. A volume can also be used to boot an
instance.

This section explains how to create a volume using OpenStackClient by
creating a 5GB example volume. This is an optional step should your
instance not require additional storage through a volume.

-----

### **Create and Attach a Volume**

**Step 1** -- Create volume

Use the following to create volumes:

    openstack volume create VOLUME_NAME --save SIZE

**VOLUME\_NAME** is the name of the volume and **SIZE** is the numeric
size in gigabytes.

-----

Create a volume with size 5GB:

    openstack volume create volume-1 --size 5

**Step 2** -- List volume

List the newly created volume using:

    $ openstack volume list
    +--------------------------------------+----------+-----------+------+-------------+
    | ID                                   | Name     | Status    | Size | Attached to |
    +--------------------------------------+----------+-----------+------+-------------+
    | e6d6242e-3fa5-47fa-8eaa-2f85e8165144 | volume-1 | available |    5 |             |
    +--------------------------------------+----------+-----------+------+-------------+

This volume will later be attached to the instance.

-----

## **How to Create an Instance**

An instance is another name for a virtual machine in OpenStack.
Instances are created by the Nova service and contribute to the
processing power of the cloud.

With the previous steps followed, you have all the parts needed to make
an instance.

This section will explain how to create a **volume-backed** instance.

-----

### **Steps for Creating an Instance**

When creating an instance in OpenStack using the command line, there are
several pieces needed first. This section walks you through obtaining
each part and then brings them all together to explain how to create an
instance.

-----

To begin you will need to obtain **UUIDs** for:

- Boot source (image, volume)
- Flavor
- Network
- Security Group
- SSH Key Pair

-----

**Step 1** -- Obtain boot source UUID

To obtain the image UUIDs, you will need to list images using
OpenStackClient by using `openstack image list`:

    +--------------------------------------+------------------------------------------------------+--------+
    | ID                                   | Name                                                 | Status |
    +--------------------------------------+------------------------------------------------------+--------+
    | 02609270-b2d7-4ee2-9e7b-450163362b57 | Amphora (x64-haproxy-ubuntu-focal)                   | active |
    | 1d6ab32b-a305-403b-9d44-5981890beccf | CentOS 7 (el7-x86_64)                                | active |
    | f2d17cda-b84d-4600-8473-111e180a5452 | CentOS 8 (el8-x86_64)                                | active |
    | d5a101ff-0870-435f-bf76-c3309e542a53 | CentOS 8 Stream (el8-x86_64)                         | active |

For this example, the **CentOS 8 Stream** image will be used which is
associated with UUID `d5a101ff-0870-435f-bf76-c3309e542a53`. This UUID
is later used to build this instance.

**Step 2** -- Get flavors

Next, list available flavors using `openstack flavor list`:

    +-------------+-------------+-------+------+-----------+-------+-----------+
    | ID          | Name        |   RAM | Disk | Ephemeral | VCPUs | Is Public |
    +-------------+-------------+-------+------+-----------+-------+-----------+
    | c1.large    | c1.large    |  4096 |   50 |         0 |     8 | True      |
    | c1.medium   | c1.medium   |  4096 |   50 |         0 |     4 | True      |
    | c1.micro    | c1.micro    |  2048 |   25 |         0 |     2 | True      |

Choose the appropriate flavor the instance will require. This example
will use the `c1.micro` flavor.

**Step 3** -- Choose network

List networks in OpenStack using `openstack network list`:

    +--------------------------------------+-----------+--------------------------------------+
    | ID                                   | Name      | Subnets                              |
    +--------------------------------------+-----------+--------------------------------------+
    | 29aa8aec-36ec-416d-9828-4a3b6bb10f4b | network-1 | 163e197c-6fcd-4219-bc55-962299691206 |
    | 5cc755c9-41fc-44c2-87e7-642dfdfb0208 | External  | a52754dd-13d9-4a36-bab6-10058f4887f5 |
    | 76a19c4e-f9c7-4c03-8e4d-6862da139cbb | network1  | b5ee016d-70e6-4930-bac0-4af71c23efde |
    +--------------------------------------+-----------+--------------------------------------+

This example will use **network-1** as the network, which is associated
with UUID `29aa8aec-36ec-416d-9828-4a3b6bb10f4b`. This UUID will later
be used to create this instance.

**Step 4** -- Security groups

List security groups using `openstack security group list`:

    +--------------------------------------+---------+------------------------+----------------------------------+------+
    | ID                                   | Name    | Description            | Project                          | Tags |
    +--------------------------------------+---------+------------------------+----------------------------------+------+
    | 44668612-1a18-4289-b5fb-f24de8e20c09 | ssh     |                        | b93259ca0a5b4541b30e4e16ae1d699d | []   |
    | c132bb35-bdc6-4161-b64c-440ab6b631bf | default | Default security group | b93259ca0a5b4541b30e4e16ae1d699d | []   |
    +--------------------------------------+---------+------------------------+----------------------------------+------+

The **ssh** security group will be associated with this instance via
UUID `44668612-1a18-4289-b5fb-f24de8e20c09`.

**Step 5** -- SSH key pair

Lastly, obtain the name of the SSH key pair using `openstack keypair
list`:

    +-------+-------------------------------------------------+------+
    | Name  | Fingerprint                                     | Type |
    +-------+-------------------------------------------------+------+
    | key-1 | a7:ab:bd:9c:78:85:e1:a1:c4:07:0f:6d:e9:36:0b:68 | ssh  |
    | ssh-1 | 53:0e:0f:19:9f:21:5f:7e:36:96:28:31:25:1b:52:af | ssh  |
    +-------+-------------------------------------------------+------+

This instance will use the SSH key pair called `key-1`.

**Step 6** -- Create instance

With the collected information, the instance can be created.

This is the base command needed to make an instance:

    openstack server create

For the full list of options to make an instance, run:

    openstack help server create

-----

The full command to make this instance, including variable placeholders,
is:

    $ openstack server create --image IMAGE_UUID \
    --flavor FLAVOR --boot-from-volume VOLUME_SIZE
    --network NETWORK_UUID --key-name SSH_KEY_NAME \
    --security-group SECURITY_GROUP_UUID \
    INSTANCE_NAME

The following explains what each variable in the above command is for:

- **IMAGE\_UUID** -- UUID of the image you want to use
- **FLAVOR** -- The name of the flavor
- **VOLUME\_SIZE** -- Size in GB of boot volume
- **NETWORK\_UUID** -- UUID of the network to be associated with the
    instance
- **SSH\_KEY\_NAME** -- Name of the SSH key
- **SECURITY\_GROUP\_UUID** -- UUID of the security group to use
- **INSTANCE\_NAME** -- Name of the instance

**NOTE** -- By default, the instance creation will occur in the
background. You can add `--wait` to the flags to have the command wait
until the instance creation is done which will show you the status of
instance creation.

-----

### Create the Instance

Here are the collected details to make an instance from the previous
section:

- **Image UUID**: d5a101ff-0870-435f-bf76-c3309e542a53
- **Flavor**: c1.micro
- **Network UUID**: 29aa8aec-36ec-416d-9828-4a3b6bb10f4b
- **Security Group UUID**: 44668612-1a18-4289-b5fb-f24de8e20c09
- **SSH Key**: key-1

Create an instance called **instance-1** booted from a 20GB volume:

    $ openstack server create --image d5a101ff-0870-435f-bf76-c3309e542a53 \
    --flavor c1.micro --boot-from-volume 20 \
    --network 29aa8aec-36ec-416d-9828-4a3b6bb10f4b \
    --key-name key-1 --security-group 44668612-1a18-4289-b5fb-f24de8e20c09 \
    instance-1

This starts the process of creating the instance and takes a small
amount of time to complete.

After creating the instance, verify the build process by running `$
openstack server show INSTANCE_NAME`, replacing **INSTANCE\_NAME** with
the actual name of the instance:

    $ openstack server show instance-1 | grep status
    | status                      | ACTIVE                                                              |

The `status` column indicates the instance status. Seeing **ACTIVE** in
the status column indicates the instance successfully spawned.

See the [Nova compute API
documentation](https://docs.openstack.org/api-guide/compute/server_concepts.html)
for a list of instance status meanings and additional commands that can
be used to troubleshoot any issues.

## **Troubleshooting Instance Error Status**

Sometimes, instance creation will not succeed which can be for a variety
of reasons. Running `openstack server list` will show the **Status** of
an instance.

Here's an example of an instance with Status, "ERROR":

    $ openstack server list
    +--------------------------------------+-----------------------------+---------+-------------------------+----------------------------+------------+
    | ID                                   | Name                        | Status  | Networks                | Image                      | Flavor     |
    +--------------------------------------+-----------------------------+---------+-------------------------+----------------------------+------------+
    | 35d624fe-785d-4915-aa7e-4bb580b29325 | centos_instance_2           | ERROR   |                         | CentOS 8 (ce8-x86_64)      | hc1.micro  |
    --------------------------------------+-----------------------------+---------+-------------------------+----------------------------+------------+

Get more information on the error status by running:

    openstack server show $INSTANCE_UUID --fit-width

Look for the **fault** row for the reason as to why the instance failed
to create.

For assistance with instance errors, consider consulting with your
OpenStack administrator.

-----

## **Next Steps**

The [next guide](backups_cli) in this series is
regarding backing up and restoring your instance data.
