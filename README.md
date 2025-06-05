#  Property Listing System Backend 
Deployment
Live URL: https://property-listing-ashy.vercel.app/

Postman Collection file -
https://github.com/Jbansal2/property-listing/blob/main/Property_Listing_System_API.postman_collection.json

This backend system manages property listings and supports full **CRUD operations**, **user authentication**, **advanced filtering**, **property favoriting**, and a **recommendation system**.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)


---

## Features

- **User Authentication:** Register/login using email & password with JWT-based sessions.
- **Property CRUD:** Create, read, update, and delete properties (restricted to creator).
- **Advanced Filtering:** Filter properties using 10+ parameters (e.g., price, bedrooms, location).
- **Favorites:** Users can favorite/unfavorite properties and view their list.
- **Recommendations:** Recommend properties via email; stored in recipient's "Recommendations Received" section.
- **Caching:** Redis is used to improve response times for frequent read operations.

---

## Tech Stack

- **Backend:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **Caching:** Redis
- **Authentication:** JSON Web Tokens (JWT)
- **ORM/ODM:** Mongoose
- **Utilities:** bcrypt, Redis client
- **Testing:** Postman

---

## Setup Instructions

### Prerequisites

- Node.js
- MongoDB (local or Atlas)
- Redis (local or RedisLabs)
- Git

### Steps to Run Locally

```bash
# 1. Clone the Repository
git clone <repository-url>
cd property-listing-system

# 2. Install Dependencies
npm install

# 3. Run the Server
npm start
```

---

## API Endpoints

### Authentication

- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and receive JWT token

### Properties

- `GET /api/properties` — Get all properties (supports filtering)
- `GET /api/properties/:id` — Get property by ID
- `POST /api/properties` — Create a new property (authenticated)
- `PUT /api/properties/:id` — Update property (creator only)
- `DELETE /api/properties/:id` — Delete property (creator only)

### Favorites

- `POST /api/properties/:id/favorite` — Add property to favorites (authenticated)
- `DELETE /api/properties/:id/favorite` — Remove property from favorites (authenticated)


### Recommendations

- `POST /api/properties/:id/recommendations` — Recommend a property to another user via email (authenticated)
- `GET /api/recommendations` — View properties recommended to the user
---


