#!/bin/bash

# AWS deployment script
set -e

echo "🚀 Deploying Rental Car Tool to AWS..."

# Check if AWS CLI is configured
if ! aws sts get-caller-identity >/dev/null 2>&1; then
    echo "❌ AWS CLI is not configured. Please run 'aws configure' first."
    exit 1
fi

# Check if Terraform is installed
if ! command -v terraform &> /dev/null; then
    echo "❌ Terraform is not installed. Please install Terraform first."
    exit 1
fi

# Variables
AWS_REGION=${AWS_REGION:-eu-south-1}
PROJECT_NAME="rental-car-tool"

echo "📍 Deploying to region: $AWS_REGION"

# Initialize and apply Terraform
echo "🏗️  Initializing Terraform..."
cd infrastructure
terraform init

echo "📋 Planning Terraform deployment..."
terraform plan -out=tfplan

echo "🚀 Applying Terraform configuration..."
terraform apply tfplan

# Get ECR repository URLs
FRONTEND_ECR=$(terraform output -raw ecr_frontend_repository_url)
BACKEND_ECR=$(terraform output -raw ecr_backend_repository_url)
ALB_DNS=$(terraform output -raw alb_dns_name)

echo "📦 ECR Repositories created:"
echo "   Frontend: $FRONTEND_ECR"
echo "   Backend: $BACKEND_ECR"

# Build and push Docker images
echo "🐳 Building and pushing Docker images..."

# Login to ECR
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $FRONTEND_ECR

# Build and push frontend
echo "🔨 Building frontend image..."
cd ../
docker build -f docker/Dockerfile.frontend -t $FRONTEND_ECR:latest .
docker push $FRONTEND_ECR:latest

# Build and push backend
echo "🔨 Building backend image..."
docker build -f docker/Dockerfile.backend -t $BACKEND_ECR:latest .
docker push $BACKEND_ECR:latest

# Update ECS services
echo "🔄 Updating ECS services..."
aws ecs update-service --cluster ${PROJECT_NAME}-cluster --service ${PROJECT_NAME}-frontend --force-new-deployment --region $AWS_REGION
aws ecs update-service --cluster ${PROJECT_NAME}-cluster --service ${PROJECT_NAME}-backend --force-new-deployment --region $AWS_REGION

echo "✅ Deployment completed!"
echo ""
echo "🌐 Application URL: http://$ALB_DNS"
echo ""
echo "📊 AWS Resources:"
echo "   ECS Cluster: ${PROJECT_NAME}-cluster"
echo "   Load Balancer: $ALB_DNS"
echo "   Region: $AWS_REGION"
