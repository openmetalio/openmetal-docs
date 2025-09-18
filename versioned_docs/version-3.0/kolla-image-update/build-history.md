# Kolla Image Build History

This page tracks the history of when Kolla images have been built. Images are
built when major security issues are patched in the base image operating system
and when changes to OpenStack services, like bug fixes and improvements, are
released. OpenStack service changes can be found in the [release notes](https://docs.openstack.org/releasenotes/)
index.

## Current OpenStack release

We are currently deploying OpenStack 2023.2 with Ubuntu 22.04 as the base
operating system.

## Image tagging

When images are built, the date they were built is appended to the image tag, in
the format "YYYY-MM-DD". Images built on October 10, 2024 for the 2023.2 release
will be tagged with `2023.2-ubuntu-jammy-2024-10-10`. The latest images built
will have two tags applied, one being the base tag (`2023.2-ubuntu-jammy`, for
example), and the other including the appended date. This allows for rolling
back to previous images if necessary.

## How to update your cloud

See [Update Kolla Images](../operators-manual/day-2/update-kolla-images.md) for
the steps needed to update your cloud.

## OpenStack 2023.2

Latest image tag: `2023.2-ubuntu-jammy`

### Ubuntu 22.04 LTS (Jammy) Security updates

See the [Ubuntu Security Notices](https://ubuntu.com/security/notices?order=newest&release=jammy&details=&offset=0)
page for information relating to security updates.

### OpenStack service updates

OpenStack service changes can be found in the [release notes](https://docs.openstack.org/releasenotes/)
index.

### Image Update History

| Tag | Build Date | Notes |
|--------------------------------|------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| 2023.2-ubuntu-jammy-2025-01-06 | 01/06/2025 | - [Ubuntu security updates](https://ubuntu.com/security/notices?order=newest&release=jammy&details=&offset=0)|
||| - [Barbican (17.0.0-5) security issue and bug fix](https://docs.openstack.org/releasenotes/barbican/2023.2.html#relnotes-17-0-0-5-stable-2023-2) |
||| - [Cinder (23.3.0-1) new feature, bug fixes](https://docs.openstack.org/releasenotes/cinder/2023.2.html#relnotes-23-3-0-1-stable-2023-2)|
||| - [Heat (21.0.0-8) new features and upgrade notes](https://docs.openstack.org/releasenotes/heat/2023.2.html#relnotes-21-0-0-8-stable-2023-2)|
||| - [Neutron (23.3.0) new features, bug fixes](https://docs.openstack.org/releasenotes/neutron/2023.2.html#relnotes-23-3-0-stable-2023-2)|
||| - [Octavia (13.0.0-35) bug fixes](https://docs.openstack.org/releasenotes/octavia/2023.2.html#relnotes-13-0-0-35-stable-2023-2)|
| 2023.2-ubuntu-jammy-2024-10-10 | 10/10/2024 | - [Ubuntu security updates](https://ubuntu.com/security/notices?order=newest&release=jammy&details=&offset=0)|
||| - [Cinder (23.2.0-12) new features and bug fixes](https://docs.openstack.org/releasenotes/cinder/2023.2.html#relnotes-23-2-0-12-stable-2023-2)|
||| - [Neutron (23.2.0-18) security issues and bug fixes](https://docs.openstack.org/releasenotes/neutron/2023.2.html#relnotes-23-2-0-18-stable-2023-2)|
||| - [Nova (28.3.0-11) bug fixes](https://docs.openstack.org/releasenotes/nova/2023.2.html#relnotes-28-3-0-11-stable-2023-2)|
||| - [Octavia (13.0.0-32) bug fixes](https://docs.openstack.org/releasenotes/octavia/2023.2.html#relnotes-13-0-0-32-stable-2023-2)|
|| 9/5/2024 ||
