resource "kubernetes_namespace" "cook_namespace" {
  metadata {
    name = "cook"
  }
}

resource "kubernetes_secret" "cook_secret" {
  metadata {
    name      = "tech-challenge-cook-secret"
    namespace = kubernetes_namespace.cook_namespace.metadata[0].name
  }

  data = {
    aws_access_key_id = var.AWS_ACCESS_KEY_ID
    aws_secret_access_key = var.AWS_SECRET_ACCESS_KEY
    aws_session_token = var.AWS_SESSION_TOKEN
    db_name = var.rds_instance_name
    db_user = local.db_credentials.username
    db_password = local.db_credentials.password
    db_url = data.aws_ssm_parameter.db_url.value
  }

  type = "Opaque"

  depends_on = [kubernetes_namespace.cook_namespace]
}

resource "kubernetes_deployment" "cook_deployment" {
  metadata {
    name      = "tech-challenge-cook-api"
    namespace = kubernetes_namespace.cook_namespace.metadata[0].name
    labels = {
      app = "tech-challenge-cook-api"
    }
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "tech-challenge-cook-api"
      }
    }

    template {
      metadata {
        labels = {
          app = "tech-challenge-cook-api"
        }
      }

      spec {
        container {
        # image             = data.aws_ecr_image.latest_image.image_uri
          image             = "diguya/tech-challenge-cook-api:latest"
          name              = "tech-challenge-cook-api"
          image_pull_policy = "Always"

          resources {
            limits = {
              cpu    = "500m"
              memory = "1Gi"
            }
            requests = {
              cpu    = "250m"
              memory = "512Mi"
            }
          }

          liveness_probe {
            http_get {
              path = "/cook/v1/health"
              port = var.server_port
            }
            initial_delay_seconds = 60
            period_seconds        = 30
            timeout_seconds       = 5
            failure_threshold     = 3
          }

          readiness_probe {
            http_get {
              path = "/cook/v1/health"
              port = var.server_port
            }
            initial_delay_seconds = 60
            period_seconds        = 10
            timeout_seconds       = 3
            failure_threshold     = 1
          }

          env {
            name  = "DB_TYPE"
            value = "postgresql"
          }

          env {
            name  = "DB_USER"
            value_from {
              secret_key_ref {
                name = "tech-challenge-cook-secret"
                key  = "db_user"
              }
            }
          }

          env {
            name  = "DB_HOST"
            value_from {
              secret_key_ref {
                name = "tech-challenge-cook-secret"
                key  = "db_url"
              }
            }
          }

          env {
            name  = "DB_NAME"
            value_from {
              secret_key_ref {
                name = "tech-challenge-cook-secret"
                key  = "db_name"
              }
            }
          }

          env {
            name  = "DB_PASSWORD"
            value_from {
              secret_key_ref {
                name = "tech-challenge-cook-secret"
                key  = "db_password"
              }
            }
          }

          env {
            name  = "DB_PORT"
            value = var.database_port
          }

          env {
            name  = "TZ"
            value = "America/Sao_Paulo"
          }

          env {
            name  = "ORDER_PRODUCT_CREATE_QUEUE"
            value = data.aws_sqs_queue.order_product_create_queue.url
          }

          env {
            name  = "ORDER_PRODUCT_DELETE_QUEUE"
            value = data.aws_sqs_queue.order_product_delete_queue.url
          }

          env {
            name  = "ORDER_PRODUCT_UPDATE_QUEUE"
            value = data.aws_sqs_queue.order_product_update_queue.url
          }

          env {
            name  = "COOK_ORDER_CREATE_QUEUE"
            value = data.aws_sqs_queue.cook_order_create_queue.url
          }

          env {
            name  = "ORDER_STATUS_UPDATE_QUEUE"
            value = data.aws_sqs_queue.order_status_update_queue.url
          }

          env {
            name = "AWS_ACCESS_KEY_ID"
            value_from {
              secret_key_ref {
                name = "tech-challenge-cook-secret"
                key  = "aws_access_key_id"
              }
            }
          }

          env {
            name = "AWS_SECRET_ACCESS_KEY"
            value_from {
              secret_key_ref {
                name = "tech-challenge-cook-secret"
                key  = "aws_secret_access_key"
              }
            }
          }

          env {
            name = "AWS_SESSION_TOKEN"
            value_from {
              secret_key_ref {
                name = "tech-challenge-cook-secret"
                key  = "aws_session_token"
              }
            }
          }

          env {
            name = "AWS_REGION"
            value = "us-east-1"
          }
        }
      }
    }
  }

  timeouts {
    create = "4m"
    update = "4m"
    delete = "4m"
  }

  depends_on = [kubernetes_secret.cook_secret]
}

resource "kubernetes_service" "cook_service" {
  metadata {
    name      = "tech-challenge-cook-api-service"
    namespace = kubernetes_namespace.cook_namespace.metadata[0].name
  }

  spec {
    selector = {
      app = "tech-challenge-cook-api"
    }

    port {
      port        = var.server_port
      target_port = var.server_port
    }

    cluster_ip = "None"
  }
}

resource "kubernetes_ingress_v1" "cook_ingress" {
  metadata {
    name      = "tech-challenge-cook-api-ingress"
    namespace = kubernetes_namespace.cook_namespace.metadata[0].name

    annotations = {
      "nginx.ingress.kubernetes.io/x-forwarded-port" = "true"
      "nginx.ingress.kubernetes.io/x-forwarded-host" = "true"
    }
  }

  spec {
    ingress_class_name = "nginx"

    rule {
      http {
        path {
          path      = "/cook"
          path_type = "Prefix"

          backend {
            service {
              name = "tech-challenge-cook-api-service"
              port {
                number = var.server_port
              }
            }
          }
        }
      }
    }
  }

  depends_on = [kubernetes_service.cook_service]

}

resource "kubernetes_horizontal_pod_autoscaler_v2" "cook_hpa" {
  metadata {
    name      = "tech-challenge-cook-api-hpa"
    namespace = kubernetes_namespace.cook_namespace.metadata[0].name
  }

  spec {
    scale_target_ref {
      api_version = "apps/v1"
      kind        = "Deployment"
      name        = "tech-challenge-cook-api"
    }

    min_replicas = 1
    max_replicas = 5

    metric {
      type = "Resource"

      resource {
        name = "cpu"
        target {
          type                = "Utilization"
          average_utilization = 75
        }
      }
    }
  }

  depends_on = [kubernetes_service.cook_service]

}
