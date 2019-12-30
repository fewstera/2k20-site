module "ecs_service" {
  source = "github.com/mergermarket/tf_ecs_service"

  env                            = "${var.env}"
  platform_config                = "${var.platform_config}"
  release                        = "${var.release}"
  common_application_environment = "${var.common_application_environment}"
  application_environment = "${merge(var.application_environment, map(
    "DYNAMODB_MESSAGE_TABLE", "${aws_dynamodb_table.messages.id}"
  ))}"
  secrets          = "${var.secrets}"
  ecs_cluster      = "${var.ecs_cluster}"
  port             = "${var.port}"
  cpu              = "${var.cpu}"
  memory           = "${var.memory}"
  desired_count    = "1"
  target_group_arn = "${var.target_group_arn}"
  task_role_policy = <<END
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:*"
      ],
      "Resource": [
        "${aws_dynamodb_table.messages.arn}"
      ]
    }
  ]
}
END
}

resource "aws_dynamodb_table" "messages" {
  name         = "${var.env}-2k20-messages"
  hash_key     = "isPurged"
  range_key    = "timestamp"
  billing_mode = "PAY_PER_REQUEST"

  attribute {
    name = "isPurged"
    type = "S"
  }

  attribute {
    name = "timestamp"
    type = "N"
  }
}
