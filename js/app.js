// API URL for user data
const API_URL = 'https://jsonplaceholder.typicode.com/users';

// Function to fetch and display users
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
        });
}

// Function to handle adding a new user (you can mock adding data)
function addUser() {
    alert("Add User functionality is not implemented in this version.");
}

// Track the currently edited user
let currentEditingUserId = null;

// Function to handle editing a user
function editUser(userId) {
    fetch(API_URL)
        .then(response => response.json())
        .then(users => {
            const user = users.find(u => u.id === userId);
            if (user) {
                currentEditingUserId = userId; // Store the user ID for later

                // Populate the form fields with user data
                document.getElementById('editFirstName').value = user.name.split(' ')[0] || '';
                document.getElementById('editLastName').value = user.name.split(' ')[1] || '';
                document.getElementById('editEmail').value = user.email || '';
                document.getElementById('editDepartment').value = user.company.name || '';

                // Display the form
                document.getElementById('editUserForm').style.display = 'block';
            }
        });
}

// Save edited user
function saveEditUser() {
    const updatedUser = {
        id: currentEditingUserId,
        firstname: document.getElementById('editFirstName').value,
        lastname: document.getElementById('editLastName').value,
        email: document.getElementById('editEmail').value,
        department: document.getElementById('editDepartment').value
    };

    // Handle the updated user
    alert(`User with ID ${updatedUser.id} is updated.`);

    // Hide the edit form after saving
    cancelEdit();
}

// Cancel editing
function cancelEdit() {
    document.getElementById('editUserForm').reset();
    document.getElementById('editUserForm').style.display = 'none';
}

// Function to handle deleting a user (mock action)
function deleteUser(userId) {
    alert(`User with ID ${userId} would be deleted.`);
}

// Initialize the page by fetching and displaying users
document.addEventListener('DOMContentLoaded', fetchUsers);

// Add event listener for "Add User" button
document.getElementById('addUserBtn').addEventListener('click', addUser);

// Handle form submission
document.getElementById('editUserForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from refreshing the page
    saveEditUser();
});
