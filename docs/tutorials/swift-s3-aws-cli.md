---
slug: /openstack-admin/use-aws-client-to-access-swift-s3-api
description: Learn how to access your OpenMetal clouds' Object store using awscli and the Swift S3 API.
---
# How to Configure and Use AWS Client for Swift S3 API Access on OpenMetal

## Objective

The Swift s3api middleware provides an S3 API compatibility layer on your
OpenMetal cloud. In this guide we will show you how access objects in your Ceph
backed object storage using a software designed to interact with S3-compatible
endpoints.

## Requirements

- [EC2 Credentials](swift-api-s3.md) generated for your cloud.

## Configure AWS client

Install the AWS client:

```shell
# Activate your virtual environment (optional but recommended)
source .venv/bin/activate

# Install the client packages with pip
pip install awscli awscli-plugin-endpoint
```

Configuring the installed client requires two files `~/.aws/credentials` and
`~/.aws/config`. These are defined as follows:

```shell
$ cat ~/.aws/credentials

[default]
aws_access_key_id = <access_key>
aws_secret_access_key = <secret_key>

$ cat ~/.aws/config 

[plugins]
endpoint = awscli_plugin_endpoint

[profile default]
region = iad3
s3 =
  endpoint_url = <cloud_ip_or_url>:8080/
  signature_version = s3v4
s3api =
  endpoint_url = <cloud_ip_or_url>:8080/
```

## Basic AWS client usage

List existing containers (buckets):

```shell
aws --profile default s3 ls
```

Create a new bucket:

```shell
aws s3api create-bucket --bucket test-bucket
```

Upload a local file to your cloud:

```shell
$ aws --profile default s3 cp test-file-up.txt s3://test-bucket/
upload: ./test-file-up.txt to s3://test-bucket/test-file-up.txt 
```

Download an object from your cloud:

```shell
$ aws --profile default s3 cp s3://test-bucket/test-file-down.txt test-file-down.txt 
download: s3://test-bucket/test-file-down.txt to ./test-file-down.txt
```

Delete an object:

```shell
$ aws --profile default s3 rm s3://test-bucket/test-file-down.txt 
delete: s3://test-bucket/test-file-down.txt
```

Delete an empty bucket:

```shell
$ aws --profile default s3 rb s3://test-bucket
remove_bucket: test-bucket
```

### Reference

- S3 client command [reference](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/s3/index.html)
