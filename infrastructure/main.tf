terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.14"
    }

  }

  // TF does not allow vars here. Use main vars or module outputs for other variables
  backend "s3" {
    bucket = "4growth-terraform-state"
    key = "state"
    region = "eu-west-3"
    // TODO: Use a generic profile name
    profile = "alex-4-growth"
    dynamodb_table = "4growth-terraform-state-lock"
  }

  required_version = "~> 1.3.2"
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