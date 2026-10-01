---
sidebar_position: 5
---
# Accessing Horizon

Skyline is the default dashboard in PCC v4. Horizon is still deployed and
reachable
directly:

    https://<VIP>:9999

`<VIP>` is the same address as your cloud's dashboard URL.

Log in with the same credentials used for Skyline.

## When to use Horizon

Use Horizon for anything Skyline does not expose yet. Both dashboards talk to
the same
OpenStack APIs, so a change made in one appears in the other.

Horizon receives no OpenMetal-specific configuration beyond what Kolla Ansible
deploys, and it is not the supported default. Prefer Skyline.
