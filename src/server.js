const express = require('express');
const bodyParser = require('body-parser');
const { createProxyMiddleware } = require('http-proxy-middleware');
const CustomForm = require('./components/CustomForm');
const UserProfile = require('./components/UserProfile');
const HomePage = require('./components/HomePage');
const LoginForm = require('./components/LoginForm');
const session = require('express-session');

const app = express();
const mockUser = {
    id: "12345",
    name: "John Doe",
    username: "admin",
    password: "password" // In a real app, this would be hashed
};

// Session middleware setup
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, domain: "localhost.com" } // Set to true if using HTTPS
}));

// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    next();
};

// Middleware to check subdomain and proxy accordingly
app.use((req, res, next) => {
    const host = req.get('host');
    
    if (host.startsWith('analyzer.')) {
        return createProxyMiddleware({
            target: 'http://localhost:3000',
            //target: 'https://httpbin.org',
            changeOrigin: true,
            on: {
                proxyReq: (proxyReq) => {
                    if (req.session.userId) {
                        proxyReq.setHeader('user', req.session.userId);
                    }
                },
            },
        })(req, res, next);
    }

    if (host.startsWith('scanner.')) {
        return createProxyMiddleware({
            target: 'http://localhost:3002',
            changeOrigin: true,
            on: {
                proxyReq: (proxyReq) => {
                    if (req.session.userId) {
                        proxyReq.setHeader('user', req.session.userId);
                    }
                },
            },
        })(req, res, next);
    }
    
    if (host.startsWith('sharer.')) {
        return createProxyMiddleware({
            target: 'http://localhost:3001',
            changeOrigin: true,
            onProxyReq: (proxyReq) => {
                if (req.session.userId) {
                    proxyReq.setHeader('user', req.session.userId);
                }
            }
        })(req, res, next);
    }

    next();
});

// Regular middleware for main app
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Login route
app.get('/login', (req, res) => {
    // Redirect to home if already logged in
    if (req.session.userId) {
        return res.redirect('/');
    }
    
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Login</title>
            <link rel="stylesheet" href="/style.css">
        </head>
        <body>
            ${LoginForm()}
        </body>
        </html>
    `);
});

// Handle login submission
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    if (username === mockUser.username && password === mockUser.password) {
        req.session.userId = mockUser.id;
        req.session.user = {
            id: mockUser.id,
            name: mockUser.name
        };
        res.redirect('/');
    } else {
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Login Failed</title>
                <link rel="stylesheet" href="/style.css">
            </head>
            <body>
                <div class="login-container">
                    <h2>Login Failed</h2>
                    <p>Invalid username or password</p>
                    <a href="/login" class="back-link">Try Again</a>
                </div>
            </body>
            </html>
        `);
    }
});

// Add logout route
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/login');
    });
});

// Protected routes
app.get('/', requireAuth, (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Demo App</title>
            <link rel="stylesheet" href="/style.css">
        </head>
        <body>
            ${HomePage()}
        </body>
        </html>
    `);
});

app.get('/profile', requireAuth, (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>User Profile</title>
            <link rel="stylesheet" href="/style.css">
        </head>
        <body>
            ${UserProfile(req.session.user)}
        </body>
        </html>
    `);
});

app.listen(2999, () => {
    console.log('Server running at:');
    console.log('  http://localhost:2999');
});
