# 🛒 FreshBasket - Grocery Delivery E-Commerce App

A complete full-stack MERN grocery delivery platform with Razorpay payment integration, admin panel, and 100+ products.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js, React Router v6, Context API |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT + bcryptjs |
| Payment | Razorpay |
| Styling | Custom CSS with CSS Variables |

---

## 📁 Project Structure

```
freshbasket/
├── server/                  # Backend (Node.js + Express)
│   ├── config/db.js
│   ├── models/              # User, Product, Cart, Wishlist, Order, Payment
│   ├── controllers/         # Business logic
│   ├── routes/              # API routes
│   ├── middleware/auth.js   # JWT middleware
│   ├── utils/seed.js        # DB seeder (100+ products)
│   └── server.js
│
└── client/                  # Frontend (React)
    └── src/
        ├── components/common/  # Navbar, Footer, ProductCard
        ├── context/            # Auth, Cart, Wishlist contexts
        ├── pages/              # All pages
        │   ├── admin/          # Admin dashboard
        │   └── ...
        ├── services/api.js     # Axios API calls
        └── App.jsx
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- Razorpay account (for payments)

---

### 1. Clone / Extract the Project

```bash
cd freshbasket
```

---

### 2. Backend Setup

```bash
cd server
npm install
```

The `.env` file is already included and pre-configured to work with **local MongoDB** out of the box. Just make sure MongoDB is running locally:

```bash
mongod
```

> 🌐 **Want to use MongoDB Atlas (cloud) instead, or deploy your app online?**
> See the detailed step-by-step guide: [`MONGODB_ATLAS_SETUP.md`](./MONGODB_ATLAS_SETUP.md)

If you want to customize ports, secrets, or add real Razorpay keys, edit `server/.env` directly:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/freshbasket
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
NODE_ENV=development
```

> 💡 Get Razorpay keys from https://dashboard.razorpay.com/app/keys

---

### 3. Seed the Database

```bash
npm run seed
```

This creates:
- ✅ 100+ grocery products across 20 categories
- ✅ Admin account: `admin@freshbasket.com` / `admin123`
- ✅ Test user: `user@freshbasket.com` / `user123`

---

### 4. Start the Backend

```bash
npm run dev
# Server runs on http://localhost:5000
```

---

### 5. Frontend Setup

```bash
cd ../client
npm install
npm start
# App runs on http://localhost:3000
```

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@freshbasket.com | admin123 |
| User | user@freshbasket.com | user123 |

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| GET | /api/auth/profile | Get profile (auth) |
| PUT | /api/auth/profile | Update profile (auth) |
| PUT | /api/auth/change-password | Change password (auth) |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | Get all (with filters) |
| GET | /api/products/:id | Get single product |
| POST | /api/products | Add product (admin) |
| PUT | /api/products/:id | Update (admin) |
| DELETE | /api/products/:id | Delete (admin) |
| POST | /api/products/:id/review | Add review (auth) |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/cart | Get cart |
| POST | /api/cart/add | Add item |
| PUT | /api/cart/update | Update quantity |
| DELETE | /api/cart/item/:productId | Remove item |
| DELETE | /api/cart/clear | Clear cart |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/orders | Create order |
| GET | /api/orders/my | My orders |
| GET | /api/orders/:id | Order detail |
| PUT | /api/orders/:id/cancel | Cancel order |

### Payment (Razorpay)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/payment/create-order | Init Razorpay |
| POST | /api/payment/verify | Verify payment |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/admin/dashboard | Stats |
| GET | /api/admin/users | All users |
| PUT | /api/admin/users/:id/block | Block/Unblock |
| GET | /api/admin/orders | All orders |
| PUT | /api/admin/orders/:id/status | Update status |

---

## 💳 Razorpay Setup

1. Go to https://dashboard.razorpay.com
2. Sign up / log in
3. Go to Settings → API Keys → Generate Test Key
4. Copy `Key ID` and `Key Secret` to your `.env`
5. For testing use card: `4111 1111 1111 1111`, any future expiry, any CVV

---

## 🛒 Features

### User
- Register / Login / Logout (JWT)
- Browse 100+ products in 20 categories
- Search, filter by category, sort by price/rating
- Product detail page with reviews
- Add to Cart / Wishlist
- Checkout with address form
- Razorpay payment (UPI, Card, Net Banking, Wallets)
- Cash on Delivery option
- Order tracking with status steps
- Cancel orders
- User profile with address management

### Admin Panel (`/admin`)
- Dashboard with revenue, users, orders stats
- Manage Products (CRUD)
- Manage Categories (CRUD)
- Manage Orders (update status)
- Manage Users (block/unblock)

---

## 📱 Responsive Design
- Desktop, Tablet, Mobile optimized
- Modern green grocery theme
- Smooth animations and hover effects
- Skeleton loaders while fetching

---

## 🐛 Common Issues

**MongoDB connection failed:**
- Make sure MongoDB is running: `mongod`
- Or use MongoDB Atlas URI

**Razorpay not loading:**
- Make sure `<script src="https://checkout.razorpay.com/v1/checkout.js">` is in `public/index.html`
- Use test mode keys

**CORS error:**
- Backend uses `cors()` middleware — ensure frontend proxy is set to `http://localhost:5000`

---

## 📦 Production Build

```bash
cd client
npm run build
```

Then serve the `build` folder from your Express backend.
