---
slug: /engineers-notes/cloud101-cloud-storage
description: "Cloud 101: Cloud Storage Options"
---

# Cloud 101: Cloud Storage Options

As more and more businesses move their operations to the cloud, choosing the
right storage option has become increasingly important. In this guide, we'll
cover the basics of cloud storage, including the different types of storage
available, such as volume and image-based storage.

We'll also dive into data redundancy, which is essential for ensuring that your
data is always available and protected. We'll discuss replication, which
involves making multiple copies of your data to guard against data loss. We'll
compare replication 2 versus 3, and explain the benefits of each.

Finally, we'll discuss erasure coding, which is an advanced technique for
ensuring data redundancy and protection. This guide is geared towards beginner
and intermediate level engineers who want to understand the different cloud
storage options available and how to choose the right one for their organization

## Volume and Image Storage

For those who are new to cloud storage, it's important to understand the
difference between volume and image storage. Volume storage is used for storing
data that needs to be accessed frequently, such as databases and application
data. Image storage, on the other hand, is used for storing virtual machine
images and other static data that doesn't change often. For most use-cases this
will hold true, but for workloads that need more performance, image-base storage
might be the best choice.

### NVMe Drives and High IOPS Workloads

When comparing block storage volumes and direct-attached image storage in a
cloud computing environment, several factors should be taken into account, such
as speed, reliability, live migrations, and more. Here's an overview of the
benefits and trade-offs of using block storage volumes versus direct-attached
image storage when using flash-based NVMe:

|  | Block Storage Volumes | Direct-Attached Image Storage |
|---|---|---|
| **Speed** | Can provide high performance, especially when using NVMe drives, which are optimized for low-latency and high-throughput access. However, they may experience some performance overhead due to network latency and the storage controller, compared to direct-attached image storage. | Can offer better performance, as it eliminates the network latency and storage controller overhead associated with block storage volumes. NVMe drives, in particular, can provide ultra-low latency and high-speed access to data. |
| **Reliability** | Typically more reliable as they are managed by the cloud provider, offering built-in redundancy and data replication. This ensures data durability and availability even in the case of hardware failures. | Reliability for direct-attached image storage depends on the hardware and implementation. Generally, it is less reliable than block storage volumes, as redundancy and data replication are not inherently provided, unless specifically configured. |
| **Live Migrations** | More flexible during live migrations, as they can be easily detached from one instance and attached to another. This makes it simpler to perform maintenance or scale resources without significant downtime. | Can be more complex, as the data is tightly coupled with the instance. This can lead to longer downtimes and a more challenging migration process. |
| **Scalability** | Usually more scalable since they can be resized independently of the instances, allowing users to add or remove storage capacity on demand. | Less scalable, as resizing the storage capacity typically requires resizing the instance itself or adding additional drives, which can be more time-consuming and disruptive. |

Overall, block storage volumes are generally more reliable, flexible, and
scalable, making them suitable for various cloud computing scenarios. On the
other hand, direct-attached image storage can offer better performance and is a
good option for performance-sensitive workloads. The choice between the two
should be based on the specific requirements and priorities of your cloud environment.

## Ceph Data Resiliency

Ceph provides data resiliency through replication and erasure coding.
Replication involves making multiple copies of your data and storing them on
different nodes to protect against data loss. Ceph allows for replica 2 or
replica 3, providing varying levels of redundancy.

Erasure coding is an advanced technique that distributes data across multiple
nodes and uses mathematical algorithms to create additional data chunks, which
are stored on other nodes. This technique provides greater data protection with
less storage overhead than traditional replication.

### Replication

The primary factors to consider when choosing between a replica 2 and a replica
3 configuration are performance, efficiency, and resiliency.

|  | Replica 2 | Replica 3 |
|---|---|---|
| **Performance** | In general, it will have better write performance than a replica 3, as data only needs to be written to two storage nodes, reducing the latency associated with data replication. | May have slightly slower write performance than replica 2 due to the additional overhead of replicating data to a third storage node. Read performance, however, can be improved as the system can tolerate more simultaneous node failures without impacting data availability. |
| **Efficiency** | Uses less storage space compared to replica 3, as it only creates one additional copy of the data. This results in lower storage overhead, making it more cost-effective. | While providing better data protection, it consumes more storage resources, as each piece of data is stored three times. This increases storage overhead and can be more costly. |
| **Resiliency** | While it provides redundancy, it is less resilient than replica 3. With only one additional copy of the data, the failure of two storage nodes simultaneously can result in data loss. | Offers higher resiliency compared to replica 2. With two additional copies of the data, the system can tolerate the failure of up to two storage nodes without losing any data, making it more suitable for scenarios where data durability and availability are critical. |

A replica 2 configuration might be more suitable for situations where storage efficiency
and write performance are prioritized, while replica 3 is preferable for scenarios
where data resiliency and higher fault tolerance are essential. The choice between
replica 2 and replica 3 should be carefully considered based on the specific needs
and priorities of your storage environment.

### Erasure Coding

Erasure coding is an advanced technique that Ceph uses to protect data with less
storage overhead than traditional replication. With erasure coding, data is divided
into multiple chunks, and then additional chunks are created using mathematical
algorithms. These additional chunks, called parity chunks, are distributed to other
storage nodes in the cluster.

When a data loss event occurs, the missing data can be reconstructed from the remaining
chunks and parity chunks. The number of chunks that can be lost without data loss
depends on the chosen erasure code, which is a configurable parameter that determines
the level of redundancy and data protection desired.

In Ceph, erasure coding profiles are typically denoted as k+m, where k is the number
of data chunks and m is the number of parity chunks. Some of the most common erasure
coding profiles used in Ceph are:

- **EC 2+1** - This profile generates one parity chunk for every two data chunks,
  resulting in a total of three chunks. This profile can tolerate the loss of a
  single chunk without data loss.
- **EC 4+2** - This profile generates two parity chunks for every four data chunks,
  resulting in a total of six chunks. This profile can tolerate the loss of up to
  two chunks without data loss.
- **EC 8+3** - This profile generates three parity chunks for every eight data chunks,
  resulting in a total of eleven chunks. This profile can tolerate the loss of up
  to three chunks without data loss.
- **EC 16+4** - This profile generates four parity chunks for every sixteen data
  chunks, resulting in a total of twenty chunks. This profile can tolerate the loss
  of up to four chunks without data loss.

Erasure coding is ideal for large-scale deployments where storage efficiency is
critical, and the loss of a single storage node or drive is expected. However, erasure
coding requires additional processing power, so it may not be the best choice for
smaller, low-compute clusters.
