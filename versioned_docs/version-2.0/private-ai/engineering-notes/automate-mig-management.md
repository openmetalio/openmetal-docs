---
slug: /private-ai/engineering-notes/automate-mig-management
description: Best practices for managing MIG device lifecycles, including automation tools and ensuring consistent GPU availability after reboot.
sidebar_position: 7
---

# Managing MIG Devices and Automating Lifecycle Operations

Multi-Instance GPU (MIG) enables partitioning of a single NVIDIA A100 into
isolated compute slices, but these configurations are **not persistent** by default.
This article outlines best practices for managing MIG devices in production
environments and describes automation techniques to ensure consistent GPU
availability after system events or reboots.

MIG State Is Not Persistent
While enabling MIG mode is persistent across reboots on **Ampere GPUs**, the
**specific GPU and compute instances** created within MIG mode are **ephemeral**.
If a server restarts, all configured MIG partitions are lost unless re-created
through automation.

To check MIG mode status:

```bash
nvidia-smi -i 0 --query-gpu=mig.mode.current --format=csv
```

To confirm instance existence:

```bash
nvidia-smi mig -lgi
```

If this list is empty after a reboot, MIG partitions must be re-created.

---

## Best Practices for MIG Instance Management

Step 1. **Use Predictable Profiles**

  Stick to known-good profiles such as:

- `1g.5gb` for small workloads

- `3g.20gb` for balanced performance

- `7g.40gb` for full-GPU workloads

Avoid frequent reconfiguration, which can lead to resource fragmentation and
scheduling failures.

Step 2. **Predefine Instance Geometry**

  For consistency, document your MIG layout per node. Example layout for one A100:

- 3x `1g.5gb`
- 1x `4g.20gb`

Or:

- 2x `3g.20gb`
- 1x `1g.5gb`

This helps ensure compatibility with OpenStack traits and avoids flavor mismatches.

Step 3. **Enable MIG Mode via Automation**

  If not already enabled, you can activate MIG mode during system provisioning:

```bash
nvidia-smi -i 0 -mig 1
```

This command can be included in a cloud-init script or post-boot automation.

---

## Automating MIG Creation with `nvidia-smi`

To recreate MIG geometry after reboot, run:

```bash
sudo nvidia-smi mig -cgi 19,19,19 -C
```

This creates three instances of profile ID 19 (`1g.5gb`). You can use other profile
IDs as needed, and combine them in one call.

For production environments, embed this logic in a startup script or systemd unit.

---

## Automating with MIG Parted

MIG Parted is an NVIDIA-provided tool that simplifies configuration and layout
of MIG profiles. It allows:

- Declarative geometry files
- Repeatable MIG creation
- Easy rollback or reconfiguration

Example systemd unit:

```bash
[Unit]
Description=Configure MIG on boot
After=multi-user.target


[Service]
ExecStart=/usr/bin/mig-parted apply /etc/mig-layout.yaml
Type=oneshot
RemainAfterExit=true

[Install]
WantedBy=multi-user.target
```

This ensures that every time a node boots, the expected MIG layout is applied
before VMs are scheduled.

---

## Cleaning Up MIG Instances

Before modifying geometry, destroy compute and GPU instances:

```bash
nvidia-smi mig -dci
nvidia-smi mig -dgi
```

Failure to clean up instances can result in placement errors or resource
allocation conflicts.

---

## Role in Private Cloud Operations

In OpenMetal's infrastructure, automation of MIG ensures that:

- GPU instances are restored predictably

- Virtual machines can rely on scheduled GPU traits

- Workload performance remains consistent after upgrades or failures

This is especially important for high-availability and multi-tenant
environments where GPU-backed workloads are tightly integrated into production workflows.

---

## Summary

- MIG partitions must be recreated after host reboots
- Use `nvidia-smi` or `mig-parted` for repeatable layouts
- Automate MIG configuration with systemd or init scripts
- Match MIG profiles to OpenStack traits to ensure correct VM scheduling

---

This completes the 7-part series on deploying and managing NVIDIA A100 GPUs using
MIG in a private cloud environment with OpenStack.
