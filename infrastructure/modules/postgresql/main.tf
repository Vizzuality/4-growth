########################
## Cluster
########################

resource "aws_db_instance" "postgresql" {
  identifier              = "${var.project}-${var.environment}-db"
  engine                  = "postgres"
  engine_version          = var.rds_engine_version
  instance_class          = var.rds_instance_class
  availability_zone       = var.availability_zones[0]
  db_name                 = replace(var.database_name, "-", "")
  username                = var.rds_user_name
  password                = random_password.postgresql_superuser.result
  backup_retention_period = 5
  allocated_storage       = 5

  maintenance_window = "Mon:00:00-Mon:03:00"
  backup_window      = "03:00-06:00"

  deletion_protection = true

  vpc_security_group_ids = [
    aws_security_group.postgresql.id
  ]
}

resource "random_password" "postgresql_superuser" {
  length  = 16
  special = false
}


#####################
# Security Groups
#####################


# Allow access to aurora to all resources which are in the same security group

resource "aws_security_group" "postgresql" {
  vpc_id                 = var.vpc_id
  description            = "Security Group for PostgreSQL DB"
  name                   = "${var.project}-${var.environment}-PostgreSQL-ingress"
  revoke_rules_on_delete = true
  tags                   = merge(
    {
      Name = "${var.project} ${var.environment} RDS SG"
    },
    var.tags
  )
}

resource "aws_security_group_rule" "postgresql_ingress" {
  type              = "ingress"
  from_port         = var.rds_port
  to_port           = var.rds_port
  protocol          = "tcp"
  cidr_blocks       = [var.vpc_cidr_block]
  security_group_id = aws_security_group.postgresql.id
}

####################
# Secret Manager
####################

resource "aws_secretsmanager_secret" "postgresql-admin" {
  description = "Connection string for PostgreSQL cluster"
  name        = "${var.project}-${var.environment}-postgresql-admin-password"
  tags        = var.tags
}

resource "aws_secretsmanager_secret_version" "postgresql-admin" {

  secret_id     = aws_secretsmanager_secret.postgresql-admin.id
  secret_string = jsonencode({
    "username" = var.rds_user_name,
    "engine"   = "postgresql",
    "host"     = aws_db_instance.postgresql.endpoint
    "password" = random_password.postgresql_superuser.result,
    "port"     = var.rds_port,
  })
}

data "template_file" "secrets_postgresql-writer" {
  template = file("${path.module}/iam_policy_secrets_read.json.tpl")
  vars     = {
    secret_arn = aws_secretsmanager_secret.postgresql-admin.arn
  }
}

resource "aws_iam_policy" "secrets_postgresql-writer" {
  name   = "${var.project}-${var.environment}-secrets-postgresql-writer"
  policy = data.template_file.secrets_postgresql-writer.rendered
}
