# 4-GROWTH Infrastructure

This document provides an overview of the infrastructure setup for the 4-GROWTH project.

## Infrastructure Overview

The infrastructure for the 4-GROWTH project is managed using Terraform. The main configuration is located in the `main.tf` file in the `infrastructure` directory. This file specifies the required providers, the backend for storing the Terraform state, and the modules used to create the infrastructure.

The infrastructure is divided into several modules, each responsible for a specific part of the infrastructure. The `state` module manages the state of the infrastructure, while the `client_ecr` and `api_ecr` modules manage the Elastic Container Registry (ECR) repositories for the client and API applications, respectively.

## Terraform State

The Terraform state is stored in an S3 bucket named `4growth-terraform-state`. The state is locked using a DynamoDB table named `4growth-terraform-state-lock` to prevent concurrent modifications.

## ECR Repositories

The ECR repositories are created using the `ecr` module. This module creates an ECR repository and a lifecycle policy for each application. The lifecycle policy specifies rules for retaining and expiring images based on their tags.

## IAM

The configuration creates a specific user for the deployment pipeline, right now with permissions to push / pull images to the ECR repositories. The user is created using the `iam` module.

## TODO

There are several aspects of the infrastructure that still need to be documented:

- **Deployment Procedures**: 
- **Additional Documentation**: 