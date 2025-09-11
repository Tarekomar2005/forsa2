# Forsa E-commerce Platform

A modern Arabic e-commerce platform for handbags with authentication and order management.

## 🚀 Features

- ✅ User Authentication (Register/Login)
- ✅ Product Catalog with Shopping Cart
- ✅ Order Management System
- ✅ Admin Panel (No Auth Required)
- ✅ Multi-device Support
- ✅ Arabic RTL Interface
- ✅ JSON Database (No External DB needed)

## 🛠️ Technology Stack

- **Backend**: Node.js + Express.js
- **Database**: JSON File (Simplified)
- **Authentication**: JWT + bcryptjs
- **Frontend**: Vanilla HTML/CSS/JS
- **Deployment**: Vercel Ready

## 📦 Installation

```bash
npm install
npm run dev
```

## 🌐 Vercel Deployment

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set Environment Variables:
   - `NODE_ENV=production`
   - `JWT_SECRET=your_super_secret_key_here`
4. Deploy!

### Step 3: Access URLs
- **Main Website**: `https://your-app.vercel.app/`
- **Authentication**: `https://your-app.vercel.app/auth`
- **Admin Panel**: `https://your-app.vercel.app/admin`

## 🔧 Configuration Files

- `vercel.json` - Vercel deployment configuration
- `server.js` - Main server file (Serverless compatible)
- `.env.example` - Environment variables template

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Orders
- `POST /api/orders` - Create order (Auth required)
- `GET /api/orders` - Get user orders (Auth required)

### Admin (Public)
- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/users` - Get all users
- `GET /api/admin/stats` - Get statistics

### Health Check
- `GET /api/health` - Server status

## 🏠 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Access URLs:
# - Main: http://localhost:3001/
# - Auth: http://localhost:3001/auth
# - Admin: http://localhost:3001/admin
```

## 🔐 Security

- JWT tokens for authentication
- bcrypt password hashing
- CORS enabled
- Environment variables for secrets

## 📝 Notes

- Database resets on each deployment (Vercel limitation)
- For production, consider upgrading to MongoDB
- Admin panel accessible without authentication for business owners
- Supports multi-device order placement

## 🤝 Support

For issues or questions, please check the server logs or contact support.
