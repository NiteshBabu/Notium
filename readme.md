# Notium

A typed Notes API backend built with Django and Django Ninja.

## Overview

Notium is a RESTful API for managing notes with features including:
- User authentication via JWT
- CRUD operations for notes
- Tagging system
- Search functionality
- Star/favorite notes
- Recent notes retrieval

## Tech Stack

- Python 3.13+
- Django 5.0+
- Django Ninja
- Poetry (dependency management)
- PyJWT (authentication)
- SQLite (development, PostgreSQL-ready)

## Setup

### Prerequisites

- Python 3.13 or higher
- Poetry installed ([installation guide](https://python-poetry.org/docs/#installation))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/NiteshBabu/Notium.git
cd notium
```

2. Install dependencies using Poetry:
```bash
poetry install
```

3. Activate the Poetry shell:
```bash
poetry shell
```

4. Run migrations:
```bash
python manage.py migrate
```

5. Create a superuser (optional, for admin access):
```bash
python manage.py createsuperuser
```

6. Run the development server:
```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/`

## API Documentation

Interactive API documentation is available at:
- Swagger UI: `http://localhost:8000/api/docs`

## Authentication

Notium uses JWT (JSON Web Tokens) for authentication.

### Login

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "username": "your_username",
  "password": "your_password"
}
```

**Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer"
}
```

### Using the Token

Include the token in the Authorization header for all protected endpoints:
```
Authorization: Bearer <your_access_token>
```

Tokens expire after 7 days.

## API Endpoints

All note endpoints require authentication via JWT token.

### Notes

#### Create Note
**Endpoint:** `POST /api/notes/`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "My First Note",
  "content": "This is the content of my note.",
  "tags": ["work", "important"]
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "title": "My First Note",
  "content": "This is the content of my note.",
  "tags": [
    {"id": 1, "name": "work"},
    {"id": 2, "name": "important"}
  ],
  "starred": false,
  "created_at": "2025-10-15T10:30:00Z",
  "updated_at": "2025-10-15T10:30:00Z"
}
```

#### List Notes
**Endpoint:** `GET /api/notes/`

**Query Parameters:**
- `search` (optional): Search in title and content
- `tag` (optional): Filter by tag name
- `starred` (optional): Filter by starred status (true/false)

**Examples:**
```bash
# Get all notes
GET /api/notes/

# Search notes
GET /api/notes/?search=meeting

# Filter by tag
GET /api/notes/?tag=work

# Get starred notes
GET /api/notes/?starred=true

# Combine filters
GET /api/notes/?search=project&tag=work&starred=true
```

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "title": "My First Note",
    "content": "This is the content of my note.",
    "tags": [{"id": 1, "name": "work"}],
    "starred": false,
    "created_at": "2025-10-15T10:30:00Z",
    "updated_at": "2025-10-15T10:30:00Z"
  }
]
```

#### Get Note by ID
**Endpoint:** `GET /api/notes/{id}`

**Response:** `200 OK` (same format as Create Note)

**Error:** `404 Not Found` if note doesn't exist or doesn't belong to user

#### Update Note
**Endpoint:** `PUT /api/notes/{id}`

**Request Body:** (all fields optional)
```json
{
  "title": "Updated Title",
  "content": "Updated content",
  "tags": ["new-tag"]
}
```

**Response:** `200 OK` (updated note)

**Error:** `404 Not Found` if note doesn't exist or doesn't belong to user

#### Delete Note
**Endpoint:** `DELETE /api/notes/{id}`

**Response:** `204 No Content`

**Error:** `404 Not Found` if note doesn't exist or doesn't belong to user

#### Toggle Star
**Endpoint:** `POST /api/notes/{id}/star`

**Response:** `200 OK` (note with toggled starred status)

**Error:** `404 Not Found` if note doesn't exist or doesn't belong to user

#### Get Recent Notes
**Endpoint:** `GET /api/notes/recent`

**Query Parameters:**
- `limit` (optional, default: 10): Number of recent notes to return

**Example:**
```bash
GET /api/notes/recent?limit=5
```

**Response:** `200 OK` (list of recent notes, same format as List Notes)

## Example API Requests

### Using cURL

```bash
# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "your_username", "password": "your_password"}'

# Create a note (replace TOKEN with actual token)
curl -X POST http://localhost:8000/api/notes/ \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Meeting Notes",
    "content": "Discussed project timeline and deliverables.",
    "tags": ["work", "meeting"]
  }'

# List notes
curl -X GET http://localhost:8000/api/notes/ \
  -H "Authorization: Bearer TOKEN"

# Search notes
curl -X GET "http://localhost:8000/api/notes/?search=meeting" \
  -H "Authorization: Bearer TOKEN"

# Get note by ID
curl -X GET http://localhost:8000/api/notes/1 \
  -H "Authorization: Bearer TOKEN"

# Update note
curl -X PUT http://localhost:8000/api/notes/1 \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Meeting Notes",
    "content": "Updated content here."
  }'

# Toggle star
curl -X POST http://localhost:8000/api/notes/1/star \
  -H "Authorization: Bearer TOKEN"

# Get recent notes
curl -X GET "http://localhost:8000/api/notes/recent?limit=5" \
  -H "Authorization: Bearer TOKEN"

# Delete note
curl -X DELETE http://localhost:8000/api/notes/1 \
  -H "Authorization: Bearer TOKEN"
```

### Using JavaScript (Fetch API)

```javascript
const API_BASE = 'http://localhost:8000/api';

// Login
async function login(username, password) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await response.json();
  return data.access_token;
}

// Create note
async function createNote(token, title, content, tags = []) {
  const response = await fetch(`${API_BASE}/notes/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title, content, tags })
  });
  return await response.json();
}

// List notes with filters
async function listNotes(token, filters = {}) {
  const params = new URLSearchParams(filters);
  const response = await fetch(`${API_BASE}/notes/?${params}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await response.json();
}

// Example usage
const token = await login('username', 'password');
const note = await createNote(token, 'My Note', 'Content here', ['tag1']);
const notes = await listNotes(token, { search: 'meeting', starred: true });
```

## Error Handling

The API returns standard HTTP status codes:

- `200 OK`: Successful request
- `201 Created`: Resource created (for POST requests)
- `204 No Content`: Successful deletion
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Missing or invalid authentication token
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

Error responses follow this format:
```json
{
  "detail": "Error message here"
}
```

## CORS Configuration

CORS is enabled for frontend integration. The following origin is allowed by default:
- `http://localhost:3000`

To add more origins, update `CORS_ALLOWED_ORIGINS` in `notium/settings.py`.

## Development

### Running Tests

```bash
python manage.py test
```

### Code Style

This project uses:
- Type hints throughout
- Docstrings for all endpoints
- Django Ninja's automatic OpenAPI documentation

### Database

The project uses SQLite by default for development. To use PostgreSQL in production:

1. Update `DATABASES` in `notium/settings.py`
2. Install PostgreSQL adapter: `poetry add psycopg2-binary`

## License

MIT

