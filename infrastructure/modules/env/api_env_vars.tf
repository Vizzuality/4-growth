
resource "random_password" "jwt_secret" {
  length           = 32
  special          = true
  override_special = "!#%&*()-_=+[]{}<>:?"
}

resource "aws_iam_access_key" "email_user_access_key" {
  user = module.email.iam_user.name
}

locals {
  api_secret_env_vars = {
    DB_HOST = module.postgresql.host
    DB_NAME = module.postgresql.db_name
    DB_PASSWORD = module.postgresql.password
    DB_USERNAME = module.postgresql.username
    DB_PORT = module.postgresql.port
    JWT_SECRET = random_password.jwt_secret.result
    AWS_SES_ACCESS_KEY_ID = aws_iam_access_key.email_user_access_key.id
    AWS_SES_ACCESS_KEY_SECRET = aws_iam_access_key.email_user_access_key.secret
    AWS_SES_DOMAIN = module.email.mail_from_domain
  }
  api_env_vars = {
  }
}