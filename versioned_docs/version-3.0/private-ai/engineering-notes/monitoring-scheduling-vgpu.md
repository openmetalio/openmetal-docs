---
slug: /private-ai/engineering-notes/monitoring-scheduling-vgpu
description: Techniques for monitoring vGPU performance and scheduling GPU-backed workloads in OpenStack using traits and placement rules.
sidebar_position: 6
---

# Monitoring, Scheduling, and Performance Management of Virtual GPUs

Effective use of virtual GPUs (vGPUs) in a private cloud requires visibility
into their performance and careful scheduling to ensure workloads are placed on
the appropriate resources. This article explains how to monitor vGPU usage,
optimize resource scheduling in OpenStack, and understand performance factors
when using MIG or SR-IOV with NVIDIA A100 GPUs.

## Monitoring vGPU Resources on the Host

On the host system, administrators can use `nvidia-smi` to view the status of MIG
instances or SR-IOV virtual functions:

```bash
nvidia-smi
```

The output includes:

- Active GPU instances
- Compute instance IDs
- Memory usage
- Running processes

For MIG configurations, detailed information on GPU and compute instance mapping
can be displayed with:

```bash
nvidia-smi mig -lgi
nvidia-smi mig -lci -gi <gpu_instance_id>
```

For ongoing telemetry or dashboard integration, **NVIDIA DCGM** (Data Center
GPU Manager) provides a metrics API that supports MIG devices. It can report:

- SM utilization
- Memory bandwidth
- ECC errors
- Application-level metrics

DCGM supports Prometheus export and integrates with NVIDIA's container tools
and Kubernetes plugins.

## Monitoring Inside Virtual Machines

Once the NVIDIA GRID driver is installed in the VM, the `nvidia-smi` utility
becomes available for end users. This allows developers to:

- View GPU memory consumption
- Monitor model inference jobs
- Identify bottlenecks in compute or memory usage

Performance within the VM is isolated to the assigned MIG partition, ensuring
consistent and repeatable behavior even when multiple VMs share a physical GPU.

## Scheduling vGPUs in OpenStack

OpenStack Nova can treat MIG partitions or SR-IOV virtual functions as
discrete resources. This is accomplished using **resource classes** and **traits**.

Example: To create a flavor that requests a MIG device:

```bash
openstack flavor create \
  --ram 8192 \
  --vcpus 4 \
  --disk 40 \
  --property resources:VGPU=1 \
  --property trait:CUSTOM_NVIDIA_1G5GB=required \
  gpu.mig.1g
```

This allows the placement engine to match only compatible hosts that offer the
specific 1g.5gb MIG profile.

Resource traits can be extended using OpenStack placement APIs or custom drivers,
allowing fine-grained control over workload scheduling based on available GPU profiles.

## Performance Considerations

MIG partitions provide **hardware-level isolation**, meaning that each instance
receives a fixed amount of:

- GPU memory
- SM compute slices
- L2 cache and memory bandwidth

This enables predictable inference throughput and latency. For example:

- A 1g.5gb profile offers 1/8 of the total GPU memory and 1/7 of the SMs
- A 3g.20gb profile provides more capacity for higher-throughput workloads

Use cases such as:

- Lightweight NLP inference
- Batch classification
- Prompt-based assistants

...can run efficiently on smaller profiles, while high-resolution vision models
or large LLMs may require 3g or 7g profiles.

## Concurrency and Isolation

MIG allows up to **7 concurrent GPU instances** on a single A100. Each VM assigned
to a MIG partition runs independently without sharing compute resources with neighbors.

This contrasts with **time-slicing**, where multiple processes share a single full
GPU sequentially. MIG offers significantly improved predictability and latency
for real-time or production workloads.

When additional concurrency is needed within a single VM, **CUDA MPS**
(Multi-Process Service) can be used to parallelize inference tasks across multiple
threads or users within one MIG instance.

## Summary

- Use `nvidia-smi`, DCGM, and OpenStack traits to monitor and schedule GPU workloads.

- Match flavor specifications with the required MIG profiles for optimal placement.

- MIG delivers consistent performance and isolation, making it well-suited for
parallel AI workloads in private clouds.

---

## Next Steps

The final article in this series will cover **Best Practices for Managing MIG
Devices and Automating Lifecycle Operations**, including persistence strategies
and automation tooling.
