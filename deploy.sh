#!/bin/bash

# Load environment variables
set -a
source .env
set +a

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo "Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Function to create required directories
create_directories() {
    mkdir -p ./nginx/conf.d
    mkdir -p ./certbot/conf
    mkdir -p ./certbot/www
    mkdir -p ./mqtt/config
    mkdir -p ./logs/nginx
}

# Function to check if services are healthy
check_services() {
    local max_attempts=30
    local attempt=1
    
    echo "Checking service health..."
    
    while [ $attempt -le $max_attempts ]; do
        local all_healthy=true
        
        for service in postgres mongodb redis mqtt backend web; do
            if ! docker-compose ps | grep $service | grep -q "Up"; then
                all_healthy=false
                echo "Service $service is not healthy yet..."
            fi
        done
        
        if $all_healthy; then
            echo "All services are healthy!"
            return 0
        fi
        
        attempt=$((attempt + 1))
        sleep 2
    done
    
    echo "Services failed to become healthy within the timeout period"
    return 1
}

# Main deployment script
main() {
    echo "Starting deployment process..."
    
    # Check Docker status
    check_docker
    
    # Create required directories
    create_directories
    
    # Build and start services
    if [ "$1" == "prod" ]; then
        echo "Starting production deployment..."
        docker-compose -f docker-compose.prod.yml build
        docker-compose -f docker-compose.prod.yml up -d
    else
        echo "Starting development deployment..."
        docker-compose -f docker-compose.dev.yml build
        docker-compose -f docker-compose.dev.yml up -d
    fi
    
    # Check service health
    if ! check_services; then
        echo "Deployment failed: Services are not healthy"
        exit 1
    fi
    
    echo "Deployment completed successfully!"
}

# Run the deployment
main "$@"