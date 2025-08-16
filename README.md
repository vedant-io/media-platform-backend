# Media Streaming and Analytics API

This is a backend application for a media streaming and analytics platform. It provides functionalities for user authentication, media upload and streaming, and analytics on media views.

## Features

*   **User Authentication:** Secure user authentication using JWT (JSON Web Tokens).
*   **Media Upload:** Upload media files to Google Cloud Storage.
*   **Media Streaming:** Get signed URLs for securely streaming media files.
*   **View Tracking:** Log and track views for each media asset.
*   **Analytics:** Get analytics on media views, including total views, unique views, and views per day.
*   **Rate Limiting:** Implemented using Arcjet to prevent abuse of the analytics endpoint.
*   **Caching:** Caching analytics data using Redis for improved performance.

## Technologies

*   **Node.js:** JavaScript runtime environment.
*   **Express:** Web framework for Node.js.
*   **MongoDB:** NoSQL database for storing application data.
*   **Mongoose:** ODM library for MongoDB.
*   **Google Cloud Storage:** For storing media files.
*   **JWT (JSON Web Tokens):** For user authentication.
*   **Bcrypt.js:** For password hashing.
*   **Arcjet:** For rate limiting and bot protection.
*   **Redis:** In-memory data store for caching.
*   **Docker:** For containerizing the application.

## Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or later)
*   [npm](https://www.npmjs.com/)
*   [Docker](https://www.docker.com/) (optional)
*   A [MongoDB](https://www.mongodb.com/) database.
*   A [Google Cloud Platform](https://cloud.google.com/) project with Google Cloud Storage enabled.
*   An [Arcjet](https://arcjet.com/) site key.

### Local Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory and add the following environment variables, replacing the placeholder values with your actual credentials:
    ```
    MONGO_URI="your-mongodb-connection-string"
    JWT_SECRET="your-jwt-secret"
    ARCJET_KEY="your-arcjet-site-key"
    GCP_PROJECT_ID="your-gcp-project-id"
    GCS_BUCKET_NAME="your-gcs-bucket-name"
    GOOGLE_APPLICATION_CREDENTIALS="path/to/your/gcp-credentials.json"
    ```

4.  **Start the server:**
    ```bash
    npm run dev
    ```
    The server will start on port 8000.

### Docker Setup

1.  **Build the Docker image:**
    ```bash
    docker build -t media-streaming-api .
    ```

2.  **Run the Docker container:**
    ```bash
    docker run -p 8000:8000 -v $(pwd)/.env:/app/.env media-streaming-api
    ```
    The server will start on port 8000.

## API Endpoints

### Authentication

*   `POST /api/auth/signup`
    *   **Description:** Registers a new user.
    *   **Request Body:** `{ "email": "user@example.com", "password": "password123" }`
    *   **Response:** `{ "_id": "...", "email": "...", "createdAt": "..." }`

*   `POST /api/auth/login`
    *   **Description:** Logs in an existing user.
    *   **Request Body:** `{ "email": "user@example.com", "password": "password123" }`
    *   **Response:** `{ "message": "Login successful" }`

### Media

*   `POST /api/media`
    *   **Description:** Uploads a new media file.
    *   **Authentication:** Requires JWT token.
    *   **Request:** `multipart/form-data` with a `mediaFile` field.
    *   **Response:** `{ "_id": "...", "title": "...", "type": "...", "file_url": "..." }`

*   `GET /api/media/:id/stream-url`
    *   **Description:** Gets a signed URL for streaming a media file.
    *   **Authentication:** Requires JWT token.
    *   **Response:** `{ "streamUrl": "..." }`

*   `GET /api/media/:id/view`
    *   **Description:** Logs a view for a media asset.
    *   **Authentication:** Requires JWT token.
    *   **Response:** `{ "message": "View logged successfully." }`

*   `GET /api/media/:id/analytics`
    *   **Description:** Gets analytics for a media asset.
    *   **Authentication:** Requires JWT token.
    *   **Response:** `{ "total_views": 0, "unique_ips": 0, "views_per_day": {} }`

## Project Structure

```
.
├── controllers
│   ├── auth.controller.js
│   └── media.controller.js
├── lib
│   ├── arcjet.js
│   ├── client.js
│   ├── db.js
│   ├── storage.js
│   └── utils.js
├── middleware
│   ├── auth.middleware.js
│   └── viewLimiter.middleware.js
├── models
│   ├── adminUser.model.js
│   ├── mediaAsset.model.js
│   └── mediaViewLog.model.js
├── routes
│   ├── authRoutes.js
│   └── mediaRoutes.js
├── __test__
│   └── auth.test.js
├── .env.example
├── .gitignore
├── Dockerfile
├── package.json
├── server.js
└── test-gcs.js
```
