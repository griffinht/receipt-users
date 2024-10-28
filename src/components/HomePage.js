const HomePage = () => {
    return `
        <div class="home-container">
            <h1>Welcome to Demo App</h1>
            <nav class="nav-menu">
                <ul>
                    <li><a href="/form" class="nav-link">Contact Form Demo</a></li>
                    <li><a href="/profile" class="nav-link">User Profile Demo</a></li>
                    <li><a href="/todo" class="nav-link">Todo List Demo</a></li>
                    <li><a href="/counter" class="nav-link">Counter Demo</a></li>
                </ul>
            </nav>
        </div>
    `;
};

module.exports = HomePage; 