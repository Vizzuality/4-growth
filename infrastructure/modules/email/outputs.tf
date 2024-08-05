output "dkim_tokens" {
  value = aws_ses_domain_dkim.domain_dkim.dkim_tokens
}

output "ses_domain_identity_arn" {
  value = aws_ses_domain_identity.domain_identity.arn
}

output "smtp_server_address" {
  value = "email-smtp.${var.region}.amazonaws.com"
}

output "mx_record_name" {
  value = aws_ses_domain_mail_from.mail_from.mail_from_domain
}

output "mx_record_value" {
  value = "10 feedback-smtp.${var.region}.amazonses.com"
}

output "mail_from_domain" {
  value = aws_ses_domain_mail_from.mail_from.mail_from_domain
}

output "txt_record_value" {
  value = "v=spf1 include:amazonses.com -all"
}

output "iam_user" {
  value = aws_iam_user.email_sender_user
}
