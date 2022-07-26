# How to Enable TLS for OpenStack using Kolla Ansible

## Introduction

By default, Private Clouds are not configured with an SSL encrypting the
network traffic from your machine to your Private Cloud's OpenStack
dashboard, called Horizon. Without encryption, information is sent in
plaintext, meaning someone could see the password you used to log in to
Horizon. In this guide, we explain how to configure an SSL for the
public, or external, network of your Private Cloud.

## Table of Contents

1. [Prerequisites](enable-tls#prerequisites)

2. [Specify an External Fully Qualified Domain Name for
    Horizon](enable-tls#specify-an-external-fully-qualified-domain-name-for-horizon)

    1. [Determine Public
        IP](enable-tls#determine-public-ip)
    2. [Configure an
        FQDN](enable-tls#configure-an-fqdn)
    3. [Apply Configuration Change Using Kolla
        Ansible](enable-tls#apply-configuration-change-using-kolla-ansible)

3. [Enable SSL Externally, Encrypting Horizon
    Traffic](enable-tls#enable-ssl-externally-encrypting-horizon-traffic)

    1. [Modify Kolla Ansible
        Configuration](enable-tls#modify-kolla-ansible-configuration)
    2. [Configure Root CA
        Bundle](enable-tls#configure-root-ca-bundle)
    3. [Prepare SSL
        File](enable-tls#prepare-ssl-file)
    4. [Specify SSL
        Certificate](enable-tls#specify-ssl-certificate)
    5. [Enable External
        TLS](enable-tls#enable-external-tls)
    6. [Reconfigure Cloud using Kolla
        Ansible](enable-tls#reconfigure-cloud-using-kolla-ansible)

4. [Reconfigure Ceph Cluster using Ceph
    Ansible](enable-tls#reconfigure-ceph-cluster-using-ceph-ansible)

    1. [Procedure](enable-tls#procedure)

5. [Reference](enable-tls#reference)

## Prerequisites

- **Prepare Kolla Ansible**: This guide explains how to configure your
    cloud with an SSL using Kolla Ansible. Any time you work with Kolla
    Ansible, you must prepare a shell environment. For more, see [How to
    Prepare and Use Kolla
    Ansible](./kolla-ansible).
    The remaining instruction assume this environment has been prepared.
    All commands are to be executed from the control plane node where
    this environment has been prepared.
- **Prepare Ceph Ansible**: This guide makes use of Ceph Ansible to
    reconfigure your cloud's Ceph cluster. When working with Ceph
    Ansible, you must first prepare a shell environment. For more, see
    [How to Prepare and Use Ceph
    Ansible](../ceph-ansible/ceph-ansible). The
    portion of this guide that has to do with using Ceph Ansible assumes
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

With the FQDN configured, Kolla Ansible must be used to apply that
configuration before proceeding with this guide. Before proceeding with
this section, ensure you have [prepared a Kolla Ansible
environment](./).
Also ensure the node from which Kolla Ansible has been prepared contains
the file `/etc/fm-deploy/kolla-ansible-inventory`, which is the Ansible
inventory file for your cloud.

To configure the cloud to use this FQDN, use the inventory file
`/etc/fm-deploy/kolla-ansible-inventory` and Kolla Ansible's
`reconfigure` subcommand.

For example:

    kolla-ansible -i /etc/fm-deploy/kolla-ansible-inventory reconfigure

## Enable SSL Externally, Encrypting Horizon Traffic

This section outlines the steps required to install a signed SSL for
your cloud's external, public network using Kolla Ansible.

### Modify Kolla Ansible Configuration

#### Configure Root CA Bundle

OpenMetal private clouds are deployed with CentOS 8 as the operating
system. Kolla Ansible needs to be updated to point to the root CA bundle
for CentOS 8. To do so, modify `/etc/kolla/globals.yml` to reflect the
location of the root CA bundle for CentOS 8:

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

Next, in `/etc/kolla/globals.yml`, ensure the key
`kolla_external_fqdn_cert` is set to the name of the certificate file.
`{{ node_config }}` in this case is defined as `/etc/kolla`.

For example:

    kolla_external_fqdn_cert: '{{ node_config }}/certificates/<certificate-name>.pem'

#### Enable External TLS

Within `/etc/kolla/globals.yml`, ensure `kolla_enable_tls_external` is
set to `'yes'`:

    kolla_enable_tls_external: 'yes'

#### Reconfigure Cloud using Kolla Ansible

The previous steps conclude the preparation of the SSL file and the
Kolla Ansible configuration. Before proceeding with this step, ensure
you have [prepared a Kolla Ansible
environment](./).

Next, to configure the cloud to use this SSL, use the inventory file
`/etc/fm-deploy/kolla-ansible-inventory` and Kolla Ansible's
`reconfigure` subcommand.

For example:

    kolla-ansible -i /etc/fm-deploy/kolla-ansible-inventory reconfigure

## Reconfigure Ceph Cluster using Ceph Ansible

Additionally, the Ceph cluster needs to be reconfigured to update Swift
to point to the Keystone HTTPS endpoint instead of the HTTP version. In
this section we explain how to configure the new Swift endpoint using
Ceph Ansible.

### Procedure

First, ensure you have [prepared a Ceph Ansible
environment](../ceph-ansible).

Next, load `./group_vars/all.yml` in an editor and find the line
containing the string `rgw keystone url:`. For this example, this line
appears this way:

    rgw keystone url: http://173.231.254.164:5000

This line tells Swift which URL to use to authenticate with Keystone.
Since the cloud now has an SSL configured externally, the Keystone URL
for Swift needs to include the HTTPS protocol.

In the file `./group_vars/all.yml`, ensure the line with `rgw keystone
url:` now specifies HTTPS instead of HTTP. For example:

    rgw keystone url: https://173.231.254.164:5000

Next, run Ceph Ansible, using:

    ansible-playbook \
        -i /etc/fm-deploy/ceph-inventory.yml \
        --private-key /root/.ssh/fm-deploy \
        /opt/ceph-ansible/site.yml

## Reference

[TLS Documentation from Kolla Ansible for OpenStack
Victoria](https://docs.openstack.org/kolla-ansible/victoria/admin/tls.html)
