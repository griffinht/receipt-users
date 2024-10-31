const HomePage = () => {
    return `
        <div class="home-container">
            <h1>Welcome to Demo App</h1>
            <nav class="nav-menu">
                <ul>
                    <li><a href="/profile" class="nav-link">User Profile</a></li>
                    <li><a href="http://analyzer.localhost.com:2999" class="nav-link">Receipt Scanner</a></li>
                    <li><a href="/login" class="nav-link">Login</a></li>
                </ul>
            </nav>
        </div>
    `;
};

module.exports = HomePage; 