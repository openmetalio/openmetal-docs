# OpenStack CLI for Common Operational Tasks

## **Background**

OpenStackClient (OSC) is the name of a command line interface for
OpenStack which can be used to administer an OpenStack cloud. The same
functionality found in the Horizon interface can also be found using
OpenStackClient.

-----

## **Get started**

OpenStackClient will need to be installed before it can be used. See
this [guide](create_an_instance.rst#create-an-instance) for installation
instructions.

For a full list and explanation of the available options use `openstack
help` or refer to the [OpenStack
documentation](https://docs.openstack.org/python-openstackclient/latest/).

Additional command line applications exist for some services such as
Nova and Cinder but will eventually be deprecated. While these command
line utilities can be used, it is recommended that the OpenStack cloud
be administered using soley the OSC. The goal of OpenStack client is to
provide all the needed commands to administer an OpenStack cloud under
one application.

-----

## **Output formatting**

Typically when OpenStackClient commands are issued, a table of formatted
data is returned. When doing batch operations you may want to extract
just the **UUID** of an item. It is possible to have OpenStackClient
return exactly the information you need which can be useful for scripts
or running the same action on multiple items.

For example:

    output formatters:
      output formatter options
    
      -f {csv,json,table,value,yaml}, --format {csv,json,table,value,yaml}
                            the output format, defaults to table
      -c COLUMN, --column COLUMN
                            specify the column(s) to include, can be repeated to
                            show multiple columns
      --sort-column SORT_COLUMN
                            specify the column(s) to sort the data (columns
                            specified first have a priority, non-existing columns
                            are ignored), can be repeated

Say you want just the **UUID** of all the servers on a host. You can run
something like this to achieve that goal (where `example_host` is the
host you are working with):

    $ openstack server list --host example_host -f value -c ID

-----

## **Common Tasks**

Below is a list of common operational tasks that can be done with the
OpenStack Client. This guide will include examples of how to perform the
following tasks:

  - Manage OpenStack users, including listing, creating, updating and
    removing users
  - Manage instances by creating them, stopping and starting them,
    creating a snapshot, plus much more.
  - Live migration of instances
  - Troubleshoot instance issues
  - Upload images
  - Create a network
  - Create security groups
  - Manage SSH key pairs
  - Collect details about OpenStack environment

-----

## **Manage OpenStack users**

In OpenStack there exists the admin user account which has the ability
to create additional users. Typically the admin account is used only
when that level of privilege is needed otherwise individual user
accounts should be used when interacting with an OpenStack cloud.

The following commands can be used to list, create, update, and remove
OpenStack users:

List users:

    $ openstack user list

Create a user where **PROJECT\_NAME** is the name of the project,
**PASSWORD** is the password to set, and **USERNAME** is the username:

    $ openstack user create --project PROJECT_NAME --password PASSWORD \
    USERNAME

The base command to update a user is `openstack user set USERNAME` where
USERNAME is the username in question.

Using that base command, you can enable or disable a user account or
change details, such as the email address associated with the user.

Disable a user:

    $ openstack user set USERNAME --disable

Enable a user:

    $ openstack user set USERNAME --enable

Change the email address, where **EMAIL\_ADDRESS** should be the email
to set:

    $ openstack user set USERNAME --email EMAIL_ADDRESS

## **Instance Management**

### **Create an instance**

See the Day 1 [guide](create_an_instance.rst) for information on how to
create an instance.

### **Stop and start an instance**

Stop an instance:

    $ openstack server stop

Start an instance:

    $ openstack server start

### **Create an instance snapshot**

Here's an example:

    $ openstack server image create --name SNAPSHOT_NAME INSTANCE_NAME

You can verify the snapshot has been created by using both `openstack
image list` to find the newly created snapshot, then `openstack image
show SNAP_SHOT_UUID` to get details on that snapshot.

-----

## **Perform live migration of instances**

Sometimes it is necessary to migrate instances from one compute node to
another if for example a compute node needs maintenance. It is possible
to live migrate instances before bringing down that node.

Before you begin, you'll need the server UUID, the host that server is
currently running on and the host to migrate to.

List servers:

    $ openstack server list
    +--------------------------------------+-----------------------------+---------+-------------------------+-----------------------------+------------+
    | ID                                   | Name                        | Status  | Networks                | Image                       | Flavor     |
    +--------------------------------------+-----------------------------+---------+-------------------------+-----------------------------+------------+
    | 8de97c6f-bd4e-4f23-b8ee-1d9841082760 | test_7                      | ACTIVE  | Internal=192.168.0.10   | test_6_snapshot_cli         | hc1.small  |
    | 120fc769-ec99-4025-b456-320d8a17a158 | test_6                      | ACTIVE  | Internal=192.168.0.173  | test_5_snap_cli             | hc1.small  |
    | e93b3344-6d78-4273-880f-220b7fbec417 | test_5                      | ACTIVE  | Internal=192.168.0.186  | CentOS 8 (ce8-x86_64)       | hc1.small  |
    +--------------------------------------+-----------------------------+---------+-------------------------+-----------------------------+------------+

Get the host of the `test_5` server:

    $ openstack server show e93b3344-6d78-4273-880f-220b7fbec417
    +-------------------------------------+--------------------------------------------------------------------+
    | Field                               | Value                                                              |
    +-------------------------------------+--------------------------------------------------------------------+
    | OS-DCF:diskConfig                   | AUTO                                                               |
    | OS-EXT-AZ:availability_zone         | nova                                                               |
    | OS-EXT-SRV-ATTR:host                | hc1.example_host                                                   |

The above output of `openstack server show` is truncated.

Find the compute node to migrate to:

    $ openstack compute service list
    +----+----------------+------------------------+----------+---------+-------+----------------------------+
    | ID | Binary         | Host                   | Zone     | Status  | State | Updated At                 |
    +----+----------------+------------------------+----------+---------+-------+----------------------------+
    | 18 | nova-scheduler | hc1.example_host       | internal | enabled | up    | 2020-09-14T21:44:09.000000 |
    | 57 | nova-scheduler | hc2.example_host       | internal | enabled | up    | 2020-09-14T21:44:13.000000 |
    | 66 | nova-scheduler | hc3.example_host       | internal | enabled | up    | 2020-09-14T21:44:12.000000 |
    |  3 | nova-conductor | hc1.example_host       | internal | enabled | up    | 2020-09-14T21:44:13.000000 |
    |  9 | nova-conductor | hc2.example_host       | internal | enabled | up    | 2020-09-14T21:44:12.000000 |
    | 15 | nova-conductor | hc3.example_host       | internal | enabled | up    | 2020-09-14T21:44:13.000000 |
    | 24 | nova-compute   | hc3.example_host       | nova     | enabled | up    | 2020-09-14T21:44:09.000000 |
    | 27 | nova-compute   | hc1.example_host       | nova     | enabled | up    | 2020-09-14T21:44:12.000000 |
    | 30 | nova-compute   | hc2.example_host       | nova     | enabled | up    | 2020-09-14T21:44:13.000000 |
    +----+----------------+------------------------+----------+---------+-------+----------------------------+

You can either choose the host to migrate to or one could be
automatically selected. The destination host should have a functioning
`nova-compute` service running.

Before migrating to a specific host, ensure the host has enough
resources:

    $ openstack host show hc2.example_host
    +------------------------+------------+-----+-----------+---------+
    | Host                   | Project    | CPU | Memory MB | Disk GB |
    +------------------------+------------+-----+-----------+---------+
    | hc2.example_host       | (total)    |   8 |     64243 |    2682 |
    | hc2.example_host       | (used_now) |   0 |     10240 |       0 |
    | hc2.example_host       | (used_max) |   0 |         0 |       0 |
    +------------------------+------------+-----+-----------+---------+

Perform the migration to a specific host:

    $ openstack --os-compute-api-version 2.79 server migrate \
    --live-migration --host hc2.example_host \
    e93b3344-6d78-4273-880f-220b7fbec417

Note that to use the `--host` flag, the Nova API version must be
specified using `--os-compute-api-version`. In this case, the maximum
version that can be used is `2.79`. More on the Nova API version release
history is
[here](https://docs.openstack.org/nova/latest/reference/api-microversion-history.html).

Running `openstack server list` should show the instance status as
`MIGRATING`:

    $ openstack server list
    +--------------------------------------+-----------------------------+-----------+-------------------------+-----------------------------+------------+
    | ID                                   | Name                        | Status    | Networks                | Image                       | Flavor     |
    +--------------------------------------+-----------------------------+-----------+-------------------------+-----------------------------+------------+
    | 8de97c6f-bd4e-4f23-b8ee-1d9841082760 | test_7                      | ACTIVE    | Internal=192.168.0.10   | test_6_snapshot_cli         | hc1.small  |
    | 120fc769-ec99-4025-b456-320d8a17a158 | test_6                      | ACTIVE    | Internal=192.168.0.173  | test_5_snap_cli             | hc1.small  |
    | e93b3344-6d78-4273-880f-220b7fbec417 | test_5                      | MIGRATING | Internal=192.168.0.186  | CentOS 8 (ce8-x86_64)       | hc1.small  |
    +--------------------------------------+-----------------------------+-----------+-------------------------+-----------------------------+------------+

Confirm the instance has been migrated to the destination host:

    $ openstack server show e93b3344-6d78-4273-880f-220b7fbec417
    +-------------------------------------+--------------------------------------------------------------+
    | Field                               | Value                                                        |
    +-------------------------------------+--------------------------------------------------------------+
    | OS-DCF:diskConfig                   | AUTO                                                         |
    | OS-EXT-AZ:availability_zone         | nova                                                         |
    | OS-EXT-SRV-ATTR:host                | hc2.example_host                                             |
    | OS-EXT-SRV-ATTR:hypervisor_hostname | hc2.example_host                                             |
    | OS-EXT-SRV-ATTR:instance_name       | instance-0000008d                                            |
    | OS-EXT-STS:power_state              | Running                                                      |
    | OS-EXT-STS:task_state               | None                                                         |
    | OS-EXT-STS:vm_state                 | active                                                       |
    | OS-SRV-USG:launched_at              | 2020-08-24T21:51:42.000000                                   |
    | OS-SRV-USG:terminated_at            | None                                                         |
    | accessIPv4                          |                                                              |
    | accessIPv6                          |                                                              |
    | addresses                           | Internal=192.168.0.186                                       |
    | config_drive                        |                                                              |
    | created                             | 2020-08-24T21:51:16Z                                         |
    | flavor                              | hc1.small (hc1.small)                                        |
    | hostId                              | a4a089ceb3b247eeb47dde6f58ed85444cf18bf763453e7fbf775675     |
    | id                                  | e93b3344-6d78-4273-880f-220b7fbec417                         |
    | image                               | CentOS 8 (ce8-x86_64)                                        |
    | key_name                            | nw_1                                                         |
    | name                                | test_5                                                       |
    | progress                            | 0                                                            |
    | project_id                          | 5ad1f9e795604f4390d274d7388c4b9f                             |
    | properties                          |                                                              |
    | security_groups                     | name='basic_webserver_group'                                 |
    | status                              | ACTIVE                                                       |
    | updated                             | 2020-09-15T21:53:49Z                                         |
    | user_id                             | 43317575cccc440fbcb38a1f23b45125                             |
    | volumes_attached                    |                                                              |
    +-------------------------------------+--------------------------------------------------------------+

-----

## **Troubleshoot instance issues**

<div class="note">

<div class="title">

Note

</div>

This section will be filled out as common scenarios occur.

</div>

## **Upload images**

To create an image, use:

    openstack image create

For assistance with the CLI options, use:

    openstack help image create

OpenStack provides an operating system called
[CirrOS](https://github.com/cirros-dev/cirros) that has the minimum
requirements to be an operating system that is generally used to test
instance creation.

This example will explain how to upload the CirrOS image into glance.

To get this CirrOS image into the glance service, you'll need to first
download it to where the OpenStackClient lives, then the base command
`openstack image create` can be used to upload the image.

Download CirrOS and upload into glance:

    # grab the latest CirrOS image
    $ wget http://download.cirros-cloud.net/0.5.1/cirros-0.5.1-x86_64-disk.img
    
    # upload the image into glance
    $ openstack image create cirros --container-format bare --disk-format
    qcow2 --file PATH_TO_CIRROS_IMAGE

List the newly uploaded image:

    $ openstack image list
    +--------------------------------------+--------------------------------+--------+
    | ID                                   | Name                           | Status |
    +--------------------------------------+--------------------------------+--------+
    | fa8eb9bd-9ccc-4d3f-b87b-6edb5450a57a | cirros                         | active |
    +--------------------------------------+--------------------------------+--------+

-----

## **Create a private network**

Listed are the steps needed to create a private network and connect it
to the provider network. Variables are presented in all capital and
should be replaced accordingly.

Create a network:

    $ openstack network create NETWORK_NAME

Create a subnet on that network:

    $ openstack subnet create --subnet-range 10.0.0.0/24 --network NETWORK_NAME
    SUBNET_NAME

Create a router that will connect to an external, public-facing network:

    $ openstack router create ROUTER_NAME

Add the subnet to the router:

    $ openstack router add subnet ROUTER_NAME SUBNET_NAME

Add the external network gateway:

    $ openstack router set --external-gateway EXTERNAL_NETWORK_UUID \
    ROUTER_NAME

-----

## **Create security groups**

Here's an example that opens inbound traffic for all IPs on ports 80 and
443.

Create a security group where **SECURITY\_GROUP** is the name of the
security group:

    $ openstack security group create SECURITY_GROUP

List security groups:

    $ openstack security group list
    +--------------------------------------+-----------------------+------------------------------------------------------------+----------------------------------+------+
    | ID                                   | Name                  | Description                                                | Project                          | Tags |
    +--------------------------------------+-----------------------+------------------------------------------------------------+----------------------------------+------+
    | 8639e3c5-47ce-4072-a1f5-1c1e931a8f75 | default               | Default security group                                     | 3c5591e744fa4fdcb38409781596182d | []   |
    | ebffcf78-52d9-436c-81db-5ea788a0c33d | devstack              |                                                            | 5ad1f9e795604f4390d274d7388c4b9f | []   |
    | ec8a02ba-4bc2-4b78-a555-902caead87fe | basic_webserver_group | This will open standard ports for web services             | 5ad1f9e795604f4390d274d7388c4b9f | []   |
    +--------------------------------------+-----------------------+------------------------------------------------------------+----------------------------------+------+

List details of a security group:

    $ openstack security group show UUID

Open ports 80 and 443 on all IP ranges for ingress TCP traffic:

    $ openstack security group rule create --remote-ip 0.0.0.0/0 \
    --dst-port 80:80 --ingress --protocol tcp SECURITY_GROUP
    
    $ openstack security group rule create --remote-ip 0.0.0.0/0 \
    --dst-port 443:443 --ingress --protocol tcp SECURITY_GROUP

-----

## **Add SSH public key**

It is recommended an SSH public key be uploaded and this is possible
through the OSC.

Running `openstack keypair create KEY_NAME`, where KEY\_NAME is the name
of the SSH key pair, is sufficient for generating an SSH private and
public key. The output will return the private key, which should be kept
somewhere private and inaccessible to others.

You can also upload a public key from a key pair using `openstack
keypair create --public-key PATH_TO_PUBLIC_KEY KEY_NAME`, where
PATH\_TO\_PUBLIC\_KEY is the file path to the public key.

-----

## **Collect details about OpenStack environment**

Show the role of each hardware node in an OpenStack cloud:

    $ openstack host list
    +------------------------+-----------+----------+
    | Host Name              | Service   | Zone     |
    +------------------------+-----------+----------+
    | hc1.edu.learnstack.org | scheduler | internal |
    | hc2.edu.learnstack.org | scheduler | internal |
    | hc3.edu.learnstack.org | scheduler | internal |
    | hc1.edu.learnstack.org | conductor | internal |
    | hc2.edu.learnstack.org | conductor | internal |
    | hc3.edu.learnstack.org | conductor | internal |
    | hc3.edu.learnstack.org | compute   | nova     |
    | hc1.edu.learnstack.org | compute   | nova     |
    | hc2.edu.learnstack.org | compute   | nova     |
    +------------------------+-----------+----------+
