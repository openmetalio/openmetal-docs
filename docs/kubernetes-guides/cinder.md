---
slug: /kubernetes-guides/configuring-openstack-cinder-with-kubernetes
sidebar_position: 6
---

# Configuring OpenStack Cinder with Kubernetes

This guide will walk you through configuring OpenStack Cinder with Kubernetes.
OpenStack Cinder is a block storage service that allows you to create persistent
volumes for your Kubernetes cluster. After following this guide, you will be able
to create persistent volumes backed by Cinder block storage.

We're using the official OpenStack documentation as a reference for this guide.
You can find the official documentation here: [Using Cinder CSI Plugin](https://github.com/kubernetes/cloud-provider-openstack/blob/v1.24.2/docs/cinder-csi-plugin/using-cinder-csi-plugin.md)

## Objectives

- Connect your Kubernetes cluster to OpenStack Cinder.
- Create a storage class for your Kubernetes cluster.
- Create a persistent volume claim (PVC) and persistent volume (PV) backed by
  Cinder.

## Prerequisites

- A Kubernetes cluster on OpenStack
- Installed and configured [OpenStack Cloud Controller Manager](./openstack-cloud-controller-manager.md)

## Configure OpenStack Cinder

### Clone the CSI Cinder repository

```bash
git clone https://github.com/kubernetes/cloud-provider-openstack && cd cloud-provider-openstack
```

Checkout the tag that matches your Kubernetes version. For example, if you're
running Kubernetes 1.24.2, you would checkout the `v1.24.2` tag.

```bash
git checkout tags/v1.24.2
```

### Optional - Setup Cloud Config Secret

If you followed our previous guide on installing the OpenStack Cloud Controller
Manager, you should already a secret named `cloud-config` in the `kube-system`
namespace.

Verify that the secret exists:

```bash
kubectl get secret -n kube-system cloud-config
```

If you have not already created this secret, please follow the steps here:
[Creating Application Secret](./openstack-cloud-controller-manager.md#generate-application-credentials)
to generate application credentials, format the config file, and create the
secret.

### Install the CSI Cinder controller plugin

The manifests included to deploy the CSI Cinder controller plugin are located in
the `manifests/cinder-csi-plugin` directory.

Before deploying the manifests, we're going to delete one of the manifests that
is not needed for this guide. The `csi-secret-cinderplugin.yaml` manifest is
used to create a secret that is used to authenticate with the OpenStack API. We
will be using the `cloud-config` secret that we created in the previous step or
already exists in your cluster.

#### Remove the csi-secret-cinderplugin.yaml manifest

```bash
rm manifests/cinder-csi-plugin/csi-secret-cinderplugin.yaml
```

#### Deploy the CSI Cinder controller plugin

```bash
kubectl -f manifests/cinder-csi-plugin/ apply
```

#### Verify the CSI Cinder pods are running

This may take a few minutes to complete. If the pods do not start, please check
the logs for any errors. A common error is that the `cloud-config` secret is not
found or is incorrectly formatted.

```bash
kubectl get pods -n kube-system | grep csi-cinder
```

#### View CSI Drivers

```bash
kubectl get csidrivers.storage.k8s.io
```

Output:

```bash
NAME                       ATTACHREQUIRED   PODINFOONMOUNT   STORAGECAPACITY   TOKENREQUESTS   REQUIRESREPUBLISH   MODES                  AGE
cinder.csi.openstack.org   true             true             false             <unset>         false               Persistent,Ephemeral   19h
```

### Create a Cinder storage class

A storage class is used to define the parameters that are used to create a
persistent volume. The storage class is used to create a persistent volume claim
(PVC) that is then used to create a persistent volume (PV). The PV is then used
by a pod to store data.

```bash
kubectl apply -f - <<EOF
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: csi-sc-cinder
  annotations:
    storageclass.kubernetes.io/is-default-class: "true"
provisioner: cinder.csi.openstack.org
parameters:
  availability: nova
allowVolumeExpansion: true
volumeBindingMode: Immediate
EOF
```

## Verify

### Create a persistent volume claim

Now that we have a storage class, we can create a persistent volume claim (PVC).
This will create a persistent volume (PV) that is backed by Cinder block storage.

In the previous step, we set the cinder storage class as the default storage
class. This means that we do not need to specify the storage class in the PVC. The
`storageClassName` field is optional, but we've included it in the example below
for clarity.

```bash
kubectl apply -f - <<EOF
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: test-volume
  namespace: default
spec:
  accessModes:
  - ReadWriteOnce
  storageClassName: csi-sc-cinder
  resources:
    requests:
      storage: 1Gi
EOF
```

#### Verify the PVC is created

```bash
kubectl get pvc -A
```

OUTPUT:

```text
NAMESPACE   NAME          STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS    AGE
default     test-volume   Bound    pvc-25cda9ab-6dfd-4aba-b629-f6c78d18cd05   1Gi        RWO            csi-sc-cinder   67m
```

### Check OpenStack Cinder

Verify that the volume was created in OpenStack Cinder. We can do this by
logging into the OpenStack dashboard or by using the OpenStack CLI.

```bash
openstack volume list
```

Output:

```bash
+--------------------------------------+------------------------------------------+-----------+------+-------------+
| ID                                   | Name                                     | Status    | Size | Attached to |
+--------------------------------------+------------------------------------------+-----------+------+-------------+
| f88eb9fc-3919-4918-b94e-c7ec880eae92 | pvc-25cda9ab-6dfd-4aba-b629-f6c78d18cd05 | available |    1 |             |
+--------------------------------------+------------------------------------------+-----------+------+-------------+

```
