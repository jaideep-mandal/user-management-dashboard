// API URL for user data
const API_URL = 'https://jsonplaceholder.typicode.com/users';

// Local array to store users dynamically
let users = [];

// Fetch users from API and store them in the local array
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
            renderUsers(); // Render users on page
        })
        .catch(error => {
            console.error('Error fetching users:', error);
            alert('Failed to load users.');
        });
}

// Render users in the table from the local array
function renderUsers() {
    const userTable = document.querySelector('#userTable tbody');
    userTable.innerHTML = ''; // Clear existing rows

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.email}</td>
            <td>${user.department}</td>
            <td>
                <button class="edit-btn" onclick="editUser(${user.id})">Edit</button>
                <button class="delete-btn" onclick="deleteUser(${user.id})">Delete</button>
            </td>
        `;
        userTable.appendChild(row);
    });
}

// Add user to local array and update UI without refresh
function addUser(event) {
    event.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const department = document.getElementById('department').value;

    if (firstName && lastName && email && department) {
        const newUser = {
            id: users.length ? users[users.length - 1].id + 1 : 1, // Assign new ID
            firstName,
            lastName,
            email,
            department
        };

        users.push(newUser); // Add user to the array
        renderUsers(); // Update UI
        cancelAddUser(); // Hide form
        alert(`User ${firstName} ${lastName} added successfully.`);
    } else {
        alert('All fields are required!');
    }
}

// Show Add User Form with overlay
function showAddUserForm() {
    document.getElementById('formOverlay').style.display = 'flex';
}

// Cancel and reset the add user form
function cancelAddUser() {
    document.getElementById('addUserFormFields').reset();
    document.getElementById('formOverlay').style.display = 'none'; // Hide overlay
}

// Edit user by populating form
function editUser(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return alert('User not found!');

    document.getElementById('firstName').value = user.firstName;
    document.getElementById('lastName').value = user.lastName;
    document.getElementById('email').value = user.email;
    document.getElementById('department').value = user.department;

    const submitButton = document.querySelector('#addUserFormFields button[type="submit"]');
    submitButton.textContent = 'Save Changes';
    submitButton.setAttribute('onclick', `saveEditUser(${userId})`);

    document.getElementById('formOverlay').style.display = 'flex'; // Show overlay
}

// Save edited user in the local array and update UI
function saveEditUser(userId) {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const department = document.getElementById('department').value;

    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        users[userIndex] = { id: userId, firstName, lastName, email, department };
        renderUsers(); // Update UI
        cancelAddUser();
        alert('User updated successfully.');
    } else {
        alert('User not found!');
    }
}

// Delete user from local array and update UI
function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        users = users.filter(user => user.id !== userId);
        renderUsers(); // Update UI
        alert('User deleted successfully.');
    }
}

// Event Listeners
document.getElementById('addUserBtn').addEventListener('click', showAddUserForm);
document.getElementById('cancelAddUserBtn').addEventListener('click', cancelAddUser);
document.getElementById('addUserFormFields').addEventListener('submit', addUser);

// Fetch users on page load
document.addEventListener('DOMContentLoaded', fetchUsers);