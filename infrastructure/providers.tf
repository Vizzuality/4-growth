provider "aws" {
  region = var.aws_region
  profile = var.aws_profile
}

# provider "github" {
#    owner = var.github_owner
#    token = var.github_token
# }