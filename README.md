# Books World — MERN Online Bookstore

A complete, production-style online bookstore built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js):
- **60+ books** with verified, real book-cover images and categorized catalogue
- **Clear discount system** with original price, discount percentage, and final calculated price throughout the application
- **Persistent Wishlist** with interactive heart icons on cards and book details, persistent database sync, and "Move to Cart"
- **Homepage Banner Slider** featuring promotions, discounts, new arrivals, and Andhra Pradesh express delivery
- **Header Search Bar** accessible across all pages with instant search
- **Professional Profile / User Icon** with an account dropdown (Profile, Orders, Wishlist, Admin Dashboard, Logout)
- **Book Details Page** with comprehensive info and **Recommended Books** based on category and author
- **Strict Validations**:
  - Name: Must start with a letter; letters, numbers, and spaces only (rejects numbers at start and special characters)
  - Email: **Gmail addresses only** (`example@gmail.com`)
  - Password: Minimum 8 characters with at least 1 uppercase, 1 lowercase, 1 number, and 1 special character
- **Andhra Pradesh Delivery Location Dropdown**: Kakinada, Rajahmundry, Visakhapatnam, Vijayawada, Guntur, Tirupati, Nellore, Kurnool, Kadapa, Anantapur, and other major AP towns
- **Admin Dashboard**: Book management, prices and discount controls, category-wide discount promotions, user management, order status tracker

```
books-world/
├── backend/
│   ├── config/db.js                MongoDB connection
│   ├── models/
│   │   ├── User.js                 name, email, hashed password, isAdmin, wishlist
│   │   ├── Book.js                 price, discountPercent, finalPrice, youSave
│   │   └── Order.js                items, AP address, totals, savedPrice, status
│   ├── middleware/
│   │   ├── authMiddleware.js       protect (JWT) + admin
│   │   ├── errorMiddleware.js      notFound + JSON error format
│   │   └── validate.js             turns express-validator errors into clean messages
│   ├── controllers/                authController, bookController, orderController, userController
│   ├── routes/                     authRoutes, bookRoutes, orderRoutes, userRoutes
│   ├── utils/generateToken.js      signs JWT
│   ├── seeder.js                   60 books with real covers + admin + customer
│   ├── fetchCovers.js              cover refresh utility
│   ├── testIntegration.js          automated end-to-end integration test
│   ├── server.js                   backend entry point
│   └── .env                        environment secrets
└── frontend/
    ├── vite.config.js              Vite config with /api proxy to port 5000
    ├── index.html
    └── src/
        ├── main.jsx                React entry with Auth, Wishlist, and Cart providers
        ├── App.jsx                 routes & layouts
        ├── index.css               modern responsive design system
        ├── api/axios.js            axios instance with automatic JWT header
        ├── utils/price.js          rupee formatting + discount math
        ├── utils/cover.js          cover error fallback handler
        ├── context/
        │   ├── AuthContext.jsx     authentication and user session
        │   ├── WishlistContext.jsx persistent wishlist with backend sync
        │   └── CartContext.jsx     shopping cart calculations
        ├── components/
        │   ├── Navbar.jsx          header search bar, profile dropdown, wishlist & cart
        │   ├── BannerSlider.jsx    responsive hero slider with auto-sliding & controls
        │   ├── BookCard.jsx        book card with wishlist heart button & discount flag
        │   ├── Price.jsx           standard price display with discount tags
        │   ├── Loader.jsx          loading spinner
        │   ├── Message.jsx         alert feedback
        │   ├── ProtectedRoute.jsx  guard for signed-in users
        │   ├── AdminRoute.jsx      guard for administrators
        │   └── AdminTabs.jsx       navigation tabs for admin pages
        └── pages/
            ├── Home.jsx            banner slider, catalog search, filters, book grid
            ├── BookDetails.jsx     book details + recommended books + wishlist
            ├── Wishlist.jsx        saved books grid with move-to-cart actions
            ├── Cart.jsx            cart items, quantity adjust, discount savings
            ├── Checkout.jsx        Andhra Pradesh delivery dropdown & order placement
            ├── Login.jsx           Gmail login with demo credentials autofill
            ├── Register.jsx        strict validation registration
            ├── Profile.jsx         user profile and password update
            ├── MyOrders.jsx        order history
            ├── OrderDetails.jsx    detailed order view and tracking status
            ├── NotFound.jsx        404 fallback
            └── admin/
                ├── Dashboard.jsx   store analytics & statistics
                ├── AdminBooks.jsx  add/edit/delete books & category discounts
                ├── AdminBookForm.jsx full book creation / editing form
                ├── AdminOrders.jsx view orders & change delivery status
                └── AdminUsers.jsx  view & manage user accounts
```

---

## 1. Quick Start

### Prerequisites
- Node.js 18 or newer (`node -v`)
- MongoDB running locally (`mongodb://127.0.0.1:27017/booksworld`) or MongoDB Atlas URI

---

## 2. Backend Setup

```bash
cd backend
npm install
```

Configure `backend/.env` (already created):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/booksworld
JWT_SECRET=books_world_jwt_super_secret_key_2026
JWT_EXPIRES_IN=30d
CLIENT_URL=http://localhost:5173
```

Seed 60 books with real covers, admin, and test user:
```bash
npm run seed
```

Start the backend server:
```bash
npm run dev
# Server runs on http://localhost:5000
```

### Pre-configured Accounts (Strict Validation Compliant):
| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@gmail.com` | `Admin@123` |
| **Customer** | `customer@gmail.com` | `Customer@123` |

Run automated backend verification test:
```bash
npm test
```

---

## 3. Frontend Setup

Open a **second terminal**:
```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 4. Key Highlights

1. **Wishlist**:
   - Wishlist heart icon on every book card and book details page
   - Persistent synchronization with MongoDB for logged-in accounts
   - Dedicated `/wishlist` page with "Move to Cart" and "Add Available to Cart"

2. **Homepage Banner Slider**:
   - Auto-slides every 5 seconds, pauses on hover
   - Prev / Next arrow controls and clickable pagination dots
   - Highlights discounts, new arrivals, AP delivery, and developer books

3. **Header Search Bar**:
   - Integrated into the sticky navbar for instant title/author search from anywhere

4. **Professional User Profile Dropdown**:
   - Initials avatar button with full name, Gmail, profile link, orders, wishlist, admin link, and logout

5. **Recommended Books**:
   - Dynamically pulls related books in the same category or author on `BookDetails`
   - Shows image, title, author, price, discount badge, View and Add to Cart buttons

6. **Andhra Pradesh Delivery**:
   - Checkout dropdown with major AP cities (Kakinada, Rajahmundry, Visakhapatnam, Vijayawada, Guntur, Tirupati, Nellore, etc.)
