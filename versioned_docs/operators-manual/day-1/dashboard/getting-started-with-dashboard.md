---
sidebar_position: 1
---
# Getting Started with the Dashboard

Skyline is the default OpenStack dashboard in PCC v4. It is served at your cloud's
dashboard URL. Horizon remains available on port 9999 — see
[Accessing Horizon](accessing-horizon.md).

## Log in to OpenMetal Central

<!-- SCREENSHOT NEEDED: OpenMetal Central login page.
     Cannot be captured automatically; Central is not reachable from the docs build
     environment. Replace this comment with: ![OpenMetal Central login](images/openmetal-central.png) -->

Sign in at [OpenMetal Central](https://central.openmetal.io/).

## Open your cloud's details page

<!-- SCREENSHOT NEEDED: Central cloud details / Manage Cloud page.
     Replace with: ![Manage Cloud](images/manage-cloud.png) -->

Select your cloud to open its details page.

## Find the dashboard URL

<!-- SCREENSHOT NEEDED: Central showing the dashboard URL (Skyline in v4).
     Replace with: ![Dashboard URL](images/dashboard-url.png) -->

The dashboard URL opens Skyline.

## Obtain the dashboard password

<!-- SCREENSHOT NEEDED: Central "show password" control.
     Replace with: ![Show password](images/show-password.png) -->

The `admin` password is shown in Central.

To read it from a control plane node instead:

    grep keystone_admin_password /etc/kolla/passwords.yml

<!-- SCREENSHOT NEEDED: Central hardware assets page (used to find node IPs for SSH).
     Replace with: ![Assets page](images/assets-page.png) -->

## Log in

![Skyline login page](images/skyline-login.png)

Enter the region, username `admin`, and the password. Leave the domain blank to use
the default domain.

![Skyline home page after login](images/overview.png)

The home page shows quota usage for compute, storage, and network.

## Two consoles

Skyline separates tenant work from administration:

- **Project console** — instances, volumes, networks, stacks. The default view.
- **Administrator console** — projects, users, roles, hypervisors, system info.

Switch between them with the **Administrator** link in the top right.
