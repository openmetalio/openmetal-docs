# Understanding & Breaking Ceph Parent Child Dependencies

Author: Ramon Grullon

## Overview

In Ceph RADOS Block Device (RBD), snapshots and clones create **parent–child
relationships** that let you roll back data or rapidly provision new volumes.
While powerful, these dependencies can also lock images in place—preventing
deletions or migrations until the chain is broken. This guide explains how the
relationships are formed, why they matter, and how to use `rbd flatten` to make
a clone fully independent.

## What Creates a Parent–Child Dependency?

1. **Snapshot → Image** — Creating a snapshot of an RBD image establishes a
   parent (the pre‑snapshot image) and a child (the snapshot).
2. **Snapshot → Clone** — Creating a clone from a snapshot forms a second level
   of dependency: the new image (clone) relies on its snapshot parent, which in
   turn relies on the original image.

Each child stores only the changed blocks, so space use is minimal—until the
parent needs to be removed.

## Why Dependencies Matter

- **Garbage collection** — Parents with children cannot be deleted, causing
  stale images to linger in the pool.
- **Performance isolation** — Heavy writes to a child can increase I/O on the
  shared parent, impacting multiple VMs.
- **Disaster recovery** — Restoring or migrating a chain of dependent images is
  slower and more error‑prone.

Breaking the chain by flattening makes each image self‑contained at the cost
of extra space.

## Identifying Parent–Child Chains

```bash
# List snapshots for an image
rbd snap ls pool_name/image_name

# Show children of a snapshot
rbd children volumes/volume-UUID

# Display the parent of a cloned image
rbd info vms/vm-clone-001 | grep parent
```

If `rbd children` reports one or more clones, you’ll need to flatten them before
you can remove the snapshot or its parent image.

## Using `rbd flatten`

`rbd flatten` copies all referenced blocks into the child image so
it no longer needs its parent. The command syntax is:

```bash
rbd flatten <pool>/<image>
```

### Step‑by‑Step Example

```bash
# 1 Check dependency
rbd children volumes/volume-UUID
volumes/volume-UUID

# 2 Start the flatten task
rbd flatten volumes/volume-UUID

# 3 Monitor progress (Ceph Nautilus+)
rbd task ls | grep flatten

# 4 Confirm the clone is now independent
rbd info volumes/volume-UUID | grep parent   # (no output)
```

Repeat until no dependencies exist

## Space & Performance Considerations

- **Storage overhead** — After flattening, each clone occupies the full logical
  size it actively uses. Plan pool capacity accordingly.
- **Cluster load** — Flatten operations are I/O‑intensive. Schedule them during
  off‑peak hours preferably.

## Troubleshooting

| Symptom                                        | Resolution                                      |
| ---------------------------------------------- | ----------------------------------------------- |
| `Image has snapshots or clones - not removing` | Flatten or delete all children first            |
| `rbd: error: Operation in progress`            | Check `rbd task ls`; wait or cancel conflicting |
| Flatten stalls at 0 %                          | Ensure the OSDs hosting the parent are healthy  |

## Best Practices

- Keep your gold images small—install only the base OS to minimize flatten
  time.
- Use **layered clones** for short‑lived workloads (CI jobs, test VMs) and
  flatten only when the volume will persist long term.

## Additional Resources

- [Ceph Documentation › RBD Commands](https://docs.ceph.com/en/latest/rbd/rbd/)
- `man rbd`
