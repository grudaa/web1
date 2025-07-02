const testAccounts = {
    admin: {
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        fullName: 'Admin User',
        id: 'admin001'
    },
    worker: {
        username: 'john.doe',
        password: 'worker123', 
        role: 'worker',
        fullName: 'John Doe',
        id: 'worker001'
    }
};

// Authentication
function authenticateUser(username, password) {
    for (let key in testAccounts) {
        const account = testAccounts[key];

        if (account.username === username && account.password === password) {
            return account; 
        }
    }
    return null; 
}

// Store user session data 
function storeUserSession(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('loginTime', new Date().toISOString());
}

// Login form handling
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            
            const existingError = document.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }

            const user = authenticateUser(username, password);
            
            if (user) {
                storeUserSession(user);

                Swal.fire({
                    icon: 'success',
                    title: 'Login Successful!',
                    text: 'Redirecting to your dashboard...',
                    timer: 1500,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    allowOutsideClick: false
                }).then(() => {
                    if (user.role === 'admin') {
                        window.location.href = 'pages/admin-dashboard.html';
                    } else if (user.role === 'worker') {
                        window.location.href = 'pages/worker-dashboard.html';
                    }
                });
                
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: 'Invalid username or password. Please try again.',
                    confirmButtonText: 'Try Again',
                    confirmButtonColor: '#dc3545'
                });
            }
        });
    }
});
