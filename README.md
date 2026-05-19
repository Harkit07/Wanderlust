# 🌍 Wanderlust

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

- 🗺️ **Interactive Maps** — Mapbox-powered geocoding and map display on each listing's detail page
- 🏠 **Listing CRUD** — Create, view, edit, and delete property listings with image uploads
- 📂 **Category Filtering** — Browse listings by category (Trending, Mountains, Castles, Camping, etc.)
- ⭐ **Reviews** — Authenticated users can post and delete star-rated reviews on any listing
- 🔐 **Authentication** — Signup, login, and logout using Passport.js local strategy with session persistence
- 🛡️ **Authorization** — Only the listing owner can edit or delete their listing; only review authors can delete their review
- 🖼️ **Image Uploads** — Listing images stored on Cloudinary via Multer
- 🗄️ **Session Storage** — Sessions persisted in MongoDB using `connect-mongo`
- 💬 **Flash Messages** — Success and error feedback messages across all user actions
- ✅ **Server-side Validation** — Request body validated with Joi schemas
- 🚀 **Deployed on Vercel** — Serverless deployment with zero cold-start configuration

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js + Express 4 | Web server & routing |
| MongoDB + Mongoose | Database & ODM |
| EJS + EJS-Mate | Server-side templating with layouts |
| Passport.js | Authentication (local strategy) |
| passport-local-mongoose | User model plugin for auth |
| express-session + connect-mongo | Session management with MongoDB store |
| Mapbox SDK | Forward geocoding & map rendering |
| Cloudinary + Multer | Image upload & cloud storage |
| connect-flash | Flash messaging |
| Joi | Server-side schema validation |
| method-override | Support for PUT/DELETE in HTML forms |

---

## 📁 Project Structure

```
Wanderlust/
├── controllers/
│   ├── listings.js      # Listing CRUD logic + geocoding
│   ├── reviews.js       # Review create & delete
│   ├── users.js         # Signup, login, logout
│   └── category.js      # Category filter logic
│
├── models/
│   ├── listing.js       # Listing schema (with GeoJSON geometry)
│   ├── reviews.js       # Review schema (rating, comment, author)
│   └── user.js          # User schema with passport-local-mongoose
│
├── routes/
│   ├── listing.js       # /listings routes
│   ├── review.js        # /listings/:id/reviews routes
│   ├── user.js          # /signup, /login, /logout routes
│   └── category.js      # /listings/category/:category routes
│
├── views/
│   ├── listings/        # home, show, new, edit EJS templates
│   ├── users/           # signup, login EJS templates
│   ├── includes/        # navbar, footer, flash partials
│   ├── layouts/         # boilerplate EJS-Mate layout
│   └── error.ejs        # Error page
│
├── public/
│   ├── css/             # Custom stylesheets
│   └── js/              # Client-side scripts (map rendering)
│
├── init/
│   ├── data.js          # Sample listing seed data
│   └── index.js         # DB seed script
│
├── utils/
│   ├── ExpressError.js  # Custom error class
│   └── wrapAsync.js     # Async error handler wrapper
│
├── middleware.js         # isLoggedIn, isOwner, isReviewAuthor, validate*
├── cloudConfig.js        # Cloudinary & Multer storage config
├── schema.js             # Joi validation schemas
├── vercel.json           # Vercel routing config
└── app.js                # Express app entry point (exported for Vercel)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v20.18.0 (see `engines` in `package.json`)
- **npm** v9+
- A **MongoDB** database (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- A **Cloudinary** account for image uploads
- A **Mapbox** account for geocoding and maps

---

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Harkit07/Wanderlust.git
cd Wanderlust

# 2. Install dependencies
npm install

# 3. Create your environment file
touch .env
# Fill in the required variables (see Environment Variables below)

# 4. Start the server
node app.js
```

The app will be available at `http://localhost:8080`.

---

### Seed the Database

To populate the database with sample listings:

```bash
node init/index.js
```

This will insert all sample listings from `init/data.js` into your MongoDB database.

---

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following:

```env
# MongoDB
ATLASDB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/wanderlust

# Session
SECRET=your_session_secret_key

# Cloudinary
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

# Mapbox
MAP_TOKEN=your_mapbox_public_access_token
```

> Add all the above variables in **Vercel Dashboard → Project Settings → Environment Variables** for production.

---

## 📡 API Routes

### Listings — `/listings`

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `GET` | `/listings` | ❌ | Browse all listings |
| `GET` | `/listings/new` | ✅ | Render new listing form |
| `POST` | `/listings` | ✅ | Create a new listing |
| `GET` | `/listings/:id` | ❌ | View a single listing with map & reviews |
| `GET` | `/listings/:id/edit` | ✅ Owner | Render edit form |
| `PUT` | `/listings/:id` | ✅ Owner | Update a listing |
| `DELETE` | `/listings/:id` | ✅ Owner | Delete a listing |

### Categories — `/listings/category`

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `GET` | `/listings/category/:category` | ❌ | Filter listings by category |

### Reviews — `/listings/:id/reviews`

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `POST` | `/listings/:id/reviews` | ✅ | Post a review on a listing |
| `DELETE` | `/listings/:id/reviews/:reviewId` | ✅ Author | Delete a review |

### Users

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `GET` | `/signup` | ❌ | Render signup form |
| `POST` | `/signup` | ❌ | Register a new user |
| `GET` | `/login` | ❌ | Render login form |
| `POST` | `/login` | ❌ | Authenticate and login |
| `GET` | `/logout` | ✅ | Logout current user |

---

## 📂 Listing Categories

Listings can be tagged with one of the following categories:

| Category | Description |
|---|---|
| Trending | Currently popular listings |
| Rooms | Private room stays |
| Iconic Cities | Urban stays in famous cities |
| Mountain | High-altitude retreats |
| Castles | Historic castle properties |
| Amazing Pools | Listings with standout pools |
| Camping | Outdoor and tent stays |
| Farms | Rural farmstay experiences |
| Arctic | Cold-weather and snow destinations |
| Domes | Unique geodesic dome stays |
| Boats | Houseboat or yacht stays |

---

## 🚢 Deployment

This app is deployed on **Vercel** as a serverless Node.js application.

### Required Changes for Vercel

1. **`app.js`** — Export the Express app instead of calling `listen` directly:
```js
// Replace app.listen(...) with:
if (require.main === module) {
  app.listen(8080);
}
module.exports = app;
```

2. **`vercel.json`** — Place in the project root:
```json
{
  "version": 2,
  "builds": [{ "src": "app.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "app.js" }]
}
```

### Deploying

- Connect your GitHub repo to [Vercel](https://vercel.com)
- Set the **Root Directory** to the project root (where `app.js` lives)
- Add all environment variables in **Vercel Dashboard → Project Settings → Environment Variables**
- Vercel auto-deploys on every push to `main`

> **Note:** Vercel's serverless environment is stateless — session data is persisted in MongoDB via `connect-mongo`, and images are stored on Cloudinary, so no data is lost between function invocations. The `RENDER_URL` keep-alive variable is no longer needed.

---

## 🤝 Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 👨‍💻 Author

**Harkit Singh**

---

## 📝 License

This project is open source and available under the **ISC License**.