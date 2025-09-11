# Forsa E-commerce Platform

## 🚀 Complete Authentication & Database System

A full-stack e-commerce platform for handbags with user authentication, MongoDB database, and a modern admin panel.

## 📋 Features

### 🔐 Authentication System
- ✅ User Registration with validation
- ✅ Secure Login/Logout
- ✅ Password strength requirements
- ✅ Session management
- ✅ Protected routes

### 🗄️ Database System
- ✅ MongoDB integration with Mongoose
- ✅ User management
- ✅ Order management
- ✅ Contact form handling
- ✅ Real-time data synchronization

### 🎨 Frontend Features
- ✅ Responsive design
- ✅ Arabic RTL support
- ✅ Glass morphism UI
- ✅ Shopping cart functionality
- ✅ Product catalog
- ✅ Admin dashboard

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/forsa_database
JWT_SECRET=your_super_secret_jwt_key_here
PORT=3000
```

### 3. Start MongoDB
**Option A: Local MongoDB**
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create cluster and get connection string
3. Replace `MONGODB_URI` in `.env`

### 4. Run the Application
```bash
# Development mode (auto-restart)
npm run dev

# Production mode
npm start
```

### 5. Access the Application
- **Website**: http://localhost:3000
- **Authentication**: http://localhost:3000/auth
- **Admin Panel**: http://localhost:3000/admin
- **Database Panel**: http://localhost:3000/database

## 🗂️ Project Structure

```
forsa2/
├── server.js              # Express server with API routes
├── package.json           # Node.js dependencies
├── auth.html              # Authentication page
├── index.html             # Main website (protected)
├── admin-panel.html       # Admin dashboard (protected)
├── database.html          # Database management
├── css/
│   └── style.css          # Main styles
├── js/
│   └── script.js          # Frontend JavaScript
└── README.md              # This file
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order

### Contacts
- `POST /api/contacts` - Submit contact form
- `GET /api/contacts` - Get contacts (admin only)

### Dashboard
- `GET /api/dashboard/stats` - Get statistics

### Users (Admin only)
- `GET /api/users` - Get all users

## 👥 User Roles

### Regular User
- ✅ Browse products
- ✅ Place orders
- ✅ View own orders
- ✅ Contact support

### Admin
- ✅ All user permissions
- ✅ View all orders
- ✅ Manage users
- ✅ View contact messages
- ✅ Access admin dashboard

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Protected API routes
- Session expiration handling
- Input validation
- CORS protection

## 🌐 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  phone: String,
  password: String (hashed),
  role: 'user' | 'admin',
  status: 'active' | 'inactive' | 'suspended',
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Orders Collection
```javascript
{
  _id: ObjectId,
  orderId: String (unique),
  userId: ObjectId (ref: User),
  customer: {
    name: String,
    phone: String,
    email: String,
    city: String,
    address: String
  },
  products: [{
    name: String,
    category: String,
    price: Number,
    quantity: Number
  }],
  totals: {
    totalItems: Number,
    totalAmount: Number
  },
  paymentMethod: String,
  status: String,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🚨 Troubleshooting

### MongoDB Connection Issues
1. Check if MongoDB is running
2. Verify connection string in `.env`
3. Check firewall settings
4. For Atlas: whitelist your IP

### Authentication Not Working
1. Clear browser localStorage
2. Check JWT_SECRET in `.env`
3. Verify token expiration

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 [PID]
```

## 📱 Mobile Responsiveness

The application is fully responsive and works on:
- ✅ Desktop (1200px+)
- ✅ Tablet (768px - 1199px)
- ✅ Mobile (320px - 767px)

## 🔄 Auto-Save & Sync

- Orders are automatically saved to MongoDB
- Real-time synchronization between devices
- Automatic session management
- Data persistence across browser sessions

## 🎯 Next Steps

To enhance the platform further:

1. **Email Integration**: Add email notifications
2. **Payment Gateway**: Integrate with payment providers
3. **Image Upload**: Allow product image uploads
4. **Push Notifications**: Real-time order updates
5. **Analytics**: Add Google Analytics
6. **SEO**: Implement meta tags and sitemap

## 📞 Support

For technical support or questions:
- Check the console for error messages
- Verify all environment variables
- Ensure MongoDB is running
- Check network connectivity

---

**Built with ❤️ for Forsa E-commerce Platform**