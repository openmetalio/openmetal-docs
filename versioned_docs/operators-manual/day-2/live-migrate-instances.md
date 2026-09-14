---
sidebar_position: 5
---
# How to Live Migrate Instances Using Skyline

## Introduction

This guide provides instructions for cloud administrators on how to
migrate instances through your Skyline dashboard. Migration is the
process that a server administrator can move instances to a different
host. Live migration keeps instances in an active state during the
migration process. This process is useful when applications need to
remain running and shutting down an instance is not possible or
advantageous.

## Prerequisite

Live migrating instances requires having a user account with the
administrator role. This is typically the account called **admin**.

## Determining an Instance's Parent Host

Switch to the **Administrator** console and go to **Compute ->
Instances**. The list shows each instance's project, host, IP address,
and status.

![Administrator instances list showing project, host, IP, and status](images/skyline-admin-instances.png)

**Figure 1:** Summary of Instances

## Migrate Instance

In the same list, find the instance and choose **More -> Live Migrate**.

![Instance row menu with the Live Migrate option](images/skyline-instance-more-menu.png)

**Figure 2:** Live Migrate action

![Live Migrate dialog showing current and target compute host](images/skyline-live-migrate.png)

**Figure 3:** Live Migration Options

- **Instance**: the instance being migrated.
- **Current Compute Host**: read-only, the host it runs on now.
- **Target Compute Host**: leave unset to let the scheduler choose, or
  pick a specific host.

Click **OK**. The instance's **Status** changes while it migrates, and
its **Host** updates when the migration completes.

OpenMetal uses shared storage through Ceph, so block migration is not
required. Skyline does not expose the **Disk Over Commit** or **Block
Migration** options that Horizon did; both apply only to local
ephemeral storage.
