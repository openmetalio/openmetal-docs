---
sidebar_position: 2
---
# How to Deploy an SSL Certificate for OpenStack using Kolla Ansible

## Introduction

Private Clouds are deployed with external TLS enabled, using a self-signed certificate. This guide replaces it with your own certificate and domain name for the dashboard and the public OpenStack APIs.

Your cloud's domain name is set in its Kolla Ansible configuration, which our team manages. You point DNS at your cloud and place the certificate on a control plane node, then our team applies the change.

## Prerequisites

- Root access to your cloud's control plane nodes.
- Your private key, certificate, and intermediate chain. The certificate and intermediate chain may be combined as a "Full Chain".

## Point DNS at Your Cloud

Your cloud's public IP is set by `kolla_external_vip_address`:

    $ grep kolla_external_vip_address /etc/kolla/globals.d/custom-globals.yml
    kolla_external_vip_address: "10.0.0.20"

Create a DNS A record for your domain pointing to that IP. On a live cloud this is a public IP.

## Prepare the Certificate File

Combine the private key, certificate, and intermediate chain into a single PEM file, in that order:

    -----BEGIN PRIVATE KEY----- <-- Private Key
    -----END PRIVATE KEY-----
    -----BEGIN CERTIFICATE----- <-- Certificate
    -----END CERTIFICATE-----
    -----BEGIN CERTIFICATE----- <-- Intermediary Certificate #1
    -----END CERTIFICATE-----
    -----BEGIN CERTIFICATE----- <-- Intermediary Certificate #2
    -----END CERTIFICATE-----

Place the file in `/etc/kolla/certificates/` on the first host listed under `control` in `/opt/kolla-ansible-cli/inventory.yml`. The name must end in `.pem`. Set its permissions:

    chmod 0600 /etc/kolla/certificates/<certificate-name>.pem

The certificate's Common Name or Subject Alternative Names must include your domain name, or a wildcard for its parent domain.

## Request the Change

[Submit a support ticket](../../day-1/intro-to-openmetal-private-cloud.md#submit-a-support-ticket) with your domain name. Our team sets the domain in your cloud's configuration and runs a deployment.

The deployment uses a PEM file from `/etc/kolla/certificates/` that is not expired and not signed by the cloud's own CA, `KollaTestCA`. If more than one qualifies, it uses the one that expires soonest.

## Renew the Certificate

Place the renewed PEM file in `/etc/kolla/certificates/` and remove the old one, then [submit a support ticket](../../day-1/intro-to-openmetal-private-cloud.md#submit-a-support-ticket) to have it applied. If the old file stays, the deployment keeps using it until it expires.

## Reference

[TLS Documentation from Kolla Ansible](https://docs.openstack.org/kolla-ansible/2026.1/admin/tls.html)
