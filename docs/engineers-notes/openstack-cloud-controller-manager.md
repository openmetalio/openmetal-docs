---
slug: /kubernetes-guides/installing-the-kubernetes-openstack-cloud-controller-manager
---

# Installing the Kubernetes OpenStack Cloud Controller Manager

## Objective

After following this guide you will be able to create publicly
available endpoints from your Kubernetes cluster.

## Background

The OpenStack cloud provider allows the Kubernetes cluster to provision, monitor,
and remove resources necessary for operation of the cluster. The OpenStack cloud
provider implements interfaces defined by the Kubernetes cloud controller manager.
The cloud controller manager is a daemon that embeds the cloud-specific control
loops shipped with Kubernetes in the core. These loops were originally in the
kube-controller-manager. However, cloud providers move at a different pace and
schedule compared to the Kubernetes project, and abstracting the provider-specific
code to the cloud controller manager allows cloud vendors to evolve independently
from the core Kubernetes code.

After you create a Kubernetes cluster on OpenStack, you can use the OpenStack
cloud provider to create a load balancer for your Kubernetes services. You can
also use the cloud provider to create persistent volumes (PVs) backed by Cinder
block storage and dynamically provisioned volumes.

For more information, please see the cloud provider documentation:
[OpenStack Cloud Controller Manager](https://github.com/kubernetes/cloud-provider-openstack/blob/release-1.24/docs/openstack-cloud-controller-manager/using-openstack-cloud-controller-manager.md)

> Note: This documentation was written for Kubernetes version 1.24. If installing
> on a different Kubernetes version, please see the cooresponding documentation
> for that version: [Cloud Provider Openstack](https://github.com/kubernetes/cloud-provider-openstack)

## Prerequisites

- A Kubernetes cluster on OpenStack

## Generate application credentials

First, you'll need to create an application credential for Kubernetes to use. Here's
how you can do that with the OpenStack CLI. You can also do this through the Horizon.

```bash
openstack application credential create --description "Kubernetes" kubernetes
```

## Create configuration file

On an environment with access to Kubernetes CLI, create the following configuration
file. Name the file `cloud.conf`. This file is used by the OpenStack cloud provider
to authenticate with your OpenStack.

- `auth-url`: You can find this under "API Access" within your project. It's
  labeled as "Identity".
- `floating-network-id`: The ID of the external network floating IPs are issued on.
- `subnet-id`: The ID of the subnet within your network.

```ini
[Global]
auth-url=http://192.128.1.15:5000
application-credential-id=
application-credential-secret=

[LoadBalancer]
use-octavia=true
floating-network-id=
subnet-id=
```

## Create a secret

Create a secret with the configuration file.

```bash
kubectl create secret -n kube-system generic cloud-config --from-file=cloud.conf
```

## Deploy provider

### Deploy the OpenStack Cloud Controller Manager

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/cloud-provider-openstack/master/manifests/controller-manager/cloud-controller-manager-roles.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes/cloud-provider-openstack/master/manifests/controller-manager/cloud-controller-manager-role-bindings.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes/cloud-provider-openstack/master/manifests/controller-manager/openstack-cloud-controller-manager-ds.yaml
```

### Wait for pods to be ready

The provider will attempt to create a pod on each of your control plane nodes.
We'll watch for them to be ready.

```bash
kubectl get pods -n kube-system -w
```

Output:

```bash
NAME                                       READY   STATUS      RESTARTS      AGE
openstack-cloud-controller-manager-4qrdb   1/1     Running     0             2d1h
openstack-cloud-controller-manager-hjhn8   1/1     Running     0             2d1h
openstack-cloud-controller-manager-jqpbk   1/1     Running     0             2d1h
```

#### Troubleshooting

- If pods do not automatically deploy on control plane nodes

    During our testing with RKE1, we found that the pods did not deploy on the control
    plane nodes. We had to manually update the `nodeSelector` in the DaemonSet
    to add the label of our control plane nodes.

    The default `nodeSelector` is: `node-role.kubernetes.io/control-plane: ""`

    ``` yaml
    node-role.kubernetes.io/controlplane: "true"
    ```

    Note that `control-plane` becomes `controlplane`.

    Edit the DaemonSet with the following command to update the `nodeSelector`:

    ``` bash
    kubectl edit daemonset/openstack-cloud-controller-manager -n kube-system
    ```

## Verify

We'll verify the functionality of your cloud provider by creating a Kubernetes
load balancer service. This will create a load balancer in OpenStack and assign
a floating IP to it.

### Deploy a simply application

```bash
kubectl run hostname-server --image=lingxiankong/alpine-test --port=8080
```

### Create a load balancer service

```bash
kubectl expose pod hostname-server --type=LoadBalancer --target-port=8080 --port=80 --name hostname-server
```

### Watch for the service to be ready

When the service is ready, you'll see the `EXTERNAL-IP` field populated with
the floating IP of your load balancer. This may take a few minutes.

```bash
kubectl get svc hostname-server -w
```

Output:

```bash
NAME              TYPE           CLUSTER-IP      EXTERNAL-IP      PORT(S)        AGE
hostname-server   LoadBalancer   10.43.228.192   <pending>          80:31835/TCP   2d1h
```

Troubleshooting:

- If your service is stuck in a `pending` state, but your load balancer is
  created in OpenStack, you can assign a floating IP to the load balancer
  manually. The service will be automatically updated with the external IP.

### Verify the load balancer

```bash
curl http://<floating-ip>
```

Output:

```bash
hostname-server
```

## What's Next

Now that you've configured, deployed, and verified your cloud provider, you can
set up other cloud provider features. Cinder, Barbican, and Octavia are all supported
by the cloud provider.

We'll cover how to configure them in our next Kubernetes guides. For now, please
see the [Cloud Provider OpenStack](https://github.com/kubernetes/cloud-provider-openstack).
