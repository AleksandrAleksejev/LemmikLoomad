const API_BASE = '/api';

const api = {
    getToken: () => localStorage.getItem('vc_token'),
    getUser: () => {
        try { return JSON.parse(localStorage.getItem('vc_user') || 'null'); }
        catch { return null; }
    },
    setAuth: (token, user) => {
        localStorage.setItem('vc_token', token);
        localStorage.setItem('vc_user', JSON.stringify(user));
    },
    clearAuth: () => {
        localStorage.removeItem('vc_token');
        localStorage.removeItem('vc_user');
    },
    logout: () => {
        api.clearAuth();
        window.location.href = '/';
    },
    isLoggedIn: () => !!localStorage.getItem('vc_token'),
    isAdmin: () => {
        const u = api.getUser();
        return u?.role === 'Admin';
    },

    async request(method, path, body = null) {
        const token = api.getToken();
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`${API_BASE}${path}`, {
            method,
            headers,
            body: body !== null ? JSON.stringify(body) : undefined
        });

        const text = await res.text();
        let data = null;
        try { data = JSON.parse(text); } catch { data = text; }

        if (res.status === 401) { api.logout(); return null; }
        if (!res.ok) throw new Error(data?.message || data || `HTTP ${res.status}`);
        return data;
    }
};

api.get    = (p)    => api.request('GET', p);
api.post   = (p, b) => api.request('POST', p, b);
api.put    = (p, b) => api.request('PUT', p, b);
api.patch  = (p, b) => api.request('PATCH', p, b);
api.del    = (p)    => api.request('DELETE', p);

// Multipart form upload (no Content-Type header – browser sets boundary)
api.postForm = async (path, formData) => {
    const token = api.getToken();
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE}${path}`, { method: 'POST', headers, body: formData });
    const text = await res.text();
    let data = null;
    try { data = JSON.parse(text); } catch { data = text; }
    if (res.status === 401) { api.logout(); return null; }
    if (!res.ok) throw new Error(data?.message || data || `HTTP ${res.status}`);
    return data;
};

// toasts
function showToast(message, type = 'success') {
    let container = document.getElementById('toast');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast';
        document.body.appendChild(container);
    }
    const el = document.createElement('div');
    el.className = `toast-item toast-${type}`;
    const icons = { success: '✅', error: '❌', info: 'ℹ️' };
    el.innerHTML = `<span>${icons[type] || '📢'}</span><span>${message}</span>`;
    container.appendChild(el);
    setTimeout(() => {
        el.style.opacity = '0';
        el.style.transform = 'translateX(100px)';
        el.style.transition = 'all 0.3s ease';
        setTimeout(() => el.remove(), 300);
    }, 3500);
}

function initScrollAnimations() {
    const observer = new IntersectionObserver(
        entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
        { threshold: 0.1 }
    );
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

function initNavbar() {
    const nav = document.querySelector('.navbar');
    if (!nav) return;
    const update = () => {
        if (window.scrollY > 20) {
            nav.classList.add('scrolled');
            nav.classList.remove('transparent');
        } else {
            nav.classList.remove('scrolled');
            nav.classList.add('transparent');
        }
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
}

function updateNavAuth() {
    const loginBtn = document.getElementById('navLoginBtn');
    const registerBtn = document.getElementById('navRegisterBtn');
    const userBtn = document.getElementById('navUserBtn');
    const dashboardBtn = document.getElementById('navDashboardBtn');

    if (!loginBtn) return;

    if (api.isLoggedIn()) {
        const user = api.getUser();
        if (loginBtn) loginBtn.style.display = 'none';
        if (registerBtn) registerBtn.style.display = 'none';
        if (userBtn) {
            userBtn.style.display = 'flex';
            userBtn.textContent = `👤 ${user?.name || 'Profiil'}`;
        }
        if (dashboardBtn) dashboardBtn.style.display = 'flex';
    } else {
        if (loginBtn) loginBtn.style.display = '';
        if (registerBtn) registerBtn.style.display = '';
        if (userBtn) userBtn.style.display = 'none';
        if (dashboardBtn) dashboardBtn.style.display = 'none';
    }
}

function petIcon(liik) {
    const icons = { 'Koer': '🐕', 'Kass': '🐈', 'Küülik': '🐇', 'Lind': '🦜', 'Muu': '🐾' };
    return icons[liik] || '🐾';
}

function statusBadge(staatus) {
    const map = {
        'Ootel': ['badge-pending', '⏳ Ootel'],
        'Kinnitatud': ['badge-approved', '✅ Kinnitatud'],
        'Lükatud': ['badge-rejected', '❌ Lükatud'],
        'Üle kantud': ['badge-transferred', '🔄 Üle kantud']
    };
    const [cls, label] = map[staatus] || ['badge-pending', staatus];
    return `<span class="badge ${cls}">${label}</span>`;
}

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initScrollAnimations();
    updateNavAuth();
});
