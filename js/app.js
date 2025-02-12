const API_URL = 'https://jsonplaceholder.typicode.com/users';
let users = [];

// Fetch users from API and store locally
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
            renderUsers();
        })
        .catch(error => alert('Failed to load users.'));
}

// Render users as cards
function renderUsers() {
    const container = document.getElementById('userCardsContainer');
    container.innerHTML = '';

    users.forEach(user => {
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
        alert(`User ${firstName} ${lastName} added successfully.`);
    } else {
        alert('All fields are required!');
    }
}

// Edit user by populating form
function editUser(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return alert('User not found!');

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
        renderUsers();
        closeForm();
        alert('User updated successfully.');
    } else {
        alert('User not found!');
    }
}

// Delete user from local array and update UI
function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        users = users.filter(user => user.id !== userId);
        renderUsers();
        alert('User deleted successfully.');
    }
}

// Close & reset form
function closeForm() {
    document.getElementById('formOverlay').style.display = 'none';
    document.getElementById('addUserFormFields').reset();
}

// Event Listeners
document.getElementById('addUserBtn').addEventListener('click', showAddUserForm);
document.getElementById('cancelAddUserBtn').addEventListener('click', closeForm);
document.addEventListener('DOMContentLoaded', fetchUsers);