---
id: remove-osd-drives
slug: /tutorials/ceph-remove-osd
title: Removing OSD Drives from a Ceph Reef Cluster
sidebar_label: Safely Removing OSD Drives
description: >
  Prerequisites, safety checks, and step-by-step procedures for safely
  decommissioning OSD drives from a Ceph Reef cluster managed by cephadm
  and ceph orch.
---

Author: Ramon Grullon

This guide covers how to safely remove one or more OSD drives from a
**Ceph Reef** cluster managed by `cephadm` and `ceph orch`. Following
these steps helps prevent data loss, avoids triggering nearfull
thresholds, and ensures the cluster can fully recover before the
physical drive is pulled.

---

## Prerequisites

Before beginning an OSD removal, confirm all of the following:

### Cluster Health

- The cluster must be in **`HEALTH_OK`** or at most **`HEALTH_WARN`**
  with no active recovery or backfill in progress.

  ```bash
  ceph -s
  ceph health detail
  ```

  Do not proceed if you see any of the following active states in `ceph -s`:

  - `recovering`
  - `backfilling`
  - `degraded`
  - `incomplete`
  - `stale`

### Available Capacity

- Confirm the cluster has **enough free space** to absorb all PGs
  currently hosted on the target OSD after it is removed. As a rule of
  thumb, available capacity should be at least as large as the data
  hosted on the OSD being removed.

  ```bash
  ceph osd df tree
  ceph df detail
  ```

  :::warning
  Removing an OSD when the cluster is at or near its `nearfull` ratio
  (default 85%) can cause writes to be blocked or OSDs to be marked
  full during backfill. Confirm `nearfull` and `full` thresholds before
  proceeding.

:::

```bash
  ceph osd dump | grep -E "full_ratio|nearfull_ratio|backfillfull_ratio"
```

### Replication and Erasure Coding

- For replicated pools, the cluster must have **at least as many active
  OSDs as the pool's `size`** after the removal. Removing an OSD that
  would drop below `min_size` will cause I/O to pause for affected PGs.

  ```bash
  ceph osd pool ls detail | grep -E "pool|size|min_size"
  ```

- For erasure-coded pools, verify the removal does not violate the EC
  profile's minimum chunk requirements (`k` + `m` OSDs must remain
  available).

### Cephadm and Ceph orch Availability

- Confirm `ceph-mgr` and `ceph orch` are healthy and that `cephadm`
  can reach the target host:

  ```bash
  ceph mgr stat
  ceph orch host ls
  ceph orch status
  ```

### OSD ID and Device Mapping

- Know the exact OSD ID(s) and physical device path(s) you intend to
  remove:

  ```bash
  ceph osd tree
  ceph orch device ls <hostname>
  ```

---

## Safety Warnings

:::danger Do Not Hot-Pull Without Completing the Drain
Physically removing a drive before the OSD has been fully drained and
decommissioned will cause **data loss** if PGs were not fully migrated.
Always complete the full drain and removal workflow before touching the
hardware.
:::

:::warning Avoid Removing Multiple OSDs Simultaneously
Removing more than one OSD at a time multiplies recovery load and
increases the risk of hitting `nearfull` or `full` thresholds
mid-recovery. Remove and confirm recovery for one OSD at a time unless
you have confirmed sufficient headroom.
:::

:::warning noout Flag Side Effects
Setting `noout` prevents OSDs from being marked out when they go down,
which is useful during maintenance. However, leaving `noout` set
permanently masks real failures. Always unset it after maintenance is
complete.
:::

:::note cephadm Will Attempt to Redeploy
Because `ceph orch` manages the OSD lifecycle, simply stopping an OSD
service is not sufficient — `cephadm` will redeploy it. You **must**
use `ceph orch osd rm` (not manual service stops) to properly
decommission an OSD.
:::

---

## Removal Procedure

### Step 1: Set noout Flag

Setting `noout` prevents PGs from being immediately re-replicated while
you work, reducing unnecessary backfill load.

```bash
ceph osd set noout
```

Verify it is set:

```bash
ceph osd dump | grep noout
```

> **Remember to unset this flag when you are done.**
> Leaving it set will hide real OSD failures.

---

### Step 2: Identify the Target OSD

Find the OSD ID corresponding to the drive you want to remove.

```bash
ceph osd tree
ceph orch ps --daemon-type osd | grep <hostname>
```

Note the OSD ID (e.g., `osd.5`) and confirm it maps to the expected
physical device:

```bash
ceph osd metadata <osd-id> | grep -E "hostname|devices|bluefs_dedicated_db|bluestore_bdev_path"
ls -la /dev/disk/by-id/ | grep nvme | grep -v part
```

---

### Step 3: Initiate the OSD Removal via Ceph orchestrator

Use `ceph orch osd rm` to safely drain and decommission the OSD. This
command marks the OSD out, waits for all PGs to migrate away, then
removes the OSD daemon and optionally zaps the device.

```bash
ceph orch osd rm <osd-id>
```

---

### Step 4: Monitor the Drain

The OSD will be marked **out** and PGs will begin migrating. Monitor
progress:

```bash
# Watch OSD removal status
ceph orch osd rm status

# Watch PG migration
watch ceph -s

# Check the specific OSD's PG count
ceph pg ls-by-osd <osd-id> | wc -l
```

Wait until `ceph orch osd rm status` shows no pending removals **and**
`ceph -s` returns to `HEALTH_OK` before proceeding.

:::warning
Do not proceed to the next step until PG migration is complete.
`ceph -s` must show 0 degraded or misplaced PGs, and the OSD's
PG count must reach 0.
:::

---

### Step 5: Confirm the OSD Is Fully Removed

Verify the OSD no longer appears in the OSD tree or daemon list:

```bash
ceph osd tree
ceph orch ps --daemon-type osd | grep <hostname>
```

```bash
ceph osd ls
ceph osd dump | grep destroyed
```

---

### Step 6: Zap Drive and Pause Orchestrator  

Zap wipes all data structures that identify the device as a Ceph OSD to both
the OS and the Ceph orchestrator.

```bash
ceph orch device zap <hostname> /dev/disk/by-id/<device>
```

Pause the OSD spec entirely during maintenance.

This stops all reconciliation globally — cephadm won't redeploy anything.
Stops cephadm from detecting the now-empty device and adding it as a new OSD.

```bash
ceph orch pause
```

---

### Step 7: Physical Drive Removal

Only after the above steps are complete and the cluster is healthy
should you physically remove the drive from the host. Coordinate with
your data center or hardware team as appropriate.

After physical removal, verify no ghost devices or stale entries remain:

```bash
ceph orch device ls <hostname>
ceph osd tree
```

---

### Step 8: Unset noout and Resume Orchestrator

If you set `noout` in Step 1, unset it now:

```bash
ceph osd unset noout
```

Unpause when the drive is physically out.

```bash
ceph orch resume
```

Confirm the cluster is healthy:

```bash
ceph -s
ceph health detail
```

---

## Post-Removal Checks

Run a final health check to confirm everything is stable:

```bash
ceph -s
ceph df detail
ceph osd df tree
ceph health detail
```

Check that:

- Cluster is `HEALTH_OK`
- No PGs are in a degraded, incomplete, or stale state
- Remaining OSDs are not approaching nearfull thresholds after the
  capacity reduction
- `noout` flag is unset

---

## Troubleshooting

### OSD Removal Is Stuck

If `ceph orch osd rm status` shows the OSD stuck in draining:

1. Check if PGs are blocked waiting on a down or unavailable OSD:

   ```bash
   ceph pg dump_stuck
   ceph health detail
   ```

2. Check if the `full` or `nearfull` ratio is being hit, blocking
   writes:

   ```bash
   ceph df
   ceph osd dump | grep -E "full_ratio|nearfull_ratio"
   ```

3. If the OSD is already down and you need to force-remove it, confirm
   data integrity first, then:

   ```bash
   ceph osd out <osd-id>
   ceph osd purge <osd-id> --yes-i-really-mean-it
   ```

   :::danger
   `osd purge` is destructive and permanent. Only run this if the OSD
   is confirmed down and all PGs have sufficient replicas on other OSDs.
   Verify with `ceph pg dump | grep <osd-id>` before proceeding.
   :::

### PG Count Not Reaching Zero

If an OSD's PG count stalls:

- Check the CRUSH map — the OSD may be the only OSD in a CRUSH bucket
  with no alternative placement:

  ```bash
  ceph osd crush tree
  ```

- Check if the PG autoscaler is interfering with expected PG counts:

  ```bash
  ceph osd pool autoscale-status
  ```

### cephadm Keeps Redeploying the OSD

If `cephadm` redeploys the OSD after you stop the service manually,
this is expected behavior. You must use the `ceph orch osd rm` workflow
— not `systemctl stop` — to properly decommission an OSD through the
orchestrator.

---

## Related Pages

- [Ceph OSD Administration](https://docs.ceph.com/en/reef/rados/operations/add-or-rm-osds/)
- [cephadm OSD Management](https://docs.ceph.com/en/reef/cephadm/services/osd/)
- [CRUSH Map Reference](https://docs.ceph.com/en/reef/rados/operations/crush-map/)
- [PG States Reference](https://docs.ceph.com/en/reef/rados/operations/pg-states/)
