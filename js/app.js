// API URL for user data
const API_URL = 'https://jsonplaceholder.typicode.com/users';

// Function to fetch and display users
function fetchUsers() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            const userTable = document.querySelector('#userTable tbody');
            userTable.innerHTML = '';  // Clear existing table rows

            data.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.name.split(' ')[0]}</td> <!-- First Name -->
                    <td>${user.name.split(' ')[1]}</td> <!-- Last Name -->
                    <td>${user.email}</td>
                    <td>${user.company.name}</td> <!-- Department -->
                    <td>
                        <button onclick="editUser(${user.id})">Edit</button>
                        <button onclick="deleteUser(${user.id})">Delete</button>
                    </td>
                `;
                userTable.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching users:', error));
}

// Function to handle adding a new user
function addUser() {
    const newUser = {
        name: "John Doe",
        email: "john.doe@example.com",
        company: { name: "Engineering" }
    };

    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(newUser),
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        console.log('New user added:', data);
        fetchUsers(); // Refresh user list
    })
    .catch(error => console.error('Error adding user:', error));
}

// Function to handle editing a user
function editUser(userId) {
    alert('Edit user functionality for ID: ' + userId);
}

// Function to handle deleting a user
function deleteUser(userId) {
    fetch(`${API_URL}/${userId}`, {
        method: 'DELETE',
    })
    .then(() => {
        console.log(`User with ID ${userId} deleted.`);
        fetchUsers(); // Refresh user list
    })
    .catch(error => console.error('Error deleting user:', error));
}

// Initialize the page by fetching and displaying users
document.addEventListener('DOMContentLoaded', fetchUsers);

// Add event listener for "Add User" button
document.getElementById('addUserBtn').addEventListener('click', addUser);