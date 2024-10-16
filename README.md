# Image Processing API

This project is an image processing api that allows users to upload CSV files containing image URLs, processes the images, and provides status updates on the processing.

![alt text](image_status.png)

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)

## Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/Aicirou/image-processing-api.git
   cd image-processing-api
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

## Configuration

1. **Create a `.env` file in the root directory and add the following environment variables:**

   ```env
   PG_USER=postgres
   PG_HOST=localhost
   PG_PASSWORD=pASSword
   PG_DATABASE=myimagedb
   PG_PORT=5432
   PORT=3000
   WEBHOOK_URL=http://example.com/webhook
   ```

2. **Ensure your PostgreSQL database is running and accessible.**

## Usage

1. **Start the server:**

   ```sh
   npm start
   ```

2. **For development with hot-reloading:**

   ```sh
   npm run dev
   ```

3. **Upload a sample CSV file for testing:**

   You can use the provided `dump.csv` file located in the root directory for testing purposes. This file contains sample image URLs to help you verify the functionality of the image processing system.

   smaple csv file:

   ```csv
   S. No.,Product Name,Input Image Urls
   1,SKU1,"https://picsum.photos/id/10/2500/1667, https://picsum.photos/id/11/2500/1667, https://picsum.photos/id/12/2500/1667"
   2,SKU2,"https://picsum.photos/id/13/2500/1667, https://picsum.photos/id/14/2500/1667, https://picsum.photos/id/15/2500/1667"
   3,SKU3,"https://picsum.photos/id/16/2500/1667, https://picsum.photos/id/17/2500/1667, https://picsum.photos/id/18/2500/1667"
   4,SKU4,"https://picsum.photos/id/19/2500/1667, https://picsum.photos/id/20/2500/1667, https://picsum.photos/id/21/2500/1667"
   5,SKU5,"https://picsum.photos/id/22/2500/1667, https://picsum.photos/id/23/2500/1667, https://picsum.photos/id/24/2500/1667"
   ```

## API Endpoints

### Upload API

- **URL**: `/api/upload`
- **Method**: `POST`
- **Description**: Upload a CSV file containing image URLs for processing.
- **Request**:
  - `Content-Type`: `multipart/form-data`
  - `file`: The CSV file to upload.
- **Response**:
  - `202 Accepted`: `{ "requestId": "unique-request-id" }`
  - `400 Bad Request`: `{ "error": "Invalid file format" }`

### Status API

- **URL**: `/api/status/:requestId`
- **Method**: `GET`
- **Description**: Get the status of a specific request.
- **Response**:
  - `200 OK`: `{ "status": "processing/completed/failed", "output Images": [...] }`
  - `404 Not Found`: `{ "error": "Request not found" }`

## Project Structure

### Key Files

- **`src/index.js`**: Entry point of the application. Sets up the Express server and connects to the database.
- **`src/routes/index.js`**: Main router file that mounts all API routes.
- **`src/services/csvProcessor.js`**: Service for processing CSV files.
- **`src/services/imageProcessor.js`**: Service for processing images.
- **`src/tables/Request.js`**: Defines the `Request` table schema and creation logic.

## Technologies Used

- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web application framework for Node.js.
- **PostgreSQL**: Open-source relational database management system.
- **Sharp**: Image processing library for Node.js.
- **Multer**: Middleware for handling `multipart/form-data` requests.
- **dotenv**: Loads environment variables from a `.env` file.
