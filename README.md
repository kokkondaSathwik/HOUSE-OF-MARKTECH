# MERN Real Estate Application

A full-stack real estate web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring authentication and an admin panel.

## Features

- User authentication (signup/login)
- Property listings
- Admin panel for property management
- Responsive design with Tailwind CSS
- JWT-based authentication
- Protected admin routes

## Tech Stack

- Frontend: React.js with Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB (Mongoose)
- Authentication: JWT
- Deployment: Frontend on Netlify/Vercel, Backend on Render/Railway/Vercel

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn package manager

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the frontend development server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- POST `/api/auth/signup` - Register a new user
- POST `/api/auth/login` - Login user

### Properties
- GET `/api/properties` - Get all properties
- GET `/api/properties/:id` - Get a specific property

### Admin Routes
- GET `/api/admin/properties` - Get all properties (admin only)
- POST `/api/admin/properties` - Add new property (admin only)
- PUT `/api/admin/properties/:id` - Update property (admin only)
- DELETE `/api/admin/properties/:id` - Delete property (admin only)

## Deployment

### Backend Deployment
1. Create an account on Render/Railway/Vercel
2. Connect your GitHub repository
3. Set up environment variables
4. Deploy the backend

### Frontend Deployment
1. Create an account on Netlify/Vercel
2. Connect your GitHub repository
3. Set up environment variables
4. Deploy the frontend

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License. 