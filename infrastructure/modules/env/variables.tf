variable "aws_region" {
  type        = string
  description = "AWS region"
}

variable "domain" {
  type = string
}

variable "project" {
  type        = string
  description = "Short name of the project, will be used to prefix created resources"
}

variable "environment" {
  type        = string
  description = "Name of the environment, will be used to prefix created resources"
}

variable "vpc" {
}

variable "tags" {
  default     = {}
  description = "Additional tags to add to resources"
}

variable "subnet_ids" {
}

variable "availability_zones" {
  type = list(string)
}

variable "beanstalk_platform" {
  type        = string
  description = "The Elastic Beanstalk platform to use"
}

variable "beanstalk_tier" {
  type        = string
  description = "The Elastic Beanstalk tier to use"
}

variable "ec2_instance_type" {
  type        = string
  description = "EC2 instance type for the server"
}


variable "elasticbeanstalk_iam_service_linked_role_name" {
  type        = string
  description = "The IAM service linked role to use for the environment"
}

variable "repo_name" {
  type        = string
  description = "Name of the Github repository where the code is hosted"
}