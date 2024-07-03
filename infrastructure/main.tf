terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.14"
    }
  }

  // TF does not allow vars here. Use main vars or module outputs for other variables
  backend "s3" {
    bucket = "4-growth-terraform-state"
    key = "state"
    region = "eu-west-3"
    profile = "4-growth"
    dynamodb_table = "4-growth-terraform-state-lock"
  }



  required_version = "~> 1.9.0"
}

data "aws_vpc" "default_vpc" {
  default = true
}

data "aws_availability_zones" "all_available_azs" {
  state = "available"
}

# THIS IS TO FILTER THE AVAILABLE ZONES BY EC2 INSTANCE TYPE AVAILABILITY
# returns zone ids that have the requested instance type available
data "aws_ec2_instance_type_offerings" "azs_with_ec2_instance_type_offering" {
  filter {
    name   = "instance-type"
    values = ["m5a.large"]
  }

  filter {
    name   = "location"
    values = data.aws_availability_zones.all_available_azs.zone_ids
  }

  location_type = "availability-zone-id"
}

# THIS IS TO FIND THE NAMES OF THOSE ZONES GIVEN BY IDS FROM ABOVE...
# because we need the names to pass to the staging module
data "aws_availability_zones" "azs_with_ec2_instance_type_offering" {
  filter {
    name   = "zone-id"
    values = sort(data.aws_ec2_instance_type_offerings.azs_with_ec2_instance_type_offering.locations)
  }
}

# THIS IS TO FILTER THE SUBNETS BY AVAILABILITY ZONES WITH EC2 INSTANCE TYPE AVAILABILITY
# so that we know which subnets can be passed to the beanstalk resource without upsetting it
data "aws_subnets" "subnets_with_ec2_instance_type_offering_map" {
  for_each = toset(
    data.aws_ec2_instance_type_offerings.azs_with_ec2_instance_type_offering.locations
  )

  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default_vpc.id]
  }

  filter {
    name   = "availability-zone-id"
    values = ["${each.value}"]
  }
}

locals {
  subnets_with_ec2_instance_type_offering_ids = sort([
    for k, v in data.aws_subnets.subnets_with_ec2_instance_type_offering_map : v.ids[0]
  ])
}



module state {
  source = "./modules/state"
  project_name = var.project_name
  aws_region = var.aws_region
  aws_profile = var.aws_profile
}

module client_ecr {
  source = "./modules/ecr"
  project_name = var.project_name
  repo_name = "client"
}

module api_ecr {
  source = "./modules/ecr"
  project_name = var.project_name
  repo_name = "api"
}

module "iam" {
  source = "./modules/iam"
}

// TODO: make this dynamic for all available envs with prefixed names per env


resource "aws_iam_service_linked_role" "elasticbeanstalk" {
  aws_service_name = "elasticbeanstalk.amazonaws.com"
}

module "dev" {
  source                                        = "./modules/env"
  domain                                        = "dev.4-growth.dev-vizzuality.com"
  project                                       = var.project_name
  environment                                   = "dev"
  aws_region                                    = var.aws_region
  vpc                                           = data.aws_vpc.default_vpc
  subnet_ids                                    = local.subnets_with_ec2_instance_type_offering_ids
  availability_zones                            = data.aws_availability_zones.azs_with_ec2_instance_type_offering.names
  beanstalk_platform                            = "64bit Amazon Linux 2023 v4.3.2 running Docker"
  beanstalk_tier                                = "WebServer"
  ec2_instance_type                             = "t3.medium"
  elasticbeanstalk_iam_service_linked_role_name = aws_iam_service_linked_role.elasticbeanstalk.name
  repo_name                                     = var.project_name
  cname_prefix                                  = "4-growth-dev-environment"
  github_owner = var.github_owner
  github_token = var.github_token
  create_env = true
}


module "staging" {
  source                                        = "./modules/env"
  domain                                        = "staging.4-growth.dev-vizzuality.com"
  project                                       = var.project_name
  environment                                   = "staging"
  aws_region                                    = var.aws_region
  vpc                                           = data.aws_vpc.default_vpc
  subnet_ids                                    = local.subnets_with_ec2_instance_type_offering_ids
  availability_zones                            = data.aws_availability_zones.azs_with_ec2_instance_type_offering.names
  beanstalk_platform                            = "64bit Amazon Linux 2023 v4.3.3 running Docker"
  beanstalk_tier                                = "WebServer"
  ec2_instance_type                             = "t3.medium"
  elasticbeanstalk_iam_service_linked_role_name = aws_iam_service_linked_role.elasticbeanstalk.name
  repo_name                                     = var.project_name
  cname_prefix                                  = "4-growth-staging-environment"
  github_owner = var.github_owner
  github_token = var.github_token
}

module "production" {
  source                                        = "./modules/env"
  domain                                        = "visualisation.4growth-project.eu"
  project                                       = var.project_name
  environment                                   = "production"
  aws_region                                    = var.aws_region
  vpc                                           = data.aws_vpc.default_vpc
  subnet_ids                                    = local.subnets_with_ec2_instance_type_offering_ids
  availability_zones                            = data.aws_availability_zones.azs_with_ec2_instance_type_offering.names
  beanstalk_platform                            = "64bit Amazon Linux 2023 v4.3.3 running Docker"
  beanstalk_tier                                = "WebServer"
  ec2_instance_type                             = "t3.small"
  elasticbeanstalk_iam_service_linked_role_name = aws_iam_service_linked_role.elasticbeanstalk.name
  repo_name                                     = var.project_name
  github_owner = var.github_owner
  github_token = var.github_token
}

module "github" {
  source       = "./modules/github"
  repo_name    = var.project_name
  github_owner = var.github_owner
  github_token = var.github_token
  global_secret_map = {
    TF_PROJECT_NAME                    = var.project_name
    TF_PIPELINE_USER_ACCESS_KEY_ID     = module.iam.pipeline_user_access_key_id
    TF_PIPELINE_USER_SECRET_ACCESS_KEY = module.iam.pipeline_user_access_key_secret
    TF_CLIENT_REPOSITORY_NAME          = module.client_ecr.repository_name
    TF_API_REPOSITORY_NAME             = module.api_ecr.repository_name
    TF_AWS_REGION                      = var.aws_region
    TF_AUTH_CREDENTIALS                = var.auth_credentials
  }
}

