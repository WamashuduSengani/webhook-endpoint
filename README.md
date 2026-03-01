# Webhook Endpoint Server

A Node.js Express server that provides a webhook endpoint for processing string data.

## Features

- POST webhook endpoint that receives JSON data
- Converts input strings to alphabetically sorted character arrays
- Returns sorted characters as JSON response
- Error handling and input validation
- Health check endpoint

## API Specification

### Webhook Endpoint
- **URL**: `POST /webhook`
- **Content-Type**: `application/json`

#### Request Format
```json
{
  "data": "example"
}
```

#### Response Format
```json
{
  "word": ["a", "e", "e", "l", "m", "p", "x"]
}
```

#### Error Responses
- **400 Bad Request**: Invalid input format
- **500 Internal Server Error**: Server processing error

### Health Check
- **URL**: `GET /`
- **Response**: Server status information

## Installation

1. Install Node.js dependencies:
   ```bash
   npm install
   ```

## Usage

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on port 3000 by default (or the port specified in the PORT environment variable).

## Example Usage

```bash
curl -X POST http://localhost:3000/sort-string \
  -H "Content-Type: application/json" \
  -d '{"data": "example"}'
```

Expected response:
```json
{
  "word": ["a", "e", "e", "l", "m", "p", "x"]
}
```

## Project Structure

```
endpoint/
├── .github/
│   └── copilot-instructions.md
├── package.json
├── server.js
└── README.md
```