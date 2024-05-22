terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.14"
    }
#     github = {
#       source  = "integrations/github"
#       version = "~> 4.0"
#     }

  }

  // TF does not allow vars here. Use main vars or module outputs for other variables
  backend "s3" {
    bucket = "4-growth-terraform-state"
    key = "state"
    region = "eu-west-3"
    profile = "4-growth"
    dynamodb_table = "4-growth-terraform-state-lock"
  }
#   backend "local" {
#     path = "./state.json"
#   }


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
    }
}