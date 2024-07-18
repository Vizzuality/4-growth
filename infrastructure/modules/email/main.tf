## TODO: check if we can use a mail from in the env block

resource "aws_ses_domain_mail_from" "mail_from" {
  domain           = aws_ses_domain_identity.domain_identity.domain
  mail_from_domain = "no-reply.${aws_ses_domain_identity.domain_identity.domain}"
}

resource "aws_ses_domain_identity" "domain_identity" {
  domain = var.domain
}

resource "aws_ses_domain_dkim" "domain_dkim" {
  domain = aws_ses_domain_identity.domain_identity.domain
}

resource "aws_iam_user" "email_sender_user" {
  name = "${replace(title(replace(var.domain, "/\\W/", " ")), " ","")}EmailSender"
}

resource "aws_iam_user_policy" "get_ecr_token_policy" {
  user = aws_iam_user.email_sender_user.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action:[
          "ses:SendEmail",
          "ses:SendRawEmail"
        ],
        Effect   = "Allow"
        Resource = aws_ses_domain_identity.domain_identity.arn
      },
    ]
  })
}
