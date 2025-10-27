---
slug:  /openmetal-central/emergency-node-power-management
description: Learn how to use the emergency power management options in OpenMetal Central
---
# Emergency Node Power Management in OpenMetal Central

## Overview

In the event that a hardware node in your cloud becomes inaccessible and all
other options to resolve have been exhausted, you can perform a hard restart of
the problem node from OpenMetal Central.

## Restart procedure

> **WARNING!!** This method of restarting a node is potentially dangerous and
> could result in data loss. Please ensure that all other options have been
> exhausted before proceeding.

1. Access the Assets page of your OpenMetal Central account.

1. Identify the problem node and access it's options menu. Here we are working
   with the `focused-badger.local` node.

   ![Power Options](/img/openmetal-central/power-options.png)

1. Select the action you wish to take. "Hard restart" in this example.

    ![Power Action](/img/openmetal-central/off-or-restart.png)

1. After selection a confirmation prompt will appear. Once you are certain the
   correct node has been selected. Click confirm.

   ![Confirmation Prompt](/img/openmetal-central/restart-confirm.png)

1. You will now see the power indicator for the node turn yellow indicating a
   restart is in progress.

   ![Power State Indicator](/img/openmetal-central/power-state-indicator.png)

1. When the indicator turns green the restart has completed and your node should
   be accessible.
