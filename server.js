const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'forsa_secret_key_2024';

// Simple JSON file database (for demo without MongoDB)
// Use /tmp directory in production (Vercel)
const DB_PATH = process.env.NODE_ENV === 'production' 
    ? '/tmp/database.json' 
    : path.join(__dirname, 'database.json');

// Initialize database file
if (!fs.existsSync(DB_PATH)) {
    const initialDB = {
        users: [],
        orders: [],
        contacts: [],
        counters: {
            users: 0,
            orders: 0,
            contacts: 0
        }
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initialDB, null, 2));
}

// Database helper functions
function readDB() {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function writeDB(data) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function generateId(type) {
    const db = readDB();
    db.counters[type]++;
    writeDB(db);
    return db.counters[type];
}

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files with proper MIME types
app.use('/css', express.static(path.join(__dirname, 'css'), {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
    }
}));
app.use('/js', express.static(path.join(__dirname, 'js'), {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
    }
}));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.static(path.join(__dirname), {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        } else if (filePath.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
    }
}));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        database: 'JSON File Database Connected',
        environment: process.env.NODE_ENV || 'development'
    });
});

// Explicit routes for static files to ensure proper serving
app.get('/css/style.css', (req, res) => {
    res.setHeader('Content-Type', 'text/css');
    res.sendFile(path.join(__dirname, 'css', 'style.css'));
});

app.get('/js/script.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.sendFile(path.join(__dirname, 'js', 'script.js'));
});

// Debug route to check file existence
app.get('/api/debug/files', (req, res) => {
    const fs = require('fs');
    const cssExists = fs.existsSync(path.join(__dirname, 'css', 'style.css'));
    const jsExists = fs.existsSync(path.join(__dirname, 'js', 'script.js'));
    const indexExists = fs.existsSync(path.join(__dirname, 'index.html'));
    
    res.json({
        files: {
            'css/style.css': cssExists,
            'js/script.js': jsExists,
            'index.html': indexExists
        },
        __dirname: __dirname,
        NODE_ENV: process.env.NODE_ENV
    });
});

// Middleware for authentication
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const db = readDB();
        const user = db.users.find(u => u.id === decoded.userId);
        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};

// Routes

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        const db = readDB();

        // Check if user already exists
        const existingUser = db.users.find(u => u.email === email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const user = {
            id: generateId('users'),
            name,
            email,
            phone,
            password: hashedPassword,
            role: email === 'admin@forsa.com' ? 'admin' : 'user', // Make first admin
            status: 'active',
            lastLogin: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        db.users.push(user);
        writeDB(db);

        // Generate token
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const db = readDB();

        // Find user
        const user = db.users.find(u => u.email === email);
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Update last login
        user.lastLogin = new Date().toISOString();
        writeDB(db);

        // Generate token
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// Order Routes
app.post('/api/orders', authenticateToken, async (req, res) => {
    try {
        const orderData = req.body;
        const db = readDB();
        
        const order = {
            id: generateId('orders'),
            orderId: orderData.orderId || 'ORD-' + Date.now(),
            userId: req.user.id,
            customer: orderData.customer,
            products: orderData.products || [],
            totals: orderData.totals,
            paymentMethod: orderData.paymentMethod || 'cash_on_delivery',
            status: 'pending',
            notes: orderData.notes || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        db.orders.push(order);
        writeDB(db);

        res.status(201).json({
            message: 'Order created successfully',
            order
        });
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ message: 'Server error during order creation' });
    }
});

app.get('/api/orders', authenticateToken, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const db = readDB();

        let orders = db.orders;
        
        // If not admin, only show user's own orders
        if (req.user.role !== 'admin') {
            orders = orders.filter(order => order.userId === req.user.id);
        }

        // Add user information to orders
        orders = orders.map(order => {
            const user = db.users.find(u => u.id === order.userId);
            return {
                ...order,
                user: user ? { name: user.name, email: user.email } : null
            };
        });

        // Sort by creation date (newest first)
        orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Pagination
        const paginatedOrders = orders.slice(skip, skip + limit);

        res.json({
            orders: paginatedOrders,
            pagination: {
                current: page,
                pages: Math.ceil(orders.length / limit),
                total: orders.length
            }
        });
    } catch (error) {
        console.error('Orders fetch error:', error);
        res.status(500).json({ message: 'Server error during orders fetch' });
    }
});

// Dashboard/Stats Routes
app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
    try {
        const db = readDB();
        let orders = db.orders;
        
        // If not admin, only show user's own stats
        if (req.user.role !== 'admin') {
            orders = orders.filter(order => order.userId === req.user.id);
        }

        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => {
            return sum + (order.totals?.totalAmount || 0);
        }, 0);

        const stats = {
            totalOrders,
            totalRevenue
        };

        // Admin-only stats
        if (req.user.role === 'admin') {
            stats.totalUsers = db.users.length;
            stats.totalContacts = db.contacts.length;
        }

        res.json(stats);
    } catch (error) {
        console.error('Stats fetch error:', error);
        res.status(500).json({ message: 'Server error during stats fetch' });
    }
});

// Admin-only routes (no authentication required for business owner)
app.get('/api/admin/orders', async (req, res) => {
    try {
        const db = readDB();
        let orders = db.orders;
        
        // Add user information to orders
        orders = orders.map(order => {
            const user = db.users.find(u => u.id === order.userId);
            return {
                ...order,
                user: user ? { name: user.name, email: user.email } : null
            };
        });
        
        // Sort by creation date (newest first)
        orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        res.json({
            orders: orders,
            total: orders.length
        });
    } catch (error) {
        console.error('Admin orders fetch error:', error);
        res.status(500).json({ message: 'Server error during admin orders fetch' });
    }
});

app.get('/api/admin/users', async (req, res) => {
    try {
        const db = readDB();
        const users = db.users.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });
        
        res.json(users);
    } catch (error) {
        console.error('Admin users fetch error:', error);
        res.status(500).json({ message: 'Server error during admin users fetch' });
    }
});

app.get('/api/admin/stats', async (req, res) => {
    try {
        const db = readDB();
        const orders = db.orders;
        
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => {
            return sum + (order.totals?.totalAmount || 0);
        }, 0);
        
        const stats = {
            totalOrders,
            totalRevenue,
            totalUsers: db.users.length,
            totalContacts: db.contacts.length
        };
        
        res.json(stats);
    } catch (error) {
        console.error('Admin stats fetch error:', error);
        res.status(500).json({ message: 'Server error during admin stats fetch' });
    }
});

// Serve the main HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/auth', (req, res) => {
    res.sendFile(path.join(__dirname, 'auth.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin-api.html'));
});

app.get('/test', (req, res) => {
    res.sendFile(path.join(__dirname, 'test.html'));
});

app.get('/debug', (req, res) => {
    res.sendFile(path.join(__dirname, 'debug.html'));
});

// Default route for any unmatched routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server (only in development)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Forsa Server running on http://localhost:${PORT}`);
        console.log(`🌐 External access: http://192.168.1.7:${PORT}`);
        console.log(`📊 Database: JSON File Database`);
        console.log(`🔐 JWT Secret: ${JWT_SECRET.substring(0, 10)}...`);
        console.log(`\n📱 Access URLs:`);
        console.log(`   Local Authentication: http://localhost:${PORT}/auth`);
        console.log(`   External Authentication: http://192.168.1.7:${PORT}/auth`);
        console.log(`   Local Main Website: http://localhost:${PORT}/`);
        console.log(`   External Main Website: http://192.168.1.7:${PORT}/`);
        console.log(`   Local Admin Panel: http://localhost:${PORT}/admin`);
        console.log(`   External Admin Panel: http://192.168.1.7:${PORT}/admin`);
        console.log(`\n🔧 Debug Tools:`);
        console.log(`   Connection Test: http://192.168.1.7:${PORT}/test`);
        console.log(`   Session Debug: http://192.168.1.7:${PORT}/debug`);
        console.log(`\n🔗 Share this URL with other devices: http://192.168.1.7:${PORT}`);
    });
}

// Export for Vercel
module.exports = app;