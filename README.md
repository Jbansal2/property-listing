#  Property Listing System Backend 
Deployment
Live URL: https://property-listing-ashy.vercel.app/
Postman Collection file - Download Property_Listing_System_API.postman_collection.json

This is a backend system for managing property listings. It supports full **CRUD operations**, **user authentication**, **advanced filtering**, **property favoriting**, and a **recommendation system**
---

##  Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)

---

##  Features

- **User Authentication**: Register/login using email & password with JWT-based sessions.
- **Property CRUD**: Create, read, update, and delete properties (restricted to creator).
- **Advanced Filtering**: Filter properties using 10+ parameters (e.g., price, bedrooms, location).
- **Favorites**: Users can favorite/unfavorite properties and view their list.
- **Recommendations**: Recommend properties via email; stored in recipient's "Recommendations Received" section.
- **Caching**: Redis is used to improve response times for frequent read operations.

---

##  Tech Stack

- **Backend**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Caching**: Redis
- **Authentication**: JSON Web Tokens (JWT)
- **ORM/ODM**: Mongoose
- **Utilities**: bcrypt, Redis client
- **Testing**: Postman

---

##  Setup Instructions

###  Prerequisites

- Node.js
- MongoDB (local or Atlas)
- Redis (local or RedisLabs)
- Git

###  Steps to Run Locally

```bash
# 1. Clone the Repository
git clone <repository-url>
cd property-listing-system

# 2. Install Dependencies
npm install

# 3. Run the Server
npm start
