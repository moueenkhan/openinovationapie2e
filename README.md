# OpenInnovation API Testing

This repository contains Cypress tests for the OpenInnovation API, designed to ensure the API behaves as expected and handles various scenarios correctly.

## Overview

The testing setup uses Cypress to run end-to-end (E2E) tests. Tests are executed in a Dockerized environment to ensure consistency and isolation. Results are generated and saved for review, and the process is integrated with GitHub Actions for continuous integration.

## Approach

### Testing Approach

1. **Cypress Framework**:
   - **Purpose**: Cypress is used for its powerful testing capabilities, including end-to-end testing, integration testing, and unit testing.
   - **Features**: It offers real-time browser preview, automatic waiting, and detailed failure messages which enhance the testing experience.

2. **Docker for Test Execution**:
   - **Purpose**: Tests run inside a Docker container to provide a consistent and isolated environment, avoiding discrepancies between different machines and setups.
   - **Container**: A Docker image with Cypress and its dependencies is used. The container also mounts a volume to save test reports on the host machine.

3. **Custom API Request Functions**:
   - **Functions**: `postRequest`, `getRequest`, and `deleteRequest` are custom functions defined to simplify and standardize API requests.
   - **Error Handling**: Each function handles errors by logging validation issues if the expected status code is not returned, allowing for more robust test cases.

4. **Test Scenarios**:
   - **Positive Cases**: Ensure that models and versions are added, retrieved, and deleted correctly.
   - **Negative Cases**: Check the system’s response to erroneous inputs or invalid operations.

5. **Volume Mounting**:
   - **Purpose**: Test reports generated inside the Docker container are saved to a directory on the host machine for easy access.
   - **Configuration**: The volume mount is configured in the `docker-compose.yml` file to map the container’s report directory to a local directory.

### Running Tests Locally

1. **Prerequisites**:
   - **Docker**: Ensure Docker is installed on your machine. [Install Docker](https://docs.docker.com/get-docker/).
   - **Docker Compose**: Ensure Docker Compose is installed. [Install Docker Compose](https://docs.docker.com/compose/install/).

2. **Setup**:
   ```bash
   docker-compose build
   docker-compose up
