# Create a Network

This guide explains networking in OpenStack including how to create a
private network, a router, and allocate and assign floating IPs.

You will learn how to create a private network on which instances will
be deployed. The network created in this guide will be used later when
creating an instance.

[Neutron](https://docs.openstack.org/neutron/latest/) is the service
that manages networking in OpenStack and allows for networks, routers,
floating IPs, and security groups to be created. It provides "network
connectivity as a service" between interfaces and uses the OpenStack
Networking API.

-----

## **Table of Contents**

1.  [Create a Network and
    Router](users_manual/users_manual/network_ip_traffic_cli#create-a-network-and-router)
2.  [Floating IPs](users_manual/network_ip_traffic_cli#floating-ips)

-----

## **Create a Network and Router**

This section demonstrates creating a private network and router. The
router is important as it will allow you to create a route between
networks, such as from the private network to the Internet.

This section explains how to make a network and router using the command
line with OpenStackClient.

-----

### **Create a network**

Listed are the steps needed to create a private network. Variables are
presented in all capital and should be replaced accordingly. Note the
output of most of the commands has been truncated.

**Note\!** -- Private networks should be used where possible. Only
expose the portions of your cloud to a public network when needed.

-----

**Step 1** -- Create private network

Use this command to create a network, replacing **NETWORK\_NAME** with
the name of the network:

    $ openstack network create NETWORK_NAME

-----

Create a network called **network-1**:

    $ openstack network create network-1
    +---------------------------+--------------------------------------+
    | Field                     | Value                                |
    +---------------------------+--------------------------------------+
    | admin_state_up            | UP                                   |
    | availability_zone_hints   |                                      |
    | availability_zones        |                                      |
    | created_at                | 2021-05-19T20:13:29Z                 |
    | description               |                                      |
    | dns_domain                | None                                 |
    | id                        | 0a193fa1-2019-4fbc-a862-6f6ced157c1e |

**Step 2** -- Create subnet

Next, a subnet will need to be created.

Use this command to create a subnet, replacing **NETWORK\_NAME** and
**SUBNET\_NAME** with the respective names of the network and subnet and
replace **SUBNET\_RANGE** with the subnet to use. An example subnet
range could be **10.0.0.0/24**:

    $ openstack subnet create --subnet-range SUBNET_RANGE --network NETWORK_NAME \
    SUBNET_NAME

-----

Create a subnet called **subnet-1** with subnet range of
**10.0.0.0/24**:

    $ openstack subnet create --subnet-range 10.0.0.0/24 --network network-1 subnet-1
    +----------------------+--------------------------------------+
    | Field                | Value                                |
    +----------------------+--------------------------------------+
    | allocation_pools     | 10.0.0.2-10.0.0.254                  |
    | cidr                 | 10.0.0.0/24                          |
    | created_at           | 2021-05-19T20:22:03Z                 |
    | description          |                                      |
    | dns_nameservers      |                                      |
    | dns_publish_fixed_ip | None                                 |
    | enable_dhcp          | True                                 |
    | gateway_ip           | 10.0.0.1                             |

**Step 3** -- Show network details

You can list the network and subnet and show more information about
each.

List networks using:

    $ openstack network list
    +--------------------------------------+-----------+--------------------------------------+
    | ID                                   | Name      | Subnets                              |
    +--------------------------------------+-----------+--------------------------------------+
    | 0a193fa1-2019-4fbc-a862-6f6ced157c1e | network-1 | df4d6183-9c3b-4bb9-a686-cf1fc7d60f7f |
    | 5cc755c9-41fc-44c2-87e7-642dfdfb0208 | External  | a52754dd-13d9-4a36-bab6-10058f4887f5 |
    +--------------------------------------+-----------+--------------------------------------+

List subnets using:

    $ openstack subnet list
    +--------------------------------------+----------+--------------------------------------+-------------------+
    | ID                                   | Name     | Network                              | Subnet            |
    +--------------------------------------+----------+--------------------------------------+-------------------+
    | a52754dd-13d9-4a36-bab6-10058f4887f5 | Internet | 5cc755c9-41fc-44c2-87e7-642dfdfb0208 | 173.231.217.64/28 |
    | df4d6183-9c3b-4bb9-a686-cf1fc7d60f7f | subnet-1 | 0a193fa1-2019-4fbc-a862-6f6ced157c1e | 10.0.0.0/24       |
    +--------------------------------------+----------+--------------------------------------+-------------------+

To get more information about each, use the `show` subcommand and
specify the UUID for the network and subnet:

    $ openstack network show 0a193fa1-2019-4fbc-a862-6f6ced157c1e
    $ openstack subnet show df4d6183-9c3b-4bb9-a686-cf1fc7d60f7f

-----

### **Create a Router**

With a network created, the next step is to create a router which will
bridge the connection from the **External** or **provider network** to
the private network.

-----

**Step 1** -- Create router

To make a router, use this base command, replacing **ROUTER\_NAME** with
the name of the router:

    $ openstack router create ROUTER_NAME

-----

Create a router called **router-1**:

    $ openstack router create router-1
    +-------------------------+--------------------------------------+
    | Field                   | Value                                |
    +-------------------------+--------------------------------------+
    | admin_state_up          | UP                                   |
    | availability_zone_hints |                                      |
    | availability_zones      |                                      |
    | created_at              | 2021-05-19T20:35:14Z                 |

**Step 2** -- Attach interfaces

With the router created, the **External** and **subnet-1** interfaces
need to be attached to it.

To add a subnet, use this command, replacing **ROUTER\_NAME** and
**SUBNET\_NAME** with the names of the respective router and subnet:

    $ openstack router add subnet ROUTER_NAME SUBNET_NAME

-----

**Attach subnet**:

Add subnet **subnet-1** to the router called **router-1**:

    $ openstack router add subnet router-1 subnet-1

The command to add the subnet to the router returns no output if
successful.

**Attach External network**:

To finish setting up the router, attach the **External** network to it.

Use this command to add the external network, replacing
**EXTERNAL\_NETWORK\_UUID** with the UUID of the network:

    $ openstack router set --external-gateway EXTERNAL_NETWORK_UUID \
    ROUTER_NAME

Obtain the UUID of the **External** network by running `openstack
network list`. The UUID will be listed in the first column.

-----

Add the external network to the router called **router-1**:

    $ openstack router set --external-gateway \
    5cc755c9-41fc-44c2-87e7-642dfdfb0208 router-1

**Step 4** -- Confirm router details

With these steps completed, you have a router that connects the external
network to the private network.

You can see the details of the router by running the following,
replacing **ROUTER\_NAME** with the name of the router:

    $ openstack router show ROUTER_NAME

-----

Show the details for the router called **router-1**, including the
interfaces that were previously attached:

    $ openstack router show router-1 --fit-width
    +-------------------------+-----------------------------------------------------------------------------------------------------+
    | Field                   | Value                                                                                               |
    +-------------------------+-----------------------------------------------------------------------------------------------------+
    | admin_state_up          | UP                                                                                                  |
    | availability_zone_hints |                                                                                                     |
    | availability_zones      | nova                                                                                                |
    | created_at              | 2021-05-19T20:35:14Z                                                                                |
    | description             |                                                                                                     |
    | external_gateway_info   | {"network_id": "5cc755c9-41fc-44c2-87e7-642dfdfb0208", "external_fixed_ips": [{"subnet_id":         |
    |                         | "a52754dd-13d9-4a36-bab6-10058f4887f5", "ip_address": "173.231.217.74"}], "enable_snat": true}      |
    | flavor_id               | None                                                                                                |
    | id                      | d5b0eb30-8b2a-4f2e-a9df-4ad7ee792cec                                                                |
    | interfaces_info         | [{"port_id": "fa1f794f-5101-4df4-b83a-3c260d0a65fa", "ip_address": "10.0.0.1", "subnet_id":         |
    |                         | "df4d6183-9c3b-4bb9-a686-cf1fc7d60f7f"}]                                                            |
    | name                    | router-1                                                                                            |

-----

## **Floating IPs**

Floating IPs in OpenStack are publicly routable IP addresses that can be
attached and detached to instances. For example if there's an instance
associated with a private network but needs to be accessed from the
Internet, a floating IP can be associated with the instance, allowing
communication from the Internet.

-----

### **Allocate and Assign Floating IPs**

To use Floating IPs they will first need to be allocated from the
provider network's pool of IPs. The following is a list of commands used
to manage floating IPs.

-----

**Step 1** -- Allocate floating IP

Allocate additional floating IPs where `NETWORK` is the UUID of the
network to allocate IPs from:

    $ openstack floating ip create NETWORK

You will need to first obtain the **External** network's UUID using
`openstack network list`.

-----

Allocate a floating IP from the **External** network:

    $ openstack floating ip create 5cc755c9-41fc-44c2-87e7-642dfdfb0208
    +---------------------+--------------------------------------+
    | Field               | Value                                |
    +---------------------+--------------------------------------+
    | created_at          | 2021-05-19T20:54:19Z                 |
    | description         |                                      |
    | dns_domain          | None                                 |
    | dns_name            | None                                 |
    | fixed_ip_address    | None                                 |
    | floating_ip_address | 173.231.217.75                       |

**Step 2** -- List floating IPs

Make use of `openstack floating ip list` to view floating IPs. You will
see the IP allocated from the previous section.

-----

List floating IPs:

    $ openstack floating ip list
    +--------------------------------------+---------------------+------------------+------+--------------------------------------+----------------------------------+
    | ID                                   | Floating IP Address | Fixed IP Address | Port | Floating Network                     | Project                          |
    +--------------------------------------+---------------------+------------------+------+--------------------------------------+----------------------------------+
    | 99d58cc0-1b27-4171-aa44-6c15d15718fa | 173.231.217.75      | None             | None | 5cc755c9-41fc-44c2-87e7-642dfdfb0208 | fece7ddb8663497bb99ee0988719143c |
    +--------------------------------------+---------------------+------------------+------+--------------------------------------+----------------------------------+

This floating IP will be used later to access an instance over SSH.

-----

## **Next Steps**

The [next
guide](users_manual/users_manual/using_creating_images_cli) goes
over images in OpenStack, which are bootable operating systems.
