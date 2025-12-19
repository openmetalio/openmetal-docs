---
slug: /tutorials/create-site-to-site-vpn
sidebar_position: 5
---
# Create a Site-to-Site VPN Connection with Endpoint Groups

Neutron provides Site-to-Site IPsec VPN through VPN as a Service (VPNaaS).
IPsec policies and connections are configured within OpenStack meaning
no dedicated virtual machines are required to use this service.

For Horizon procedure please use - [Horizon VPN Site-to-Site](https://openmetal.io/docs/manuals/tutorials/create-site-to-site-vpn-in-horizon)

## Prerequisites

- Familiarity with OpenStackClient

## Overview

In this guide you will create a site-to-site IPSec VPN connection. This allows
you to configure communication between private networks across regions.

### Step One: West Network Setup

1. Create Network

    ```bash
    $  openstack network create net-west
    +---------------------------+--------------------------------------+
    | Field                     | Value                                |
    +---------------------------+--------------------------------------+
    | admin_state_up            | UP                                   |
    | availability_zone_hints   |                                      |
    | availability_zones        |                                      |
    | created_at                | 2022-07-11T17:23:38Z                 |
    | description               |                                      |
    | dns_domain                | None                                 |
    | id                        | ffbb6dc6-4dec-4f96-92c9-2af5098ecca1 |
    | ipv4_address_scope        | None                                 |
    | ipv6_address_scope        | None                                 |
    | is_default                | False                                |
    | is_vlan_transparent       | None                                 |
    | mtu                       | 1500                                 |
    | name                      | net-west                             |
    | port_security_enabled     | True                                 |
    | project_id                | e6fa12aa82f942f199a8cd6f3ee183d1     |
    | provider:network_type     | vxlan                                |
    | provider:physical_network | None                                 |
    | provider:segmentation_id  | 4                                    |
    | qos_policy_id             | None                                 |
    | revision_number           | 1                                    |
    | router:external           | Internal                             |
    | segments                  | None                                 |
    | shared                    | False                                |
    | status                    | ACTIVE                               |
    | subnets                   |                                      |
    | tags                      |                                      |
    | updated_at                | 2022-07-11T17:23:38Z                 |
    +---------------------------+--------------------------------------+
    ```

1. Create Subnet

    ```sh
    $ openstack subnet create subnet-west \
     --network net-west \
     --subnet-range 10.1.0.0/24
    +----------------------+--------------------------------------+
    | Field                | Value                                |
    +----------------------+--------------------------------------+
    | allocation_pools     | 10.1.0.2-10.1.0.254                  |
    | cidr                 | 10.1.0.0/24                          |
    | created_at           | 2022-07-11T17:25:54Z                 |
    | description          |                                      |
    | dns_nameservers      |                                      |
    | dns_publish_fixed_ip | None                                 |
    | enable_dhcp          | True                                 |
    | gateway_ip           | 10.1.0.1                             |
    | host_routes          |                                      |
    | id                   | e4ee7de8-ddfc-43aa-b74b-31e029225603 |
    | ip_version           | 4                                    |
    | ipv6_address_mode    | None                                 |
    | ipv6_ra_mode         | None                                 |
    | name                 | subnet-west                          |
    | network_id           | ffbb6dc6-4dec-4f96-92c9-2af5098ecca1 |
    | project_id           | e6fa12aa82f942f199a8cd6f3ee183d1     |
    | revision_number      | 0                                    |
    | segment_id           | None                                 |
    | service_types        |                                      |
    | subnetpool_id        | None                                 |
    | tags                 |                                      |
    | tenant_id            | e6fa12aa82f942f199a8cd6f3ee183d1     |
    | updated_at           | 2022-07-11T17:25:54Z                 |
    +----------------------+--------------------------------------+
    ```

1. Create router

    ```sh
    $ openstack router create router-west
    +-------------------------+--------------------------------------+
    | Field                   | Value                                |
    +-------------------------+--------------------------------------+
    | admin_state_up          | UP                                   |
    | availability_zone_hints |                                      |
    | availability_zones      |                                      |
    | created_at              | 2022-07-11T17:29:04Z                 |
    | description             |                                      |
    | distributed             | False                                |
    | external_gateway_info   | null                                 |
    | flavor_id               | None                                 |
    | ha                      | True                                 |
    | id                      | e5d611fd-22b6-4da9-bdf4-84eb84d4e6e9 |
    | name                    | router-west                          |
    | project_id              | e6fa12aa82f942f199a8cd6f3ee183d1     |
    | revision_number         | 2                                    |
    | routes                  |                                      |
    | status                  | ACTIVE                               |
    | tags                    |                                      |
    | tenant_id               | e6fa12aa82f942f199a8cd6f3ee183d1     |
    | updated_at              | 2022-07-11T17:29:04Z                 |
    +-------------------------+--------------------------------------+
    ```

1. Associate subnet (This command returns no output)

    ```sh
    openstack router add subnet router-west subnet-west
    ```

1. Set external gateway (This command returns no output)

    ```sh
     openstack router set --external-gateway \
     $(openstack network list --external -f value -c ID) \
     router-west
    ```

### Step Two: East Network Setup

1. Create Network

    ```sh
    $ openstack network create net-east
    +---------------------------+--------------------------------------+
    | Field                     | Value                                |
    +---------------------------+--------------------------------------+
    | admin_state_up            | UP                                   |
    | availability_zone_hints   |                                      |
    | availability_zones        |                                      |
    | created_at                | 2022-07-11T18:20:44Z                 |
    | description               |                                      |
    | dns_domain                | None                                 |
    | id                        | 535f5839-ea6e-402f-8235-fdc3b99c9696 |
    | ipv4_address_scope        | None                                 |
    | ipv6_address_scope        | None                                 |
    | is_default                | False                                |
    | is_vlan_transparent       | None                                 |
    | mtu                       | 1500                                 |
    | name                      | net-east                             |
    | port_security_enabled     | True                                 |
    | project_id                | e6fa12aa82f942f199a8cd6f3ee183d1     |
    | provider:network_type     | vxlan                                |
    | provider:physical_network | None                                 |
    | provider:segmentation_id  | 5                                    |
    | qos_policy_id             | None                                 |
    | revision_number           | 1                                    |
    | router:external           | Internal                             |
    | segments                  | None                                 |
    | shared                    | False                                |
    | status                    | ACTIVE                               |
    | subnets                   |                                      |
    | tags                      |                                      |
    | updated_at                | 2022-07-11T18:20:44Z                 |
    +---------------------------+--------------------------------------+
    ```

1. Create Subnet

    ```sh
    $ openstack subnet create subnet-east --network net-east --subnet-range 10.2.0.0/24
    +----------------------+--------------------------------------+
    | Field                | Value                                |
    +----------------------+--------------------------------------+
    | allocation_pools     | 10.2.0.2-10.2.0.254                  |
    | cidr                 | 10.2.0.0/24                          |
    | created_at           | 2022-07-11T18:25:01Z                 |
    | description          |                                      |
    | dns_nameservers      |                                      |
    | dns_publish_fixed_ip | None                                 |
    | enable_dhcp          | True                                 |
    | gateway_ip           | 10.2.0.1                             |
    | host_routes          |                                      |
    | id                   | 1f78171d-e1f4-4920-abf2-45e5f9bf9570 |
    | ip_version           | 4                                    |
    | ipv6_address_mode    | None                                 |
    | ipv6_ra_mode         | None                                 |
    | name                 | subnet-east                          |
    | network_id           | 535f5839-ea6e-402f-8235-fdc3b99c9696 |
    | project_id           | e6fa12aa82f942f199a8cd6f3ee183d1     |
    | revision_number      | 0                                    |
    | segment_id           | None                                 |
    | service_types        |                                      |
    | subnetpool_id        | None                                 |
    | tags                 |                                      |
    | tenant_id            | e6fa12aa82f942f199a8cd6f3ee183d1     |
    | updated_at           | 2022-07-11T18:25:01Z                 |
    +----------------------+--------------------------------------+
    ```

1. Create router

    ```sh
    $ openstack router create router-east
    +-------------------------+--------------------------------------+
    | Field                   | Value                                |
    +-------------------------+--------------------------------------+
    | admin_state_up          | UP                                   |
    | availability_zone_hints |                                      |
    | availability_zones      |                                      |
    | created_at              | 2022-07-11T18:27:25Z                 |
    | description             |                                      |
    | distributed             | False                                |
    | external_gateway_info   | null                                 |
    | flavor_id               | None                                 |
    | ha                      | True                                 |
    | id                      | 075dc3d1-4587-43b0-9f90-19632f012820 |
    | name                    | router-east                          |
    | project_id              | e6fa12aa82f942f199a8cd6f3ee183d1     |
    | revision_number         | 2                                    |
    | routes                  |                                      |
    | status                  | ACTIVE                               |
    | tags                    |                                      |
    | tenant_id               | e6fa12aa82f942f199a8cd6f3ee183d1     |
    | updated_at              | 2022-07-11T18:27:25Z                 |
    +-------------------------+--------------------------------------+
    ```

1. Associate subnet

    ```sh
    openstack router add subnet router-east subnet-east
    ```

1. Set external gateway

    ```sh
    openstack router set --external-gateway \
    $(openstack network list --external -f value -c ID) \
    router-east
    ```

### Step Three: Create an IKE and IPSec Policy

An IKE and IPSec policy will need to be created. It is recommended that you set
explicit parameters to provide higher security than the defaults.

```sh
openstack vpn ike policy create ikepolicy1 \
 --ike-version v2 \
 --auth-algorithm sha256 \
 --encryption-algorithm aes-256 \
 --pfs group14
+-------------------------------+--------------------------------------+
| Field                         | Value                                |
+-------------------------------+--------------------------------------+
| Authentication Algorithm      | sha256                               |
| Description                   |                                      |
| Encryption Algorithm          | aes-256                              |
| ID                            | 2274a56d-c42f-4e60-bdab-a30e572a4baf |
| IKE Version                   | v2                                   |
| Lifetime                      | {'units': 'seconds', 'value': 3600}  |
| Name                          | ikepolicy1                           |
| Perfect Forward Secrecy (PFS) | group14                              |
| Phase1 Negotiation Mode       | main                                 |
| Project                       | e6fa12aa82f942f199a8cd6f3ee183d1     |
| project_id                    | e6fa12aa82f942f199a8cd6f3ee183d1     |
+-------------------------------+--------------------------------------+
```

```sh
$ openstack vpn ipsec policy create ipsecpolicy1 \
 --auth-algorithm sha256 \
 --encryption-algorithm aes-256 \
 --pfs group14 
+-------------------------------+--------------------------------------+
| Field                         | Value                                |
+-------------------------------+--------------------------------------+
| Authentication Algorithm      | sha256                               |
| Description                   |                                      |
| Encapsulation Mode            | tunnel                               |
| Encryption Algorithm          | aes-256                              |
| ID                            | 64eebf8d-7f79-4118-8b9f-0254a9e487d5 |
| Lifetime                      | {'units': 'seconds', 'value': 3600}  |
| Name                          | ipsecpolicy1                         |
| Perfect Forward Secrecy (PFS) | group14                              |
| Project                       | e6fa12aa82f942f199a8cd6f3ee183d1     |
| Transform Protocol            | esp                                  |
| project_id                    | e6fa12aa82f942f199a8cd6f3ee183d1     |
+-------------------------------+--------------------------------------+
```

### Step Four: Create VPN Service for Both Sites

Now create a VPN service for both sites. You will want to take note of the
external IP addresses assigned to each.

> Note: The VPN services are configured without a subnet defined. This allows
> you flexibility to configure multiple local subnets in a local endpoint group
> per IPSec site connection or multiple site connections with different local
> subnets.

1. Create VPN west

    ```sh
    $ openstack vpn service create vpn-west \
     --router router-west
    +----------------+--------------------------------------+
    | Field          | Value                                |
    +----------------+--------------------------------------+
    | Description    |                                      |
    | Flavor         | None                                 |
    | ID             | 5fa1384d-8594-468c-a689-e716ae71f9be |
    | Name           | vpn-west                             |
    | Project        | e6fa12aa82f942f199a8cd6f3ee183d1     |
    | Router         | e5d611fd-22b6-4da9-bdf4-84eb84d4e6e9 |
    | State          | True                                 |
    | Status         | PENDING_CREATE                       |
    | Subnet         | None                                 |
    | external_v4_ip | 200.225.46.189                       |
    | external_v6_ip | None                                 |
    | project_id     | e6fa12aa82f942f199a8cd6f3ee183d1     |
    +----------------+--------------------------------------+
    ```

    Take note as the external IP may be different from the router.

1. Create VPN east

    ```sh
    $ openstack vpn service create vpn-east \
     --router router-east
    +----------------+--------------------------------------+
    | Field          | Value                                |
    +----------------+--------------------------------------+
    | Description    |                                      |
    | Flavor         | None                                 |
    | ID             | 7df8bf8c-03e3-4885-89f3-e6cb3f5d16e4 |
    | Name           | vpn-east                             |
    | Project        | e6fa12aa82f942f199a8cd6f3ee183d1     |
    | Router         | 075dc3d1-4587-43b0-9f90-19632f012820 |
    | State          | True                                 |
    | Status         | PENDING_CREATE                       |
    | Subnet         | None                                 |
    | external_v4_ip | 200.225.46.184                       |
    | external_v6_ip | None                                 |
    | project_id     | e6fa12aa82f942f199a8cd6f3ee183d1     |
    +----------------+--------------------------------------+
    ```

### Step Five: Create Endpoint Groups

1. Create west local endpoint group

    Local endpoint groups define subnets given by name or UUID. The site west
    local endpoint contains `subnet-west`.

    ```sh
    $ openstack vpn endpoint group create subnet-ep-west \
     --type subnet \
     --value subnet-west
    +-------------+------------------------------------------+
    | Field       | Value                                    |
    +-------------+------------------------------------------+
    | Description |                                          |
    | Endpoints   | ['e4ee7de8-ddfc-43aa-b74b-31e029225603'] |
    | ID          | d566c941-e103-492c-8725-d0886133b520     |
    | Name        | subnet-ep-west                           |
    | Project     | e6fa12aa82f942f199a8cd6f3ee183d1         |
    | Type        | subnet                                   |
    | project_id  | e6fa12aa82f942f199a8cd6f3ee183d1         |
    +-------------+------------------------------------------+
    ```

1. Create west peer endpoint group

    Peer endpoint groups are CIDRs. The site west peer endpoint group will
    contain the peer subnet CIDR. In this case that's the site east subnet.

    ```sh
    $ openstack vpn endpoint group create peer-ep-west \
     --type cidr \
     --value 10.2.0.0/24 
    +-------------+--------------------------------------+
    | Field       | Value                                |
    +-------------+--------------------------------------+
    | Description |                                      |
    | Endpoints   | ['10.2.0.0/24']                      |
    | ID          | 869a2e64-d41d-4996-bd19-0ae4bccdcaee |
    | Name        | peer-ep-west                         |
    | Project     | e6fa12aa82f942f199a8cd6f3ee183d1     |
    | Type        | cidr                                 |
    | project_id  | e6fa12aa82f942f199a8cd6f3ee183d1     |
    +-------------+--------------------------------------+
    ```

1. Create east local endpoint group

    Local endpoint groups define subnets given by name or UUID. The site east
    local endpoint contains `subnet-east`.

    ```sh
    $ openstack vpn endpoint group create subnet-ep-east \
     --type subnet \
     --value subnet-east 
    +-------------+------------------------------------------+
    | Field       | Value                                    |
    +-------------+------------------------------------------+
    | Description |                                          |
    | Endpoints   | ['1f78171d-e1f4-4920-abf2-45e5f9bf9570'] |
    | ID          | 1b0a3828-1086-411c-bbfc-96195e76b6ba     |
    | Name        | subnet-ep-east                           |
    | Project     | e6fa12aa82f942f199a8cd6f3ee183d1         |
    | Type        | subnet                                   |
    | project_id  | e6fa12aa82f942f199a8cd6f3ee183d1         |
    +-------------+------------------------------------------+
    ```

1. Create east peer endpoint group

    Peer endpoint groups are CIDRs. The site east peer endpoint group will
    contain the peer subnet CIDR. In this case that's the site west subnet.

    ```sh
    $ openstack vpn endpoint group create peer-ep-east \
     --type cidr \
     --value 10.1.0.0/24 2>/dev/null
    +-------------+--------------------------------------+
    | Field       | Value                                |
    +-------------+--------------------------------------+
    | Description |                                      |
    | Endpoints   | ['10.1.0.0/24']                      |
    | ID          | a9f46708-ed80-4a83-b4d4-f7d98bc897e7 |
    | Name        | peer-ep-east                         |
    | Project     | e6fa12aa82f942f199a8cd6f3ee183d1     |
    | Type        | cidr                                 |
    | project_id  | e6fa12aa82f942f199a8cd6f3ee183d1     |
    +-------------+--------------------------------------+
    ```

### Step Six: Create VPN Site Connections

1. Create west site connection

    Create a site connection (`conn-west`) from site west (VPN service
    `vpn-west`) to site east (peer IP address `200.225.46.184`) defining the
    local (`subnet-ep-west`) and peer (`peer-ep-west`) endpoint groups.

    ```sh
    $ openstack vpn ipsec site connection create conn-west \
     --vpnservice vpn-west \
     --ikepolicy ikepolicy1 \
     --ipsecpolicy ipsecpolicy1 \
     --peer-address 200.225.46.184 \
     --peer-id 200.225.46.184 \
     --local-endpoint-group subnet-ep-west \
     --peer-endpoint-group peer-ep-west \
     --psk secret
    +--------------------------+----------------------------------------------------+
    | Field                    | Value                                              |
    +--------------------------+----------------------------------------------------+
    | Authentication Algorithm | psk                                                |
    | Description              |                                                    |
    | ID                       | 31a38f73-2c29-452d-a7a8-8990fcde89cf               |
    | IKE Policy               | 2274a56d-c42f-4e60-bdab-a30e572a4baf               |
    | IPSec Policy             | 64eebf8d-7f79-4118-8b9f-0254a9e487d5               |
    | Initiator                | bi-directional                                     |
    | Local Endpoint Group ID  | d566c941-e103-492c-8725-d0886133b520               |
    | Local ID                 |                                                    |
    | MTU                      | 1500                                               |
    | Name                     | conn-west                                          |
    | Peer Address             | 200.225.46.184                                     |
    | Peer CIDRs               |                                                    |
    | Peer Endpoint Group ID   | 869a2e64-d41d-4996-bd19-0ae4bccdcaee               |
    | Peer ID                  | 200.225.46.184                                     |
    | Pre-shared Key           | secret                                             |
    | Project                  | e6fa12aa82f942f199a8cd6f3ee183d1                   |
    | Route Mode               | static                                             |
    | State                    | True                                               |
    | Status                   | PENDING_CREATE                                     |
    | VPN Service              | 5fa1384d-8594-468c-a689-e716ae71f9be               |
    | dpd                      | {'action': 'hold', 'interval': 30, 'timeout': 120} |
    | project_id               | e6fa12aa82f942f199a8cd6f3ee183d1                   |
    +--------------------------+----------------------------------------------------+
    ```

1. Create east site connection

    Create a site connection (`conn-east`) from site east (VPN service
    `vpn-east`) to site west (peer IP address `200.225.46.189`) defining the
    local (`subnet-ep-east`) and peer (`peer-ep-east`) endpoint groups.

    ```sh
    $ openstack vpn ipsec site connection create conn-east \
     --vpnservice vpn-east \
     --ikepolicy ikepolicy1 \
     --ipsecpolicy ipsecpolicy1 \
     --peer-address 200.225.46.189 \
     --peer-id 200.225.46.189 \
     --local-endpoint-group subnet-ep-east \
     --peer-endpoint-group peer-ep-east \
     --psk secret 2>/dev/null
    +--------------------------+----------------------------------------------------+
    | Field                    | Value                                              |
    +--------------------------+----------------------------------------------------+
    | Authentication Algorithm | psk                                                |
    | Description              |                                                    |
    | ID                       | 324290df-f959-4a52-945f-a3c77466fb01               |
    | IKE Policy               | 2274a56d-c42f-4e60-bdab-a30e572a4baf               |
    | IPSec Policy             | 64eebf8d-7f79-4118-8b9f-0254a9e487d5               |
    | Initiator                | bi-directional                                     |
    | Local Endpoint Group ID  | 1b0a3828-1086-411c-bbfc-96195e76b6ba               |
    | Local ID                 |                                                    |
    | MTU                      | 1500                                               |
    | Name                     | conn-east                                          |
    | Peer Address             | 200.225.46.189                                     |
    | Peer CIDRs               |                                                    |
    | Peer Endpoint Group ID   | a9f46708-ed80-4a83-b4d4-f7d98bc897e7               |
    | Peer ID                  | 200.225.46.189                                     |
    | Pre-shared Key           | secret                                             |
    | Project                  | e6fa12aa82f942f199a8cd6f3ee183d1                   |
    | Route Mode               | static                                             |
    | State                    | True                                               |
    | Status                   | PENDING_CREATE                                     |
    | VPN Service              | 7df8bf8c-03e3-4885-89f3-e6cb3f5d16e4               |
    | dpd                      | {'action': 'hold', 'interval': 30, 'timeout': 120} |
    | project_id               | e6fa12aa82f942f199a8cd6f3ee183d1                   |
    +--------------------------+----------------------------------------------------+
    ```

### Step Seven: Test Site-to-Site Connection

Create instances connected to `subnet-west` and `subnet-east` and confirm they
can communicate via ICMP echo requests to local IPs.
