---
sidebar_position: 1
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Container Orchestration with OpenStack Heat

## Introduction

This guide provides an introduction to Heat Orchestration through
OpenStack. Outlined within this article are the basics of Orchestration
and the mechanics of the Heat Orchestration Engine. Then we review a
sample of a Heat Orchestration Template and provide the appropriate
syntax. Lastly, we cover how to deploy a template and check the status
of a Heat Stack.

## Overview of Heat Orchestration

Orchestration tools utilize automation to deploy, manage, scale, and
network containers. Within OpenStack, the primary orchestration
component is Heat. Heat uses an orchestration engine for the automation
of resources, infrastructure, applications, and services. These created
resources are referred to as Stacks. Heat Stacks are deployed using Heat
Orchestration Templates also referred to as HOT templates. HOT templates
are created in YAML that passes instructions to the Heat Engine
specifying the resources to be deployed.

### How to View Heat Stacks in the Dashboard

This page lists every stack in the current project and is where new stacks are created.

<Tabs groupId="dashboard">
<TabItem value="skyline" label="Skyline" default>

Go to **Orchestration -> Stacks**.

![Stacks page listing existing stacks](images/skyline-stack-list.png)

</TabItem>
<TabItem value="hz" label="Horizon">

Go to **Project -> Orchestration -> Stacks**.

![Stacks page in Horizon](images/hz-stacks.png)

</TabItem>
</Tabs>

### Architecture

Heat API receives rest API calls from the following sources: the dashboard,
HOT Templates, and through the Heat Client. The Heat API is then passed
to RabbitMQ or another message broker which activates the Heat
Orchestration Engine. The Heat Orchestration Engine then connects to
resources including Nova, Glance, Neutron, and Cinder and parses
instructions from the HOT template for functions and parameters. These
functions and parameters are then used to create resources known as
stacks.

## Heat Orchestration Template Components

Central to the deployment of Heat and the creation of Stacks is the use
of templates. Heat Templates are written in YAML with the following
structure:

### Template Version

The template version is formatted as date and corresponds to different
versions of heat. The template version tells Heat how the template will
be structured, what features can be validated, and what resources can be
created. Currently, the latest template version that is supported is
2018-08-31 (rocky).

### Description

Although optional, a description is highly recommended as it outlines
the intended function of the template. This is particularly useful for
templates that are not frequently used or are intended to be shared
among various members of a team or project.

### Parameters

Parameters are optional but allow a user to pass additional values to
the template. These values are used to overwrite any default settings
that are specified in the resources section.

### Resources

Resources are what are ultimately created by the Heat Orchestration
Engine. These values can be default values or input from the parameters
above.

### Output

Output in a Heat Template is optional. However, you can pass values from
Heat upon execution of the template. These values are accessed through
Heat API or client tools.

## Sample Heat Orchestration Template

The following is an example of a Heat Orchestration Template to deploy
an instance. In this example, all resources receive their values fed
separately as parameters. When formatting parameters, each parameter is
grouped in a nested block. The first line contains the name of the
parameter and additional attributes are grouped below each element.

### Attributes

- Parameter Name: Name of Parameter
- Type: Required value that supports the following types: **string**,
    **comma\_delimited\_list**, **json**, **boolean**
- Label: Optional attribute, creates a name for the parameter for
    additional readability
- Description: Optional attribute, creates a description for parameter
- Default: Optional attribute, default values for parameters if input
    is not specified by the user

Example Heat Orchestration Template:

    heat_template_version: 2018-03-02
    
    description: Simple template to deploy a single instance
    
    parameters:
      key_name:
        type: string
        label: Key Name
        description: Name of key-pair to be used for compute instance
      image_id:
        type: string
        label: Image ID
        description: Image to be used for compute instance
      instance_type:
        type: string
        label: Instance Type
        description: Type of instance (flavor) to be used
      network_name:
        type: string
        description: The network to be used
      security_groups:
        type: comma_delimited_list
        description: Name of the Security Group
    
    resources:
      my_instance:
        type: OS::Nova::Server
        properties:
          key_name: { get_param: key_name }
          image: { get_param: image_id }
          networks:
            - network: { get_param: network_name }
          flavor: { get_param: instance_type }
          security_groups: { get_param: security_groups }

## Deploying a Heat Template

Confirm you have the correct project selected.

<Tabs groupId="dashboard">
<TabItem value="skyline" label="Skyline" default>

Go to **Orchestration -> Stacks** and click **Create Stack**. This opens a two-step wizard.

### Step 1: Prepare Template

Paste the template into **Template Content**, or upload it as a file. Give it a **Template Name**.

![Create Stack, Prepare Template step](images/skyline-create-stack-template.png)

**Figure 1:** Prepare Template

Click **Next**.

### Step 2: Orchestration information

Skyline reads the template's `parameters` section and renders an input for each one. For the example template above, that is:

- **Stack Name**
- **Creation Timeout (Minutes)**
- **Fail Rollback**
- **Key Name**
- **Image ID**
- **Instance Type** — the flavor
- **network_name**
- **security_groups**

![Create Stack, Orchestration information step](images/skyline-create-stack-params.png)

**Figure 2:** Orchestration information

Click **OK** to create the stack.

</TabItem>
<TabItem value="hz" label="Horizon">

Go to **Project -> Orchestration -> Stacks** and click **Launch Stack**.

![Select Template dialog in Horizon](images/hz-launch-stack.png)

**Figure 1:** Select Template

- **Template Source**: **File** to upload the template, or **Direct Input** to paste it.
- **Environment Source**: optional.

Click **Next**. Horizon reads the template's `parameters` section and renders an input for each one, alongside **Stack Name**, **Creation Timeout**, **Rollback On Failure**, and the password for your user.

Click **Launch** to create the stack.

</TabItem>
</Tabs>

## Viewing Recently Deployed Stacks

Switch to the project where the stack was created. The list shows the stack and its current status. Click the stack name for its detail page, which includes a copy of the template used to create it.

<Tabs groupId="dashboard">
<TabItem value="skyline" label="Skyline" default>

Go to **Orchestration -> Stacks**.

![Stacks list showing the test stack](images/skyline-stack-list.png)

**Figure 3:** Stacks Created within Admin Project

The detail page tabs are **Detail**, **Stack Resources**, **Stack Events**, and **YAML File**.

![Stack detail page](images/skyline-stack-detail.png)

**Figure 4:** Overview of Test Stack

</TabItem>
<TabItem value="hz" label="Horizon">

Go to **Project -> Orchestration -> Stacks**.

![Stacks list in Horizon](images/hz-stacks.png)

**Figure 3:** Stacks Created within Admin Project

The detail page tabs are **Topology**, **Overview**, **Resources**, **Events**, and **Template**.

![Stack detail page in Horizon](images/hz-stack-detail.png)

**Figure 4:** Overview of Test Stack

</TabItem>
</Tabs>

## Additional Resources for OpenStack Heat Service

For the latest on OpenStack Heat Documentation visit [Welcome to the
Heat documentation](https://docs.openstack.org/heat/latest/#). Further
reading regarding Heat architecture can be found at [Heat
architecture](https://docs.openstack.org/heat/latest/developing_guides/architecture.html).
Additionally, OpenStack has a guide for creating your first stack
through heat that can be found at [Creating your first
stack](https://docs.openstack.org/heat/latest/getting_started/create_a_stack.html).
