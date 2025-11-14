---
slug: /kubernetes-guides/installing-a-rancher-cluster-on-openstack
sidebar_position: 2
---

# Installing a Rancher managed cluster on OpenStack

This guide will validate running an RKE1 (Rancher) cluster on an OpenStack
environment. We'll be following the official rancher documentation: [Setting up
a High-availability RKE Kubernetes Cluster](https://docs.ranchermanager.rancher.io/how-to-guides/new-user-guides/kubernetes-cluster-setup/rke1-for-rancher).

RKE1 is the first iteration of Rancher's Kubernetes deployment system. RKE2 is
available and also works within OpenStack. We'll be creating a guide on RKE2 in
the near future. To learn the differences between RKE1 and RKE2, please see
[RKE1 vs RKE2](https://docs.ranchermanager.rancher.io/how-to-guides/new-user-guides/Kubernetes-clusters-in-rancher-setup/launch-kubernetes-with-rancher/rke1-vs-rke2-differences).

Setting up an RKE1 cluster on OpenStack is rather simple. First, we need create the
nodes for our cluster within OpenStack. Then we create an RKE configuration
file that points to each of our nodes. Finally, we use RKE to install
Kubernetes on our nodes.

We'll be performing these steps on a Standard - OpenMetal Cloud. You can follow
along by deploying a trial, then accessing one of your hardware nodes via SSH.

## Prerequisites

This guide requires access to the OpenStack CLI. Complete the following steps
to [install the OpenStack CLI](/operators-manual/operators_docs/day-1/command-line/openstackclient).

## Create Nodes

We'll need to create 3 nodes for our cluster. Before we can create
our nodes, we need to create a network, subnet, and router. We'll also need to
create a security group so traffic can reach our cluster.

### Create a Project

Creating a project will separate the resources and make it easy to cleanup later.

```bash
openstack project create --domain default --description "RKE1 Cluster" rke1
```

```bash
openstack role add --project rke1 --user admin admin
```

#### Update the OpenStack CLI

Update the following environment variables.

> Note: Replace <project_id> with the project id from the previous step.

```bash
export OS_PROJECT_ID=<project_id>
export OS_PROJECT_NAME=rke1
```

### Network

We'll need to create some networking resources for our nodes.

#### Create a Network

```bash
openstack network create \
  --project rke1 \
  rke1
```

#### Create a Subnet

```bash
openstack subnet create \
  rke1-subnet \
  --project rke1 \
  --network rke1 \
  --subnet-range 172.31.0.0/28
```

#### Create a Router

```bash
openstack router create \
  rke1-router \
  --project rke1
```

#### Add a Subnet to the Router

```bash
openstack router add subnet \
  rke1-router \
  rke1-subnet
```

#### Set the Router's External Gateway

```bash
openstack router set --external-gateway \
  $(openstack network list --external -f value -c ID) \
  rke1-router
```

### Create a Security Group

Create a security group that allows traffic on common ports required by
Kubernetes deployment systems.

> Note: This is not a definitive list. In production
deployments you'll want to lock down your security groups to only allow traffic
to the nodes and ports that need it.

```bash
openstack security group create rke1 --project rke1
openstack security group rule create --protocol icmp --dst-port 1:65535 rke1
openstack security group rule create --protocol tcp --dst-port 22:22 rke1
openstack security group rule create --protocol tcp --dst-port 53:53 rke1
openstack security group rule create --protocol tcp --dst-port 179:179 rke1
openstack security group rule create --protocol tcp --dst-port 6443:6443 rke1
openstack security group rule create --protocol tcp --dst-port 2380:2380 rke1
openstack security group rule create --protocol tcp --dst-port 7080:7080 rke1
openstack security group rule create --protocol tcp --dst-port 8472:8472 rke1
openstack security group rule create --protocol tcp --dst-port 8080:8080 rke1
openstack security group rule create --protocol tcp --dst-port 9100:9100 rke1
openstack security group rule create --protocol tcp --dst-port 10250:10250 rke1
openstack security group rule create --protocol udp --dst-port 8472:8472 rke1
openstack security group rule create --protocol tcp --dst-port 30000:32767 rke1
```

### Create a Key Pair

This key will be used by the deployment environment to access the nodes.

#### Generate a key pair

```bash
ssh-keygen -t ed25519 -N '' -f /root/.ssh/id_rke1
```

#### Upload the public key to OpenStack

````bash
openstack keypair create --public-key /root/.ssh/id_rke1.pub rke1-key
````

### Create Instances

#### Prepare Docker installation script

Each of your nodes will need docker installed on them. This script will install
any dependencies after the VM is created.

```bash
cat <<EOF > ./install_docker.sh
#!/bin/bash

curl https://releases.rancher.com/install-docker/20.10.sh | sh
sudo usermod -aG docker ubuntu
EOF
```

#### Create Servers

These nodes will serve as your 3 Kubernetes cluster nodes. We'll use the
`--user-data` flag to pass the script we created above to the nodes. This will
install docker on the nodes. We'll also use the `--max` flag to create 3 nodes
at once.

```bash
openstack server create --flavor m1.medium \
  --image="Ubuntu 20.04 (focal-amd64)" \
  --network rke1 \
  --key-name rke1-key \
  --security-group rke1 \
  --user-data ./install_docker.sh \
  --max 3 \
  rke1
```

#### Deployment node

We'll also deploy a node that we'll use to deploy our cluster. This node will
be used to run the RKE installer. It's not required, but it's a good idea to
keep the deployment environment separate from the cluster. This will allow you
to easily destroy the deployment environment without affecting your cluster.

```bash
openstack server create --flavor m1.medium \
  --image="Ubuntu 20.04 (focal-amd64)" \
  --network rke1 \
  --key-name rke1-key \
  --security-group rke1 \
  rke1-launcher2
```

#### Add a floating IP to the deployment node

At this point, you should have 4 nodes running. Each node is currently only
accessible from the private network. We'll need to add a floating IP to the
deployment node so we can access it.

```bash
openstack floating ip create \
  --description "RKE1 Cluster - Deployment Node" \
  --project rke1 \
  External
```

```bash
openstack server add floating ip rke1-launcher2 <floating-ip>
```

> Note: You'll need to replace `<floating-ip>` with the floating IP you created
> for this and the following commands.

#### Copy the SSH key to deployment node

We'll need to copy the SSH key we created earlier to the deployment node. This
will allow RKE to deploy Kubernetes to the 3 cluster nodes.

```bash
scp -i ~/.ssh/id_rke1  ~/.ssh/id_rke1 ubuntu@<floating-ip>:/home/ubuntu/.ssh/id_rsa
```

#### SSH to deployment node

```bash
ssh -i ~/.ssh/id_rke1 ubuntu@<floating-ip>
```

## Deploy Your Cluster

### Install RKE

```bash
curl -OL https://github.com/rancher/rke/releases/download/v1.3.14/rke_linux-amd64
```

```bash
chmod +x rke_linux-amd64 && sudo mv rke_linux-amd64 /usr/local/bin/rke
```

### Install Kubectl

```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
```

```bash
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

### Prepare your configuration file

Create a configuration file for your RKE cluster. Substitute the `address`
with the IP addresses of the nodes you created. Save this file as `rancher-cluster.yml`

Full documentation for the configuration file can be found here:
[Configuration Options](https://rancher.com/docs/rke/latest/en/config-options/)

Example Configuration file:
[Example Configuration](https://rancher.com/docs/rke/latest/en/example-yamls/)

You can view the IP addresses of your nodes by running:

```bash
openstack server list --project rke1
```

#### Configuration File

```yaml
nodes:
  - address: <node_1_IP_address>
    user: ubuntu
    role:
      - controlplane
      - worker
      - etcd
  - address: <node_2_IP_address>
    user: ubuntu
    role:
      - controlplane
      - worker
      - etcd
  - address: <node_3_IP_address>
    user: ubuntu
    role:
      - controlplane
      - worker
      - etcd

services:
  etcd:
    snapshot: true
    creation: 6h
    retention: 24h

ingress:
  provider: nginx
  options:
    use-forwarded-headers: "true"
```

### Run RKE

This process takes about 2 minutes. After it completes, you should have a
working Kubernetes cluster.

```bash
rke up --config rancher-cluster.yml
```

Output:

```bash
...
INFO[0171] [ingress] Setting up nginx ingress controller
INFO[0171] [ingress] removing admission batch jobs if they exist
INFO[0171] [addons] Saving ConfigMap for addon rke-ingress-controller to Kubernetes
INFO[0171] [addons] Successfully saved ConfigMap for addon rke-ingress-controller to Kubernetes
INFO[0171] [addons] Executing deploy job rke-ingress-controller
INFO[0181] [ingress] removing default backend service and deployment if they exist
INFO[0181] [ingress] ingress controller nginx deployed successfully
INFO[0181] [addons] Setting up user addons
INFO[0181] [addons] no user addons defined
INFO[0181] Finished building Kubernetes cluster successfully
```

## Verify Installation

### Set config as default

```bash
mkdir ~/.kube && cp kube_config_rancher-cluster.yml ~/.kube/config
```

### Fetch resources

Get pods in all namespaces.

```bash
kubectl get pods -A
```

Output:

```bash
ubuntu@rke1-launcher:~/rancher$ kubectl get pods -A
NAMESPACE       NAME                                       READY   STATUS      RESTARTS   AGE
ingress-nginx   ingress-nginx-admission-create-9s6t2       0/1     Completed   0          3m55s
ingress-nginx   ingress-nginx-admission-patch-2brpz        0/1     Completed   0          3m55s
ingress-nginx   nginx-ingress-controller-j286h             1/1     Running     0          3m55s
ingress-nginx   nginx-ingress-controller-nm5m7             1/1     Running     0          3m55s
ingress-nginx   nginx-ingress-controller-x65pp             1/1     Running     0          3m55s
kube-system     calico-kube-controllers-74df54cbb7-49xm7   1/1     Running     0          4m25s
kube-system     canal-jkzvb                                2/2     Running     0          4m26s
kube-system     canal-mz67r                                2/2     Running
...
```

### Credentials

Save a copy of the following files in a secure location:

- `rancher-cluster.yml`: The RKE cluster configuration file.
- `kube_config_cluster.yml`: The Kubeconfig file for the cluster, this file
  contains credentials for full access to the cluster.
- `rancher-cluster.rkestate`: The Kubernetes Cluster State file, this file
  contains credentials for full access to the cluster.

## What's Next?

You've now deployed a Kubernetes cluster using RKE1. You can now deploy
workloads to the cluster. However, likely want to deploy an OpenStack load
balancer and persistent volumes as well.

To do this, you'll need to setup OpenStack Cloud Provider resources. We're in the
process of creating guides on how to do this.

- [OpenStack Cloud Controller Manager](../openstack-provider/openstack-cloud-controller-manager.md)
- [Cinder CSI Driver](../openstack-provider/cinder.md)
- Barbican KMS Plugin - _Coming soon_

You can find more information on the OpenStack Cloud Provider resources here:
[OpenStack Cloud Provider](https://github.com/Kubernetes/cloud-provider-openstack).
