---
sidebar_position: 2
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# How to Add Additional Provider IP Blocks

## Introduction

With OpenMetal Private Clouds, multiple provider IP blocks are
supported. This guide explains how to request an additional provider IP
block and how to use the IPs in Skyline.

## Before Proceeding

**WARNING\!** -- If your cloud has had its configuration modified, do
**not** use the functions in OpenMetal Central to modify your cloud,
otherwise the configuration changes to your cloud will be reverted to
the defaults. The functions in OpenMetal Central that you should not use
are adding and removing hardware nodes and adding Provider IP blocks. We
can still accommodate your requests by performing the actions manually
through a support ticket. We are aware of the inflexibility of the
deployment system and are working to produce a more flexible system that
allows for custom configuration changes.

## Getting Started

To add the IP block you need to reach out to your Account Manager who
will submit the request. Our support staff will handle the addition and
inform you through a OpenMetal Central ticket sent to your primary
e-mail address when complete.

### Confirm new Provider Block Addition

First to confirm the addition of the IP block, log in with a user that has the administrator role. This is typically the account called "admin".

<Tabs groupId="dashboard">
<TabItem value="skyline" label="Skyline" default>

Switch to the **Administrator** console, go to **Network -> Networks**, then click the **External** network.

![Networks list showing the External network](images/skyline-admin-networks.png)

**Figure 1:** List of Networks

Choose the **Subnets** tab and confirm the new subnet has been added.

![Subnets tab of the External network](images/skyline-external-subnets.png)

**Figure 2:** List of Subnets for the External network

</TabItem>
<TabItem value="hz" label="Horizon">

Go to **Admin -> Network -> Networks**, then click the **External** network.

![Networks list in Horizon](images/hz-admin-networks.png)

**Figure 1:** List of Networks

The network detail page lists its subnets. Confirm the new subnet has been added.

![External network detail in Horizon](images/hz-external-subnets.png)

**Figure 2:** List of Subnets for the External network

</TabItem>
</Tabs>

The new subnet will be prefixed with **Internet\_** and will have a
series of hex values following it.

### How are the new Provider Block IPs Used?

When creating a resource that requires an IP from this block, specify
the name of the newly added provider block to add IPs from it.
