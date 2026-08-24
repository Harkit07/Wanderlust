<p align="center">
  <img src="./logo.png" alt="Wanderlust Logo" width="200"/>
</p>

<h1 align="center">🌍 Wanderlust</h1>

A full-stack travel listing web application inspired by Airbnb, built with Node.js, Express, EJS, and MongoDB. Users can browse, create, and review property listings across various categories — complete with interactive maps powered by Mapbox. Deployed on Vercel.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Seed the Database](#seed-the-database)
- [Environment Variables](#environment-variables)
- [API Routes](#api-routes)
- [Listing Categories](#listing-categories)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## ✨ Features

- 🗺️ **Interactive Maps**
  Mapbox-powered geocoding and map display on each listing's detail page.
- 🏠 **Listing CRUD**
  Create, view, edit, and delete property listings with image uploads.
- 📂 **Category Filtering**
  Browse listings by category (Trending, Mountains, Castles, Camping, etc.).
- ⭐ **Reviews**
  Authenticated users can post and delete star-rated reviews on any listing.
- 🔐 **Authentication**
  Signup, login, and logout using **bcrypt** password hashing + **express-session** with a MongoDB session store.
- 🛡️ **Authorization**
  Only the listing owner can edit or delete their listing; only review authors can delete their own review.
- 🖼️ **Image Uploads**
  Listing images stored on Cloudinary via Multer.
- 🗄️ **Session Storage**
  Sessions persisted in MongoDB using `connect-mongo`.
- 💬 **Flash Messages**
  Success and error feedback messages across all user actions.
- ✅ **Server-side Validation**
  Request body validated with Joi schemas.
- 🚀 **Deployed on Vercel**
  Serverless deployment with zero cold-start configuration.

---

## 🛠️ Tech Stack

| Technology               | Purpose                                 |
| ------------------------ | --------------------------------------- |
| Node.js + Express 4      | Web server & routing                    |
| MongoDB + Mongoose       | Database & ODM                          |
| EJS + EJS-Mate           | Server-side templating with layouts     |
| bcrypt + express-session | Password hashing and session management |
| connect-mongo            | MongoDB session store                   |
| Mapbox SDK               | Forward geocoding & map rendering       |
| Cloudinary + Multer      | Image upload & cloud storage            |
| connect-flash            | Flash messaging                         |
| Joi                      | Server-side schema validation           |
| method-override          | Support for PUT/DELETE in HTML forms    |

---

## 📁 Project Structure

```text
Wanderlust/
├── controllers/
│   ├── listings.js
│   ├── reviews.js
│   ├── users.js
│   └── category.js
│
├── models/
│   ├── listing.js
│   ├── reviews.js
│   └── user.js
│
├── routes/
│   ├── listing.js
│   ├── review.js
│   ├── user.js
│   └── category.js
│
├── views/
│   ├── listings/
│   ├── users/
│   ├── includes/
│   ├── layouts/
│   └── error.ejs
│
├── public/
│   ├── css/
│   └── js/
│
├── init/
│   ├── data.js
│   └── index.js
│
├── utils/
│   ├── ExpressError.js
│   └── wrapAsync.js
│
├── middleware.js
├── cloudConfig.js
├── schema.js
├── vercel.json
└── app.js
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v20.18.0+
- npm v9+
- MongoDB Database (Local or Atlas)
- Cloudinary Account
- Mapbox Account

---

### Installation

```bash
# Clone the repository
git clone https://github.com/Harkit07/Wanderlust.git

# Navigate into project
cd Wanderlust

# Install dependencies
npm install

# Create environment file
touch .env

# Start the application
node app.js
```

The application will be available at:

```text
http://localhost:8080
```

---

### Seed the Database

```bash
node init/index.js
```

This will populate the database using sample data from `init/data.js`.

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# MongoDB
ATLASDB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/wanderlust

# Session Secret
SECRET=your_session_secret_key

# Cloudinary
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

# Mapbox
MAP_TOKEN=your_mapbox_public_access_token
```

For production deployments, add these variables to your Vercel project settings.

---

## 📡 API Routes

### Listings — `/listings`

| Method | Route                | Auth     | Description             |
| ------ | -------------------- | -------- | ----------------------- |
| GET    | `/listings`          | ❌       | Browse all listings     |
| GET    | `/listings/new`      | ✅       | Render new listing form |
| POST   | `/listings`          | ✅       | Create a listing        |
| GET    | `/listings/:id`      | ❌       | View listing details    |
| GET    | `/listings/:id/edit` | ✅ Owner | Edit listing form       |
| PUT    | `/listings/:id`      | ✅ Owner | Update listing          |
| DELETE | `/listings/:id`      | ✅ Owner | Delete listing          |

### Categories — `/listings/category`

| Method | Route                          | Auth | Description                 |
| ------ | ------------------------------ | ---- | --------------------------- |
| GET    | `/listings/category/:category` | ❌   | Filter listings by category |

### Reviews — `/listings/:id/reviews`

| Method | Route                             | Auth      | Description   |
| ------ | --------------------------------- | --------- | ------------- |
| POST   | `/listings/:id/reviews`           | ✅        | Create review |
| DELETE | `/listings/:id/reviews/:reviewId` | ✅ Author | Delete review |

### Users

| Method | Route     | Auth | Description       |
| ------ | --------- | ---- | ----------------- |
| GET    | `/signup` | ❌   | Signup page       |
| POST   | `/signup` | ❌   | Register user     |
| GET    | `/login`  | ❌   | Login page        |
| POST   | `/login`  | ❌   | Authenticate user |
| GET    | `/logout` | ✅   | Logout user       |

---

## 📂 Listing Categories

| Category      | Description                |
| ------------- | -------------------------- |
| Trending      | Popular listings           |
| Rooms         | Private room stays         |
| Iconic Cities | Famous city accommodations |
| Mountain      | High-altitude retreats     |
| Castles       | Historic castle properties |
| Amazing Pools | Listings with pools        |
| Camping       | Outdoor stays              |
| Farms         | Rural farm experiences     |
| Arctic        | Snow destinations          |
| Domes         | Dome accommodations        |
| Boats         | Houseboats and yachts      |

---

## 🚢 Deployment

This project is deployed on Vercel as a serverless Node.js application.

### app.js

```js
if (require.main === module) {
  app.listen(8080);
}

module.exports = app;
```

### vercel.json

```json
{
  "version": 2,
  "builds": [
    {
      "src": "app.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "app.js"
    }
  ]
}
```

### Deploying to Vercel

1. Connect GitHub repository to Vercel
2. Set the project root directory
3. Add all environment variables
4. Deploy

Vercel automatically redeploys on every push to the `main` branch.

---

## 🤝 Contributing

```bash
# Fork the repository

# Create a new branch
git checkout -b feature/your-feature-name

# Commit changes
git commit -m "Add new feature"

# Push branch
git push origin feature/your-feature-name
```

Then open a Pull Request.

---

## 👨‍💻 Author

**Harkit Singh**

- 📧 harkitsinghsran9584@gmail.com
- 📞 +91-8890436710
- 🌐 [Portfolio](#)
- 🐙 [github.com/Harkit07](https://github.com/Harkit07)
- 🔗 [Live Demo](https://wanderlust-jade-sigma.vercel.app/listings)

---

## 📝 License

This project is licensed under the ISC License.
