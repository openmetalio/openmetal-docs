---
slug: /kubernetes-guides/deploying-a-kubespray-cluster-to-openstack-using-terraform
description: This guide will walk you through deploying a Kubespray cluster to OpenStack using Terraform.
sidebar_position: 3
---

# Deploying a Kubespray cluster to OpenStack using Terraform

Kubespray is a community-driven project that provides a set of Ansible playbooks
to deploy a production-ready Kubernetes cluster. It is a great tool to deploy a
Kubernetes cluster on OpenStack! This guide will detail using Terraform to
automate creation of your OpenStack infrastructure and Ansible to deploy
a Kubespray cluster on it.

We'll be using the following official Kubespray documentation as a reference:

- [Kubespray - Terraform for OpenStack](https://github.com/kubernetes-sigs/kubespray/blob/v2.20.0/contrib/terraform/openstack/README.md)
- [Kubespray - Configuring OpenStack](https://kubespray.io/#/docs/openstack)

## Kubespray Features

- Support for most popular network plugins (Calico, Cilium, Contiv, Flannel,
  Multus, Weave, Kube-router, Romana, Amazon VPC CNI, etc.)
- Support for most popular Linux distributions
- Upgrade support from a previous Kubernetes version
- Composable attributes
- Declarative way to customize cluster configuration through a
  configuration file
- Network load balancer (MetalLB) for services of type LoadBalancer
- Configurable bootstrap tools for the Kubernetes cluster
- Multi-purpose bootstrap node used as a bastion (optional)
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
and efficiently. Terraform supports existing, popular service providers as well
as custom in-house solutions. Configuration files describe to Terraform the
components needed to run a single application or your entire data center.

Terraform generates an execution plan describing what is needed to reach the
desired state, then executes it to build the described infrastructure. As the
configuration changes, Terraform is able to determine what changed and
create incremental execution plans which can be applied. This allows for high
fidelity plans and helps reduce out-of-band changes, which can lead to drift and
conflicts.

For non Debian based systems, please see the [Terraform Installation Instructions](https://www.terraform.io/downloads).

```bash
wget -O- https://apt.releases.hashicorp.com/gpg | \
gpg --dearmor | \
sudo tee /usr/share/keyrings/hashicorp-archive-keyring.gpg

echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] \
https://apt.releases.hashicorp.com $(lsb_release -cs) main" | \
sudo tee /etc/apt/sources.list.d/hashicorp.list

sudo apt update && sudo apt install terraform
```

### Create and Activate Virtual Environment

Ensure the required Python modules are installed.

```bash
sudo apt-get install python3-virtualenv
```

Create your virtual environment.

```bash
virtualenv .kubespray
```

Activate the environment.

```bash
source .kubespray/bin/activate
```

Update pip

```bash
pip install -U pip
```

### Setup the OpenStack CLI

We'll be using the CLI to help populate our Terraform variables. If you don't have
access to the OpenStack CLI, please follow the steps in this guide:
[How to Install and Use OpenStack's CLI](../../operators-manual/day-1/command-line/openstackclient.md#how-to-install-and-use-openstacks-cli)

### Create an OpenStack project

We'll be creating a project to deploy our infrastructure into. You can use an
existing project if you have one.

```bash
openstack project create --domain default \
--description "Kubespray Cluster" \
kubespray-demo
```

```bash
openstack role add --project kubespray-demo --user admin admin
```

> Note: You can substitute the admin user if you already have your own user.

## Deploy the infrastructure with Terraform

### Set environment variables

If you have not already done so, download your `openrc.sh` file from your
projects "API Access" menu. Save the OpenStack RC file to your workspace and
source it.

> **This is an important step** as it sets the environment variables Terraform
> uses to authenticate with OpenStack. Double check that these values are correct.

`openrc.sh`

```bash
OS_AUTH_URL=https://openstack:5000
OS_PROJECT_ID=projectid
OS_PROJECT_NAME="kubespray-demo"
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

### Generate SSH key and add to SSH agent

```bash
ssh-keygen -t ed25519 -N '' -f ~/.ssh/id_rsa.kubespray
```

```bash
# Start an SSH Agent for the current shell
eval $(ssh-agent -s)

# Add the generated key
ssh-add ~/.ssh/id_rsa.kubespray
```

### Clone Kubespray

The Kubespray repository contains the Ansible playbooks and Terraform templates
we'll be using. Pull them down now with `git`:

```bash
git clone --depth 1 --branch v2.20.0  https://github.com/kubernetes-sigs/kubespray
```

Install Ansible and other requirements with `pip`.

```bash
cd kubespray
pip install -r requirements.txt
```

### Prepare your cluster configuration

```bash
cp -LRp contrib/terraform/openstack/sample-inventory inventory/test-cluster
cd inventory/test-cluster
ln -s ../../contrib/terraform/openstack/hosts
ln -s ../../contrib
```

### Configure Terraform variables

The previous commands generated a few files including one named `cluster.tfvars`.
This file will be used to configure the nodes and networks for your cluster.
Refer to [Cluster Variables](https://github.com/kubernetes-sigs/kubespray/blob/v2.20.0/contrib/terraform/openstack/README.md#cluster-variables)
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
terraform -chdir="contrib/terraform/openstack" init
```

### Apply the Terraform plan

> Note: Run these commands from the `kubespray/inventory/test-cluster` directory.

```bash
 terraform -chdir="contrib/terraform/openstack" apply -var-file=$PWD/cluster.tfvars
```

You'll be prompted to confirm your changes to OpenStack, type `yes` to continue.
Once the process completes, the infrastructure required to deploy Kubernetes will
be available in your OpenStack project.

> Note: If you want to destroy your resources, you can run the following command:
>
> ```bash
> terraform -chdir="contrib/terraform/openstack" destroy -var-file=$PWD/cluster.tfvars
> ```

## Deploy Kubernetes with Ansible

The Terraform run created your nodes and an Ansible inventory file. Next prepare
the Ansible variables.

We provide here a simplified example configuration, it is likely you will want
to configure more options than we've provided when setting up your cluster. For
a full list of options, refer to the [Kubespray Documentation](https://kubespray.io/#/).

These are the options we updated to deploy the cluster with the OpenStack Cloud
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

You are ready to deploy Kubernetes. The following command needs to be run from the
`kubespray` directory. The process will take some time to complete and depends
on the number of resources you wish to deploy. In our example, it took about 12
minutes.

```bash
cd ../..
```

```bash
ansible-playbook --become -i inventory/test-cluster/hosts cluster.yml
```

## Verify Kubernetes Installation

### Access your bastion node (Optional)

If you followed along with the guide, you have a bastion node you can use to
access your cluster. If you don't have a bastion node, you can skip this
step.

#### List your nodes

```bash
openstack server list
```

#### SSH into your bastion node with Agent forwarding

```bash
ssh -A ubuntu@<bastion_ip>
```

### Install Kubectl

```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
```

```bash
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

### Create configuration file

To create the configuration file used to authenticate with the cluster, several
certificates must be copied from the master node. Replace `<master_ip>` with
the IP address of your master node:

```bash
ssh ubuntu@[master-ip] sudo cat /etc/kubernetes/ssl/apiserver-kubelet-client.key > client.key
ssh ubuntu@[master-ip] sudo cat /etc/kubernetes/ssl/apiserver-kubelet-client.crt > client.crt
ssh ubuntu@[master-ip] sudo cat /etc/kubernetes/ssl/ca.crt > ca.crt
```

```bash
# Set cluster
kubectl config set-cluster default-cluster \
  --server=https://[master-ip]:6443 \
  --certificate-authority=ca.crt \
  --embed-certs=true

# Set credentials
kubectl config set-credentials default-admin \
  --certificate-authority=ca.crt \
  --client-key=client.key \
  --client-certificate=client.crt \
  --embed-certs=true

# Create context
kubectl config set-context default-context \
 --cluster=default-cluster \
 --user=default-admin

# Set active context
kubectl config use-context default-context
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

You should now have a working configuration file. Save this in a safe place to
access your cluster from a machine that can reach your master node.

```bash
cat ~/.kube/config
```

## Verify OpenStack Cloud Provider

By enabling the OpenStack Cloud Provider, Kubespray configured a few pods that
should now be in the running state.

```bash
$ kubectl get pods -A | grep 'csi\|openstack'

kube-system   csi-cinder-controllerplugin-9b75f6cc7-hpwn5            6/6     Running   0          11h
kube-system   csi-cinder-nodeplugin-75vt5                            3/3     Running   0          11h
kube-system   csi-cinder-nodeplugin-jhdng                            3/3     Running   0          11h
kube-system   openstack-cloud-controller-manager-d7wbb               1/1     Running   0          11h
```

### Verify Load balancer

The OpenStack Cloud Provider supports Octavia load balancers. Verify the load
balancer is working by creating a service of type `LoadBalancer`. Once you
create the service, you should see a new load balancer created in the OpenStack
dashboard.

Create a service with the following command:

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

You should also see a floating IP associated with the load balancer service in Kubernetes.
This may take a couple of minutes to complete:

```bash
kubectl get svc -A -w
```

Output:

```bash
NAMESPACE     NAME              TYPE           CLUSTER-IP      EXTERNAL-IP      PORT(S)                  AGE
default       hostname-server   LoadBalancer   10.233.32.201   127.0.0.1        80:32709/TCP             12h
```

### Verify Cinder

Next we'll verify that Cinder volumes are working. First, create a storage class:

```bash
kubectl apply -f - <<EOF
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: cinder-csi
  annotations:
    storageclass.kubernetes.io/is-default-class: "true"
provisioner: cinder.csi.openstack.org
parameters:
  availability: nova
allowVolumeExpansion: true
volumeBindingMode: Immediate
EOF
```

Now create a PersistentVolumeClaim by running the following command:

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

## Deploy a pod that uses the volume

We'll deploy a Redis instance configured to use the volume we created in the
previous step.

> **Warning**: This is just an example. **Do not** use this in production.

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
