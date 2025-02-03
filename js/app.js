// API URL for user data
const API_URL = 'https://jsonplaceholder.typicode.com/users';

// Fetch and display users in the table
function fetchUsers() {
    fetch(API_URL)
        .then(response => response.json())
        .then(users => {
            const userTable = document.querySelector('#userTable tbody');
            userTable.innerHTML = ''; // Clear existing table rows

            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.name.split(' ')[0]}</td> <!-- First Name -->
                    <td>${user.name.split(' ')[1]}</td> <!-- Last Name -->
                    <td>${user.email}</td>
                    <td>${user.company.name}</td> <!-- Department -->
                    <td>
                        <button class="edit-btn" onclick="editUser(${user.id})">Edit</button>
                        <button class="delete-btn" onclick="deleteUser(${user.id})">Delete</button>
                    </td>
                `;
                userTable.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching users:', error);
            alert('Failed to load users.');
        });
}

// Function to handle adding a new user via form submission
function addUser(event) {
    event.preventDefault(); // Prevent form from refreshing the page

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const department = document.getElementById('department').value;

    if (firstName && lastName && email && department) {
        const newUser = {
            name: `${firstName} ${lastName}`,
            email,
            company: { name: department }
        };

        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser)
        })
        .then(response => response.json())
        .then(user => {
            alert(`User ${user.name} added successfully.`);
            fetchUsers(); // Refresh the user list
            cancelAddUser(); // Close the form
        })
        .catch(error => {
            console.error('Error adding user:', error);
            alert('Failed to add user.');
        });
    } else {
        alert('All fields are required!');
    }
}

// Cancel the add user form and reset it
function cancelAddUser() {
    const form = document.getElementById('addUserFormFields');
    if (form) {
        form.reset(); // This will reset all form inputs
    }
    document.getElementById('addUserForm').style.display = 'none'; // Hide the form
}

// Show the Add User form
function showAddUserForm() {
    document.getElementById('addUserForm').style.display = 'block';
}

// Function to handle editing a user (opens a form pre-filled with user data)
function editUser(userId) {
    fetch(`${API_URL}/${userId}`)
        .then(response => response.json())
        .then(user => {
            document.getElementById('firstName').value = user.name.split(' ')[0];
            document.getElementById('lastName').value = user.name.split(' ')[1];
            document.getElementById('email').value = user.email;
            document.getElementById('department').value = user.company.name;

            // Change the form's action from "Add" to "Edit"
            const submitButton = document.querySelector('#addUserFormFields button[type="submit"]');
            submitButton.textContent = 'Save Changes';
            submitButton.setAttribute('onclick', `saveEditUser(${user.id})`);
            
            // Show the form
            document.getElementById('addUserForm').style.display = 'block';
        })
        .catch(error => {
            console.error('Error fetching user data for editing:', error);
            alert('Failed to load user data.');
        });
}

// Function to save changes after editing a user
function saveEditUser(userId) {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const department = document.getElementById('department').value;

    const updatedUser = {
        name: `${firstName} ${lastName}`,
        email,
        company: { name: department }
    };

    fetch(`${API_URL}/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
    })
    .then(response => response.json())
    .then(() => {
        alert('User updated successfully.');
        fetchUsers(); // Refresh the user list
        cancelAddUser(); // Hide the form
    })
    .catch(error => {
        console.error('Error updating user:', error);
        alert('Failed to update user.');
    });
}

// Function to handle deleting a user
function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        fetch(`${API_URL}/${userId}`, { method: 'DELETE' })
            .then(() => {
                alert('User deleted successfully.');
                fetchUsers(); // Refresh the user list
            })
            .catch(error => {
                console.error('Error deleting user:', error);
                alert('Failed to delete user.');
            });
    }
}

// Event listeners
document.getElementById('addUserBtn').addEventListener('click', showAddUserForm);
document.getElementById('cancelAddUserBtn').addEventListener('click', cancelAddUser);
document.getElementById('addUserFormFields').addEventListener('submit', addUser);

// Initialize the page by fetching and displaying users
document.addEventListener('DOMContentLoaded', fetchUsers);