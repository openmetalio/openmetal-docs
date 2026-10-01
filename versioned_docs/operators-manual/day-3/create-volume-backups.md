---
sidebar_position: 3
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Create and Restore Volume Backups

## Introduction

With Private Clouds, you have the ability to create backups and
snapshots of your volume data. If a volume's data goes corrupt or is
removed by mistake, having a copy of that data could be invaluable. In
this guide, we explain how to create and recover volume backups using
Skyline.

## Create a Volume Backup

<Tabs groupId="dashboard">
<TabItem value="hz" label="Horizon" default>

Go to **Project -> Volumes -> Volumes**.

![Volumes list in Horizon](images/hz-volumes.png)

**Figure 1:** Volumes List

Find the volume and choose **Create Backup** from its actions menu.

![Create Volume Backup form in Horizon](images/hz-create-backup.png)

**Figure 2:** Create Volume Backup Form

- **Backup Name**: a name for the backup.
- **Description**: optional.
- **Container Name**: leave blank.
- **Backup Snapshot**: optionally back up from a snapshot instead.

Submit the form, then go to **Project -> Volumes -> Backups** to see the backup.

![Volume Backups list in Horizon](images/hz-backups.png)

**Figure 3:** Volume Backup List

</TabItem>
<TabItem value="skyline" label="Skyline">

Go to **Storage -> Volumes**.

![Volumes list](images/skyline-volume-list.png)

**Figure 1:** Volumes List

Find the volume and choose **More -> Data Protection -> Create Backup**.

![Create Volume Backup dialog](images/skyline-create-backup.png)

**Figure 2:** Create Volume Backup Form

- **Volume**: read-only, the volume being backed up.
- **Volume Backup Name**: a name for the backup.
- **Backup Mode**: **Full** copies the whole volume. **Incremental** copies only the blocks changed since the last backup, and requires an existing full backup of that volume.

Submit the form, then go to **Storage -> Volume Backups** to see the backup.

![Volume Backups list showing the new backup](images/skyline-backup-list.png)

**Figure 3:** Volume Backup List

</TabItem>
</Tabs>

On a Private Cloud, volume backups are stored in the Ceph pool called `backups`.

### Test Volume Backups

Creating backup copies of your important data is only one part of having
a solid backup and recovery plan. Additionally, consider testing
backed-up data to ensure if something unexpected does happen that
restoring your backups will actually be useful. To test volume backups,
you can restore a volume backup within OpenStack alongside the original
volume and compare the contents.

## Restore a Volume Backup

<Tabs groupId="dashboard">
<TabItem value="hz" label="Horizon" default>

Go to **Project -> Volumes -> Backups**. Find the backup and choose **Restore Backup** from its actions menu.

![Volume Backups list in Horizon](images/hz-backups.png)

**Figure 4:** Restore Backup

</TabItem>
<TabItem value="skyline" label="Skyline">

Go to **Storage -> Volume Backups**. Find the backup and choose **More -> Restore Backup**.

![Restore Backup option in the row menu](images/skyline-backup-restore-menu.png)

**Figure 4:** Restore Backup

</TabItem>
</Tabs>

Choose the volume to restore into. Leave it unset to restore into a new volume.

## Ceph, Volumes, and Data Durability

When volume backups are created, they are stored in your cloud's Ceph
cluster in a pool called `backups`. By default, the Ceph cluster is
configured with host level replication across each of your cloud's three
control plane nodes. With this configuration, your cloud could suffer
losing all but one Ceph node and still retain all of the cluster's data.
For more about how your Ceph cluster was configure, see the heading
**Default Configuration for the Ceph Cluster** in the
[Introduction to Ceph](../day-2/introduction-to-ceph) guide.

## Store Data Outside of the Cloud

Taking data backups a step further, consider storing critical data
outside of the cloud. Storing data both in the cloud's Ceph cluster as
well as outside of it increases the failure domain.

With Ceph you can use [RBD mirroring](https://docs.ceph.com/en/latest/rbd/rbd-mirroring/),
which effectively is a way to mirror your Ceph cluster's data to another Ceph
cluster.
