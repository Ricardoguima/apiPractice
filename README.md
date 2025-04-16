# Node.js API + Docker + Nginx Reverse Proxy Deployment on EC2

## Description
A containerized Node.js API reverse-proxied with Nginx and deployed to an AWS EC2 instance using Docker Compose. This project demonstrates how to set up a simple API, containerize it, route traffic through Nginx, and manage the deployment end-to-end.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Step-by-Step Guide](#step-by-step-guide)
  - [1. Create the Node.js API](#1-create-the-nodejs-api)
  - [2. Create the Dockerfile](#2-create-the-dockerfile)
  - [3. Create the Docker Compose File](#3-create-the-docker-compose-file)
  - [4. Create the Nginx Reverse Proxy Config](#4-create-the-nginx-reverse-proxy-config)
  - [5. Set Up the EC2 Instance](#5-set-up-the-ec2-instance)
  - [6. Deploy with Docker Compose](#6-deploy-with-docker-compose)
- [Deployment Bugs & Fixes Summary](#deployment-bugs--fixes-summary)
- [Final Result](#final-result)
- [Optional Next Steps](#optional-next-steps)

---

## Project Overview
This project is a simple Node.js API deployed using Docker and Nginx on an AWS EC2 instance. The goal is to containerize the app, set up a reverse proxy with Nginx, and deploy it live using Docker Compose.

---

## Step-by-Step Guide

### 1. Create the Node.js API
Create a file named `app.js` with the following code:

```js
const express = require("express");
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("OHHHH YEAHH it totally works");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server Listening on PORT:", PORT);
});
```

---

### 2. Create the Dockerfile
This file defines how your app is containerized.

File: `Dockerfile`

```Dockerfile
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000
CMD ["node", "app.js"]
```

---

### 3. Create the Docker Compose File
Define services for the app and reverse proxy.

File: `docker-compose.yml`

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"

  nginx:
    image: nginx:latest
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      - app
```

---

### 4. Create the Nginx Reverse Proxy Config
Direct incoming HTTP requests to the Node.js app.

File: `nginx.conf`

```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        proxy_pass http://app:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
```

---

### 5. Set Up the EC2 Instance
1. Launch an EC2 instance using Amazon Linux or Ubuntu.
2. Add inbound rules for ports 22 (SSH), 80 (HTTP), and optionally 443 (HTTPS).
3. SSH into your instance:
   ```bash
   ssh -i your-key.pem ec2-user@your-ec2-ip
   ```
4. Install Docker and Docker Compose v2.
5. Clone or upload your project files to the server.

---

### 6. Deploy with Docker Compose
1. Navigate to the project folder:
   ```bash
   cd ~/apipractice
   ```
2. Build and start containers:
   ```bash
   docker compose up --build -d
   ```
3. Open your EC2 public IP in a browser:
   ```
   http://your-ec2-ip
   ```
   You should see: `OHHHH YEAHH it totally works`

---

## Deployment Bugs & Fixes Summary

- Nginx showing "Cannot GET /"
  - Cause: No `/` route defined in `app.js`
  - Fix: Added a root route in the Express app

- Nginx couldn't reach the Express app
  - Cause: `proxy_pass http://app:3000;` failed due to missing service alias
  - Fix: Removed `container_name` from `docker-compose.yml`

- Containers named `node-app` and `nginx-proxy` still appeared
  - Cause: Old containers built using Docker Compose v1
  - Fix: Removed Compose v1 and rebuilt with Docker Compose v2

- VS Code edits didn't affect the app
  - Cause: Edited a local file instead of the EC2 instance
  - Fix: Used `nano` to edit files directly on EC2

- `docker compose` not recognized
  - Cause: Docker Compose v2 plugin not installed
  - Fix: Installed Compose v2 under `~/.docker/cli-plugins` and made it executable

- Builds reused cached configs
  - Cause: Docker re-used old containers and images
  - Fix: Ran full cleanup and rebuild using:
    ```bash
    docker compose down --remove-orphans
    docker container prune -f
    docker image prune -af
    docker volume prune -f
    docker network prune -f
    docker compose up --build -d
    ```

---

## Final Result
Your app is now live and accessible via the EC2 instance’s public IP, reverse proxied by Nginx and containerized via Docker.

---
