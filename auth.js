document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const authContainer = document.getElementById('auth-container');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const showLoginBtn = document.getElementById('show-login');
    const showSignupBtn = document.getElementById('show-signup');
    const loginFormElement = document.getElementById('login');
    const signupFormElement = document.getElementById('signup');
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');

    // Toggle password visibility
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.replace('fa-eye-slash', 'fa-eye');
            }
        });
    });

    // Switch between login and signup
    function switchForms(showLogin) {
        if (showLogin) {
            showLoginBtn.classList.add('text-indigo-600', 'border-indigo-600');
            showLoginBtn.classList.remove('text-gray-500');
            showSignupBtn.classList.add('text-gray-500');
            showSignupBtn.classList.remove('text-indigo-600', 'border-indigo-600');
            
            signupForm.classList.add('animate__fadeOut');
            setTimeout(() => {
                signupForm.classList.add('hidden');
                signupForm.classList.remove('animate__fadeOut');
                loginForm.classList.remove('hidden');
                loginForm.classList.add('animate__fadeIn');
            }, 300);
        } else {
            showSignupBtn.classList.add('text-indigo-600', 'border-indigo-600');
            showSignupBtn.classList.remove('text-gray-500');
            showLoginBtn.classList.add('text-gray-500');
            showLoginBtn.classList.remove('text-indigo-600', 'border-indigo-600');
            
            loginForm.classList.add('animate__fadeOut');
            setTimeout(() => {
                loginForm.classList.add('hidden');
                loginForm.classList.remove('animate__fadeOut');
                signupForm.classList.remove('hidden');
                signupForm.classList.add('animate__fadeIn');
            }, 300);
        }
    }

    // Event listeners for form switching
    showLoginBtn.addEventListener('click', () => switchForms(true));
    showSignupBtn.addEventListener('click', () => switchForms(false));

    // Form submissions
    loginFormElement.addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin();
    });

    signupFormElement.addEventListener('submit', function(e) {
        e.preventDefault();
        handleSignup();
    });

    // Login function
    function handleLogin() {
        authContainer.classList.add('animate__animated', 'animate__pulse');
        const email = loginFormElement.querySelector('input[type="email"]').value;
        
        // Simple validation
        if (!email.includes('@')) {
            alert('Please enter a valid email');
            authContainer.classList.remove('animate__animated', 'animate__pulse');
            return;
        }

        // Simulate API call
        setTimeout(() => {
            authContainer.classList.remove('animate__animated', 'animate__pulse');
            localStorage.setItem('user', JSON.stringify({ 
                email, 
                name: email.split('@')[0] 
            }));
            window.location.href = 'home.html';
        }, 1000);
    }

    // Signup function
    function handleSignup() {
        authContainer.classList.add('animate__animated', 'animate__pulse');
        
        // Get form values
        const fname = signupFormElement.querySelector('input:nth-of-type(1)').value;
        const lname = signupFormElement.querySelector('input:nth-of-type(2)').value;
        const email = signupFormElement.querySelector('input[type="email"]').value;
        const password = signupFormElement.querySelector('input[type="password"]').value;
        const terms = signupFormElement.querySelector('#terms').checked;

        // Validation
        if (!fname || !lname) {
            alert('Please enter your full name');
            authContainer.classList.remove('animate__animated', 'animate__pulse');
            return;
        }

        if (!email.includes('@')) {
            alert('Please enter a valid email');
            authContainer.classList.remove('animate__animated', 'animate__pulse');
            return;
        }

        if (password.length < 8) {
            alert('Password must be at least 8 characters');
            authContainer.classList.remove('animate__animated', 'animate__pulse');
            return;
        }

        if (!terms) {
            alert('You must agree to the terms');
            authContainer.classList.remove('animate__animated', 'animate__pulse');
            return;
        }

        // Simulate API call
        setTimeout(() => {
            authContainer.classList.remove('animate__animated', 'animate__pulse');
            localStorage.setItem('user', JSON.stringify({ 
                email, 
                name: `${fname} ${lname}` 
            }));
            window.location.href = 'welcome.html';
        }, 1000);
    }

    // Add floating animation to particles
    document.querySelectorAll('.animate-float').forEach((el, i) => {
        el.style.animationDuration = `${Math.random() * 5 + 5}s`;
        el.style.animationDelay = `${i * 0.5}s`;
    });
});