# Use Docker Compose to build the services
FROM docker/compose:latest

WORKDIR /backend

COPY . .

# Run Docker Compose to build and start the services
CMD ["docker-compose", "up", "--build"]