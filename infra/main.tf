module "ecs_service" {
  source = "github.com/mergermarket/tf_ecs_service"

  env                            = "${var.env}"
  platform_config                = "${var.platform_config}"
  release                        = "${var.release}"
  common_application_environment = "${var.common_application_environment}"
  application_environment        = "${var.application_environment}"
  secrets                        = "${var.secrets}"
  ecs_cluster                    = "${var.ecs_cluster}"
  port                           = "${var.port}"
  cpu                            = "${var.cpu}"
  memory                         = "${var.memory}"
  target_group_arn               = "${var.target_group_arn}"
  task_role_policy = <<END
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "es:*"
      ],
      "Resource": "${var.elasticsearch_domain_arn}"
    }
  ]
}
END
}
