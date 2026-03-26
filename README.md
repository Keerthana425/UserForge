# BuyerForeSight – User Management API

A production-ready REST API built with **Node.js + Express + SQLite (sql.js)**.

---

## 🚀 Getting Started

```bash
# 1 – Install dependencies
npm install

# 2 – (Optional) seed the database with demo users
node seed.js

# 3 – Start the server
npm start          # production
npm run dev        # dev mode with auto-reload (requires nodemon)
```

Server starts at **http://localhost:3000**

---

## 📂 Project Structure

```
user-management-api/
├── index.js                  # Entry point – Express app + boot
├── seed.js                   # Optional seed script
├── package.json
├── src/
│   ├── database.js           # sql.js SQLite setup + helpers
│   └── validators.js         # Request body validation middleware
├── controllers/
│   └── userController.js     # Route handlers (CRUD logic)
└── routes/
    └── users.js              # /users route definitions
```

---

## 📋 API Reference

### Base URL
```
http://localhost:3000
```
# 🚀 UserForge API

🌐 **Live API:** https://userforge.onrender.com  
📂 **GitHub Repo:** https://github.com/Keerthana425/UserForge

---

## 🧪 Try it instantly

GET all users:
https://userforge.onrender.com/users


---

### `GET /users`
List all users with optional filtering and sorting.

**Query Parameters**

| Param    | Type   | Default     | Description                                    |
|----------|--------|-------------|------------------------------------------------|
| `search` | string | –           | Filter by name, email, or role (partial match) |
| `sort`   | string | `createdAt` | Sort column: `name`, `email`, `role`, `createdAt`, `updatedAt` |
| `order`  | string | `asc`       | Sort direction: `asc` or `desc`                |

**Examples**
```
GET /users
GET /users?search=alice
GET /users?sort=name&order=asc
GET /users?search=admin&sort=createdAt&order=desc
```

**Response `200`**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "uuid",
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "role": "admin",
      "phone": "+1-555-0101",
      "avatar": null,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### `GET /users/:id`
Get a single user by ID.

**Response `200`**
```json
{
  "success": true,
  "data": { ...user }
}
```

**Response `404`**
```json
{
  "success": false,
  "message": "User with id 'xyz' not found"
}
```

---

### `POST /users`
Create a new user.

**Request Body**
```json
{
  "name":   "Alice Johnson",       // required, min 2 chars
  "email":  "alice@example.com",   // required, must be unique
  "role":   "admin",               // optional: user | admin | moderator (default: user)
  "phone":  "+1-555-0101",         // optional
  "avatar": "https://..."          // optional
}
```

**Response `201`**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": { ...user }
}
```

**Response `400`** – validation errors  
**Response `409`** – email already in use

---

### `PUT /users/:id`
Update an existing user (partial update supported).

**Request Body** – all fields optional
```json
{
  "name":   "Alice A. Johnson",
  "email":  "newemail@example.com",
  "role":   "moderator",
  "phone":  "+1-555-9999",
  "avatar": "https://..."
}
```

**Response `200`**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": { ...updatedUser }
}
```

**Response `404`** – user not found  
**Response `409`** – email conflict

---

### `DELETE /users/:id`
Delete a user.

**Response `200`**
```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": { ...deletedUser }
}
```

**Response `404`** – user not found

---

## 🗄 Data Model

| Field       | Type   | Notes                                        |
|-------------|--------|----------------------------------------------|
| `id`        | TEXT   | UUID v4, auto-generated                      |
| `name`      | TEXT   | Required, min 2 characters                   |
| `email`     | TEXT   | Required, unique, lowercased on write        |
| `role`      | TEXT   | `user` \| `admin` \| `moderator` (default: user) |
| `phone`     | TEXT   | Optional                                     |
| `avatar`    | TEXT   | Optional (URL)                               |
| `createdAt` | TEXT   | ISO 8601 timestamp, auto-set on create       |
| `updatedAt` | TEXT   | ISO 8601 timestamp, auto-set on update       |

---

## 🛠 Tech Stack

| Layer      | Technology        |
|------------|-------------------|
| Runtime    | Node.js           |
| Framework  | Express 4         |
| Database   | SQLite via sql.js |
| IDs        | UUID v4           |
