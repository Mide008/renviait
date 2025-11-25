/**
 * Renvia IT - Authentication System
 * Handles login, logout, and session management
 * NOTE: This is a front-end demo using localStorage. 
 * Replace with real backend authentication in production.
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ===================================
    // CHECK AUTHENTICATION STATE
    // ===================================
    function isAuthenticated() {
        return localStorage.getItem('isLoggedIn') === 'true';
    }
    
    function getCurrentUser() {
        const userStr = localStorage.getItem('currentUser');
        return userStr ? JSON.parse(userStr) : null;
    }
    
    function setCurrentUser(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('isLoggedIn', 'true');
    }
    
    function clearAuth() {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isLoggedIn');
    }
    
    // ===================================
    // PROTECT DASHBOARD PAGE
    // ===================================
    if (window.location.pathname.includes('dashboard.html')) {
        if (!isAuthenticated()) {
            window.location.href = 'login.html';
            return;
        }
        
        // Display user name in dashboard
        const user = getCurrentUser();
        if (user) {
            const userNameElements = document.querySelectorAll('#userName, #dashboardUserName');
            userNameElements.forEach(el => {
                if (el) el.textContent = user.firstName || user.email.split('@')[0];
            });
        }
    }
    
    // ===================================
    // LOGIN FORM HANDLER
    // ===================================
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        // Password toggle
        const togglePassword = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('password');
        
        if (togglePassword && passwordInput) {
            togglePassword.addEventListener('click', function() {
                const type = passwordInput.type === 'password' ? 'text' : 'password';
                passwordInput.type = type;
                
                const icon = this.querySelector('i');
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            });
        }
        
        // Form submission
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(loginForm);
            const email = formData.get('email');
            const password = formData.get('password');
            const remember = formData.get('remember') === 'on';
            
            // Validate inputs
            if (!email || !password) {
                showError('Please enter both email and password');
                return;
            }
            
            // Email format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showError('Please enter a valid email address');
                return;
            }
            
            // Disable submit button
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
            
            try {
                // Simulate API call
                await simulateLogin(email, password);
                
                // Create user object
                const user = {
                    email: email,
                    firstName: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
                    lastName: '',
                    loginTime: new Date().toISOString(),
                    remember: remember
                };
                
                // Store authentication
                setCurrentUser(user);
                
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
                
            } catch (error) {
                showError(error.message || 'Login failed. Please try again.');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }
    
    // ===================================
    // SIMULATE LOGIN (DEMO ONLY)
    // ===================================
    async function simulateLogin(email, password) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        /*
         * CONFIGURATION NEEDED FOR PRODUCTION:
         * Replace this with actual authentication API call:
         * 
         * const response = await fetch('YOUR_API_ENDPOINT/login', {
         *     method: 'POST',
         *     headers: { 'Content-Type': 'application/json' },
         *     body: JSON.stringify({ email, password })
         * });
         * 
         * if (!response.ok) {
         *     throw new Error('Invalid credentials');
         * }
         * 
         * return await response.json();
         */
        
        // Demo: Accept any email/password combination
        console.log('Demo login successful for:', email);
        return { success: true };
    }
    
    // ===================================
    // LOGOUT HANDLER
    // ===================================
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Clear authentication
            clearAuth();
            
            // Redirect to login
            window.location.href = 'login.html';
        });
    }
    
    // ===================================
    // USER MENU DROPDOWN
    // ===================================
    const userMenuToggle = document.getElementById('userMenuToggle');
    const userMenuDropdown = document.getElementById('userMenuDropdown');
    
    if (userMenuToggle && userMenuDropdown) {
        userMenuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            userMenuDropdown.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!userMenuToggle.contains(e.target) && !userMenuDropdown.contains(e.target)) {
                userMenuDropdown.classList.remove('active');
            }
        });
    }
    
    // ===================================
    // SHOW ERROR MESSAGE
    // ===================================
    function showError(message) {
        // Remove existing alerts
        const existingAlerts = document.querySelectorAll('.alert');
        existingAlerts.forEach(alert => alert.remove());
        
        // Create error alert
        const alert = document.createElement('div');
        alert.className = 'alert alert-error';
        alert.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <div>${message}</div>
        `;
        
        // Insert at top of form
        const form = document.getElementById('loginForm');
        if (form) {
            form.insertBefore(alert, form.firstChild);
            
            // Auto remove after 5 seconds
            setTimeout(() => {
                alert.style.transition = 'opacity 0.3s ease';
                alert.style.opacity = '0';
                setTimeout(() => alert.remove(), 300);
            }, 5000);
        }
    }
    
    // ===================================
    // SESSION TIMEOUT (Optional)
    // ===================================
    if (isAuthenticated()) {
        const user = getCurrentUser();
        
        // If remember me was not checked, implement session timeout
        if (user && !user.remember) {
            const loginTime = new Date(user.loginTime);
            const now = new Date();
            const hoursSinceLogin = (now - loginTime) / (1000 * 60 * 60);
            
            // Auto logout after 24 hours
            if (hoursSinceLogin > 24) {
                clearAuth();
                if (window.location.pathname.includes('dashboard.html')) {
                    window.location.href = 'login.html';
                }
            }
        }
    }
    
    console.log('Auth system initialized');
});