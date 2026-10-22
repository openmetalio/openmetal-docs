---
sidebar_position: 1
---
# Troubleshooting RabbitMQ

## Introduction

RabbitMQ is the central messaging system used by your Private Cloud,
allowing all OpenStack services to communicate with one another. Should
there be an issue with this communication chain, your cloud may not
function as expected. If requests in the dashboard are not completing as
before, or seem to get stuck, you may have an issue with RabbitMQ. In
this guide, we explain symptoms of a RabbitMQ issue and generally how to
address them.

## Prerequisites

This guide requires root access over SSH to your Private Cloud's control
plane nodes. You should be comfortable using the command line when
troubleshooting RabbitMQ.

## Symptoms of a RabbitMQ Problem

Actions hang in the dashboard or when using OpenStackClient. For example when
an instance is created but never completes, you may have an issue with
RabbitMQ. Additionally, say you try to delete something in the dashboard, but
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
    ipsec_driver.suspicious-spoonbill.local 0       3
    scheduler_fanout_pedantic-piranha.local:nova-scheduler:7 0       1
    reply_pedantic-piranha.local:nova-compute:1     0       1
    q-plugin.suspicious-spoonbill.local     0       3
    engine_worker_fanout_suspicious-spoonbill.local:heat-engine:9    0       1
    cinder-volume.suspicious-spoonbill.local@rbd-1.suspicious-spoonbill.local        0       1
    reply_suspicious-spoonbill.local:nova-conductor:6        0       1
    mistral_event_engine.192.168.3.5        0       1
    heat-engine-listener.8c2c593e-97da-4b09-933b-1e634e609dab        0       1
    heat-engine-listener.23c7a798-27ff-4c54-baea-81d068cef57e        0       1
    engine_worker   0       15
    cinder-backup   0       3
    heat-engine-listener_fanout_pedantic-piranha.local:heat-engine:1 0       1
    q-plugin_fanout_suspicious-spoonbill.local:neutron-rpc-server:1  0       1
    mistral_engine_fanout_suspicious-spoonbill.local:mistral-server:1        0       1
    q-reports-plugin_fanout_suspicious-spoonbill.local:neutron-rpc-server:8  0       1
    mistral_engine  0       3

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
Ansible](redeploy-rabbitmq).
