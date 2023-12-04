---
slug: /openstack-admin/swift-s3-api-access-with-s3cmd
description: Learn how to access your OpenMetal clouds' Object store using s3cmd and the Swift S3 API
sidebar_position: 9
---
# How to Configure and Use s3cmd for Swift S3 API Access on OpenMetal

## Objective

This guide will show you how to configure and use the s3cmd CLI tool to interact
with your OpenMetal clouds' Ceph-backed Object store via the Swift S3 API.

## Prerequisites

- [EC2 Credentials](swift-api-s3.md) generated for your cloud.

## Install

- Create and/or activate your virtual environment:
  
  ```shell
  virtualenv .venv

  source .venv/bin/activate
  ```

- Install `s3cmd` with `pip`:
  
  ```shell
  pip install s3cmd
  ```

## Configure

- `s3cmd --configure` provides interactive configuration prompts. You will need
  to enter only **Access Key**, **Secret Key**, **S3 Endpoint**, and
  **Use HTTPS protocol**:

- To gather your exact endpoint run the following command

```shell
openstack endpoint list --interface public --service object-store
```

```shell
  $ s3cmd --configure
  [...]
  Access Key: <access_key>
  Secret Key: <secret_key>
  [...]
  S3 Endpoint: <cloud_ip_or_configured_domain:port>
  [...]
  DNS-style bucket+hostname:port template for accessing a bucket: <FQDN only (ie. mycloud.openmetal.cloud)>
  [...]
  Use HTTPS protocol: <yes/no determined by your clouds TLS status>
  [...]
  Test access with supplied credentials? [Y/n] y
  [...]
  ```

## Basic Usage

- List available buckets and bucket contents with `s3cmd ls`:
  
  ```shell
  $ s3cmd ls
  2022-11-01 16:08  s3://openmetal-bucket

  $ s3cmd ls s3://openmetal-bucket
  2022-11-01 16:12           37  s3://openmetal-bucket/important-file.txt
  ```

- Create a new bucket with `s3cmd mb`:
  
  ```shell
  $ s3cmd mb s3://test-bucket
  Bucket 's3://test-bucket/' created
  ```

- Upload a local file to your bucket with `s3cmd put`:
  
  ```shell
  $ s3cmd put important-archive.zip s3://test-bucket/important-archive.zip
  upload: 'important-archive.zip' -> 's3://test-bucket/important-archive.zip'  [part 1 of 4, 15MB] [1 of 1]
   15728640 of 15728640   100% in    1s     9.45 MB/s  done
  upload: 'important-archive.zip' -> 's3://test-bucket/important-archive.zip'  [part 2 of 4, 15MB] [1 of 1]
   15728640 of 15728640   100% in    1s    11.71 MB/s  done
  upload: 'important-archive.zip' -> 's3://test-bucket/important-archive.zip'  [part 3 of 4, 15MB] [1 of 1]
   15728640 of 15728640   100% in    1s    13.89 MB/s  done
  upload: 'important-archive.zip' -> 's3://test-bucket/important-archive.zip'  [part 4 of 4, 122KB] [1 of 1]
   125565 of 125565   100% in    0s   170.41 KB/s  done
  ```

- Download a file from your bucket with `s3cmd get`:
  
  ```shell
  $ s3cmd get s3://test-bucket/important-file.txt
  download: 's3://test-bucket/important-file.txt' -> './important-file.txt'  [1 of 1]
   37 of 37   100% in    0s    50.40 B/s  done
  ```

- Delete file from bucket with `s3cmd rm`:
  
  ```shell
  $ s3cmd rm s3://test-bucket/important-file.txt
  delete: 's3://test-bucket/important-file.txt'
  ```

- Delete an empty bucket with `s3cmd rb`:
  
  ```shell
  $ s3cmd rb s3://test-bucket
  Bucket 's3://test-bucket/' removed
  ```

### Reference

- [s3cmd CLI tool](https://github.com/s3tools/s3cmd)
