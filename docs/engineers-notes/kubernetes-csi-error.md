---
slug: /engineers-notes/kubernetes-failed-to-detach-persistent-volume
---

# Kubernetes - Failed to detach Persistent Volume

This is an entry in our Engineering Notes. We record troubleshooting steps
and advice from our experience using similar tools to your teams.

## Problem: Failed to detach

Our team recently ran into an issue in our Kubernetes cluster where
`volumeattachment`'s failed to detach and caused a flood of errors in our
logging systems. The errors were thrown repeatedly in the logs of the `csi-attacher`
container. The `csi-attacher` is a sidecar container that is responsible
for attaching and detaching volumes to and from nodes. In our case,
the `csi-attacher` was part of the `csi-cinder-controllerplugin` pod in
the `kube-system` namespace.

The side effect of this error was a dramatic increase in resource utilization
on the node.

```text
request.go:530 Throttling request took 1.385373635s, request: PATCH:https://10.254.0.1:443/apis/storage.k8s.io/v1beta1/volumeattachments/csi-5321e82004036bca2c98cd2254de8568283a1e72a36cc21b1df53d2667de54e3
csi_handler.go:439 Saved detach error to "csi-5321e82004036bca2c98cd2254de8568283a1e72a36cc21b1df53d2667de54e3
csi_handler.go:99 Error processing csi-5321e82004036bca2c98cd2254de8568283a1e72a36cc21b1df53d2667de54e3": failed to detach: persistentvolume "pvc-5a4edc0a-20bf-418d-92a9-32dbfc952082" not found
controller.go:175 Started VA processing csi-5321e82004036bca2c98cd2254de8568283a1e72a36cc21b1df53d2667de54e3
csi_handler.go:89 CSIHandler: processing VA csi-5321e82004036bca2c98cd2254de8568283a1e72a36cc21b1df53d2667de54e3
csi_handler.go:140 Starting detach operation for "csi-5321e82004036bca2c98cd2254de8568283a1e72a36cc21b1df53d2667de54e3"
csi_handler.go:147 Detaching csi-5321e82004036bca2c98cd2254de8568283a1e72a36cc21b1df53d2667de54e3
csi_handler.go:428 Saving detach error to csi-5321e82004036bca2c98cd2254de8568283a1e72a36cc21b1df53d2667de54e3
```

## Solution: Force delete `VolumeAttachments`

The problem was that we had volume attachments that were defined in Kubernetes
but not in OpenStack. This caused an issue with the `csi-attacher` because it
was trying to detach the volume from the node but it was not able to find the
volume in OpenStack.

To fix this issue, we had to delete the volume attachments from Kubernetes. However,
we were not able to delete the volume attachments because it still attempted to
remove the volume from OpenStack. To get around this, we had to edit the
`volumeattachment` and remove the `finalizers`. This allowed the CSI driver to
delete the volume attachment from Kubernetes automatically.


### List all `VolumeAttachments` and `PersistentVolumes`

```bash
kubectl get pv
```

```bash
kubectl get volumeattachment
```

### Edit `VolumeAttachment` with the issue

Verify that the volume attachment doesn't have a volume associated with it.

```bash
kubectl edit volumeattachment csi-5321e82004036bca2c98cd2254de8568283a1e72a36cc21b1df53d2667de54e3
```

### Remove the finalizers and save the file

```yaml
  finalizers:
  - external-attacher/.....
```

### Delete the `VolumeAttachment`

If the volume attachment has not been automatically deleted, you should be
able to delete it now

```bash
kubectl delete volumeattachment csi-5321e82004036bca2c98cd2254de8568283a1e72a36cc21b1df53d2667de54e3
```
