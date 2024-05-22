variable "repo_name" {
  type = string
}

variable "secret_map" {
  type    = map(string)
  default = {}
}

variable "variable_map" {
  type    = map(string)
  default = {}
}

variable "github_owner" {
  type        = string
  description = "Owner of the Github repository where the code is hosted"
}

variable "github_token" {
  type        = string
  description = "Github token to access the repository"
}

