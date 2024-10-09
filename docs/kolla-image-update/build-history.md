# Kolla Image Build History
This page tracks the history of when Kolla images have been built. Images are
built when major security issues are patched in the base image operating system
and when changes to OpenStack services, like bug fixes and improvements, are
released. OpenStack service changes can be found in the [release notes](https://docs.openstack.org/releasenotes/) index.

## Current OpenStack release
We are currently deploying OpenStack 2023.2 with Ubuntu 22.04 as the base operating system.

## Image tagging
When images are built, the date they were built is appended to the image tag, in
the format "MM-DD-YYYY". Images built on October 7, 2024 for the 2023.2 release
will be tagged with `2023.2-ubuntu-jammy-10-07-2024`. The latest images built
will have two tags applied, one being the base tag (`2023.2-ubuntu-jammy`, for
example), and the other including the appended date. This allows for rolling
back to previous images if necessary.

## How to update your cloud
See [Update Kolla Images](../operators-manual/day-2/update-kolla-images.md) for the steps needed to update your cloud.

## OpenStack 2023.2
Latest image tag: `2023.2-ubuntu-jammy`

### Ubuntu 22.04 LTS (Jammy) Security updates
See the [Ubuntu Security Notices](https://ubuntu.com/security/notices?order=newest&release=jammy&details=&offset=0) page for information relating to security updates.

### OpenStack service updates
OpenStack service changes can be found in the [release notes](https://docs.openstack.org/releasenotes/) index.

### Images Update History
- Images updated 10/7/2024
- Images updated 9/5/2024