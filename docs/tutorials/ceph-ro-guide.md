---
title: "How to Handle a Ceph Cluster Going Read-Only Due to Full OSDs"
slug: ceph-ro-guide
description: "Step-by-step guide to troubleshoot and fix Ceph clusters that enter read-only mode due to full OSDs."
tags:
  - ceph
  - storage
  - troubleshooting
---
In a Ceph cluster, storage capacity reaching critical thresholds can cause the cluster to enter a read-only (RO) state. This typically occurs when OSDs exceed the `full-ratio` limit, which is set to `0.95` (95%) by default. Once this threshold is crossed, Ceph blocks write operations to prevent potential data corruption or inconsistency. While this is a protective measure, it can bring production workloads to a halt if it happens unexpectedly.

## Prerequisites
* [Access to your hardware nodes.](https://openmetal.io/docs/manuals/openmetal-central/how-to-add-ssh-keys-in-openmetal-central)

Because critical operations will take place on your **physical servers**, make sure you have SSH access.

## What to Do When Ceph Goes RO

When this happens, you have two immediate options (run these from your physical nodes):
### 1. Temporarily increase the full-ratio (safer option)

```bash
ceph osd set-full-ratio 0.97
```
This gives you a buffer to delete unnecessary data or snapshots and restore normal operations.

### 2. Reduce the replication factor
```bash
ceph osd pool set images size 2
```
This changes the replication factor **only for the `images` pool**, reducing it from 3 replicas to 2. It can free up space for that specific pool.

:::danger
**Important:** The number of replicas includes the object itself, [see the docs](https://docs.ceph.com/en/mimic/rados/operations/pools/#set-the-number-of-object-replicas).
:::
:::danger
Only use this in non-production or emergency scenarios, as it compromises data durability.
:::


After applying either change, Ceph will lift the write block and move out of RO mode.
In some cases, you may need to restart affected instances if operating systems or applications don't handle the transition well. [This guide](https://openmetal.io/docs/manuals/tutorials/recoveraninstance) can help if that happens.
## Post-Recovery Cleanup Steps

Once the cluster is writable again, **it's crucial to act quickly**. The primary goal is to reduce OSD usage **below critical thresholds**. Ideally, bring OSD **usage below 80%**, or at least under 85%, to prevent another full state.

**Focus on:**
* **Deleting unused volumes and snapshots**
* **Cleaning up abandoned or temporary data**
* **Working with application teams to offload unnecessary storage**

Use `ceph osd df` to monitor usage and `ceph -s` to check for any remaining health warnings during cleanup. [This article](https://openmetal.io/docs/manuals/operators-manual/day-2/check-ceph-status-disk-usage#check-ceph-status) provides additional information.

## Real-World Example: A Ceph Cluster Hitting RO State

In this example, a Ceph cluster entered a **read-only (RO)** state due to one or more OSDs crossing the `full-ratio` threshold (default: 0.95). The issue was identified and mitigated by temporarily increasing the full-ratio, but not without immediate cleanup requirements.

### 1. OSDs Approaching or Exceeding 95% Usage

```bash
[root@shiny-jacana ~]# ceph osd df
ID  CLASS  WEIGHT   REWEIGHT  SIZE     RAW USE  DATA     OMAP      META     AVAIL    %USE   VAR   PGS  STATUS
 1    ssd  2.91100   1.00000  2.9 TiB  2.8 TiB  2.8 TiB   721 KiB  5.5 GiB  149 GiB  95.01  1.01  135      up
 4    ssd  2.91100   1.00000  2.9 TiB  2.7 TiB  2.7 TiB   333 KiB  5.2 GiB  166 GiB  94.43  1.01  134      up
 9    ssd  2.91089   1.00000  2.9 TiB  2.8 TiB  2.7 TiB   572 KiB  5.6 GiB  163 GiB  94.53  1.01  129      up
12    ssd  2.91089   1.00000  2.9 TiB  2.8 TiB  2.8 TiB   729 KiB  5.7 GiB  157 GiB  94.72  1.01  130      up
15    ssd  2.91089   1.00000  2.9 TiB  2.7 TiB  2.7 TiB   998 KiB  5.6 GiB  169 GiB  94.35  1.01  126      up
18    ssd  2.91089   1.00000  2.9 TiB  2.7 TiB  2.7 TiB   474 KiB  5.7 GiB  198 GiB  93.35  1.00  126      up
```

The first OSD (`ID 1`) has crossed the critical **95% usage threshold**, which caused Ceph to enter a read-only state to prevent data loss or corruption.

### 2. Inspecting Cluster-Wide Usage
Next, we ran `ceph df` to assess space usage across pools:
```bash
[root@shiny-jacana ~]# ceph df
--- RAW STORAGE ---
CLASS     SIZE    AVAIL     USED  RAW USED  %RAW USED
ssd    140 TiB  8.7 TiB  131 TiB   131 TiB      93.74

--- POOLS ---
POOL        ID   PGS   STORED  OBJECTS     USED  %USED  MAX AVAIL
volumes      3  2048   65 TiB   17.09M  129 TiB  97.90    1.4 TiB
images       2   512  193 GiB   24.79k  385 GiB  11.92    1.4 TiB
vms          4    64   60 GiB   15.46k  120 GiB   4.05    1.4 TiB
```
The `volumes` pool is using almost 98% of its quota, indicating that it’s the main driver of OSD saturation.

### 3. Mitigating the RO State

```bash
[root@shiny-jacana ~]# ceph osd set-full-ratio 0.97
osd set-full-ratio 0.97
```
This allowed the cluster to resume write operations. Keep in mind, **this is only a temporary solution**. The underlying issue **lack of space** still needs to be resolved.

## How to Prevent This in the Future

* **Set up proactive monitoring** and use tools like DataDog to alert when OSD usage hits 80% or more. [See this article](https://openmetal.io/docs/manuals/openmetal-central/enable-datadog-monitoring) to enable Datadog Cloud Monitoring in [OpenMetal Central](https://openmetal.io/platform/openmetal-central-cloud-portal/).
* **Automate snapshot cleanup** by implementing periodic audits for unused volumes and snapshots.
* **Plan capacity with headroom** and avoid running clusters above 80–85% usage for extended periods.
* **Scale out before you're at risk**. If usage trends consistently high, add more OSDs or expand storage.

:::tip
Need to remove stuck images? Check out this [Ceph cleanup guide](https://openmetal.io/docs/manuals/tutorials/ceph-dependencies) to break parent-child dependencies and clear them out.
:::

## In Summary

When Ceph enters a read-only state due to full OSDs, quick and informed action is essential. Temporarily adjusting the 'full-ratio' buys time, but it’s not a long-term fix. Clean up storage immediately and make sure you have monitoring and capacity planning in place to avoid recurrence. The earlier you respond to rising usage, the less disruptive the recovery will be.
