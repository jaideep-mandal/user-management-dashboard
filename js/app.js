const API_URL = 'https://jsonplaceholder.typicode.com/users';
let users = [];
let visibleUsers = [];
let currentIndex = 0;
let userToDelete = null;
let USERS_PER_LOAD = window.innerWidth <= 768 ? 5 : 6; // 5 users for small screens, 6 for large screens

// Fetch users from API once and store them
function fetchUsers() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            users = data.map(user => ({
                id: user.id,
                firstName: user.name.split(' ')[0],
                lastName: user.name.split(' ')[1] || '',
                email: user.email,
                department: user.company?.name || 'N/A'
            }));
            loadMoreUsers(); // Load initial users
            checkSmallScreenBehavior(); // Check if "Load More" should be added
        })
        .catch(error => showNotification('Failed to load users.', 'error'));
}

// Load more users when scrolling
function loadMoreUsers() {
    const nextUsers = users.slice(currentIndex, currentIndex + USERS_PER_LOAD);
    visibleUsers = [...visibleUsers, ...nextUsers];
    currentIndex += USERS_PER_LOAD;
    renderUsers();

    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const noUsersLeftMsg = document.getElementById('noUsersLeftMsg');

    if (currentIndex >= users.length) {
        loadMoreBtn.style.display = 'none';  // Hide Load More button
        noUsersLeftMsg.style.display = 'block'; // Show "No user left" message
    } else {
        loadMoreBtn.style.display = window.innerWidth <= 768 ? 'block' : 'none';
        noUsersLeftMsg.style.display = 'none';
    }
}

// Check if the user is on a small screen and enable "Load More" behavior
function checkSmallScreenBehavior() {
    if (window.innerWidth <= 768) {
        document.getElementById('loadMoreBtn').style.display = 'block';
    }
}

// Event listener for "Load More" button
document.getElementById('loadMoreBtn').addEventListener('click', loadMoreUsers);

// Detect when user reaches the bottom and load more users
window.addEventListener('scroll', () => {
    if (window.innerWidth > 768) { // Infinite scroll only for large screens
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
            if (currentIndex < users.length) {
                loadMoreUsers();
            }
        }
    }
});

// Render users as cards
function renderUsers() {
    const container = document.getElementById('userCardsContainer');
    container.innerHTML = '';

    visibleUsers.forEach(user => {
        const card = document.createElement('div');
        card.classList.add('user-card');
        card.innerHTML = `
            <div class="user-avatar">${user.firstName.charAt(0)}${user.lastName.charAt(0)}</div>
            <h3>${user.firstName} ${user.lastName}</h3>
            <p>Email: ${user.email}</p>
            <p>Department: ${user.department}</p>
            <button class="edit-btn" onclick="editUser(${user.id})">Edit</button>
            <button class="delete-btn" onclick="deleteUser(${user.id})">Delete</button>
        `;
        container.appendChild(card);
    });
}

// Show Add User Form
function showAddUserForm() {
    document.getElementById('formOverlay').style.display = 'flex';

    // Reset form & set default behavior (Adding user)
    document.getElementById('addUserFormFields').reset();
    const submitButton = document.querySelector('#addUserFormFields button[type="submit"]');
    submitButton.textContent = 'Add User';
    submitButton.setAttribute('onclick', 'addUser(event)');
}

// Add user to local array and update UI
function addUser(event) {
    event.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const department = document.getElementById('department').value;

    if (firstName && lastName && email && department) {
        const newUser = {
            id: users.length ? users[users.length - 1].id + 1 : 1, // Generate new ID
            firstName,
            lastName,
            email,
            department
        };

        users.push(newUser); // Add user to local array
        renderUsers();
        closeForm();
        showNotification(`User ${firstName} ${lastName} added successfully.`);
    } else {
        showNotification('All fields are required!', 'error');
    }
}

// Edit user by populating form
function editUser(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return showNotification('User not found!', 'error');

    document.getElementById('firstName').value = user.firstName;
    document.getElementById('lastName').value = user.lastName;
    document.getElementById('email').value = user.email;
    document.getElementById('department').value = user.department;

    // Change submit button behavior to save edit
    const submitButton = document.querySelector('#addUserFormFields button[type="submit"]');
    submitButton.textContent = 'Save Changes';
    submitButton.setAttribute('onclick', `saveEditUser(${userId})`);

    document.getElementById('formOverlay').style.display = 'flex';
}

// Save edited user in local array and update UI
function saveEditUser(userId) {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const department = document.getElementById('department').value;

    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        users[userIndex] = { id: userId, firstName, lastName, email, department };

        // Update visibleUsers array to reflect changes
        visibleUsers = users.slice(0, currentIndex);
        
        renderUsers();
        closeForm();
        showNotification('User updated successfully.');
    } else {
        showNotification('User not found!', 'error');
    }
}

// Delete user from local array and update UI
function deleteUser(userId) {
    userToDelete = userId; // Store user ID
    document.getElementById('deleteModal').style.display = 'flex';
}

// Confirm and delete user
function confirmDeleteUser() {
    if (userToDelete !== null) {
        users = users.filter(user => user.id !== userToDelete);

        // Update visibleUsers array to reflect deletion
        visibleUsers = users.slice(0, currentIndex);

        renderUsers();
        showNotification('User deleted successfully.');
    }

    closeDeleteModal();
}

// Close delete modal without deleting
function closeDeleteModal() {
    userToDelete = null; // Reset stored user ID
    document.getElementById('deleteModal').style.display = 'none';
}

// Close & reset form
function closeForm() {
    document.getElementById('formOverlay').style.display = 'none';
    document.getElementById('addUserFormFields').reset();
}

// Show a toast notification
function showNotification(message, type = "success") {
    const container = document.getElementById("notificationContainer");
    const toast = document.createElement("div");
    
    toast.classList.add("toast");
    if (type === "error") toast.classList.add("error");
    
    toast.innerHTML = message;
    container.appendChild(toast);

    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Event Listeners
document.getElementById('addUserBtn').addEventListener('click', showAddUserForm);
document.getElementById('cancelAddUserBtn').addEventListener('click', closeForm);
document.getElementById('confirmDeleteBtn').addEventListener('click', confirmDeleteUser);
document.getElementById('cancelDeleteBtn').addEventListener('click', closeDeleteModal);
document.addEventListener('DOMContentLoaded', fetchUsers);