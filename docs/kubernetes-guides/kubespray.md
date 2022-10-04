---
slug: /kubernetes-guides/deploying-a-kubespray-cluster-to-openstack-using-terraform
description: This guide will walk you through deploying a Kubespray cluster to OpenStack using Terraform.
sidebar_position: 4
---

# Deploying a Kubespray cluster to OpenStack using Terraform

Kubespray is a community-driven project that provides a set of Ansible playbooks
to deploy a production-ready Kubernetes cluster. It is a great tool to deploy a
Kubernetes cluster on OpenStack! This guide will show you how to use Terraform to
automate the deployment of your OpenStack infrastructure and then use Ansible to
deploy a Kubespray cluster on top of it.

We'll be using the following official Kubespray documentation as a reference:

- [Kubespray - Terraform for OpenStack](https://github.com/kubernetes-sigs/kubespray/blob/v2.20.0/contrib/terraform/openstack/README.md)
- [Kubespray - Configuring OpenStack](https://kubespray.io/#/docs/openstack)

## Kubespray Features

- support for most popular network plugins (Calico, Cilium, Contiv, Flannel,
  Multus, Weave, Kube-router, Romana, Amazon VPC CNI, etc.)
- support for most popular Linux distributions
- upgrade support from a previous Kubernetes version
- composable attributes
- declarative way to customize cluster configuration through a
  configuration file
- network load balancer (MetalLB) for services of type LoadBalancer
- configurable bootstrap tools for the Kubernetes cluster
- multi-purpose bootstrap node used as a bastion (optional)
- GPU node support

## Prerequisites

- An OpenStack instance. If you don't have OpenStack, you can sign up for a free
  trial today with OpenMetal [OpenMetal Central](https://central.openmetal.io/sign-up).

## Prepare deployment environment

We'll be performing this deployment from a VM running Ubuntu 20.04. You
 can also use one of your OpenMetal cloud core nodes or your work station. Our
 guide will have you install Terraform and Ansible in your installation environment.

### Install Terraform

Terraform is a tool for building, changing, and versioning infrastructure safely
and efficiently. Terraform can manage existing and popular service providers
as well as custom in-house solutions. Configuration files describe to Terraform
the components needed to run a single application or your entire data center.

Terraform generates an execution plan describing what it will do to reach the
desired state, and then executes it to build the described infrastructure. As
the configuration changes, Terraform is able to determine what changed and
create incremental execution plans which can be applied. This allows for high
fidelity plans and helps reduce the possibility of out-of-band changes, including
drift and conflicts.

For non Debian based systems, please see the [Terraform Installation Instructions](https://www.terraform.io/downloads).

```bash
wget -O- https://apt.releases.hashicorp.com/gpg | gpg --dearmor | sudo tee /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update && sudo apt install terraform
```

### Install Ansible

The playbooks require an ansible-core version between 2.11.0 and 2.13.0. The following
will install ansible core version 2.12.9.

```bash
sudo apt-get install python3-pip
```

```bash
python3 -m pip install --user ansible==5.10.0
```

```bash
pip install netaddr
```

```bash
export PATH=$PATH:$HOME/.local/bin
```

### Set up the OpenStack CLI

We'll be using the CLI to help populate our Terraform variables. If you don't have
access to the OpenStack CLI, please follow the steps in this guide:
[How to Install and Use OpenStack's CLI](../operators-manual/day-1/command-line/openstackclient.md#how-to-install-openstackclient).

### Create a OpenStack project

We'll be creating a project to deploy our infrastructure into. You can use an
existing project if you have one.

```bash
openstack project create --domain default --description "Kubespray Cluster" kubespray-demo
```

```bash
openstack role add --project rke1 --user admin admin
```

> Note: You can substitute the admin user if you already have your own user.

## Deploy the infrastructure with Terraform

### Set environment variables

You may have already done this if you have used the OpenStack CLI. If not, you
can download your openrc file from the OpenStack dashboard. You can find it
under your projects "API Access" menu item. Download the OpenStack RC File, save
it to your workspace, and source it.

**This is an important step** as it will set the environment variables that Terraform
will use to authenticate with OpenStack. Double check that the values are correct.

`openrc.sh`

```bash
OS_AUTH_URL=https://openstack:5000
OS_PROJECT_ID=projectid
OS_PROJECT_NAME=username
OS_PROJECT_DOMAIN_ID=default
OS_USERNAME=username
OS_PASSWORD=password
OS_REGION_NAME=RegionOne
OS_INTERFACE=public
OS_IDENTITY_API_VERSION=3
OS_USER_DOMAIN_NAME=Default
```

```bash
source openrc.sh
```

### Generate SSH key

```bash
ssh-keygen -t ed25519 -N '' -f ~/.ssh/id_rsa.kubespray
```

### Clone Kubespray

Pull down the kubespray repository. It contains the ansible playbooks and the
Terraform templates we'll be using.

```bash
git clone --depth 1 --branch v2.20.0  https://github.com/kubernetes-sigs/kubespray
```

### Prepare your cluster configuration

```bash
cd kubespray
cp -LRp contrib/terraform/openstack/sample-inventory inventory/test-cluster
cd inventory/test-cluster
ln -s ../../contrib/terraform/openstack/hosts
ln -s ../../contrib
```

### Configure Terraform variables

The previous commands generated a few files for you including a `cluster.tfvars`
file. This file will be used to configure your nodes and networks to use for
your cluster. Refer to [Cluster Variables](https://github.com/kubernetes-sigs/kubespray/blob/v2.20.0/contrib/terraform/openstack/README.md#cluster-variables)
documentation for a full list of variables.

For this example, we'll be using the following variables:

> Note: We've added comments to help you fetch the values you want to replace from
> OpenStack.

```bash
cluster_name = "test-cluster"

public_key_path = "~/.ssh/id_rsa.kubespray.pub"

image = "Ubuntu 20.04 (focal-amd64)"

ssh_user = "ubuntu"

## Path to your cluster group vars directory
group_vars_path="<group_vars_path>/kubespray/inventory/test-cluster/group_vars"

number_of_bastions = 1

# List available flavors command: openstack flavor list
flavor_bastion = "gp1.small"

number_of_etcd = 0
number_of_k8s_masters = 0
number_of_k8s_masters_no_etcd = 0
number_of_k8s_masters_no_floating_ip = 1
number_of_k8s_masters_no_floating_ip_no_etcd = 0

# List available flavors command: openstack flavor list
flavor_k8s_master = "gp1.large"

number_of_k8s_nodes = 0
number_of_k8s_nodes_no_floating_ip = 2

# List available flavors command: openstack flavor list
flavor_k8s_node = "gp1.large"

network_name = "test-cluster-network"

# Fetch this value with this command: openstack network list --external
external_net = "<external_network_id>"

subnet_cidr = "172.29.0.0/25"

floatingip_pool = "External"

bastion_allowed_remote_ips = ["0.0.0.0/0"]
```

### Initialize Terraform

```bash
terraform -chdir="../../contrib/terraform/openstack" init
```

### Apply the Terraform plan

You'll be prompted to confirm your changes to OpenStack, type `yes` to continue.
After this process completes, your OpenStack project will have any required resources
to deploy Kubernetes.

> Note: Run this command from the kubespray/inventory/test-cluster directory.

```bash
 terraform -chdir="../../contrib/terraform/openstack" apply -var-file=$PWD/cluster.tfvars
```

> Note: If you want to destroy your resources, you can run the following command:

```bash
terraform -chdir="../../contrib/terraform/openstack" destroy -var-file=$PWD/cluster.tfvars
```

## Deploy Kubernetes with Ansible

The previous Terraform created your nodes and an Ansible inventory file for you.
Next, we need to prepare the ansible variables. When configuring your cluster,
you'll likley want to configure more options than what we've provided here. For
a full list of options, refer to the [Kubespray Documentation](https://kubespray.io/#/docs).

This is a list of options we updated to deploy the cluster with the OpenStack Cloud
Provider, Cinder CSI, and support for Octavia load balancers.

### Update `group_vars/all/all.yml`

```yaml
cloud_provider: external
external_cloud_provider: openstack
```

### Update `group_vars/all/openstack.yml`

```yaml
cinder_csi_enabled: true
cinder_csi_ignore_volume_az: true
```

### Deploy Kubernetes

Your ready to deploy Kubernetes. The following command needs to be run from the
kubespray directory. The process will take some time to complete depending on the
number of resources you wish to deploy. In our example, it took about 12 minutes.

```bash
cd ../..
```

```bash
ansible-playbook -i inventory/test-cluster/hosts.yaml --become --become-user=root cluster.yml
```

## Verify Kubernetes Installation

### Access your bastion node (Optional)

If you followed along with the guide, you'll have a bastion node that you can
use to access your cluster. If you don't have a bastion node, you can skip this
step.

#### List your nodes

```bash
openstack server list
```

#### SSH into your bastion node

```bash
ssh -i ~/.ssh/id_rsa.kubespray ubuntu@<bastion_ip>
```

### Install Kubectl

```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
```

```bash
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

### Create configuration file

We need to copy certificates from the master node to create a configuration file
that can be used to authenticate with the cluster. Replace the `<master_ip>` with
the IP address of your master node.

```bash
ssh ubuntu@[master-ip] sudo cat /etc/kubernetes/ssl/apiserver-kubelet-client.key > client.key
ssh ubuntu@[master-ip] sudo cat /etc/kubernetes/ssl/apiserver-kubelet-client.crt > client.crt
ssh ubuntu@[master-ip] sudo cat /etc/kubernetes/ssl/ca.crt > ca.crt
```

```bash
kubectl config set-cluster default-cluster --server=https://[master-ip]:6443 \
    --certificate-authority=ca.crt --embed-certs=true

kubectl config set-credentials default-admin \
  --certificate-authority=ca.crt \
  --client-key=client.key \
  --client-certificate=client.crt \
  --embed-certs=true
```

### Test Connection

```bash
 kubectl get pods -A
```

Output:

```bash
NAMESPACE     NAME                                                   READY   STATUS    RESTARTS   AGE
kube-system   coredns-74d6c5659f-b9lrn                               1/1     Running   0          13h
kube-system   coredns-74d6c5659f-t9q6q                               1/1     Running   0          13h
kube-system   csi-cinder-controllerplugin-9b75f6cc7-hpwn5            6/6     Running   0          11h
kube-system   csi-cinder-nodeplugin-75vt5                            3/3     Running   0          11h
kube-system   csi-cinder-nodeplugin-jhdng                            3/3     Running   0          11h
kube-system   dns-autoscaler-59b8867c86-cv5nm                        1/1     Running   0          13h
kube-system   kube-apiserver-test-cluster-k8s-master-nf-1            1/1     Running   1          13h
kube-system   kube-flannel-dstxm                                     1/1     Running   0          13h
...
```

### Save your configuration

You should now have a working configuration file. You can now save this in a safe
place to access your cluster from a machine that can reach your master node.

```bash
cat ~/.kube/config
```

## Verify OpenStack Cloud Provider

By enabling the OpenStack Cloud Provider, Kubespray configured a few pods that
should now be in the running state.

```bash
kubectl get pods -A | grep 'csi\|openstack'
```

Output:

```bash
kube-system   csi-cinder-controllerplugin-9b75f6cc7-hpwn5            6/6     Running   0          11h
kube-system   csi-cinder-nodeplugin-75vt5                            3/3     Running   0          11h
kube-system   csi-cinder-nodeplugin-jhdng                            3/3     Running   0          11h
kube-system   openstack-cloud-controller-manager-d7wbb               1/1     Running   0          11h
```

### Verify Load balancer

The OpenStack Cloud Provider supports Octavia load balancers. You can verify
that the load balancer is working by creating a service of type `LoadBalancer`.
When you create the service, you should see a new load balancer created in the
OpenStack dashboard.

Create a service by running the following command:

```bash
kubectl apply -f - <<EOF
apiVersion: v1
kind: Service
metadata:
  name: fake-service
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 80
  selector:
    app: fake-service
EOF
```

You can verify that the load balancer was created by running the following command:

```bash
openstack loadbalancer list
```

You should also see a floating ip associated with the load balancer service in Kubernetes.
This may take a couple of minutes to complete.

```bash
kubectl get svc -A -w
```

Output:

```bash
NAMESPACE     NAME              TYPE           CLUSTER-IP      EXTERNAL-IP      PORT(S)                  AGE
default       hostname-server   LoadBalancer   10.233.32.201   127.0.0.1        80:32709/TCP             12h
```

### Verify Cinder

Next we'll verify that Cinder volumes are working. Create a PersistentVolumeClaim
by running the following command:

```bash
apply -f - <<EOF
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: test-volume
  namespace: default
spec:
  accessModes:
  - ReadWriteOnce
  storageClassName: cinder-csi
  resources:
    requests:
      storage: 1Gi
EOF
```

## Deploy a pod that used the volume

We'll deploy a redis instance, which will use the volume we created in the
previous step.

> Note: This is just an example. Do not use this in production.

```bash
kubectl apply -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
      - image: redis
        name: redis
        volumeMounts:
        - mountPath: /var/lib/redis
          name: redis-data
      volumes:
      - name: redis-data
        persistentVolumeClaim:
          claimName: test-volume
EOF
```

## Verify the volume is bound

```bash
kubectl get pvc -A
```

Output:

```bash
NAMESPACE   NAME            STATUS    VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS    AGE
default     test-volume     Bound     pvc-f7ceeaae-86aa-4ab3-9512-bb65f7d6c5f0   1Gi        RWO            cinder-csi      12h
```

### Verify the volume exists in OpenStack

```bash
openstack volume list
```

## All Done

You should now have a working Kubernetes cluster with the OpenStack Cloud Provider
enabled. You can now deploy your applications to the cluster.
