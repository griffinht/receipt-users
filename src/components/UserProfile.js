const UserProfile = (user) => {
    return `
        <div class="profile-container">
            <h2>User Profile</h2>
            <div class="profile-info">
                <p><strong>User ID:</strong> ${user.id}</p>
                <p><strong>Name:</strong> ${user.name}</p>
            </div>
            <a href="/" class="back-link">Back to Form</a>
        </div>
    `;
};

module.exports = UserProfile; 