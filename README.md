<div align="center">

# 📚 Books World — MERN Online Bookstore

### Discover Books. Explore Stories. Shop Smarter.

A feature-rich online bookstore built with the MERN stack, offering an interactive book catalogue, personalized wishlists, transparent discounts, intelligent book recommendations, and a dedicated admin dashboard.

<br>

<p>
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/Vite-Build_Tool-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express.js-API-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js">
</p>

<p>
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
  <img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT">
  <img src="https://img.shields.io/badge/Git-GitHub-F05032?style=for-the-badge&logo=git&logoColor=white" alt="Git">
</p>

<br>

**📖 60+ Books &nbsp; • &nbsp; 💰 Dynamic Discounts &nbsp; • &nbsp; ❤️ Persistent Wishlist**

**🔎 Instant Search &nbsp; • &nbsp; 🎯 Book Recommendations &nbsp; • &nbsp; ⚙️ Admin Dashboard**

</div>

---

## 📑 Table of Contents

- [📚 About the Project](#-about-the-project)
- [🎯 Project Highlights](#-project-highlights)
- [✨ Features](#-features)
- [🛍️ Customer Experience](#️-customer-experience)
- [⚙️ Admin Dashboard](#️-admin-dashboard)
- [🛠️ Technology Stack](#️-technology-stack)
- [🧠 Technical Skills Demonstrated](#-technical-skills-demonstrated)
- [🏗️ Project Architecture](#️-project-architecture)
- [📂 Project Structure](#-project-structure)
- [🚀 Installation and Setup](#-installation-and-setup)
- [🔑 Demo Accounts](#-demo-accounts)
- [🔌 API Overview](#-api-overview)
- [💰 Discount System](#-discount-system)
- [📍 Andhra Pradesh Delivery](#-andhra-pradesh-delivery)
- [🔒 Validation and Security](#-validation-and-security)
- [🧪 Testing](#-testing)
- [🚧 Future Enhancements](#-future-enhancements)
- [👩‍💻 Developer](#-developer)

---

# 📚 About the Project

**Books World** is a full-stack online bookstore developed using the **MERN stack — MongoDB, Express.js, React, and Node.js**.

The application provides a complete online book-shopping experience, from discovering books and comparing prices to managing wishlists, placing orders, and tracking deliveries.

It combines a React-based frontend with a Node.js and Express backend, using MongoDB to store user accounts, book information, wishlists, and orders.

The platform also includes an administrator interface for managing the book catalogue, configuring discounts, overseeing users, and updating order statuses.

### 🎯 Project Objectives

- Build a complete full-stack bookstore application.
- Create an organized and searchable book catalogue.
- Implement authentication and role-based access control.
- Maintain wishlist data through backend synchronization.
- Calculate book discounts and savings consistently.
- Recommend related books based on category and author.
- Support delivery-location selection for Andhra Pradesh.
- Provide administrative tools for managing bookstore operations.

---

# 🎯 Project Highlights

| Feature | Description |
|---|---|
| 📚 Book Catalogue | Browse a categorized collection of 60+ books. |
| 🖼️ Book Cover Images | Display book covers using configured image sources. |
| 🔎 Instant Search | Search for books by title or author from the header. |
| 💰 Transparent Pricing | Display original prices, discounts, final prices, and savings. |
| ❤️ Persistent Wishlist | Synchronize saved books with the backend for logged-in users. |
| 🛒 Cart Integration | Move wishlist items into the shopping cart. |
| 🎞️ Banner Slider | Showcase promotions, new arrivals, and delivery highlights. |
| 🎯 Book Recommendations | Discover related books based on category and author. |
| 🔐 Registration Validation | Apply name, Gmail address, and password rules. |
| 📍 AP Delivery Locations | Select from supported Andhra Pradesh cities and towns. |
| ⚙️ Admin Dashboard | Manage books, users, discounts, and orders. |
| 📦 Order Tracking | View order details and delivery-status updates. |

---

# ✨ Features

## 📖 1. Book Catalogue

The catalogue helps customers discover and explore books.

- 60+ seeded books.
- Categorized book listings.
- Book cover images.
- Individual book details.
- Search by title or author.
- Recommended books based on category and author.
- Consistent price and discount presentation.

## 🔎 2. Global Header Search

The search bar is integrated into the navigation header.

- Accessible across pages.
- Supports searching by book title or author.
- Helps users find books without returning to the homepage.
- Connects book discovery with the catalogue experience.

## 💰 3. Transparent Discount System

Books World displays pricing information to help customers understand their savings.

- Original book price.
- Discount percentage.
- Calculated final price.
- Amount saved.
- Category-wide promotional discounts managed by administrators.

The application includes a shared price utility to support consistent currency formatting and discount calculations.

## ❤️ 4. Persistent Wishlist

The wishlist lets users save books they want to purchase later.

- Interactive heart icons on book cards.
- Wishlist controls on the book details page.
- Dedicated wishlist page.
- Backend synchronization for logged-in users.
- Move individual books to the cart.
- Add available wishlist books to the cart.

## 🎞️ 5. Homepage Banner Slider

The homepage includes a promotional banner slider.

- Automatic slide transitions every five seconds.
- Previous and next navigation controls.
- Clickable pagination indicators.
- Pause-on-hover behavior.
- Promotions featuring discounts and new arrivals.
- Andhra Pradesh delivery highlights.

## 🎯 6. Recommended Books

The book details page displays related titles.

Recommendations are based on shared categories or authors, helping customers discover additional books.

Each recommendation can display:

- Book cover.
- Title and author.
- Price and discount information.
- Navigation to book details.
- Add-to-cart functionality.

## 🛒 7. Shopping Cart and Checkout

The shopping workflow includes:

- Cart item management.
- Quantity adjustments.
- Discount and savings calculations.
- Checkout with delivery-location selection.
- Order placement.
- Order history and order details.

The exact checkout and payment behavior depends on the implemented backend workflow.

## 👤 8. User Profile and Navigation

The navigation header includes a profile menu with account-related links.

Depending on the user's role, the menu provides access to:

- Profile.
- Orders.
- Wishlist.
- Admin Dashboard.
- Logout.

The profile button uses the user's initials as an avatar.

## 📦 9. Order Tracking

Customers can view their previous orders and inspect individual order details.

Administrators can update order statuses through the admin interface.

---

# 🛍️ Customer Experience

The customer application is organized into dedicated pages.

| Page | Route | Description |
|---|---|---|
| Home | `/` | Banner slider, catalogue, search, filters, and book grid |
| Book Details | `/books/:id` | Book information and recommendations, if configured at this route |
| Wishlist | `/wishlist` | Saved books and cart actions |
| Cart | `/cart` | Items, quantity controls, and discount savings |
| Checkout | `/checkout` | Delivery location and order placement |
| Login | `/login` | User authentication |
| Register | `/register` | Account creation with validation |
| Profile | `/profile` | Profile and password management |
| My Orders | `/orders` | Customer order history |
| Order Details | `/orders/:id` | Order information and delivery status |

> **Important:** Confirm the actual routes in `frontend/src/App.jsx` before publishing this route table. The book-details route shown above is illustrative because the supplied project structure does not specify its exact URL.

---

# ⚙️ Admin Dashboard

The admin dashboard provides management tools for the bookstore.

| Module | Purpose |
|---|---|
| Dashboard | Store analytics and statistics |
| Book Management | Add, edit, and delete books |
| Pricing Controls | Manage prices and discount percentages |
| Category Discounts | Configure category-wide promotions |
| Order Management | View orders and update delivery status |
| User Management | View and manage user accounts |

The administrator interface helps centralize book catalogue management, promotional pricing, customer administration, and order processing.

Administrative operations should be protected by backend authorization, not just by hiding frontend pages.

---

# 🛠️ Technology Stack

## 🎨 Frontend

<p>
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
</p>

| Technology | Purpose |
|---|---|
| React | Component-based user interface |
| Vite | Development server and build tooling |
| JavaScript | Frontend interactions and application logic |
| CSS | Responsive styling and visual design |
| Axios | HTTP requests to the backend |
| React Context | Shared authentication, wishlist, and cart state |

## ⚙️ Backend

<p>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js">
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT">
</p>

| Technology | Purpose |
|---|---|
| Node.js | Server-side JavaScript runtime |
| Express.js | Backend API framework |
| MongoDB | Persistent application data |
| Mongoose | Database models and data access |
| JWT | Authentication tokens |
| bcryptjs | Password hashing |
| express-validator | Request validation |
| Axios | Frontend API communication |

*Confirm package dependencies against the actual `package.json` files before treating this list as exhaustive.*

---

# 🧠 Technical Skills Demonstrated

## 1. Full-Stack Web Development

- Building a React frontend.
- Developing a Node.js and Express backend.
- Connecting frontend components to REST APIs.
- Organizing a full-stack application into modules.

## 2. Database Management

- Designing Mongoose models.
- Storing users, books, and orders.
- Persisting wishlist data.
- Managing data through backend controllers.

## 3. Authentication and Authorization

- User registration and login.
- JWT generation and verification.
- Password hashing.
- Protected frontend routes.
- Administrator-specific access controls.

## 4. State Management

- Shared authentication state.
- Persistent wishlist synchronization.
- Cart state and calculations.
- Reusable React context providers.

## 5. Business Logic

- Discount percentage calculations.
- Final price and savings calculations.
- Category-wide discount promotions.
- Cart and order workflows.
- Delivery-location selection.

## 6. User Experience

- Global search.
- Interactive wishlist buttons.
- Banner slider controls.
- Recommended book sections.
- Form validation and error feedback.
- Reusable loading and message components.

## 7. Testing and Development

- Backend integration testing.
- Database seeding.
- Error-handling middleware.
- Environment configuration.
- Git and GitHub version control.

---

# 🏗️ Project Architecture

Books World uses a client-server architecture. The frontend sends HTTP requests to the backend, which processes requests, enforces applicable rules, and interacts with MongoDB.

```text
                    👤 CUSTOMER / ADMIN
                            |
                            v
                 ┌──────────────────────┐
                 │    React Frontend    │
                 │                      │
                 │ Home & Book Catalogue│
                 │ Search & Recommendations
                 │ Wishlist & Cart      │
                 │ Checkout & Orders    │
                 │ Admin Dashboard      │
                 └──────────┬───────────┘
                            |
                            | Axios / HTTP
                            v
                 ┌──────────────────────┐
                 │    Express Server    │
                 │                      │
                 │ Authentication       │
                 │ Book Management      │
                 │ User Management      │
                 │ Wishlist Operations  │
                 │ Order Processing     │
                 │ Validation & Errors  │
                 └──────────┬───────────┘
                            |
                            | Mongoose
                            v
                 ┌──────────────────────┐
                 │       MongoDB        │
                 │                      │
                 │ Users                │
                 │ Books                │
                 │ Wishlists            │
                 │ Orders               │
                 └──────────────────────┘
```

### Architecture Components

| Component | Responsibility |
|---|---|
| React Frontend | Pages, navigation, interactions, and shared UI state |
| Axios Client | HTTP communication with the backend |
| Express Routes | Map API requests to backend operations |
| Controllers | Process application requests and business logic |
| Middleware | Authentication, authorization, validation, and errors |
| Mongoose Models | Define and access application data |
| MongoDB | Store users, books, wishlists, and orders |

---

# 📂 Project Structure

```text
books-world/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Book.js
│   │   └── Order.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── validate.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookController.js
│   │   ├── orderController.js
│   │   └── userController.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookRoutes.js
│   │   ├── orderRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── utils/
│   │   └── generateToken.js
│   │
│   ├── seeder.js
│   ├── fetchCovers.js
│   ├── testIntegration.js
│   ├── server.js
│   └── .env
│
└── frontend/
    ├── vite.config.js
    ├── index.html
    │
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        │
        ├── api/
        │   └── axios.js
        │
        ├── utils/
        │   ├── price.js
        │   └── cover.js
        │
        ├── context/
        │   ├── AuthContext.jsx
        │   ├── WishlistContext.jsx
        │   └── CartContext.jsx
        │
        ├── components/
        │   ├── Navbar.jsx
        │   ├── BannerSlider.jsx
        │   ├── BookCard.jsx
        │   ├── Price.jsx
        │   ├── Loader.jsx
        │   ├── Message.jsx
        │   ├── ProtectedRoute.jsx
        │   ├── AdminRoute.jsx
        │   └── AdminTabs.jsx
        │
        └── pages/
            ├── Home.jsx
            ├── BookDetails.jsx
            ├── Wishlist.jsx
            ├── Cart.jsx
            ├── Checkout.jsx
            ├── Login.jsx
            ├── Register.jsx
            ├── Profile.jsx
            ├── MyOrders.jsx
            ├── OrderDetails.jsx
            ├── NotFound.jsx
            │
            └── admin/
                ├── Dashboard.jsx
                ├── AdminBooks.jsx
                ├── AdminBookForm.jsx
                ├── AdminOrders.jsx
                └── AdminUsers.jsx
```

---

# 🚀 Installation and Setup

Follow these steps to run Books World locally.

## 1️⃣ Prerequisites

Install the following:

- [Node.js 18 or newer](https://nodejs.org/)
- npm
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) or a MongoDB Atlas connection string
- [Git](https://git-scm.com/)

Verify your Node.js installation:

```bash
node -v
npm -v
```

## 2️⃣ Clone the Repository

Replace the placeholder with the actual GitHub repository URL.

```bash
git clone <YOUR_BOOKS_WORLD_REPOSITORY_URL>
cd books-world
```

## 3️⃣ Install Backend Dependencies

```bash
cd backend
npm install
```

## 4️⃣ Configure Environment Variables

Create or update `backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/booksworld
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=30d
CLIENT_URL=http://localhost:5173
```

### Important Security Notes

- Generate your own JWT secret.
- Do not commit `.env` files to GitHub.
- Ensure MongoDB is running.
- Use the correct MongoDB URI for your environment.

If `.env` is already present locally, update its values rather than overwriting it unnecessarily.

## 5️⃣ Seed the Database

From the `backend` directory:

```bash
npm run seed
```

The supplied seed script is intended to create:

- 60 books.
- Book-cover image references.
- An administrator account.
- A customer account.

Check the seeder before running it against a database containing data you need to preserve.

## 6️⃣ Start the Backend Server

From the `backend` directory:

```bash
npm run dev
```

Expected backend address:

```text
http://localhost:5000
```

## 7️⃣ Install Frontend Dependencies

Open a second terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
```

## 8️⃣ Start the Frontend

```bash
npm run dev
```

Expected frontend address:

```text
http://localhost:5173
```

## 9️⃣ Open Books World

Visit:

**http://localhost:5173**

Keep both development servers running while using the application.

---

# 🔑 Demo Accounts

The supplied seed configuration is intended to provide these local development accounts.

| Role | Email | Password |
|---|---|---|
| Administrator | `admin@gmail.com` | `Admin@123` |
| Customer | `customer@gmail.com` | `Customer@123` |

These credentials are for local development only.

**Do not reuse demo passwords in a public production deployment.**

---

# 🔌 API Overview

The backend is organized into authentication, book, order, and user route modules.

The exact endpoint paths should be confirmed in the corresponding route files before documenting individual requests.

| API Module | Responsibility |
|---|---|
| Authentication | Registration, login, and token-related operations |
| Books | Book catalogue and book management |
| Users | User information, wishlist, and profile operations |
| Orders | Order creation, order history, and status management |

### API Configuration

The frontend uses a shared Axios instance in:

```text
frontend/src/api/axios.js
```

The supplied Vite configuration proxies `/api` requests to the backend on port `5000`.

### Example Request Flow

```text
React Page
    |
    v
Axios Client
    |
    v
Express Route
    |
    v
Middleware / Controller
    |
    v
Mongoose Model
    |
    v
MongoDB
```

The shared Axios client is described as automatically attaching the JWT header when applicable.

---

# 💰 Discount System

Books World uses a shared price utility to keep pricing calculations consistent.

### Pricing Information

| Field | Description |
|---|---|
| Original Price | Price before the discount |
| Discount Percentage | Discount applied to the original price |
| Final Price | Price after applying the discount |
| You Save | Difference between the original and final prices |

### Discount Formula

For a discount percentage `d` and original price `p`:

```text
Discount Amount = p × d / 100

Final Price = p − Discount Amount

You Save = p − Final Price
```

For example, if a book costs ₹500 and has a 20% discount:

| Calculation | Amount |
|---|---:|
| Original Price | ₹500 |
| Discount | 20% |
| Discount Amount | ₹100 |
| Final Price | ₹400 |
| Customer Savings | ₹100 |

This is an illustrative example. The actual result depends on the application's implemented pricing rules and rounding behavior.

---

# 📍 Andhra Pradesh Delivery

Books World provides a delivery-location dropdown for supported Andhra Pradesh locations.

Examples include:

- Kakinada
- Rajahmundry
- Visakhapatnam
- Vijayawada
- Guntur
- Tirupati
- Nellore
- Kurnool
- Kadapa
- Anantapur

The supplied project description also mentions other major towns in Andhra Pradesh.

The checkout workflow uses the selected delivery location when collecting order information.

---

# 🔒 Validation and Security

Books World includes registration validation, authentication middleware, and administrator route protection.

## Registration Rules

| Field | Validation Requirement |
|---|---|
| Name | Must begin with a letter and contain only letters, numbers, and spaces |
| Email | Gmail addresses only, such as `example@gmail.com` |
| Password | At least 8 characters, including uppercase, lowercase, number, and special character |

## Security Features

- JWT-based authentication.
- Password hashing with bcryptjs.
- Authentication middleware.
- Administrator authorization middleware.
- Request validation using express-validator.
- Centralized error-handling middleware.
- Protected frontend routes.
- Administrator-specific frontend routes.

### Production Security Checklist

Before deployment:

- [ ] Replace the development JWT secret.
- [ ] Keep credentials out of source control.
- [ ] Verify backend authorization for all protected operations.
- [ ] Validate and sanitize user input.
- [ ] Configure production CORS settings.
- [ ] Use HTTPS.
- [ ] Review token expiration and storage.
- [ ] Verify password update and account-management behavior.
- [ ] Test invalid and unauthorized requests.

These controls should be verified against the actual code. Their presence does not by itself guarantee complete application security.

---

# 🧪 Testing and Validation

The project includes a backend integration-test file:

```text
backend/testIntegration.js
```

The supplied project instructions specify this command:

```bash
npm test
```

Run it from the `backend` directory if the backend's `package.json` defines the corresponding test script.

### Recommended Test Areas

| Area | What to Verify |
|---|---|
| Registration | Valid and invalid names, emails, and passwords |
| Authentication | Successful login and rejected credentials |
| Authorization | Protected routes and administrator-only operations |
| Book Catalogue | Book retrieval and search behavior |
| Pricing | Discount percentages, final prices, and savings |
| Wishlist | Add, remove, and persistent synchronization |
| Cart | Item movement and quantity updates |
| Checkout | Delivery location and order creation |
| Order Management | Order history and status changes |
| Admin Dashboard | Book, user, and order management |

Do not describe a test as passing until it has been executed successfully in the current project environment.

---

# 🚧 Future Enhancements

Potential improvements for future versions include:

- [ ] Add automated frontend component tests.
- [ ] Expand backend integration-test coverage.
- [ ] Add API documentation with OpenAPI.
- [ ] Introduce advanced book filters and sorting.
- [ ] Improve accessibility and keyboard navigation.
- [ ] Add mobile-specific UI refinements.
- [ ] Add email notifications for order updates.
- [ ] Integrate a payment gateway if required.
- [ ] Add deployment instructions and a live demo.
- [ ] Add screenshots and a short gameplay-style shopping walkthrough.
- [ ] Document database models and API responses in detail.

These are potential improvements rather than claims about existing functionality.

---

# 👩‍💻 Developer

<div align="center">

### Bhanusri Manukonda

Computer Science and Engineering  
Aspiring Software Developer

<br>

<a href="https://github.com/bhanusri-manukonda">
  <img src="https://img.shields.io/badge/GitHub-bhanusri--manukonda-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Profile">
</a>

</div>

---

# 📌 Project Purpose

Books World demonstrates full-stack web development through an online bookstore use case.

The project combines:

- React-based user interfaces.
- Node.js and Express API development.
- MongoDB data persistence.
- Authentication and authorization.
- Wishlist and cart state management.
- Discount and pricing calculations.
- Order workflows.
- Administrative operations.

It provides a practical portfolio example of building and integrating frontend and backend components into a complete web application.

---

<div align="center">

### ⭐ Like Books World? Consider starring the repository!

**Books World — Discover Your Next Favorite Book.**

</div>
