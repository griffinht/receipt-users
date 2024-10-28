const express = require('express');
const bodyParser = require('body-parser');
const { createProxyMiddleware } = require('http-proxy-middleware');
const CustomForm = require('./components/CustomForm');
const UserProfile = require('./components/UserProfile');
const HomePage = require('./components/HomePage');
const app = express();
const port = 3000;

// Proxy middleware setup
const scannerProxy = createProxyMiddleware({
    target: 'http://localhost:3002',
    changeOrigin: true,
    pathRewrite: {
        '^/scanner': '/' // Remove /scanner from the URL
    }
});

const sharerProxy = createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: {
        '^/sharer': '/' // Remove /sharer from the URL
    }
});

// Use the proxy middleware for /scanner and /sharer paths
app.use('/scanner', scannerProxy);
app.use('/sharer', sharerProxy);

// Mock user data (in a real app, this would come from a database)
const mockUser = {
    id: "12345",
    name: "John Doe"
};

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the CSS file
app.get('/style.css', (req, res) => {
    res.sendFile(__dirname + '/public/style.css');
});

// Serve the home page
app.get('/', (req, res) => {
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

// Contact form page
app.get('/form', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Contact Form Demo</title>
            <link rel="stylesheet" href="/style.css">
        </head>
        <body>
            <h1>Contact Form Demo</h1>
            ${CustomForm()}
            <a href="/" class="back-link">Back to Home</a>
        </body>
        </html>
    `);
});

// User profile page
app.get('/profile', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>User Profile</title>
            <link rel="stylesheet" href="/style.css">
        </head>
        <body>
            ${UserProfile(mockUser)}
        </body>
        </html>
    `);
});

// Todo list page (placeholder)
app.get('/todo', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Todo List Demo</title>
            <link rel="stylesheet" href="/style.css">
        </head>
        <body>
            <h1>Todo List Demo</h1>
            <p>Coming soon...</p>
            <a href="/" class="back-link">Back to Home</a>
        </body>
        </html>
    `);
});

// Counter page (placeholder)
app.get('/counter', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Counter Demo</title>
            <link rel="stylesheet" href="/style.css">
        </head>
        <body>
            <h1>Counter Demo</h1>
            <p>Coming soon...</p>
            <a href="/" class="back-link">Back to Home</a>
        </body>
        </html>
    `);
});

// Handle form submission
app.post('/submit', (req, res) => {
    const formData = req.body;
    console.log('Form submission received:', formData);
    res.send(`
        <h1>Form Submitted Successfully!</h1>
        <p>Name: ${formData.name}</p>
        <p>Email: ${formData.email}</p>
        <p>Message: ${formData.message}</p>
        <a href="/" class="back-link">Back to Home</a>
    `);
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
