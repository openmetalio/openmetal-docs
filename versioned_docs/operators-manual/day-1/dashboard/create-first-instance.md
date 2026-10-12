---
sidebar_position: 4
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# How to Create an Instance

This guide creates a private network, a security group, a key pair, and an instance, then attaches a floating IP so the instance is reachable from outside the cloud.

## Create a network and router

<Tabs groupId="dashboard">
<TabItem value="hz" label="Horizon" default>

Horizon creates the network and the router separately.

Go to **Project -> Network -> Networks**.

![Networks list in Horizon](images/hz-networks.png)

Click **Create Network**. The form has three tabs.

![Create Network form in Horizon](images/hz-network-form.png)

- **Network** tab — **Network Name**: **Private**. Leave **Create Subnet** checked.
- **Subnet** tab — **Subnet Name**: **private-subnet**. **Network Address**: `192.168.0.0/24`.
- **Subnet Details** tab — leave **Enable DHCP** checked. DNS name servers and allocation pools are optional.

Click **Create**.

Next go to **Project -> Network -> Routers**.

![Routers list in Horizon](images/hz-routers.png)

Click **Create Router**.

![Create Router form in Horizon](images/hz-router-form.png)

- **Router Name**: **Router**.
- **External Network**: **External**.

Click **Create Router**, then open the router, choose the **Interfaces** tab, and click **Add Interface** to attach **private-subnet**.

</TabItem>
<TabItem value="skyline" label="Skyline">

**Quick Create** builds the network, its subnet, and an attached router in one step.

Go to **Network -> Networks**.

![Networks list](images/networks.png)

Click **Quick Create**.

![Quick Create dialog](images/quick-create-empty.png)

Fill in the form.

![Quick Create with a router attached](images/quick-create-filled.png)

- **Network Name**: **Private**.
- **Subnet Name**: **private-subnet**.
- **Subnet CIDR**: a private range, for example `192.168.0.0/24`.
- **Gateway IP** and **DNS**: filled automatically.
- **Create and Attach Router**: check this, then set **Router Name**.
- **Options -> External Gateway**: check this and select **External**, or the router has no route out and floating IPs will not work.

Click **OK**.

![Networks list showing Private](images/network-list.png)

![Routers list](images/router-list.png)

To build the pieces separately, use **Create Network** on this page and **Create Router** under **Network -> Routers**, then attach the subnet with **More -> Connect Subnet**.

</TabItem>
</Tabs>

### View the topology

<Tabs groupId="dashboard">
<TabItem value="hz" label="Horizon" default>

Go to **Project -> Network -> Network Topology**.

![Network topology in Horizon](images/hz-network-topology.png)

The **Graph** tab shows the same data as a node graph. **Small** and **Normal** change the level of detail.

</TabItem>
<TabItem value="skyline" label="Skyline">

Go to **Network -> Topology**.

![Network topology](images/network-topology.png)

Clear **Show Instances** to reduce the diagram to networks and routers.

</TabItem>
</Tabs>

## Create a security group

Security groups control traffic to and from instances. The **default** group denies all inbound traffic and allows all outbound traffic.

<Tabs groupId="dashboard">
<TabItem value="hz" label="Horizon" default>

Go to **Project -> Network -> Security Groups**.

![Security groups list in Horizon](images/hz-security-groups.png)

Click **Create Security Group**, name it **SSH**, then click **Create Security Group**.

![Create Security Group form in Horizon](images/hz-security-group-form.png)

Click **Manage Rules** on the new group.

![Security group rules in Horizon](images/hz-security-group-rules.png)

Click **Add Rule**.

![Add Rule form in Horizon](images/hz-add-rule-form.png)

- **Rule**: **SSH**, which presets TCP port 22.
- **Remote**: **CIDR**.
- **CIDR**: the source allowed to connect.

Click **Add**.

</TabItem>
<TabItem value="skyline" label="Skyline">

Go to **Network -> Security Groups**.

![Security groups list](images/security-groups.png)

Click **Create Security Group**, name it **SSH**, then click **OK**.

![Create Security Group dialog](images/security-group-form.png)

Open the **SSH** group.

![Security group rules](images/security-group-rules.png)

Click **Create Rule**.

![Create Rule dialog](images/add-rule-form.png)

- **Protocol**: TCP. **Direction**: Ingress. **Ether Type**: IPv4.
- **Port or Port Range**: `22`.
- **Remote Type**: CIDR. **Remote IP Prefix**: the source allowed to connect.

Click **OK**.

</TabItem>
</Tabs>

Open only the ports you need, to the narrowest source range that works. Use the IP of a control plane node rather than `0.0.0.0/0`.

## Add a key pair

An SSH key is injected at boot. It cannot be added to a running instance.

<Tabs groupId="dashboard">
<TabItem value="hz" label="Horizon" default>

Go to **Project -> Compute -> Key Pairs**.

![Key pairs list in Horizon](images/hz-keypairs.png)

Click **Create Key Pair** to generate one, or **Import Public Key** to upload an existing key.

![Import Public Key form in Horizon](images/hz-keypair-form.png)

- **Key Pair Name**: the name shown when launching an instance.
- **Key Type**: **SSH Key**.
- **Public Key**: paste the key, or load it from a file.

</TabItem>
<TabItem value="skyline" label="Skyline">

Go to **Compute -> Key Pairs**.

![Key pairs list](images/key-pairs.png)

Click **Create Keypair**.

![Create Keypair dialog](images/key-pair-form.png)

- **Create Type**: generate a new key pair, or import an existing public key.
- **Keypair Name**: the name shown when launching an instance.
- **Public Key**: paste the public key when importing.

</TabItem>
</Tabs>

To create a key pair on a control plane node first, see [Create SSH Key Pair for an OpenStack Control Plane Node](../command-line/create-SSH-key).

## Create the instance

<Tabs groupId="dashboard">
<TabItem value="hz" label="Horizon" default>

Go to **Project -> Compute -> Instances** and click **Launch Instance**. This opens a wizard whose steps are listed down the left side.

![Launch Instance wizard in Horizon](images/hz-launch-instance.png)

- **Details** — **Instance Name**, **Availability Zone**, **Count**.
- **Source** — **Select Boot Source**: **Image**. Leave **Create New Volume** set to **Yes** to boot from a Cinder volume in Ceph. Pick the image with its up arrow.
- **Flavor** — pick the flavor with its up arrow.
- **Networks** — select **Private**.
- **Security Groups** — select **SSH**.
- **Key Pair** — select the key pair, or import one here.

The remaining steps are optional. Click **Launch Instance**.

</TabItem>
<TabItem value="skyline" label="Skyline">

Go to **Compute -> Instances** and click **Create Instance**. This opens a four-step wizard.

### Step 1: Base Config

![Base Config step](images/wizard-1-base-config.png)

- **Flavor**: the vCPU, memory, and disk size. This example uses **gen2.small**.
- **Start Source**: **Image**. Then pick a distribution tab and the image.
- **Boot From Volume**: **Yes** creates a Cinder volume from the image, stored in Ceph.
- **System Disk**: choose a volume **Type**, then a **Size** at least the flavor's disk size, or the wizard will not advance.

### Step 2: Network Config

![Network Config step](images/wizard-2-network-config.png)

Select the **Private** network and the **SSH** security group.

### Step 3: System Config

![System Config step](images/wizard-3-system-config.png)

Set the **Name**, set **Login Type** to **Keypair**, and select the key pair.

### Step 4: Confirm Config

![Confirm Config step](images/wizard-4-confirm-config.png)

Review the summary and click **OK**.

</TabItem>
</Tabs>

Attaching an instance directly to **External** consumes a public IP and exposes it to the Internet. Use a private network and a floating IP instead.

The instance builds in a few minutes.

<Tabs groupId="dashboard">
<TabItem value="hz" label="Horizon" default>

![Instances list in Horizon](images/hz-instances.png)

</TabItem>
<TabItem value="skyline" label="Skyline">

![Instances list](images/instance-list.png)

</TabItem>
</Tabs>

## Attach a floating IP

A floating IP makes the instance reachable from outside the cloud.

<Tabs groupId="dashboard">
<TabItem value="hz" label="Horizon" default>

Go to **Project -> Network -> Floating IPs**.

![Floating IPs list in Horizon](images/hz-floating-ips.png)

Click **Allocate IP To Project**.

![Allocate Floating IP form in Horizon](images/hz-allocate-floating-ip.png)

Select **External** as the **Pool**, then click **Allocate IP**.

Find the new address and click **Associate**, then select the instance's port.

</TabItem>
<TabItem value="skyline" label="Skyline">

Go to **Network -> Floating IPs**.

![Floating IPs list](images/floating-ips.png)

Click **Allocate IP**.

![Allocate floating IP dialog](images/allocate-floating-ip.png)

Select the **External** network, then click **OK**.

Find the new address and choose **More -> Associate**, then select the instance and its port.

</TabItem>
</Tabs>

The instance is now reachable over SSH from any source permitted by the **SSH** security group rule.
