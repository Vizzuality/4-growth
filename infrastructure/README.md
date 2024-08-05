# 4-GROWTH Infrastructure

This document provides an overview of the infrastructure setup for the 4-GROWTH project.

## Infrastructure Overview

The infrastructure for the 4-GROWTH project is managed using Terraform. The main configuration is located in the `main.tf` file in the `infrastructure` directory. This file specifies the required providers, the backend for storing the Terraform state, and the modules used to create the infrastructure.

The infrastructure is divided into several modules, each responsible for a specific part of the infrastructure. The `state` module manages the state of the infrastructure, while the `client_ecr` and `api_ecr` modules manage the Elastic Container Registry (ECR) repositories for the client and API applications, respectively.

## Architecture

The infrastructure architecture is based on the following components:

1. ElasticBeanStalk environment and application, to host the Frontend, API and Database.
2. Elastic Container Registry (ECR) repositories for the client and API applications.
3. Load Balancer with HTTPS listener.
4. NGINX reverse proxy to distribute requests to the Frontend and API.


## Working with Terraform

To be able to plan / apply changes to the infrastructure, you need to have Terraform in its specified version installed. Please refer to the [official documentation](https://learn.hashicorp.com/tutorials/terraform/install-cli) for instructions on how to install Terraform.

The configuration requires you to have a AWS profile named `4-growth` configured in your `aws` cli. The profile should have the necessary permissions to create the resources specified in the configuration, but the name should match.


## Terraform State

The Terraform state is stored in an S3 bucket named `4growth-terraform-state`. The state is locked using a DynamoDB table named `4growth-terraform-state-lock` to prevent concurrent modifications.

## ECR Repositories

The ECR repositories are created using the `ecr` module. This module creates an ECR repository and a lifecycle policy for each application. The lifecycle policy specifies rules for retaining and expiring images based on their tags.

## IAM

The configuration creates a specific user for the deployment pipeline, right now with permissions to push / pull images to the ECR repositories. The user is created using the `iam` module.

## Deployment

The deployment is done using GitHub Actions. The deployment pipeline is defined in the `.github/workflows/deploy.yml` file. The pipeline consists of the following steps:

1. Builds the Docker images for the client and API applications.
2. Pushes the images to the ECR repositories.
3. Deploys the images to the ElasticBeanstalk environment, using the credentials for the specific IAM user created for the deployment pipeline.

