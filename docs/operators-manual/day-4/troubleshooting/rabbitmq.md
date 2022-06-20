# Troubleshooting RabbitMQ

## Introduction

RabbitMQ is the central messaging system used by your Private Cloud,
allowing all OpenStack services to communicate with one another. Should
there be an issue with this communication chain, your cloud may not
function as expected. If requests in Horizon are not completing as
before, or seem to get stuck, you may have an issue with RabbitMQ. In
this guide, we explain symptoms of a RabbitMQ issue and generally how to
address them.

## Table of Contents

1.  [Prerequisites](operators_manual/day-4/troubleshooting/rabbitmq#prerequisites)
2.  [Symptoms of a RabbitMQ
    Problem](operators_manual/day-4/troubleshooting/rabbitmq#symptoms-of-a-rabbitmq-problem)
3.  [How Check your RabbitMQ Cluster's
    Status](operators_manual/day-4/troubleshooting/rabbitmq#how-check-your-rabbitmq-cluster-s-status)
4.  [List RabbitMQ
    Queues](operators_manual/day-4/troubleshooting/rabbitmq#list-rabbitmq-queues)
5.  [Addressing Network
    Partitions](operators_manual/day-4/troubleshooting/rabbitmq#addressing-network-partitions)
6.  [Redeploy RabbitMQ
    Cluster](operators_manual/day-4/kolla-ansible/redeploy-rabbitmq#redeploy-rabbitmq-cluster)

## Prerequisites

This guide requires root access over SSH to your Private Cloud's control
plane nodes. You should be comfortable using the command line when
troubleshooting RabbitMQ.

## Symptoms of a RabbitMQ Problem

Actions hang in Horizon or when using OpenStackClient. For example when
an instance is created but never completes, you may have an issue with
RabbitMQ. Additionally, say you try to delete something in Horizon, but
the item hangs indefinitely and is never actually deleted. This
indicates a probable issue with RabbitMQ.

## How Check your RabbitMQ Cluster's Status

The command `rabbitmqctl cluster_status` is used to report the status of
your cloud's RabbitMQ cluster. This is a quick way to determine the
health of the RabbitMQ cluster.

RabbitMQ is deployed into Docker containers which changes the way you
interact with the cluster. To check the status of your cloud's RabbitMQ
cluster, from a control plane node as root, execute:

    docker exec -it rabbitmq rabbitmqctl cluster_status

## List RabbitMQ Queues

List queue name, current count of queued messages, and count of messages
consumed for a private cloud's RabbitMQ cluster and put the output into
a table:

    docker exec -it rabbitmq rabbitmqctl list_queues -p / name messages consumers --formatter pretty_table

For example, listing the first few queues:

    # docker exec -it rabbitmq rabbitmqctl list_queues -p / name messages consumers | head -20
    Timeout: 60.0 seconds ...
    Listing queues for vhost / ...
    name    messages        consumers
    heat-engine-listener_fanout_7025924940fc4f11b89ed31afe5a642c    0       1
    scheduler_fanout_257bb53015e3478db4c7c36236923300       0       1
    reply_7c1ef96102e643a8bd8827f7191cf4cc  0       1
    reply_742233f6bbbb47e196d53e834dffd912  0       0
    heat-engine-listener.7b6e3335-0745-4c38-a78c-93eca7f9b336       0       0
    watcher.applier.control_fanout_97961841bc9e4304b1dbfe6da039ee0c 0       1
    reply_733a0bc0a2e248aea9c307d2dbb6b88b  0       1
    neutron-vo-SecurityGroupRule-1.0_fanout_a6dad4171bb94d0aa97ae30b218b779a        0       1
    engine_fanout_917e9c14d41d4d69be11122b1bd28485  0       1
    reply_b9fa7b24616f40eb9be6e4cb70ebd9d2  0       0
    q-l3-plugin_fanout_190b34d25d7444ecb3d901abb971f93f     0       1
    reply_849a66b5d7e74d099d89ed842832a7ae  0       1
    magnum-conductor.reobzilz72y4   0       0
    magnum-conductor_fanout_97e11c7c5ebc46fabfe57adf45a05b11        0       1
    reply_faad7408773c4e7ebbaa9abfb9c0534a  0       1
    cinder-volume.lovely-ladybug.local@rbd-1_fanout_1d3ef02f49f148618fcb36163687b9cd        0       1
    engine_fanout_28b15b87d3ec4541b0d7731b928f6852  0       1

## RabbitMQ and Network Partitions

Although uncommon with a stable cloud platform, with RabbitMQ, it is
possible for the cluster to go into a **Network Partition**. To better
understand and resolve these types of issues, see RabbitMQ's [Clustering
and Network Paritions](https://www.rabbitmq.com/partitions.html) guide.

## Redeploy RabbitMQ Cluster

In worst case scenarios it is possible to redeploy your cloud's RabbitMQ
cluster. This tends to be a last resort effort to get RabbitMQ
functioning again. Kolla Ansible is used to redeploy a cloud's RabbitMQ
cluster. For more, see [How to Redeploy RabbitMQ Cluster using Kolla
Ansible](operators_manual/day-4/kolla-ansible/redeploy-rabbitmq).
