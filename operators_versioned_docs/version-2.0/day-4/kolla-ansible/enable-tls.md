---
sidebar_position: 2
---
# How to Deploy an SSL Certificate for OpenStack using Kolla Ansible

## Introduction

By default, Private Clouds are deployed with Kolla Ansible's self-signed SSL
certificate. The following will guide you through the steps needed to deploy a
different SSL certificate, providing encryption of the network traffic for
Horizon and the OpenStack public APIs in your cloud.

## Prerequisites

- **Prepare Kolla Ansible**: This guide explains how to configure your
    cloud with an SSL using Kolla Ansible. Any time you work with Kolla
    Ansible, you must prepare a shell environment. For more, see
    [How to Prepare and Use Kolla Ansible](./prepare-kolla-ansible).
    The remaining instruction assume this environment has been prepared.
    All commands are to be executed from the control plane node where
    this environment has been prepared.
- **Root Access**: Root access to your cloud's control plane nodes is
    required.
- **Provide your own SSL Files**: This guide requires the private key,
    certificate and intermediate chain. Your certificate and
    intermediate chain may be combined as a "Full Chain".

## Specify an External Fully Qualified Domain Name for Horizon

Before configuring your cloud with an SSL, a Fully Qualified Domain Name
(FQDN) must be configured. The FQDN should have its DNS A record
adjusted to point to the public IP of your cloud. This section explains
how to prepare your cloud with an FQDN and how to determine the public
IP of your cloud.

### Determine Public IP

Within `/etc/kolla/globals.yml`, your cloud's public IP is defined by
the key `kolla_external_vip_address`.

For example:

    $ grep kolla_external_vip_address /etc/kolla/globals.yml
    kolla_external_vip_address: 173.231.254.164

For this example, the FQDN selected should have a DNS A record pointed
to **173.231.254.164**. Ensure your FQDN's A record is pointed to the
value defined by `kolla_external_vip_address` within your cloud's
`/etc/kolla/globals.yml`.

### Configure an FQDN

To specify a domain name for Horizon, within `/etc/kolla/globals.yml`,
set the value for `kolla_external_fqdn` to the domain of your choosing.
**Note** your `/etc/kolla/globals.yml` may not have a line containing
`kolla_external_fqdn`. If this line is not present, append it the file.

For example, to set the FQDN for a cloud to be **cloud.domain.com**,
use:

    kolla_external_fqdn: cloud.domain.com

### Apply Configuration Change Using Kolla Ansible

With the FQDN configured, Kolla Ansible must be used to apply that configuration
before proceeding with this guide. Before proceeding with this section, ensure
you have [prepared a Kolla Ansible environment](./prepare-kolla-ansible).

To configure the cloud to use this FQDN, use the inventory files
`/opt/kolla-ansible-cli/inventory.yml` and `/opt/kolla-ansible-cli/ansible/inventory/multinode` as well as Kolla Ansible's
`reconfigure` subcommand.

For example:

    kolla-ansible -i /opt/kolla-ansible-cli/inventory.yml -i /opt/kolla-ansible-cli/ansible/inventory/multinode reconfigure

## Enable SSL Externally, Encrypting Horizon Traffic

This section outlines the steps required to install a signed SSL for
your cloud's Horizon and public OpenStack APIs using Kolla Ansible.

### Modify Kolla Ansible Configuration

#### Configure Root CA Bundle

OpenMetal private clouds are deployed with CentOS 9 Stream as the operating
system. Kolla Ansible needs to be updated to point to the root CA bundle file.
To do so, modify `/etc/kolla/globals.yml` to reflect the location of the root CA
bundle for CentOS 9 Stream:

    openstack_cacert: '/etc/pki/tls/certs/ca-bundle.crt'

#### Prepare SSL File

Your SSL files need to be prepared into a single file of **PEM** format,
including the private key, certificate, and intermediate chain. When
preparing the file ensure the order of the information is the private
key first, then the certificate, and finally the intermediate chain.

To prepare your SSL, concatenate the contents of the private key, the
certificate, and the intermediary chain into single file located
`/etc/kolla/certificates/<certificate-name>.pem`, where
`<certificate-name>` is the name of the certificate file.

Additionally, ensure `0600` permissions are set for the certificate
file:

    chmod 0600 /etc/kolla/certificates/<certificate-name>.pem

As an example, here's truncated output including the headers of a
prepared SSL PEM file:

    -----BEGIN PRIVATE KEY----- <-- Private Key
    -----END PRIVATE KEY-----
    -----BEGIN CERTIFICATE----- <-- Certificate
    -----END CERTIFICATE-----
    -----BEGIN CERTIFICATE----- <-- Intermediary Certificate #1
    -----END CERTIFICATE-----
    -----BEGIN CERTIFICATE----- <-- Intermediary Certificate #2
    -----END CERTIFICATE-----

Ensure your SSL PEM file reflects the above ordering otherwise Kolla
Ansible may fail to execute as expected.

#### Specify SSL Certificate

Next, in `/etc/kolla/globals.yml`, ensure the key `kolla_external_fqdn_cert` is
set to the name of the certificate file.

For example:

    kolla_external_fqdn_cert: '{{ node_config }}/certificates/<certificate-name>.pem'

`{{ node_config }}` in this case is defined as `/etc/kolla`.

#### Enable External TLS

Within `/etc/kolla/globals.yml`, ensure `kolla_enable_tls_external` is
set to `'yes'`:

    kolla_enable_tls_external: 'yes'

#### Reconfigure Cloud using Kolla Ansible

The previous steps conclude the preparation of the SSL file and the
Kolla Ansible configuration. Before proceeding with this step, ensure
you have [prepared a Kolla Ansible environment](./prepare-kolla-ansible).

Next, to configure the cloud to use this SSL, use the inventory file
`/opt/kolla-ansible-cli/inventory.yml` and `/opt/kolla-ansible-cli/ansible/inventory/multinode` as well as Kolla Ansible's
`reconfigure` subcommand.

For example:

    kolla-ansible -i /opt/kolla-ansible-cli/inventory.yml -i /opt/kolla-ansible-cli/ansible/inventory/multinode reconfigure

## Reference

[TLS Documentation from Kolla Ansible](https://docs.openstack.org/kolla-ansible/yoga/admin/tls.html)
