// js/utils.js — Shared helpers used on every page

// BASE API 
const API = 'https://couponhub-backend-adnp.onrender.com/api';

/* ── Token & User stored in localStorage ── */
const getToken = () => localStorage.getItem('token');
const getUser = () => JSON.parse(localStorage.getItem('user') || 'null');

const saveAuth = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const isLoggedIn = () => !!getToken();

/* ── API request helper ── */
const request = async (path, method = 'GET', body = null, auth = false) => {
  const headers = { 'Content-Type': 'application/json' };

  if (auth) headers['Authorization'] = 'Bearer ' + getToken();

  const res = await fetch(API + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message || 'Request failed');

  return data;
};

/* ── Toast notification ── */
const toast = (msg) => {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2800);
};

/* ── Format date ── */
const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

/* ── Expiry check ── */
const isExpired = (d) => new Date() > new Date(d);

/* ── Copy to clipboard ── */
const copyText = async (text) => {
  await navigator.clipboard.writeText(text);
};

/* ── Coupon card UI ── */
const couponCard = (c, savedIds = []) => {
  const exp = isExpired(c.expiryDate);
  const isSaved = savedIds.includes(c._id);

  return `
  <div class="card coupon-card">
    <div style="display:flex; justify-content:space-between;">
      <span class="coupon-brand">${c.brand}</span>
      <span class="tag">${c.category}</span>
    </div>

    <div class="coupon-discount">${c.discount}</div>
    <div class="coupon-desc">${c.description}</div>

    <div class="coupon-code">
      <span class="code-text">${c.code}</span>
      <button class="btn btn-blue btn-sm copy-btn" data-code="${c.code}">Copy</button>
    </div>

    <div class="coupon-expiry ${exp ? 'expired' : ''}">
      ${exp ? 'Expired' : 'Expires'}: ${fmtDate(c.expiryDate)}
    </div>

    <div class="coupon-actions">
      <button class="btn btn-outline btn-sm save-btn ${isSaved ? 'saved' : ''}" data-id="${c._id}">
        ${isSaved ? '❤️ Saved' : '🤍 Save'}
      </button>
    </div>
  </div>`;
};

/* ── Attach events ── */
const attachCardEvents = (container) => {
  container.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      await copyText(btn.dataset.code);
      btn.textContent = 'Copied!';
      setTimeout(() => (btn.textContent = 'Copy'), 1500);
      toast('Copied!');
    });
  });

  container.querySelectorAll('.save-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!isLoggedIn()) {
        toast('Login required');
        return;
      }

      try {
        const res = await request(`/coupons/${btn.dataset.id}/save`, 'POST', null, true);

        btn.textContent = res.saved ? '❤️ Saved' : '🤍 Save';
        btn.classList.toggle('saved', res.saved);
      } catch (e) {
        toast(e.message);
      }
    });
  });
};

/* ── Navbar update ── */
const updateNav = () => {
  const user = getUser();

  const authLink = document.getElementById('authLink');
  const dashLink = document.getElementById('dashLink');
  const adminLink = document.getElementById('adminLink');

  if (!authLink) return;

  if (user) {
    authLink.textContent = 'Logout';
    authLink.onclick = (e) => {
      e.preventDefault();
      clearAuth();
      location.href = 'index.html';
    };

    if (dashLink) dashLink.style.display = '';
    if (adminLink) adminLink.style.display = user.role === 'admin' ? '' : 'none';
  } else {
    authLink.textContent = 'Login';
    authLink.href = 'pages/login.html';

    if (dashLink) dashLink.style.display = 'none';
    if (adminLink) adminLink.style.display = 'none';
  }
};

document.addEventListener('DOMContentLoaded', updateNav);
