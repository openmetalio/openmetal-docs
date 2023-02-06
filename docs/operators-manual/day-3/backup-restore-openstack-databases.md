---
sidebar_position: 5
---
# Backup and Restore OpenStack Service Databases

Kolla Ansible provides a utility to create copies of all OpenStack
service databases, called `mariadb_backup`. In this section, we explain
how to use Kolla Ansible's builtin function to create database backups
of a Private Cloud's OpenStack services.

## Prerequisites

Before proceeding with this guide, a Kolla Ansible environment needs to
be prepared. For information about preparing a Kolla Ansible
environment, see [How to Prepare and Use Kolla Ansible](../day-4/kolla-ansible/prepare-kolla-ansible).
Once the environment is prepared, come back to this guide to learn how to
create database backups of OpenStack services.

## How to Create OpenStack Service Database Backups

The following instruction must be performed from the folder in which you
have prepared Kolla Ansible. This section first provides the command
syntax, then follows up with an example of the command's execution and
output. Note that Kolla Ansible has no way to schedule backups.

### Command Syntax for Full Database Backups

The command to perform a full backup of all databases using Kolla
Ansible is...:

    kolla-ansible -i <inventory> mariadb_backup

...where `<inventory>` is the path to the Kolla Ansible inventory file.

### Command Syntax for Incremental Database Backups

The command to perform an incremental backup of all databases using
Kolla Ansible is...:

    kolla-ansible -i <inventory> mariadb_backup --incremental

...where `<inventory>` is the path to the Kolla Ansible inventory file.

### Path to the Kolla Ansible Inventory File

:::info New Clouds

On clouds provisioned ***after* Dec 2022** you will need to open a 
[support ticket](../day-1/intro-to-openmetal-private-cloud.md#how-to-submit-a-support-ticket)
 to have the configuration saved to your nodes.

:::

The Kolla Ansible inventory file is located across all control plane
nodes as:

    /etc/fm-deploy/kolla-ansible-inventory

### Command Usage Example for a Full Database Backup

From the host that has Kolla Ansible prepared, the following command is
executed:

    kolla-ansible -i /etc/fm-deploy/kolla-ansible-inventory mariadb_backup

Truncated output of the above command:

    # kolla-ansible -i /etc/fm-deploy/kolla-ansible-inventory mariadb_backup
    Backup MariaDB databases : ansible-playbook -i /etc/fm-deploy/kolla-ansible-inventory -e @/etc/kolla/globals.yml  -e @/etc/kolla/passwords.yml -e CONFIG_DIR=/etc/kolla  -e kolla_action=backup -e mariadb_backup_type=full /opt/kolla-ansible/.venv/share/kolla-ansible/ansible/mariadb_backup.yml
    
    [...previous output truncated...]
    
    TASK [mariadb : Taking full database backup via Mariabackup] **************************************************************************************************
    skipping: [focused-capybara]
    skipping: [lovely-ladybug]
    [WARNING]: The value False (type bool) in a string field was converted to 'False' (type string). If this does not look like what you expect, quote the entire
    value to ensure it does not change.
    changed: [relaxed-flamingo]
    
    PLAY RECAP ****************************************************************************************************************************************************
    focused-capybara           : ok=2    changed=0    unreachable=0    failed=0    skipped=1    rescued=0    ignored=0
    lovely-ladybug             : ok=2    changed=0    unreachable=0    failed=0    skipped=1    rescued=0    ignored=0
    relaxed-flamingo           : ok=3    changed=1    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0

The task `[mariadb : Taking full database backup via Mariabackup]` is
where a backup of all OpenStack service databases is created. Kolla
Ansible creates a Docker volume called `mariadb_backup` to store the
database copies. Previous backups made using this method are not
overwritten. The host under this task that reports a change (example:
`changed=1`) is where the Docker volume storing the databases is
created.

**Note\!** -- For this example, since the Docker volume was created on
another host, the remaining instruction in this guide must be performed
from that host. If Kolla Ansible creates `mariadb_backup` on another
host, you must SSH into that host as root to continue this process.

### Command Usage Example for an Incremental Database Backup

**Note\!** -- Incremental backups can only be made if a full backup has
been made prior, otherwise the following command will result in an
error.

From the host that has Kolla Ansible prepared, the following command is
executed:

    kolla-ansible -i /etc/fm-deploy/kolla-ansible-inventory mariadb_backup \
        --incremental

Truncated output of the above command:

    # kolla-ansible -i /etc/fm-deploy/kolla-ansible-inventory mariadb_backup --incremental
    Backup MariaDB databases : ansible-playbook -i /etc/fm-deploy/kolla-ansible-inventory -e @/etc/kolla/globals.yml  -e @/etc/kolla/passwords.yml -e CONFIG_DIR=/etc/kolla  -e kolla_action=backup -e mariadb_backup_type=incremental /opt/kolla-ansible/.venv/share/kolla-ansible/ansible/mariadb_backup.yml
    
    [...previous output truncated...]
    
    TASK [mariadb : include_tasks] ****************************************************************************************************************************************************************
    included: /opt/kolla-ansible/.venv/share/kolla-ansible/ansible/roles/mariadb/tasks/backup.yml for relaxed-flamingo, focused-capybara, lovely-ladybug
    
    TASK [mariadb : Taking incremental database backup via Mariabackup] ***************************************************************************************************************************
    skipping: [focused-capybara]
    skipping: [lovely-ladybug]
    [WARNING]: The value False (type bool) in a string field was converted to 'False' (type string). If this does not look like what you expect, quote the entire value to ensure it does not
    change.
    changed: [relaxed-flamingo]
    
    PLAY RECAP ************************************************************************************************************************************************************************************
    focused-capybara           : ok=2    changed=0    unreachable=0    failed=0    skipped=1    rescued=0    ignored=0
    lovely-ladybug             : ok=2    changed=0    unreachable=0    failed=0    skipped=1    rescued=0    ignored=0
    relaxed-flamingo           : ok=3    changed=1    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0

The task `[mariadb : Taking incremental database backup via Mariabackup]` is
where an incremental backup of all OpenStack service databases is created. Kolla
Ansible creates a Docker volume called `mariadb_backup` to store the database
copies. Previous backups made using this method are not overwritten. The host
under this task that reports a change (example: `changed=1`) is where the Docker
volume storing the databases is created.

**Note\!** -- For this example, since the Docker volume was created on
another host, the remaining instruction in this guide must be performed
from that host. If Kolla Ansible creates `mariadb_backup` on another
host, you must SSH into that host as root to continue this process.

## How to Restore a Private Cloud's OpenStack Service Databases

This section explains how to restore both **full** and **incremental**
database backups created using Kolla Ansible's `mariadb_backup` function.

## Full Database Restoration Steps

Follow these steps to learn how to restore full OpenStack service
databases created using Kolla Ansible's `mariadb_backup` function.

### Full Restoration: Create Temporary Docker Container

In this section, we create a temporary Docker container called
`dbrestore`. This container is created with the same volumes as the
`mariadb` Docker container. The `mariadb_backup` Docker volume is
mounted as `/backup` in this container. Finally, the container is
created using the `kolla/centos-binary-mariadb:victoria` Docker image
available from Docker Hub with a Bash shell.

Create the temporary Docker container called `dbrestore` using:

    docker run --rm -it --volumes-from mariadb --name dbrestore \
        --volume mariadb_backup:/backup \
        kolla/centos-binary-mariadb:victoria \
        /bin/bash

Once you run the above Docker command, your terminal should appear this
way:

    ()[mysql@06ab93fb83a3 /]$

### Full Restoration: Prepare Backup Directory

**Caution\!** -- Be careful when using commands. The following commands
make use of the `rm` command which deletes files.

Next, the backup data must be prepared before it can be copied into
place.

This example uses a full MariaDB backup called
`mysqlbackup-08-12-2021-1638999340.qp.xbc.xbs.gz`.

To prepare the backup data, in the Docker container, run:

    cd /backup
    rm -rf /backup/restore
    mkdir -p /backup/restore/full
    gunzip mysqlbackup-08-12-2021-1638999340.qp.xbc.xbs.gz
    mbstream -x -C /backup/restore/full/ < mysqlbackup-08-12-2021-1638999340.qp.xbc.xbs
    mariabackup --prepare --target-dir /backup/restore/full

Load another shell session for the node in which you are working and
stop the MariaDB Docker container:

    docker stop mariadb

Navigate back to the Docker container and run:

    rm -rf /var/lib/mysql/*
    rm -rf /var/lib/mysql/\.[^\.]*
    mariabackup --copy-back --target-dir /backup/restore/full

Next, navigate back to the other shell and start the MariaDB Docker
container:

    docker start mariadb

Examine MariaDB's logs to confirm the Galera cluster has synchronized:

    # tail -1 /var/log/kolla/mariadb/mariadb.log
    2021-12-08 22:27:39 2 [Note] WSREP: Synchronized with group, ready for
    connections

## Incremental Database Restoration Steps

Follow these steps to learn how to restore an incremental OpenStack
service database backup created using Kolla Ansible's `mariadb_backup`
function.

### Incremental Restoration: Create Temporary Docker Container

In this section, we create a temporary Docker container called
`dbrestore`. This container is created with the same volumes as the
`mariadb` Docker container. The `mariadb_backup` Docker volume is
mounted as `/backup` in this container. Finally, the container is
created using the `kolla/centos-binary-mariadb:victoria` Docker image
available from Docker Hub with a Bash shell.

Create the temporary Docker container called `dbrestore` using:

    docker run --rm -it \
        --volumes-from mariadb \
        --name dbrestore \
        --volume mariadb_backup:/backup \
        kolla/centos-binary-mariadb:victoria \
        /bin/bash

Once you run the above Docker command, your terminal should appear this
way:

    ()[mysql@06ab93fb83a3 /]$

### Incremental Restoration: Prepare Backup Directory

**Caution\!** -- Be careful when using commands. The following commands
make use of the `rm` command which deletes files.

This section assumes a full and incremental backup have been created.
Note that your full and incremental backup file names will differ from
this example.

Next, we must prepare the backup data before it can be copied into
place.

In the Docker container, run:

    cd /backup/
    rm -rf /backup/restore
    mkdir -p /backup/restore/full
    mkdir -p /backup/restore/incremental
    gunzip mysqlbackup-10-12-2021-1639166052.qp.xbc.xbs.gz
    gunzip incremental-20-mysqlbackup-10-12-2021-1639169695.qp.xbc.xbs.gz
    mbstream -x -C /backup/restore/full/ < mysqlbackup-10-12-2021-1639166052.qp.xbc.xbs
    mbstream -x -C /backup/restore/incremental/ < incremental-20-mysqlbackup-10-12-2021-1639169695.qp.xbc.xbs
    mariabackup --prepare --target-dir=/backup/restore/full/
    mariabackup --prepare --target-dir=/backup/restore/full/ --incremental-dir=/backup/restore/incremental/

Load another shell session for the node in which you are working and
stop the MariaDB Docker container:

    docker stop mariadb

Navigate back to the Docker container and run:

    rm -rf /var/lib/mysql/*
    rm -rf /var/lib/mysql/\.[^/.]*
    mariabackup --copy-back --target-dir /backup/restore/full/

Next, navigate back to the other shell and start the MariaDB Docker
container:

    docker start mariadb

Examine MariaDB's logs to confirm the Galera cluster has synchronized:

    # tail -1 /var/log/kolla/mariadb/mariadb.log
    2021-12-08 22:27:39 2 [Note] WSREP: Synchronized with group, ready for
    connections

## References

- Kolla Ansible's [MariaDB database backup and restore](https://docs.openstack.org/kolla-ansible/victoria/admin/mariadb-backup-and-restore.html)
- MariaDB's [Full Backup and Restore with Mariabackup](https://mariadb.com/kb/en/full-backup-and-restore-with-mariabackup/)
- MariaDB's [Incremental Backup and Restore with Mariabackup](https://mariadb.com/kb/en/incremental-backup-and-restore-with-mariabackup/)
