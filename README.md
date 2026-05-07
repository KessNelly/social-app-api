# Social Media API

A full-featured RESTful Social Media API built with **Node.js, Express, and MongoDB**. Allows users to create posts, follow other users, like posts, and view personalized feeds.

---

## Features Implemented

### Authentication & Users

- User registration and login
- JWT Authentication (expires in 1 hour)
- Protected and public routes

### Posts

- Create posts (default: **draft**)
- Update, delete, and publish posts (owner only)
- Get all published posts (public)
- Get single published post with author details
- Get user's own posts (with state filter)
- Advanced search (title, content, tags)
- Pagination (default 20 per page)
- Sorting (`like_count`, `comment_count`, `createdAt`)

### Follow System

- Follow / Unfollow users
- Prevent self-follow and duplicate follows
- View following and followers lists (paginated)

### Feed & Engagement

- Personalized feed (posts from followed users + own posts)
- Like / Unlike posts (with like count tracking)
- Prevents duplicate likes

### Technical Features

- Proper error handling & validation (Zod)
- Security (Helmet, CORS)
- Clean architecture (feature-based structure)
- Comprehensive testing with Jest + Supertest

---

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT
- **Validation**: Zod
- **Testing**: Jest + Supertest
- **Security**: Helmet, CORS

---

## Setup Instructions

1. Clone the repository
2. Run: npm install
3. Copy .env.example to .env and configure:
   - MONGO_URI
   - JWT_SECRET
4. Run the app:
   npm run dev

Server URL: http://localhost:5000

---

## Major API Endpoints

Authentication

- POST /api/auth/signup
- POST /api/auth/login

Posts

- POST /api/posts → Create Post (Draft)
- GET /api/posts/published → All Published Posts (Public)
- GET /api/posts/:id → Single Post
- GET /api/posts/me → My Posts
- GET /api/posts/feed → Personalized Feed
- PATCH /api/posts/:id → Update Post
- PATCH /api/posts/:id/publish → Publish Post
- DELETE /api/posts/:id → Delete Post

Follow

- POST /api/follows/:userId/follow
- DELETE /api/follows/:userId/unfollow
- GET /api/follows/following
- GET /api/follows/followers

Likes

- POST /api/likes/:postId/toggle

## Testing

Run tests with:

- npm test

All major endpoints have been tested.

## Project Structure

```text
src/
├── config/              # Database connection
├── middleware/          # Auth, error handler, pagination
├── modules/
│   ├── auth/            # Authentication logic
│   ├── users/           # User model
│   ├── posts/           # Post model, controller & validation
│   ├── follows/         # Follow model & controller
│   └── likes/           # Like model & controller
├── routes/              # All route definitions
├── server.js            # Main Express server
└── jest.setup.js        # Jest configuration
```

👨‍💻 Author

- Kessiena Akpobire
- Second Semester Examination Project, Backend Engineering Diploma (Altschool Africa)
- May 2026
