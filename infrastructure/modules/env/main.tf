

module "beanstalk" {
  source = "../beanstalk"
  project                                       = var.project
  environment                                   = var.environment
  region                                        = var.aws_region
  application_name                              = "${var.project}-${var.environment}"
  application_environment                       = "${var.project}-${var.environment}-environment"
  solution_stack_name                           = var.beanstalk_platform
  tier                                          = var.beanstalk_tier
  tags                                          = var.tags
  vpc                                           = var.vpc
  public_subnets                                = var.subnet_ids
  elb_public_subnets                            = var.subnet_ids
  ec2_instance_type                             = var.ec2_instance_type
  domain                                        = var.domain
  acm_certificate                               = aws_acm_certificate.acm_certificate
  elasticbeanstalk_iam_service_linked_role_name = var.elasticbeanstalk_iam_service_linked_role_name
  cname_prefix                                  = var.cname_prefix
}

module "postgresql" {
  source = "../postgresql"
  log_retention_period        = var.rds_log_retention_period
  subnet_ids                  = var.subnet_ids
  project                     = var.project
  environment                 = var.environment
  rds_backup_retention_period = var.rds_backup_retention_period
  rds_user_name               = "postgres"
  rds_engine_version          = var.rds_engine_version
  rds_instance_class          = var.rds_instance_class
  rds_instance_count          = var.rds_instance_count
  tags                        = var.tags
  vpc_id                      = var.vpc.id
  rds_port                    = 5432
  vpc_cidr_block              = var.vpc.cidr_block
  availability_zones          = var.availability_zones
  database_name               = var.project
}

module "github" {
  source = "../github"
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
    NEXTAUTH_SECRET                    = var.next_auth_secret
  }
  variable_map = {
    NEXT_PUBLIC_API_URL                = "https://dev.4-growth.dev-vizzuality.com/api"
    NEXTAUTH_URL                       = "https://dev.4-growth.dev-vizzuality.com/auth/api"
  }
}
