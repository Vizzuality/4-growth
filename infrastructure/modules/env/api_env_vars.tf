
resource "random_password" "jwt_secret" {
  length           = 32
  special          = true
  override_special = "!#%&*()-_=+[]{}<>:?"
}

// TODO: We are using the count meta-argument in the postgresql module call to create instances conditionally to save costs
//       so the psql module becomes a list of objects. Once all environments are using a DB instance, we should remove the count argument and refactor this
//       to use the module output directly

locals {
  postgresql = length(module.postgresql) > 0 ? module.postgresql[0] : {}
}

locals {
  api_secret_env_vars = {
    DB_HOST = lookup(local.postgresql, "host", null)
    DB_NAME = lookup(local.postgresql, "db_name", null)
    DB_PASSWORD = lookup(local.postgresql, "password", null)
    DB_USERNAME = lookup(local.postgresql, "username", null)
    DB_PORT = lookup(local.postgresql, "port", null)
    JWT_SECRET = random_password.jwt_secret.result
  }
  api_env_vars = {
  }
}