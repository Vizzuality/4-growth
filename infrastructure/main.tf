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

module "iam" {
  source = "./modules/iam"
}


module "github" {
    source = "./modules/github"
    repo_name = var.project_name
    github_owner = var.github_owner
    github_token = var.github_token
    secret_map = {
        TF_PROJECT_NAME                    = var.project_name
        TF_PIPELINE_USER_ACCESS_KEY_ID     = module.iam.pipeline_user_access_key_id
        TF_PIPELINE_USER_SECRET_ACCESS_KEY = module.iam.pipeline_user_access_key_secret
        TF_CLIENT_REPOSITORY_NAME          = module.client_ecr.repository_name
        TF_API_REPOSITORY_NAME             = module.api_ecr.repository_name
        TF_AWS_REGION                      = var.aws_region
    }
}