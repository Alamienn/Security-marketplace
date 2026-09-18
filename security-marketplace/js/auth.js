// Simple role state
let currentRole = 'customer'; // 'customer' or 'company'
let authMode = 'login';     // 'login' or 'register'

function setRole(role) {
  currentRole = role;
  const btnCustomer = document.getElementById('btn-customer');
  const btnCompany = document.getElementById('btn-company');
  const companyExtra = document.getElementById('company-extra');

  if (role === 'customer') {
    btnCustomer.classList.add('bg-primary', 'text-white');
    btnCustomer.classList.remove('text-gray-600');
    btnCompany.classList.remove('bg-primary', 'text-white');
    btnCompany.classList.add('text-gray-600');
    if (companyExtra) companyExtra.classList.add('hidden');
  } else {
    btnCompany.classList.add('bg-primary', 'text-white');
    btnCompany.classList.remove('text-gray-600');
    btnCustomer.classList.remove('bg-primary', 'text-white');
    btnCustomer.classList.add('text-gray-600');
    if (companyExtra) companyExtra.classList.remove('hidden');
  }
}

function switchAuth(mode) {
  authMode = mode;
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const title = document.getElementById('auth-title');
  const subtitle = document.getElementById('auth-subtitle');

  if (mode === 'login') {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    title.textContent = 'Login to SecureGuard';
    subtitle.textContent = 'Access your account as Customer or Company';
  } else {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    title.textContent = 'Create Account';
    subtitle.textContent = 'Register as Customer or Security Company';
  }
}

function openAuth(mode) {
  switchAuth(mode);
  // Scroll to the auth card on hero
  document.querySelector('.hero-bg').scrollIntoView({ behavior: 'smooth' });
}

// Simple mock login (stores in localStorage)
function handleLogin(e) {
  e.preventDefault();
  const form = e.target;
  const email = form.querySelector('input[type="email"]').value.trim();
  const password = form.querySelector('input[type="password"]').value;

  // Mock users (for demo)
  const users = JSON.parse(localStorage.getItem('sg_users') || '[]');
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    localStorage.setItem('sg_current_user', JSON.stringify(user));
    redirectToDashboard(user.role);
  } else {
    alert('Invalid email or password.\n\nFor demo, first Register an account.');
  }
}

// Simple mock register
function handleRegister(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.querySelector('input[type="text"]').value.trim();
  const email = form.querySelector('input[type="email"]').value.trim();
  const phone = form.querySelector('input[type="tel"]').value.trim();
  const password = form.querySelector('input[type="password"]').value;

  let location = '';
  let address = '';
  if (currentRole === 'company') {
    const extras = form.querySelectorAll('#company-extra input');
    location = extras[0] ? extras[0].value.trim() : '';
    address = extras[1] ? extras[1].value.trim() : '';
  }

  const users = JSON.parse(localStorage.getItem('sg_users') || '[]');

  if (users.some(u => u.email === email)) {
    alert('Email already registered. Please login.');
    return;
  }

  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    phone,
    password,
    role: currentRole,
    location: location || '',
    address: address || '',
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  localStorage.setItem('sg_users', JSON.stringify(users));
  localStorage.setItem('sg_current_user', JSON.stringify(newUser));

  alert('Account created successfully!');
  redirectToDashboard(currentRole);
}

function redirectToDashboard(role) {
  if (role === 'company') {
    window.location.href = 'pages/company-dashboard.html';
  } else {
    window.location.href = 'pages/customer-dashboard.html';
  }
}

// Check if already logged in
document.addEventListener('DOMContentLoaded', () => {
  const current = localStorage.getItem('sg_current_user');
  if (current) {
    // Optional: auto-redirect if already logged in
    // const user = JSON.parse(current);
    // redirectToDashboard(user.role);
  }
});
