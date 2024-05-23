# most of this is from https://gist.github.com/tomfa/6fc429af5d598a85e723b3f56f681237

# the role and profile for the EC2

resource "aws_iam_instance_profile" "beanstalk_ec2" {
  name = "${var.application_name}-beanstalk-ec2-user"
  role = aws_iam_role.beanstalk_ec2.name
}


resource "aws_iam_role" "beanstalk_ec2" {
  name               = "${var.application_name}-beanstalk-ec2-role"
  assume_role_policy = <<EOF
{
  "Version": "2008-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "beanstalk_ec2_worker" {
  role       = aws_iam_role.beanstalk_ec2.id
  policy_arn = "arn:aws:iam::aws:policy/AWSElasticBeanstalkWorkerTier"
}

resource "aws_iam_role_policy_attachment" "beanstalk_ec2_web" {
  role       = aws_iam_role.beanstalk_ec2.id
  policy_arn = "arn:aws:iam::aws:policy/AWSElasticBeanstalkWebTier"
}

resource "aws_iam_role_policy_attachment" "beanstalk_ec2_container" {
  role       = aws_iam_role.beanstalk_ec2.id
  policy_arn = "arn:aws:iam::aws:policy/AWSElasticBeanstalkMulticontainerDocker"
}

resource "aws_iam_role_policy_attachment" "beanstalk_ec2_ecr" {
  role       = aws_iam_role.beanstalk_ec2.id
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}
