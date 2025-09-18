---
slug: managing-backups-in-openstack
sidebar_position: 10
---
# Managing Backups in OpenStack

Having a solid backup strategy is important in the event where data is
lost and you need to recover it. In this guide, you will learn how to
make backups of instance data, volumes, and how to store backups outside
of the OpenStack cloud.

## Testing Considerations

Backups should not only be created, but should be confirmed they contain
all data as well as be restored and tested as part of a polished backup
strategy. Consider a disaster recovery scenario where you have known
backups, however they were never tested, and are not usable due to some
circumstance.

## How to Create an Instance Backup

This section demonstrates how to create an instance backup using
OpenStackClient.

To begin, ensure you have prepared your OpenStackClient environment
before issuing commands.

Depending on how the instance was spawned will determine how to create a
backup. If the instance is volume-backed, you will have to back up the
volume. If the instance is image-backed, you can back up the instance
itself, which creates an image backup. Each method is described below.

### Volume-backed

To create a backup of a volume-backed instance using OpenStackClient,
you will need to create a backup of the volume, by first obtaining the
volume's UUID, then use `openstack volume backup create VOLUME_UUID`.

In addition, if the volume is in use by an instance, the `--force` flag
is required to create the volume backup.

#### Create Backup

Create a backup of a volume-backed instance by first listing volumes
then issuing the command to back up that volume:

```shell
$ openstack volume list
+--------------------------------------+-------------------+-----------+------+--------------------------------------------+
| ID                                   | Name              | Status    | Size | Attached to                                |
+--------------------------------------+-------------------+-----------+------+--------------------------------------------+
| 9887730c-e804-4353-af2d-a92b750ed6b5 |                   | in-use    |   17 | Attached to instance-2-volume on /dev/vda  |
| 9a1dfde3-9113-400c-b06e-80d67c636ef9 |                   | in-use    |   25 | Attached to wordpress-1 on /dev/vda
```

This example demonstrates creating a backup of `instance-2-volume` by
backing up its associated volume, referenced by
`9887730c-e804-4353-af2d-a92b750ed6b5`.

Create backup of `instance-2-volume`:

```shell
$ openstack volume backup create 9887730c-e804-4353-af2d-a92b750ed6b5 \
--force
+-------+--------------------------------------+
| Field | Value                                |
+-------+--------------------------------------+
| id    | bc8d29c4-be51-4675-b290-bd0bdc8c9be7 |
| name  | None                                 |
+-------+--------------------------------------+
```

Take note of the **id** of the backup as this will be used next to
determine the backup status.

#### Confirm Backup Completion

The backup will take some time to complete. After a period of time,
check the status by using `openstack volume backup show
VOLUME_BACKUP_UUID`, replacing **VOLUME\_BACKUP\_UUID** with the actual
UUID of the volume backup:

```shell
$ openstack volume backup show bc8d29c4-be51-4675-b290-bd0bdc8c9be7
+-----------------------+--------------------------------------+
| Field                 | Value                                |
+-----------------------+--------------------------------------+
| availability_zone     | None                                 |
| container             | backups                              |
| created_at            | 2021-05-24T16:04:49.000000           |
| data_timestamp        | 2021-05-24T16:04:49.000000           |
| description           | None                                 |
| fail_reason           | None                                 |
| has_dependent_backups | False                                |
| id                    | bc8d29c4-be51-4675-b290-bd0bdc8c9be7 |
| is_incremental        | False                                |
| name                  | None                                 |
| object_count          | 0                                    |
| size                  | 17                                   |
| snapshot_id           | None                                 |
| status                | available                            |
| updated_at            | 2021-05-24T16:05:35.000000           |
| volume_id             | 9887730c-e804-4353-af2d-a92b750ed6b5 |
+-----------------------+--------------------------------------+
```

### Image-backed

To create a backup of an image-backed instance, use `openstack server
backup create INSTANCE_UUID`.

#### Create Instance Backup

First list instances to obtain the UUID, or you can specify the instance
name to the backup command:

 ```shell
 $ openstack server list
 +--------------------------------------+-------------------+--------+-----------------------------------------+------------------------------+----------+
 | ID                                   | Name              | Status | Networks                                | Image                        | Flavor   |
 +--------------------------------------+-------------------+--------+-----------------------------------------+------------------------------+----------+
 | 226ebf42-f58d-4149-8393-dd4f241c33aa | image-backed      | ACTIVE | network-1=192.168.0.199                 | CentOS 8 Stream (el8-x86_64) | c1.micro |
```

Next, create a backup of the instance called **image-backed** using:

```shell
$ openstack server backup create image-backed
+------------------+------------------------------------------------------------------------+
| Field            | Value                                                                  |
+------------------+------------------------------------------------------------------------+
| container_format | bare                                                                   |
| created_at       | 2021-05-24T16:45:17Z                                                   |
| disk_format      | qcow2                                                                  |
| file             | /v2/images/um_f3f2bf61-c699-43ce-9db5-4bb3343cbfad/file                   |
| id               | f3f2bf61-c699-43ce-9db5-4bb3343cbfad                                   |
| min_disk         | 25                                                                     |
| min_ram          | 0                                                                      |
| name             | image-backed                                                           |
```

Note the **id** column from the output. This is the UUID of the backup
and will be used to verify backup completion.

#### Confirm Instance Backup Completion

When a backup of an image-backed instance is created, it is created as
an image.

To confirm the status of the backup, use `openstack image show UUID`:

```shell
$ openstack image show f3f2bf61-c699-43ce-9db5-4bb3343cbfad --fit-width
+------------------+------------------------------------------------------------------------+
| Field            | Value                                                                  |
+------------------+------------------------------------------------------------------------+
| container_format | bare                                                                   |
| created_at       | 2021-05-24T16:45:17Z                                                   |
| disk_format      | raw                                                                    |
| file             | /v2/images/um_f3f2bf61-c699-43ce-9db5-4bb3343cbfad/file                   |
| id               | f3f2bf61-c699-43ce-9db5-4bb3343cbfad                                   |
| min_disk         | 25                                                                     |
| min_ram          | 0                                                                      |
| name             | image-backed                                                           |
| owner            | b93259ca0a5b4541b30e4e16ae1d699d                                       |
| properties       | [truncated]                                                            |
| protected        | False                                                                  |
| schema           | /v2/schemas/image                                                      |
| size             | 26843545600                                                            |
| status           | active                                                                 |
| tags             |                                                                        |
| updated_at       | 2021-05-24T16:45:50Z                                                   |
| visibility       | private                                                                |
+------------------+------------------------------------------------------------------------+
```

Look for the **status** column to indicate the status of the backup. If
the backup is complete, the status will show as `active`.

## How to Recover an Instance Backup

This section explains how to recover an instance backup using
OpenStackClient.

To recover an instance backup, the process involves creating a new
instance based on the image or volume backup.

### Volume-backed Instance

This section demonstrates how to recover an instance using a volume
backup.

To restore an instance from a volume backup, the volume backup needs to
first be restored into a new volume, then an instance can be booted
using that new volume.

#### Create new volume

First create a volume of appropriate size to restore the volume backup
into, using `openstack volume create --size SIZE`:

```shell
$ openstack volume create wordpress-1-backup-1 --size 25
+---------------------+--------------------------------------+
| Field               | Value                                |
+---------------------+--------------------------------------+
| attachments         | []                                   |
| availability_zone   | nova                                 |
| bootable            | false                                |
| consistencygroup_id | None                                 |
| created_at          | 2021-05-24T17:57:29.000000           |
| description         | None                                 |
| encrypted           | False                                |
| id                  | 1810a215-67e4-48b5-ba51-feef9d263660 |
| multiattach         | False                                |
| name                | wordpress-1-backup-1                 |
```

Take note of the **id**, `1810a215-67e4-48b5-ba51-feef9d263660`, as this
will be used in the next section to recover.

#### Restore volume backup

The volume backup can be restored now, but first you will need the UUID
of the backup created previously. This can be listed by using `openstack
volume backup list`:

```shell
 $ openstack volume backup list
 +--------------------------------------+--------------------------+-------------+-----------+------+
 | ID                                   | Name                     | Description | Status    | Size |
 +--------------------------------------+--------------------------+-------------+-----------+------+
 | f8440441-92b8-4522-9dfe-18868e089d6e | None                     | None        | available |   25 |
 | bc8d29c4-be51-4675-b290-bd0bdc8c9be7 | None                     | None        | available |   17 |
 | 1ae23283-e43f-4a67-97a1-0b7f7afaaff2 | wordpress-media-1-backup |             | available |    5 |
 +--------------------------------------+--------------------------+-------------+-----------+------+
 ```

This example will recover the volume backup under UUID
`f8440441-92b8-4522-9dfe-18868e089d6e`.

Restore the volume backup into the new volume using `openstack volume
backup restore BACKUP_UUID VOLUME_UUID`, replacing **BACKUP\_UUID** and
**VOLUME\_UUID** with the UUIDs of the backup and the new volume:

```shell
$ openstack volume backup restore f8440441-92b8-4522-9dfe-18868e089d6e 1810a215-67e4-48b5-ba51-feef9d263660
+-------------+--------------------------------------+
| Field       | Value                                |
+-------------+--------------------------------------+
| backup_id   | f8440441-92b8-4522-9dfe-18868e089d6e |
| volume_id   | 1810a215-67e4-48b5-ba51-feef9d263660 |
| volume_name | wordpress-1-backup-1                 |
+-------------+--------------------------------------+
```

#### Confirm volume

Confirm the volume backup restored into the new volume by listing
volumes and note the **Status** column:

```shell
$ openstack volume list
+--------------------------------------+----------------------+-----------+------+--------------------------------------------+
| ID                                   | Name                 | Status    | Size | Attached to                                |
+--------------------------------------+----------------------+-----------+------+--------------------------------------------+
| 1810a215-67e4-48b5-ba51-feef9d263660 | wordpress-1-backup-1 | available |   25 |                                            |
```

If the backup is ready to use, the **Status** column will show as
`available`.

**Step 4** -- Create new instance

A new instance can now be created using this volume. For help with how to
create an instance see the [Create an Instance](create-an-instance) guide.

The following builds an instance booted from the previously restored
volume backup:

```sh
$ openstack server create --volume 1810a215-67e4-48b5-ba51-feef9d263660 \\
    --flavor c1.micro \\
    --network 29aa8aec-36ec-416d-9828-4a3b6bb10f4b \\
    --key-name key-1 \\
    --security-group 44668612-1a18-4289-b5fb-f24de8e20c09 \\
    wordpress-2-volume-restored
```

**Step 5** -- Confirm instance restoration

Show the details of the instance to confirm it is active:

```sh
$ openstack server show wordpress-2-volume-restored | grep status
| status                      | ACTIVE                                                   |
```

#### Image-backed Instance

This section explains how to recover an instance using an image backup.

-----

**Step 1** -- List images

First, acquire the UUID of the image you wish to restore using
`openstack image list`:

```sh
$ openstack image list
+--------------------------------------+------------------------------------------------------+--------+
| ID                                   | Name                                                 | Status |
+--------------------------------------+------------------------------------------------------+--------+
| d5a101ff-0870-435f-bf76-c3309e542a53 | CentOS 8 Stream (el8-x86_64)                         | active |
| 8c8e0a35-61dd-4540-b9fd-ca36ca0ef181 | Debian 10 (buster-amd64)                             | active |
| be44af12-aa34-4b25-b4af-60a66599f442 | Fedora CoreOS (fedora-coreos-33.20210412.3.0-stable) | active |
| c005b6f3-9d34-4f91-94b6-1ff50c174750 | Ubuntu 20.04 (focal-amd64)                           | active |
| f3f2bf61-c699-43ce-9db5-4bb3343cbfad | image-backed                                         | active |
| d589995e-7425-42fd-8a6a-3bf98783e0cc | wordpress-1-snap                                     | active |
| ec4c8f61-6f44-4360-99b3-47b3022d177d | wordpress-2-snap                                     | active |
+--------------------------------------+------------------------------------------------------+--------+
```

This example will use the image called **image-backed**, which is
associated with UUID `f3f2bf61-c699-43ce-9db5-4bb3343cbfad`.

**Step 2** -- Spawn instance

With the image UUID, spawn a new instance called
**instance-3-image-backed**:

```sh
$ openstack server create \
--image f3f2bf61-c699-43ce-9db5-4bb3343cbfad \
--flavor c1.micro \
--network 29aa8aec-36ec-416d-9828-4a3b6bb10f4b \
--key-name key-1 \
--security-group 44668612-1a18-4289-b5fb-f24de8e20c09 \
instance-3-image-backed
```

**Step 3** -- Confirm instance creation

Confirm the instance created successfully by listing instances or
showing the specific details of the instance.

**List Instances**:

List instances using `openstack server list`:

```sh
$ openstack server list
+--------------------------------------+-----------------------------+--------+-------------------------+------------------------------+----------+
| ID                                   | Name                        | Status | Networks                | Image                        | Flavor   |
+--------------------------------------+-----------------------------+--------+-------------------------+------------------------------+----------+
| 98174d7f-53c1-4861-84a5-2517b90ba92e | instance-3-image-backed     | ACTIVE | network-1=192.168.0.176 | image-backed                 | c1.micro |
| ff205cad-965c-4ae1-9e47-65fa4d1df82b | wordpress-2-volume-restored | ACTIVE | network-1=192.168.0.226 | N/A (booted from volume)     | c1.micro |
| 226ebf42-f58d-4149-8393-dd4f241c33aa | image-backed                | ACTIVE | network-1=192.168.0.199 | CentOS 8 Stream (el8-x86_64) | c1.micro |
| da6591d9-7cbd-47aa-9a46-ff3cb6d52c24 | instance-2-volume           | ACTIVE | network-1=192.168.0.178 | N/A (booted from volume)     | c1.micro |
| 72e1e2db-0276-4ddd-85b4-452aa7c449c0 | instance-1                  | ACTIVE | network-1=192.168.0.50  | CentOS 8 Stream (el8-x86_64) | c1.micro |
+--------------------------------------+-----------------------------+--------+-------------------------+------------------------------+----------+
```

The first item in the above list is the instance previously created. The
**Status** column shows `ACTIVE` indicating the instance is ready to
use.

## Volume Backups

### How to Create a Volume Backup

In addition to creating instance snapshots, you can also create backups
of volumes using OpenStackClient. This is important when a persistent
volume is used and you want to create backup copies of it.

**Step 1** -- List existing volumes

To create a volume backup, you first need to know the name or UUID of
the volume being backed up.

Determine this by listing volumes, using `openstack volume list`:

```sh
$ openstack volume list
+--------------------------------------+----------------------+-----------+------+------------------------------------------------------+
| ID                                   | Name                 | Status    | Size | Attached to                                          |
+--------------------------------------+----------------------+-----------+------+------------------------------------------------------+
| 1810a215-67e4-48b5-ba51-feef9d263660 | wordpress-1-backup-1 | available |   25 |                                                      |
| 9887730c-e804-4353-af2d-a92b750ed6b5 |                      | in-use    |   17 | Attached to instance-2-volume on /dev/vda            |
| 2a8eb736-9e7b-4ede-9a4e-9a50fc571da2 |                      | in-use    |   25 | Attached to wordpress-2-volume-restored on /dev/vda  |
| 664e09b7-e1f9-46e1-9504-794ff75e7295 |                      | available |   25 |                                                      |
| 0860845e-ba18-4f1f-84ed-22600ad7bbca | wordpress-media-1    | available |    5 |                                                      |
+--------------------------------------+----------------------+-----------+------+------------------------------------------------------+
```

**Step 2** -- Create volume backup

This example will demonstrate backing up the volume from the above
called `wordpress-media-1`.

To create a volume backup of this volume, use `openstack volume backup
create wordpress-media-1`:

```sh
$ openstack volume backup create wordpress-media-1
+-------+--------------------------------------+
| Field | Value                                |
+-------+--------------------------------------+
| id    | 3db892b4-809e-400b-9d85-1f3340de49a5 |
| name  | None                                 |
+-------+--------------------------------------+
```

**Step 3** -- Confirm volume backup completion

You can either list the volume backups and look at the **Status** column
or show the details of the specific volume backup.

List volume backups using `openstack volume backup list`:

```sh
$ openstack volume backup list
+--------------------------------------+--------------------------+-------------+-----------+------+
| ID                                   | Name                     | Description | Status    | Size |
+--------------------------------------+--------------------------+-------------+-----------+------+
| 3db892b4-809e-400b-9d85-1f3340de49a5 | None                     | None        | available |    5 |
| f8440441-92b8-4522-9dfe-18868e089d6e | None                     | None        | available |   25 |
| bc8d29c4-be51-4675-b290-bd0bdc8c9be7 | None                     | None        | available |   17 |
| 1ae23283-e43f-4a67-97a1-0b7f7afaaff2 | wordpress-media-1-backup |             | available |    5 |
+--------------------------------------+--------------------------+-------------+-----------+------+
```

The **Status** column indicates if the volume backup is ready to use or
not and should report `available` when the backup is ready.

### How to Recover a Volume Backup

This section explains the steps needed to recover a volume backup using
OpenStackClient. The flow for recovering a volume backup is to find the
volume backup UUID, create an empty volume, then recover the backup into
the new volume.

**Step 1** -- Find the volume backup

First, list the available volume backups using `openstack volume backup
list`:

```sh
$ openstack volume backup list
+--------------------------------------+--------------------------+-------------+-----------+------+
| ID                                   | Name                     | Description | Status    | Size |
+--------------------------------------+--------------------------+-------------+-----------+------+
| 3db892b4-809e-400b-9d85-1f3340de49a5 | None                     | None        | available |    5 |
| f8440441-92b8-4522-9dfe-18868e089d6e | None                     | None        | available |   25 |
| bc8d29c4-be51-4675-b290-bd0bdc8c9be7 | None                     | None        | available |   17 |
| 1ae23283-e43f-4a67-97a1-0b7f7afaaff2 | wordpress-media-1-backup |             | available |    5 |
+--------------------------------------+--------------------------+-------------+-----------+------+
```

This example will recover the volume backup called
**wordpress-media-1-backup**.

**Step 2** -- Create new volume

Next, create a new volume at least the size of the volume backup using
`openstack volume create --size SIZE VOLUME_NAME`, where **SIZE** is in
gigabytes and the **VOLUME\_NAME** is the name of the volume:

```sh
$ openstack volume create --size 5 wordpress-media-1-backup-2
+---------------------+--------------------------------------+
| Field               | Value                                |
+---------------------+--------------------------------------+
| attachments         | []                                   |
| availability_zone   | nova                                 |
| bootable            | false                                |
| consistencygroup_id | None                                 |
| created_at          | 2021-05-24T22:04:02.000000           |
| description         | None                                 |
| encrypted           | False                                |
| id                  | 05b1310b-35d0-497f-a150-3ca436b6a969 |
```

The UUID of this volume is `05b1310b-35d0-497f-a150-3ca436b6a969` and
will be used in the next section.

**Step 3** -- Recover volume backup

Restore the volume backup into the new volume using `openstack volume
backup restore BACKUP_UUID VOLUME_UUID`, replacing **BACKUP\_UUID** and
**VOLUME\_UUID** with the UUIDs of the backup and the new volume:

```sh
$ openstack volume backup restore wordpress-media-1-backup 05b1310b-35d0-497f-a150-3ca436b6a969
+-------------+--------------------------------------+
| Field       | Value                                |
+-------------+--------------------------------------+
| backup_id   | 1ae23283-e43f-4a67-97a1-0b7f7afaaff2 |
| volume_id   | 05b1310b-35d0-497f-a150-3ca436b6a969 |
| volume_name | wordpress-media-1-backup-2           |
+-------------+--------------------------------------+
```

**Step 4** -- Confirm backup recovery

Finally, confirm the backup restored by listing volumes:

```sh
$ openstack volume list
+--------------------------------------+----------------------------+-----------+------+------------------------------------------------------+
| ID                                   | Name                       | Status    | Size | Attached to                                          |
+--------------------------------------+----------------------------+-----------+------+------------------------------------------------------+
| 05b1310b-35d0-497f-a150-3ca436b6a969 | wordpress-media-1-backup-2 | available |    5 |                                                      |
| 1810a215-67e4-48b5-ba51-feef9d263660 | wordpress-1-backup-1       | available |   25 |                                                      |
| 9887730c-e804-4353-af2d-a92b750ed6b5 |                            | in-use    |   17 | Attached to instance-2-volume on /dev/vda            |
| 2a8eb736-9e7b-4ede-9a4e-9a50fc571da2 |                            | in-use    |   25 | Attached to wordpress-2-volume-restored on /dev/vda  |
| 664e09b7-e1f9-46e1-9504-794ff75e7295 |                            | available |   25 |                                                      |
| 0860845e-ba18-4f1f-84ed-22600ad7bbca | wordpress-media-1          | available |    5 |                                                      |
+--------------------------------------+----------------------------+-----------+------+------------------------------------------------------+
```

The first item in the above list is the restored backup,
**wordpress-media-1-backup-2**. Note the **Status** column reports
`available` indicating the backup restoration succeeded.
