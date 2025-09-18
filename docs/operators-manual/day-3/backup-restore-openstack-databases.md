---
sidebar_position: 5
---
# Backup and Restore OpenStack Service Databases

Kolla Ansible provides a utility to create copies of all OpenStack
service databases, called `mariadb_backup`. In this section, we explain
how to use Kolla Ansible's builtin function to create database backups
of a Private Cloud's OpenStack services.

## Prerequisites

Before proceeding with this guide, a Kolla Ansible environment needs to be
prepared. For information about preparing a Kolla Ansible environment, see [How
to Prepare and Use Kolla Ansible](../day-4/kolla-ansible/prepare-kolla-ansible).
Once the environment is prepared, come back to this guide to learn how to create
database backups of OpenStack services.

## How to Create OpenStack Service Database Backups

The following instruction must be performed from the folder in which you
have prepared Kolla Ansible. This section first provides the command
syntax, then follows up with an example of the command's execution and
output. Note that Kolla Ansible has no way to schedule backups.

### Create a Full Database Backup with Kolla Ansible

From the host that has Kolla Ansible prepared, the following command is
executed:

    kolla-ansible \
        -i /opt/kolla-ansible-cli/inventory.yml \
        -i /opt/kolla-ansible-cli/ansible/inventory/multinode \
        mariadb_backup

Truncated output of the above command:

    Backup MariaDB databases : ansible-playbook -e @/etc/kolla/globals.yml  -e @/etc/kolla/globals.d/custom-globals.yml -e @/etc/kolla/passwords.yml -e CONFIG_DIR=/etc/kolla  -e kolla_action=backup -e mariadb_backup_type=full /opt/kolla-ansible-cli/.venv/share/kolla-ansible/ansible/mariadb_backup.yml  --inventory inventory.yml --inventory ansible/inventory/multinode
    
    PLAY [Backup MariaDB] ***********************************************************************************************************************************************************************
    
    [...output truncated...]
    
    TASK [mariadb : Taking full database backup via Mariabackup] ********************************************************************************************************************************
    skipping: [encouraging-bobcat.local]
    skipping: [hardcore-rodent.local]
    changed: [comfortable-lark.local]
    
    PLAY RECAP **********************************************************************************************************************************************************************************
    comfortable-lark.local     : ok=5    changed=1    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
    encouraging-bobcat.local   : ok=3    changed=0    unreachable=0    failed=0    skipped=1    rescued=0    ignored=0
    hardcore-rodent.local      : ok=3    changed=0    unreachable=0    failed=0    skipped=1    rescued=0    ignored=0

The task `[mariadb : Taking full database backup via Mariabackup]` is
where a backup of all OpenStack service databases is created. Kolla
Ansible creates a Docker volume called `mariadb_backup` to store the
database copies. Previous backups made using this method are not
overwritten. The host under this task that reports a change (example:
`changed=1`) is where the Docker volume storing the databases is
created.

> **Note**: For this example, since the Docker volume was created on
another host, the remaining instruction in this guide must be performed
from that host. If Kolla Ansible creates `mariadb_backup` on another
host, you must SSH into that host as root to continue this process.

### Create an Incremental Database Backup with Kolla Ansible

> **Note**: Incremental backups can only be made if a full backup has
been made prior, otherwise the following command will result in an
error.

From the host that has Kolla Ansible prepared, the following command is
executed:

    kolla-ansible \
        -i /opt/kolla-ansible-cli/inventory.yml \
        -i /opt/kolla-ansible-cli/ansible/inventory/multinode \
        mariadb_backup \
        --incremental

Truncated output of the above command:

    Backup MariaDB databases : ansible-playbook -e @/etc/kolla/globals.yml  -e @/etc/kolla/globals.d/custom-globals.yml -e @/etc/kolla/passwords.yml -e CONFIG_DIR=/etc/kolla  -e kolla_action=backup -e mariadb_backup_type=incremental /opt/kolla-ansible-cli/.venv/share/kolla-ansible/ansible/mariadb_backup.yml  --inventory inventory.yml --inventory ansible/inventory/multinode
    [WARNING]: Invalid characters were found in group names but not replaced, use -vvvv to see details
    
    PLAY [Backup MariaDB] ***********************************************************************************************************************************************************************
   
    [...output truncated...]

    TASK [mariadb : Taking incremental database backup via Mariabackup] *************************************************************************************************************************
    skipping: [encouraging-bobcat.local]
    skipping: [hardcore-rodent.local]
    changed: [comfortable-lark.local]
    
    PLAY RECAP **********************************************************************************************************************************************************************************
    comfortable-lark.local     : ok=5    changed=1    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
    encouraging-bobcat.local   : ok=3    changed=0    unreachable=0    failed=0    skipped=1    rescued=0    ignored=0
    hardcore-rodent.local      : ok=3    changed=0    unreachable=0    failed=0    skipped=1    rescued=0    ignored=0

The task `[mariadb : Taking incremental database backup via Mariabackup]` is
where an incremental backup of all OpenStack service databases is created. Kolla
Ansible creates a Docker volume called `mariadb_backup` to store the database
copies. Previous backups made using this method are not overwritten. The host
under this task that reports a change (example: `changed=1`) is where the Docker
volume storing the databases is created.

> **Note**: For this example, since the Docker volume was created on
another host, the remaining instruction in this guide must be performed
from that host. If Kolla Ansible creates `mariadb_backup` on another
host, you must SSH into that host as root to continue this process.

## How to Restore a Private Cloud's OpenStack Service Databases

This section explains how to restore both **full** and **incremental**
database backups created using Kolla Ansible's `mariadb_backup` function.

### Full Database Backup Restoration

Follow these steps to restore a full MariaDB database backup of OpenStack
service databases.

> **Note**: Make sure you run these commands from the host that contains the
`mariadb_backup` Docker volume. The `mariadb_backup` Kolla Ansible command ran
earlier outputs the host where this volume was created. Run `docker volume ls |
grep mariadb_backup` to check.

#### Steps

**1.** In this section, we create a temporary Docker container called
*`dbrestore`. This
container is created with the same volumes as the `mariadb` Docker container.
The `mariadb_backup` Docker volume is mounted as `/backup` in this container.
Finally, the container is created using the
`registry.flexmetal.net/kolla/centos-source-mariadb-server:yoga` Docker image
available from our registry.

Create the temporary Docker container called `dbrestore` using:

    docker run \
        --rm -it \
        --volumes-from mariadb \
        --name dbrestore \
        --volume mariadb_backup:/backup \
        registry.flexmetal.net/kolla/centos-source-mariadb-server:yoga \
        /bin/bash

Once you run the above Docker command, your terminal should appear this
way:

    ()[mysql@312d0cd3edbe /]$

**2.** Next, the backup data must be prepared before it can be copied into
 place. This
example uses a full MariaDB backup called
`mysqlbackup-29-08-2025-1756478084.qp.xbc.xbs.gz`.

To prepare the backup data, in the Docker container, run:

    cd /backup/
    rm -rf /backup/restore
    mkdir -p /backup/restore/full
    gunzip mysqlbackup-29-08-2025-1756478084.qp.xbc.xbs.gz
    mbstream -x -C /backup/restore/full/ < mysqlbackup-29-08-2025-1756478084.qp.xbc.xbs
    mariabackup --prepare --target-dir /backup/restore/full

**3.** With Kolla Ansible, stop the MariaDB service:

    kolla-ansible \
        -i inventory.yml \
        -i ansible/inventory/multinode \
        stop \
        --tags mariadb \
        --yes-i-really-really-mean-it

**4.** Navigate back to the Docker container and run:

    rm -rf /var/lib/mysql/*
    rm -rf /var/lib/mysql/\.[^\.]*
    mariabackup --copy-back --target-dir /backup/restore/full

**5.** Next, with Kolla Ansible run MariaDB recovery while specifying the host from
which the database backup was restored:

    kolla-ansible \
        -i /opt/kolla-ansible-cli/inventory.yml \
        -i /opt/kolla-ansible-cli/ansible/inventory/multinode \
        mariadb_recovery \
        -e mariadb_recover_inventory_name=comfortable-lark.local

Examine MariaDB's logs to confirm the Galera cluster has synchronized:

    # less /var/log/kolla/mariadb/mariadb.log
    2025-08-29 15:12:13 0 [Note] WSREP: Shifting JOINED -> SYNCED (TO: 132)
    2025-08-29 15:12:13 2 [Note] WSREP: Server comfortable-lark synced with group
    2025-08-29 15:12:13 2 [Note] WSREP: Server status change joined -> synced
    2025-08-29 15:12:13 2 [Note] WSREP: Synchronized with group, ready for connections

### Incremental Database Restoration

Follow these steps to learn how to restore an incremental OpenStack
service database backup created using Kolla Ansible's `mariadb_backup`
function.

> **Note**: Make sure you run these commands from the host that contains the
`mariadb_backup` Docker volume. The `mariadb_backup` Kolla Ansible command ran
earlier outputs the host where this volume was created. Run `docker volume ls |
grep mariadb_backup` to check.

#### Steps

**1.** In this section, we create a temporary Docker container called
*`dbrestore`. This
container is created with the same volumes as the `mariadb` Docker container.
The `mariadb_backup` Docker volume is mounted as `/backup` in this container.
Finally, the container is created using the
`registry.flexmetal.net/kolla/centos-source-mariadb-server:yoga` Docker image
available from Docker Hub with a Bash shell.

Create the temporary Docker container called `dbrestore` using:

    docker run --rm -it \
        --volumes-from mariadb \
        --name dbrestore \
        --volume mariadb_backup:/backup \
        registry.flexmetal.net/kolla/centos-source-mariadb-server:yoga \
        /bin/bash

Once you run the above Docker command, your terminal should appear this
way:

    ()[mysql@fe16a3c81311 /]$

**2.** Next, we must prepare the backup data before it can be copied into
place.

> **Note**: This section assumes a full and incremental backup have been created.
The full and incremental backup file names will differ from this example.

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

**3.** With Kolla Ansible, stop the MariaDB service:

    kolla-ansible \
        -i /opt/kolla-ansible-cli/inventory.yml \
        -i /opt/kolla-ansible-cli/ansible/inventory/multinode \
        stop \
        --tags mariadb \
        --yes-i-really-really-mean-it

**4.** Navigate back to the `dbrestore` Docker container and run:

    rm -rf /var/lib/mysql/*
    rm -rf /var/lib/mysql/\.[^/.]*
    mariabackup --copy-back --target-dir /backup/restore/full/

**5.** Next, with Kolla Ansible run MariaDB recovery while specifying the host from
which the database backup was restored:

    kolla-ansible \
        -i /opt/kolla-ansible-cli/inventory.yml \
        -i /opt/kolla-ansible-cli/ansible/inventory/multinode \
        mariadb_recovery \
        -e mariadb_recover_inventory_name=comfortable-lark.local

Examine MariaDB's logs to confirm the Galera cluster has synchronized:

    # less /var/log/kolla/mariadb/mariadb.log
    2025-08-29 16:55:41 0 [Note] WSREP: Shifting JOINED -> SYNCED (TO: 128)
    2025-08-29 16:55:41 6 [Note] WSREP: Server comfortable-lark synced with group
    2025-08-29 16:55:41 6 [Note] WSREP: Server status change joined -> synced
    2025-08-29 16:55:41 6 [Note] WSREP: Synchronized with group, ready for connections

## References

- Kolla Ansible's [MariaDB database backup and restore](https://docs.openstack.org/kolla-ansible/2023.2/admin/mariadb-backup-and-restore.html)
- MariaDB's [Full Backup and Restore with Mariabackup](https://mariadb.com/kb/en/full-backup-and-restore-with-mariabackup/)
- MariaDB's [Incremental Backup and Restore with Mariabackup](https://mariadb.com/kb/en/incremental-backup-and-restore-with-mariabackup/)
