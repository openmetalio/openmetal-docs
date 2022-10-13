---
sidebar_position: 3
slug: /kubernetes-guides/installing-a-kops-cluster-on-openstack
description: This guide will walk you through the process of installing a Kubernetes cluster on OpenStack using kops.
---

# Installing a kOps cluster on OpenStack

This guide will walk you through the process of installing a Kubernetes cluster
on OpenStack using [kOps - Kubernetes Operations](https://kops.sigs.k8s.io/).
kOps is a command line tool, written in Go, and maintained by the Kubernetes
community allowing you to install Kubernetes clusters on a variety of cloud
providers.  kOps is a great option for those who want to install
Kubernetes clusters on OpenStack. It provides a lot of flexibility and allows you to install a Kubernetes cluster that is highly available and secure.

At the time of writing this guide, October 2022, kOps for OpenStack is still
in beta. According to kOps, it is in good shape for production, but some
features are still missing.

## Objectives

Our plan is to validate the installation of a v1.25.1 Kubernetes cluster on
OpenStack using kOps. We'll be configuring it to use the OpenStack cloud provider
with cinder as the storage provider with the OpenStack load balancer providing
ingress to the cluster.

This guide follows the official [kOps OpenStack guide](https://kops.sigs.k8s.io/getting_started/openstack/).
Please refer to it for more details. We'll be running these steps from one of
our OpenMetal servers deployed with each new OpenStack instance. They can also
be run from a VM or a local machine.

## Prerequisites

- An OpenStack cloud with the following services enabled:
  - Keystone
  - Nova
  - Neutron
  - Cinder
  - Octavia

If you don't have an OpenStack cloud, you can deploy a free trial using
[OpenMetal Central](https://central.openmetal.io).

## Prepare OpenStack

### Setup CLI tools

We'll be using the OpenStack CLI tools to interact with the OpenStack cloud. If you
don't have them installed, complete the following steps
to [install the OpenStack CLI](/operators-manual/day-1/command-line/openstackclient.md).

### Create a project

Let's create a project for our cluster. Creating a project will allow us to
separate our cluster resources from other resources in the cloud. It will also
help us clean up our cluster resources when we're done with them.

```bash
openstack project create --domain default --description "kOps Cluster" kops
```

We'll add a user to the project. We're adding the admin user to the project, but
if you've already created an OpenStack user, you should use that user instead.

```bash
openstack role add --project kops --user admin admin
```

### Update project name

Replace `<project_id>` with the ID of the project you created in the previous
step.

```bash
export OS_PROJECT_ID=<project_id>
export OS_PROJECT_NAME=kops
```

### Create Swift object store

This object store will be used to store your cluster configuration file.

```bash
openstack container create kops
```

### Create application credentials

The credentials are saved as a secret in the cluster and used by kOps to interact
with the OpenStack cloud. Your personal credentials could also be used, but use
of application credentials is recommended.

```bash
openstack application credential create --description "kOps" kops
```

### Create Credentials file

Create a file named `app-creds.sh`

- Replace `<ip-address>` with the IP address of your OpenStack cloud. If you dont
know the URL to your keystone service, you can find it in the OpenStack dashboard
or by running `openstack endpoint list`.
- Replace `<secret-id>` with the id from the previous step.
- Replace `<secret>` with the secret from the previous step.

```bash
export OS_AUTH_TYPE=v3applicationcredential
export OS_AUTH_URL=http://<ip-address>:5000
export OS_IDENTITY_API_VERSION=3
export OS_REGION_NAME="iad3"
export OS_INTERFACE=public
export OS_APPLICATION_CREDENTIAL_ID=<secret-id>
export OS_APPLICATION_CREDENTIAL_SECRET=<secret>
```

### Source in the credentials

Next, we'll source in the credentials file. If you're using the same shell that
you used for the CLI, you'll need to log out and back in before sourcing the
credentials, as some environment variables set when using your personal credentials
can conflict with those for the application credentials.

```bash
exit
```

> Note: If you wish to retain your current shell the following command will
> extract all OpenStack related variables from the environment with `env` and
> unset them:
>
> ```bash
> unset $(env | awk -F'=' '/OS_/ {print $1}' | tr "\n" " ")
> ```

Log back in.

```bash
source app-creds.sh
```

## Deploy the Kubernetes cluster

### Install kOps CLI

```bash
curl -Lo kops https://github.com/kubernetes/kops/releases/download/v1.25.1/kops-linux-amd64
```

```bash
chmod +x kops
```

```bash
sudo mv kops /usr/local/bin/kops
```

### Generate SSH key

This key will be used to access the Kubernetes nodes.

```bash
ssh-keygen -t ed25519 -N '' -f ~/.ssh/id_kops
```

### Set state store

KOps will store the cluster configuration file in a Swift object store. Use the
one you created earlier as the state store.

```bash
export KOPS_STATE_STORE=swift://kops
```

### Install Kubectl

```bash
curl -LO https://storage.googleapis.com/kubernetes-release/release/v1.25.1/bin/linux/amd64/kubectl
```

```bash
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

### Create cluster configuration

The following command will create a cluster configuration file. It will be stored
in the Swift object store we created in a previous step. You may need to pull
some information from your OpenStack cloud.

OpenStack Values of note:

- `--image`: Operating system image
  - Found by running `openstack image list`
  - Supported operating systems: [kOps supported operating systems](https://github.com/kubernetes/kops/blob/v1.25.1/docs/operations/images.md).
- `--node-size`: Instance flavor
  - Found by running `openstack flavor list`.
  - Custom flavors can also be created in the OpenStack dashboard.
- `--zones`: Availability zone
  - Found by running `openstack availability zone list`.
- `--os-ext-net`: External network
  - Found by running `openstack network list --external`.

```bash
$ kops create cluster \
  --cloud openstack \
  --name my-cluster.k8s.local \
  --state ${KOPS_STATE_STORE} \
  --zones nova \
  --network-cidr 10.1.0.0/24 \
  --image "Ubuntu 20.04 (focal-amd64)" \
  --master-count=1 \
  --node-count=2 \
  --os-octavia=true \
  --node-size m1.medium \
  --master-size m1.medium \
  --etcd-storage-type __DEFAULT__ \
  --api-loadbalancer-type public \
  --topology private \
  --ssh-public-key ~/.ssh/id_kops.pub \
  --networking flannel \
  --os-ext-net External

---Output truncated---

Must specify --yes to apply changes

Cluster configuration has been created.

Suggestions:
 * list clusters with: kops get cluster
 * edit this cluster with: kops edit cluster my-cluster.k8s.local
 * edit your node instance group: kops edit ig --name=my-cluster.k8s.local nodes-nova
 * edit your master instance group: kops edit ig --name=my-cluster.k8s.local master-nova-1

Finally configure your cluster with: kops update cluster --name my-cluster.k8s.local --yes --admin
```

### Update cluster configuration

Now that we have a cluster configuration file, we can provide additional
configuration options.

> For an extensive list of options on the Cluster resource see: [Cluster Spec](https://kops.sigs.k8s.io/cluster_spec/).

For our example, we'll override a setting that will otherwise cause the nodes
to fail setup. This is a known issue with Ubuntu images and kubeadm. 

For more information see:
- [ERROR Swap: running with swap on is not supported. Please disable swap](https://github.com/kubernetes/kubeadm/issues/610)
or
- [Node swap support](https://github.com/kubernetes/enhancements/issues/2400).

We'll suppress the error by setting `kubelet.failSwapOn` to `false`. For
production use cases we recommend disabling swap.

```bash
kops edit cluster my-cluster.k8s.local
```

```yaml
  kubelet:
    failSwapOn: false
```

> Note!: You should already have a kubelet section.

### Deploy configuration

```bash
 kops update cluster --name my-cluster.k8s.local --yes --admin
```

### Validate Cluster

Our small 3-node cluster took about 8 minutes to deploy. If your deployment
is larger, it will take longer. Run the following command to watch the deployment
status.

```bash
$ kops validate cluster --wait 10m

---Output truncated---

Pod     kube-system/csi-cinder-controllerplugin-84b9c4955-dmjqv system-cluster-critical pod "csi-cinder-controllerplugin-84b9c4955-dmjqv" is pending

Validation Failed
W1010 22:13:19.203438 2645280 validate_cluster.go:232] (will retry): cluster not yet healthy
INSTANCE GROUPS
NAME            ROLE    MACHINETYPE     MIN     MAX     SUBNETS
master-nova     Master  m1.medium       1       1       nova
nodes-nova      Node    m1.medium       2       2       nova

NODE STATUS
NAME                    ROLE    READY
master-nova-d2gurm      master  True
nodes-nova-7oi4el       node    True
nodes-nova-ncdj6g       node    True

VALIDATION ERRORS
KIND    NAME                                    MESSAGE
Pod     kube-system/coredns-77bcddd996-jflxd    system-cluster-critical pod "coredns-77bcddd996-jflxd" is pending

Validation Failed
W1010 22:13:30.376327 2645280 validate_cluster.go:232] (will retry): cluster not yet healthy
INSTANCE GROUPS
NAME            ROLE    MACHINETYPE     MIN     MAX     SUBNETS
master-nova     Master  m1.medium       1       1       nova
nodes-nova      Node    m1.medium       2       2       nova

NODE STATUS
NAME                    ROLE    READY
master-nova-d2gurm      master  True
nodes-nova-7oi4el       node    True
nodes-nova-ncdj6g       node    True

Your cluster my-cluster.k8s.local is ready
```

## Test your cluster

### Get all pods

```bash
kubectl get pods --all-namespaces
```

Output

```bash
[root@comfortable-lamprey kops]# kubectl get pods -A
NAMESPACE      NAME                                          READY   STATUS    RESTARTS        AGE
kube-flannel   kube-flannel-ds-7tkwv                         1/1     Running   0               4m
kube-flannel   kube-flannel-ds-95qmb                         1/1     Running   1 (2m9s ago)    3m2s
kube-flannel   kube-flannel-ds-k4vcs                         1/1     Running   0               3m4s
kube-system    coredns-77bcddd996-978n5                      1/1     Running   0               3m59s
kube-system    coredns-77bcddd996-jflxd                      1/1     Running   0               2m19s
kube-system    coredns-autoscaler-975545559-rl2zl            1/1     Running   0               3m59s
kube-system    csi-cinder-controllerplugin-84b9c4955-dmjqv   5/5     Running   0               3m59s
kube-system    csi-cinder-nodeplugin-b24tf                   3/3     Running   0               3m2s
kube-system    csi-cinder-nodeplugin-pbncg                   3/3     Running   0               3m59s
kube-system    csi-cinder-nodeplugin-pmzb2                   3/3     Running   0               3m4s
kube-system    dns-controller-6c8954774c-n287p               1/1     Running   0               3m59s
kube-system    etcd-manager-events-master-nova-d2gurm        1/1     Running   0               3m38s
kube-system    etcd-manager-main-master-nova-d2gurm          1/1     Running   0               2m54s
kube-system    kops-controller-ltf7f                         1/1     Running   0               4m
kube-system    kube-apiserver-master-nova-d2gurm             2/2     Running   2 (5m ago)      3m15s
kube-system    kube-controller-manager-master-nova-d2gurm    1/1     Running   4 (4m59s ago)   4m12s
kube-system    kube-proxy-master-nova-d2gurm                 1/1     Running   0               3m25s
kube-system    kube-proxy-nodes-nova-7oi4el                  1/1     Running   0               90s
kube-system    kube-proxy-nodes-nova-ncdj6g                  1/1     Running   0               2m16s
kube-system    kube-scheduler-master-nova-d2gurm             1/1     Running   0               3m40s
kube-system    openstack-cloud-provider-hlhzx                1/1     Running   0               3m59s
```

### Verify OpenStack cloud provider services

Our installation allows you to provision volumes and load balancers. If you want
to validate the installation check out our other guides.

- [Validate Load Balancer (Octavia)](../openstack-provider/openstack-cloud-controller-manager.md#verify)
- [Validate Storage Class (Cinder)](../openstack-provider/cinder.md#verify)

## Troubleshooting

The kOps documentation provides helpful troubleshooting steps for common issues:
[Troubleshooting kOps clusters](https://kops.sigs.k8s.io/operations/troubleshoot/).

If you need to start over you can delete your cluster with the following command:

```bash
kops delete cluster --name my-cluster.k8s.local --yes
```
