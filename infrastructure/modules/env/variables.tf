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

variable "cname_prefix" {
  type        = string
  description = "The CNAME prefix to use for the environment"
  default     = null
}
variable "github_owner" {
  type        = string
  description = "Owner of the Github repository where the code is hosted"
}

variable "github_token" {
  type        = string
  description = "Github token to access the repository"
}

# RDS

variable "rds_instance_class" {
  type        = string
  description = "Instance type of Aurora PostgreSQL server"
  default     = null
}

variable "rds_engine_version" {
  type        = string
  description = "RDS Database engine version"
  default     = null
}

variable "rds_instance_count" {
  type        = number
  default     = 1
  description = "Number of Aurora PostgreSQL instances before autoscaling"
}

variable "rds_log_retention_period" {
  type        = number
  default     = 1
  description = "Time in days to keep log files in cloud watch"
}

variable "rds_backup_retention_period" {
  type        = number
  default     = 7
  description = "Time in days to keep db backups"
}

variable "contact_email" {
  type        = string
  description = "Email address where contact form submissions will be sent"
  default     = null
}

variable "github_additional_environment_secrets" {
  type        = map(string)
  description = "Github additional environment-specific secrets"
  default     = {}
}

variable "github_additional_environment_variables" {
  type        = map(string)
  description = "Github additional environment-specific variables"
  default     = {}
}
