---
sidebar_position: 4
---
# VPNaaS Configuration and Deployment

Installation and configuration of Virtual Private Networking as a Service
(VPNaaS) on your OpenMetal Cloud.

## Prerequisites

- [Kolla Ansible](../operators-manual/day-4/kolla-ansible/prepare-kolla-ansible)
- [OpenstackCLI](../operators-manual/day-1/command-line/openstackclient)
- `python-neutronclient` cli plugin for advanced networking.

## Preparation

You will first need to ensure the following values are set in
`/etc/kolla/globals.yml`:

```sh
$ grep vpnaas /etc/kolla/globals.yml
enable_horizon_neutron_vpnaas: "yes"
enable_neutron_vpnaas: "yes"
```

### Upgrade libreswan driver to strongswan driver

When using StrongSwan/OpenSwan is used on Ubuntu containers (release >= 3.0.0),
as in the case in our current environment, the version of the VPNaaS device
driver will need to be upgraded. This can be done by performing the following
steps for each `neutron-l3-agent` container.

On your kolla-ansible host, edit the following file and then restart all of your
`neutron-l4-agent` containers

```sh
vi /etc/kolla/config/neutron/neutron_vpnaas.conf 

[service_providers]
service_provider = VPN:strongswan:neutron_vpnaas.services.vpn.service_drivers.ipsec.IPsecVPNDriver:default
```

Exit the container and issue a restart with docker.

```sh
docker restart neutron_l3_agent
```

Repeat the above across the remaining nodes.

### Deploy Changes with Kolla Ansible

With this preparation complete you can now deploy the changes with
`kolla-ansible`. To deploy the changes, use Kolla Ansible's `reconfigure`
subcommand. For example:
