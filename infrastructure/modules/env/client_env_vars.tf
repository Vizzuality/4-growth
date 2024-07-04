resource "random_string" "next_auth_secret"{
  length = 64
  special = true
}


locals {
  client_secret_env_vars = {
    NEXTAUTH_SECRET = random_string.next_auth_secret.result
  }
  client_env_vars = {
    NEXT_PUBLIC_API_URL = "https://${var.environment}.4-growth.dev-vizzuality.com/api"
    NEXTAUTH_URL        = "https://${var.environment}.dev.4-growth.dev-vizzuality.com/auth/api"
  }
}