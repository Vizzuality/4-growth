output "security_group_id" {
  value       = aws_security_group.postgresql.id
  description = "Security group ID to access postgresql database"
}

output "postgresql-password-secret-arn" {
  value = aws_secretsmanager_secret.postgresql-admin.arn
}

output "postgresql-password-secret-version-arn" {
  value = aws_secretsmanager_secret_version.postgresql-admin.arn
}

output "username" {
  value     = aws_db_instance.postgresql.username
  sensitive = true
}

output "password" {
  value     = aws_db_instance.postgresql.password
  sensitive = true
}

output "host" {
  value = aws_db_instance.postgresql.address
}

output "port" {
  value = aws_db_instance.postgresql.port
}

output "db_name" {
  value = aws_db_instance.postgresql.db_name
}
