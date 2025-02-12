locals {
    db_credentials = jsondecode(data.aws_secretsmanager_secrets_version.db_credentials.secret_string)
}
