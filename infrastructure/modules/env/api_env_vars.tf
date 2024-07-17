
resource "random_password" "jwt_secret" {
  length           = 32
  special          = true
  override_special = "!#%&*()-_=+[]{}<>:?"
}

// TODO: We are using the count meta-argument in the postgresql module call to create instances conditionally to save costs
//       so the psql module becomes a list of objects. Once all environments are using a DB instance, we should remove the count argument and refactor this
//       to use the module output directly


locals {
  api_secret_env_vars = {
    DB_HOST = module.postgresql.host
    DB_NAME = module.postgresql.db_name
    DB_PASSWORD = module.postgresql.password
    DB_USERNAME = module.postgresql.username
    DB_PORT = module.postgresql.port
    JWT_SECRET = random_password.jwt_secret.result
  }
  api_env_vars = {
  }
}