# Docker Compose Setup

This project sets up a MongoDB service using Docker Compose. The configuration is defined in the `docker-compose.yml` file.

## Project Structure

```
docker-compose-setup
├── docker-compose.yml
└── README.md
```

## Services

### MongoDB

- **Database Name**: clinic25
- **Port**: 27017
- **Data Persistence**: The MongoDB service uses a volume to ensure data is persisted across container restarts.

## Getting Started

1. Ensure you have Docker and Docker Compose installed on your machine.
2. Navigate to the project directory:
   ```
   cd docker-compose-setup
   ```
3. Start the MongoDB service:
   ```
   docker-compose up
   ```
4. Access MongoDB on `localhost:27017`.

## Stopping the Service

To stop the MongoDB service, run:
```
docker-compose down
```

## License

This project is licensed under the MIT License.