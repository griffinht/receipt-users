const UserProfile = (user) => {
    return `
        <div class="profile-container">
            <h2>User Profile</h2>
            <div class="profile-info">
                <p><strong>User ID:</strong> ${user.id}</p>
                <p><strong>Name:</strong> ${user.name}</p>
            </div>
            <div class="profile-actions">
                <a href="/" class="back-link">Back to Home</a>
                <form action="/logout" method="POST" class="logout-form">
                    <button type="submit" class="logout-button">Logout</button>
                </form>
            </div>
        </div>
    `;
};

module.exports = UserProfile; 