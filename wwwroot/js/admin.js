let allBookings = [];
let allClinics = [];
let allProcedures = [];
let allPets = [];

// Calendar state
let calYear = new Date().getFullYear();
let calMonth = new Date().getMonth();

// Chart instances (for destroy on re-render)
let chartInstances = {};

document.addEventListener('DOMContentLoaded', async () => {
    if (!api.isLoggedIn()) { window.location.href = '/auth.html'; return; }
    if (!api.isAdmin()) { window.location.href = '/dashboard.html'; return; }

    const user = api.getUser();
    document.getElementById('sidebarAvatar').textContent = user?.name?.[0]?.toUpperCase() || 'A';
    document.getElementById('sidebarName').textContent = user?.name || 'Admin';

    await loadClinics();
    await loadDashboard();
    showSection('dashboard');
});

const ADMIN_SECTIONS = ['dashboard', 'bookings', 'clinics', 'procedures', 'users', 'charts', 'calendar', 'medrecords'];

function showSection(name) {
    ADMIN_SECTIONS.forEach(s => {
        const el = document.getElementById(`section-${s}`);
        if (el) el.style.display = s === name ? 'block' : 'none';
        const nav = document.getElementById(`nav-${s}`);
        if (nav) nav.classList.toggle('active', s === name);
    });
    const titles = {
        dashboard: i18n.t('adminDashboard'), bookings: i18n.t('adminBookings'),
        clinics: i18n.t('adminClinics'), procedures: i18n.t('adminProcedures'),
        users: i18n.t('adminUsers'), charts: i18n.t('adminCharts'),
        calendar: i18n.t('adminCalendar'), medrecords: i18n.t('adminMedRecords')
    };
    document.getElementById('topbarTitle').textContent = titles[name] || '';

    if (name === 'bookings') loadAllBookings();
    else if (name === 'clinics') { allClinics.length ? renderClinicsGrid() : loadClinics(); }
    else if (name === 'procedures') loadProcedures();
    else if (name === 'users') loadUsers();
    else if (name === 'charts') loadCharts();
    else if (name === 'calendar') renderCalendar();
    else if (name === 'medrecords') initAdminMedRecords();
}

async function loadDashboard() {
    try {
        const [stats, bookings] = await Promise.all([
            api.get('/Broneering/stats'),
            api.get('/Broneering/all')
        ]);
        allBookings = bookings || [];

        document.getElementById('statsGrid').innerHTML = `
            <div class="stat-card">
                <div class="stat-icon stat-icon-teal">📋</div>
                <div><div class="stat-value">${stats.total}</div><div class="stat-label">${i18n.t('statTotal')}</div></div>
            </div>
            <div class="stat-card">
                <div class="stat-icon stat-icon-yellow">⏳</div>
                <div><div class="stat-value">${stats.ootel}</div><div class="stat-label">${i18n.t('statPending')}</div></div>
            </div>
            <div class="stat-card">
                <div class="stat-icon stat-icon-green">✅</div>
                <div><div class="stat-value">${stats.kinnitatud}</div><div class="stat-label">${i18n.t('statConfirmed')}</div></div>
            </div>
            <div class="stat-card">
                <div class="stat-icon stat-icon-red">❌</div>
                <div><div class="stat-value">${stats.lukatud}</div><div class="stat-label">${i18n.t('statRejected')}</div></div>
            </div>
            <div class="stat-card">
                <div class="stat-icon stat-icon-blue">👥</div>
                <div><div class="stat-value">${stats.users}</div><div class="stat-label">${i18n.t('statUsers')}</div></div>
            </div>
            <div class="stat-card">
                <div class="stat-icon stat-icon-teal">🐾</div>
                <div><div class="stat-value">${stats.pets}</div><div class="stat-label">${i18n.t('statPets')}</div></div>
            </div>
        `;

        if (stats.ootel > 0) {
            const badge = document.getElementById('pendingBadge');
            badge.textContent = stats.ootel;
            badge.style.display = '';
        }
        document.getElementById('pendingCount').textContent = `${stats.ootel} ootel`;

        const recent = [...allBookings].slice(0, 5);
        document.getElementById('recentBookings').innerHTML = renderMiniTable(recent);

        const pending = allBookings.filter(b => b.staatus === 'Ootel').slice(0, 5);
        document.getElementById('pendingBookings').innerHTML = pending.length
            ? renderMiniTable(pending, true)
            : '<div class="empty-state" style="padding:32px;"><div class="empty-icon" style="font-size:32px;">✅</div><div class="empty-title" style="font-size:15px;">Kõik kinnitatud!</div></div>';

    } catch (err) {
        showToast('Statistika laadimine ebaõnnestus: ' + err.message, 'error');
    }
}

function renderMiniTable(bookings, showActions = false) {
    if (!bookings.length) return '<div style="padding:24px;text-align:center;color:var(--text-muted);">Andmed puuduvad</div>';
    return `<div class="table-scroll"><table>
        <thead><tr><th>#</th><th>Klient</th><th>Protseduur</th><th>Kuupäev</th><th>Staatus</th>${showActions ? '<th></th>' : ''}</tr></thead>
        <tbody>${bookings.map(b => `
        <tr>
            <td>${b.id}</td>
            <td><div class="td-name">${b.user?.name || '—'}</div><div class="td-sub">${b.user?.email || ''}</div></td>
            <td>${b.protseduur?.ikoon || ''} ${b.protseduur?.nimi || '—'}</td>
            <td>${new Date(b.kuupAev).toLocaleDateString('et-EE',{day:'2-digit',month:'2-digit',year:'numeric'})}</td>
            <td>${statusBadge(b.staatus)}</td>
            ${showActions ? `<td><button class="action-btn action-approve" onclick="openStatusModal(${b.id})">Halda</button></td>` : ''}
        </tr>`).join('')}</tbody>
    </table></div>`;
}

// bookings
async function loadAllBookings() {
    // TODO: server-side pagination would be nice here
    try {
        allBookings = await api.get('/Broneering/all');
        filterAdminBookings();
    } catch (err) {
        showToast('Laadimine ebaõnnestus: ' + err.message, 'error');
    }
}

function filterAdminBookings() {
    const search = (document.getElementById('adminBookingSearch')?.value || '').toLowerCase();
    const status = document.getElementById('statusFilter')?.value || '';
    const filtered = allBookings.filter(b => {
        const matchStatus = !status || b.staatus === status;
        const matchSearch = !search ||
            (b.user?.name || '').toLowerCase().includes(search) ||
            (b.user?.email || '').toLowerCase().includes(search) ||
            (b.lemmikloom?.nimi || '').toLowerCase().includes(search) ||
            (b.kliinik?.nimi || '').toLowerCase().includes(search) ||
            (b.protseduur?.nimi || '').toLowerCase().includes(search);
        return matchStatus && matchSearch;
    });
    renderBookingsTable(filtered);
}

function renderBookingsTable(bookings) {
    const tbody = document.getElementById('bookingsTableBody');
    if (!bookings.length) {
        tbody.innerHTML = `<tr><td colspan="9"><div class="empty-state"><div class="empty-icon">📋</div><div class="empty-title">Broneeringud puuduvad</div></div></td></tr>`;
        return;
    }
    tbody.innerHTML = bookings.map(b => `
        <tr>
            <td><strong>#${b.id}</strong></td>
            <td>
                <div class="td-name">${b.user?.name || '—'}</div>
                <div class="td-sub">📧 ${b.user?.email || ''}</div>
                ${b.user?.phone ? `<div class="td-sub">📞 ${b.user.phone}</div>` : ''}
            </td>
            <td>
                <div class="td-name">${b.lemmikloom ? petIcon(b.lemmikloom.liik) + ' ' + b.lemmikloom.nimi : '—'}</div>
                <div class="td-sub">${b.lemmikloom?.liik || ''}</div>
            </td>
            <td>
                <div class="td-name">${b.protseduur?.ikoon || ''} ${b.protseduur?.nimi || '—'}</div>
                <div class="td-sub">⏱ ${b.protseduur?.kestus || '—'} min</div>
            </td>
            <td>
                <div class="td-name">${b.kliinik?.nimi || '—'}</div>
                <div class="td-sub">📍 ${b.kliinik?.aadress || ''}</div>
            </td>
            <td>
                <div class="td-name">${new Date(b.kuupAev).toLocaleDateString('et-EE',{day:'2-digit',month:'2-digit',year:'numeric'})}</div>
                <div class="td-sub">${new Date(b.kuupAev).toLocaleTimeString('et-EE',{hour:'2-digit',minute:'2-digit'})}</div>
            </td>
            <td><strong style="color:var(--primary);">${b.protseduur?.hind ?? '—'} €</strong></td>
            <td>${statusBadge(b.staatus)}</td>
            <td>
                <div style="display:flex;gap:6px;flex-wrap:wrap;">
                    ${b.staatus === 'Ootel' ? `
                        <button class="action-btn action-approve" onclick="quickStatus(${b.id},'Kinnitatud')">✅</button>
                        <button class="action-btn action-reject" onclick="quickStatus(${b.id},'Lükatud')">❌</button>
                    ` : ''}
                    <button class="action-btn action-transfer" onclick="openStatusModal(${b.id})">⚙️</button>
                </div>
            </td>
        </tr>
    `).join('');
}

async function quickStatus(id, staatus) {
    try {
        await api.patch(`/Broneering/${id}/status`, { staatus });
        allBookings = allBookings.map(b => b.id === id ? { ...b, staatus } : b);
        filterAdminBookings();
        showToast(`Staatus muudetud: ${staatus}`, 'success');
    } catch (err) {
        showToast('Viga: ' + err.message, 'error');
    }
}

function openStatusModal(id) {
    const b = allBookings.find(x => x.id === id);
    if (!b) return;
    document.getElementById('statusBookingId').value = id;
    document.getElementById('statusBookingIdDisplay').textContent = id;
    document.getElementById('newStatus').value = b.staatus;
    toggleClinicTransfer();
    document.getElementById('statusModal').classList.remove('hidden');
}

function closeStatusModal() { document.getElementById('statusModal').classList.add('hidden'); }

function toggleClinicTransfer() {
    const val = document.getElementById('newStatus').value;
    const group = document.getElementById('transferClinicGroup');
    group.style.display = val === 'Üle kantud' ? 'block' : 'none';
    if (val === 'Üle kantud') {
        const sel = document.getElementById('transferClinic');
        sel.innerHTML = '<option value="">Vali kliinik...</option>' +
            allClinics.map(c => `<option value="${c.id}">${c.nimi}</option>`).join('');
    }
}

async function saveStatus() {
    const id = parseInt(document.getElementById('statusBookingId').value);
    const staatus = document.getElementById('newStatus').value;
    const kliinikId = staatus === 'Üle kantud'
        ? parseInt(document.getElementById('transferClinic').value) || undefined
        : undefined;

    if (staatus === 'Üle kantud' && !kliinikId) { showToast('Vali kliinik üleandmiseks.', 'error'); return; }

    const btn = document.getElementById('saveStatusBtn');
    btn.disabled = true;
    try {
        await api.patch(`/Broneering/${id}/status`, { staatus, kliinikId });
        allBookings = allBookings.map(b => b.id === id ? { ...b, staatus } : b);
        filterAdminBookings();
        closeStatusModal();
        showToast('Staatus edukalt uuendatud! ✅', 'success');
    } catch (err) {
        showToast('Viga: ' + err.message, 'error');
    } finally {
        btn.disabled = false;
    }
}

async function loadClinics() {
    try {
        allClinics = await api.get('/Kliinik/list');
        const grid = document.getElementById('clinicsGrid');
        if (grid && document.getElementById('section-clinics').style.display !== 'none') renderClinicsGrid();
    } catch { showToast('Kliinikute laadimine ebaõnnestus.', 'error'); }
}

function renderClinicsGrid() {
    const grid = document.getElementById('clinicsGrid');
    if (!allClinics.length) { grid.innerHTML = '<div class="empty-state"><div class="empty-icon">🏥</div><div class="empty-title">Kliinikud puuduvad</div></div>'; return; }
    grid.innerHTML = allClinics.map(c => `
        <div class="card" style="overflow:visible;">
            <div class="clinic-card-header">
                <div class="clinic-card-icon">🏥</div>
                <div class="clinic-card-name">${c.nimi}</div>
            </div>
            <div class="clinic-card-body">
                <div class="clinic-info-row"><span class="clinic-info-icon">📍</span><span class="clinic-info-text">${c.aadress || '—'}</span></div>
                <div class="clinic-info-row"><span class="clinic-info-icon">📞</span><span class="clinic-info-text">${c.telefon || '—'}</span></div>
                <div class="clinic-info-row"><span class="clinic-info-icon">📧</span><span class="clinic-info-text">${c.email || '—'}</span></div>
                ${c.kirjeldus ? `<div class="clinic-desc">${c.kirjeldus}</div>` : ''}
                <div style="display:flex;gap:8px;margin-top:16px;">
                    <button class="btn btn-outline btn-sm" style="flex:1;" onclick="editClinic(${c.id})">✏️ Muuda</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteClinic(${c.id},'${c.nimi.replace(/'/g,"\\'")}')">🗑</button>
                </div>
            </div>
        </div>`).join('');
}

function openClinicModal(clinic = null) {
    document.getElementById('clinicModalTitle').textContent = clinic ? 'Muuda kliiniku' : 'Lisa kliinik';
    document.getElementById('saveClinicBtn').textContent = clinic ? 'Salvesta' : 'Lisa kliinik';
    document.getElementById('editClinicId').value = clinic?.id || '';
    document.getElementById('clinicNimi').value = clinic?.nimi || '';
    document.getElementById('clinicAadress').value = clinic?.aadress || '';
    document.getElementById('clinicTelefon').value = clinic?.telefon || '';
    document.getElementById('clinicEmail').value = clinic?.email || '';
    document.getElementById('clinicKirjeldus').value = clinic?.kirjeldus || '';
    document.getElementById('clinicModal').classList.remove('hidden');
}

function editClinic(id) { openClinicModal(allClinics.find(c => c.id === id)); }
function closeClinicModal() { document.getElementById('clinicModal').classList.add('hidden'); }

async function saveClinic() {
    const id = document.getElementById('editClinicId').value;
    const dto = {
        nimi: document.getElementById('clinicNimi').value.trim(),
        aadress: document.getElementById('clinicAadress').value.trim(),
        telefon: document.getElementById('clinicTelefon').value.trim(),
        email: document.getElementById('clinicEmail').value.trim(),
        kirjeldus: document.getElementById('clinicKirjeldus').value.trim()
    };
    if (!dto.nimi || !dto.aadress) { showToast('Nimi ja aadress on kohustuslikud.', 'error'); return; }
    const btn = document.getElementById('saveClinicBtn');
    btn.disabled = true;
    try {
        if (id) {
            const updated = await api.put(`/Kliinik/${id}`, dto);
            allClinics = allClinics.map(c => c.id === parseInt(id) ? updated : c);
            showToast('Kliinik uuendatud! ✅', 'success');
        } else {
            const created = await api.post('/Kliinik/add', dto);
            allClinics.push(created);
            showToast('Kliinik lisatud! 🏥', 'success');
        }
        renderClinicsGrid();
        closeClinicModal();
    } catch (err) { showToast('Viga: ' + err.message, 'error'); }
    finally { btn.disabled = false; }
}

async function deleteClinic(id, name) {
    if (!confirm(`Kustuta kliinik "${name}"?`)) return;
    try {
        await api.del(`/Kliinik/delete/${id}`);
        allClinics = allClinics.filter(c => c.id !== id);
        renderClinicsGrid();
        showToast('Kliinik kustutatud.', 'info');
    } catch (err) { showToast('Viga: ' + err.message, 'error'); }
}

async function loadProcedures() {
    try {
        allProcedures = await api.get('/Proceduur');
        renderProceduresTable();
    } catch { showToast('Protseduuride laadimine ebaõnnestus.', 'error'); }
}

function renderProceduresTable() {
    const tbody = document.getElementById('proceduresTableBody');
    if (!allProcedures.length) { tbody.innerHTML = '<tr><td colspan="7"><div class="empty-state"><div class="empty-icon">💉</div><div class="empty-title">Protseduurid puuduvad</div></div></td></tr>'; return; }
    tbody.innerHTML = allProcedures.map(p => `
        <tr>
            <td style="font-size:24px;text-align:center;">${p.ikoon}</td>
            <td><div class="td-name">${p.nimi}</div></td>
            <td><span class="badge badge-primary">${p.kategooria}</span></td>
            <td><strong style="color:var(--primary);">${p.hind} €</strong></td>
            <td>${p.kestus} min</td>
            <td style="max-width:240px;"><div style="font-size:13px;color:var(--text-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${p.kirjeldus}</div></td>
            <td>
                <div style="display:flex;gap:6px;">
                    <button class="action-btn action-transfer" onclick="editProc(${p.id})">✏️</button>
                    <button class="action-btn action-reject" onclick="deleteProc(${p.id},'${p.nimi.replace(/'/g,"\\'")}')">🗑</button>
                </div>
            </td>
        </tr>`).join('');
}

function openProcModal(proc = null) {
    document.getElementById('procModalTitle').textContent = proc ? i18n.t('adminEditProc') : i18n.t('adminAddProcBtn');
    document.getElementById('saveProcBtn').textContent = proc ? i18n.t('adminEditProcBtn') : i18n.t('adminAddProcBtn');
    document.getElementById('editProcId').value = proc?.id || '';
    document.getElementById('procNimi').value = proc?.nimi || '';
    document.getElementById('procIkoon').value = proc?.ikoon || '🏥';
    document.getElementById('procKategooria').value = proc?.kategooria || 'Ennetus';
    document.getElementById('procHind').value = proc?.hind || '';
    document.getElementById('procKestus').value = proc?.kestus || '';
    document.getElementById('procKirjeldus').value = proc?.kirjeldus || '';
    document.getElementById('procNimiRu').value = proc?.nimiRu || '';
    document.getElementById('procNimiEn').value = proc?.nimiEn || '';
    document.getElementById('procKirjeldusRu').value = proc?.kirjeldusRu || '';
    document.getElementById('procKirjeldusEn').value = proc?.kirjeldusEn || '';
    document.getElementById('procModal').classList.remove('hidden');
}

function editProc(id) { openProcModal(allProcedures.find(p => p.id === id)); }
function closeProcModal() { document.getElementById('procModal').classList.add('hidden'); }

async function saveProc() {
    const id = document.getElementById('editProcId').value;
    const dto = {
        nimi: document.getElementById('procNimi').value.trim(),
        nimiRu: document.getElementById('procNimiRu').value.trim() || null,
        nimiEn: document.getElementById('procNimiEn').value.trim() || null,
        ikoon: document.getElementById('procIkoon').value.trim() || '🏥',
        kategooria: document.getElementById('procKategooria').value,
        hind: parseFloat(document.getElementById('procHind').value) || 0,
        kestus: parseInt(document.getElementById('procKestus').value) || 0,
        kirjeldus: document.getElementById('procKirjeldus').value.trim(),
        kirjeldusRu: document.getElementById('procKirjeldusRu').value.trim() || null,
        kirjeldusEn: document.getElementById('procKirjeldusEn').value.trim() || null
    };
    if (!dto.nimi || !dto.kirjeldus) { showToast('Nimi ja kirjeldus on kohustuslikud.', 'error'); return; }
    const btn = document.getElementById('saveProcBtn');
    btn.disabled = true;
    try {
        if (id) {
            const updated = await api.put(`/Proceduur/${id}`, dto);
            allProcedures = allProcedures.map(p => p.id === parseInt(id) ? updated : p);
            showToast('Protseduur uuendatud! ✅', 'success');
        } else {
            const created = await api.post('/Proceduur', dto);
            allProcedures.push(created);
            showToast('Protseduur lisatud! 💉', 'success');
        }
        renderProceduresTable();
        closeProcModal();
    } catch (err) { showToast('Viga: ' + err.message, 'error'); }
    finally { btn.disabled = false; }
}

async function deleteProc(id, name) {
    if (!confirm(`Kustuta protseduur "${name}"?`)) return;
    try {
        await api.del(`/Proceduur/${id}`);
        allProcedures = allProcedures.filter(p => p.id !== id);
        renderProceduresTable();
        showToast('Protseduur kustutatud.', 'info');
    } catch (err) { showToast('Viga: ' + err.message, 'error'); }
}

async function loadUsers() {
    try {
        const users = await api.get('/Auth/users');
        const tbody = document.getElementById('usersTableBody');
        if (!users.length) { tbody.innerHTML = '<tr><td colspan="8"><div class="empty-state">Kasutajad puuduvad</div></td></tr>'; return; }
        tbody.innerHTML = users.map((u, i) => `
            <tr>
                <td>${i + 1}</td>
                <td><div class="td-name">${u.name}</div></td>
                <td>${u.email}</td>
                <td>${u.phone || '—'}</td>
                <td>${u.role === 'Admin'
                    ? '<span class="badge" style="background:#fef3c7;color:#92400e;">⚙️ Admin</span>'
                    : '<span class="badge badge-primary">👤 Kasutaja</span>'}</td>
                <td style="text-align:center;"><strong>${u.petCount}</strong></td>
                <td style="text-align:center;"><strong>${u.bookingCount}</strong></td>
                <td style="font-size:13px;color:var(--text-muted);">${new Date(u.createdAt).toLocaleDateString('et-EE')}</td>
            </tr>`).join('');
    } catch { showToast('Kasutajate laadimine ebaõnnestus.', 'error'); }
}

// charts
function makeChart(id, type, labels, datasets, options = {}) {
    if (chartInstances[id]) chartInstances[id].destroy();
    const ctx = document.getElementById(id)?.getContext('2d');
    if (!ctx) return;
    chartInstances[id] = new Chart(ctx, {
        type,
        data: { labels, datasets },
        options: {
            responsive: true,
            plugins: { legend: { position: 'bottom' } },
            ...options
        }
    });
}

async function loadCharts() {
    if (!allBookings.length) {
        try { allBookings = await api.get('/Broneering/all'); } catch { return; }
    }

    const colors = ['#0d7c5f','#f59e0b','#ef4444','#3b82f6','#8b5cf6','#10b981','#f97316'];

    // Chart 1: By status
    const statusCounts = { Ootel: 0, Kinnitatud: 0, 'Lükatud': 0, 'Üle kantud': 0 };
    allBookings.forEach(b => { if (statusCounts[b.staatus] !== undefined) statusCounts[b.staatus]++; });
    makeChart('chartStatus', 'doughnut',
        Object.keys(statusCounts),
        [{ data: Object.values(statusCounts), backgroundColor: ['#f59e0b','#10b981','#ef4444','#3b82f6'] }]
    );

    // Chart 2: By procedure
    const procCounts = {};
    allBookings.forEach(b => {
        const name = b.protseduur?.nimi || 'Tundmatu';
        procCounts[name] = (procCounts[name] || 0) + 1;
    });
    const sortedProc = Object.entries(procCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);
    makeChart('chartProcedures', 'bar',
        sortedProc.map(x => x[0]),
        [{ label: 'Broneeringud', data: sortedProc.map(x => x[1]), backgroundColor: colors }],
        { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
    );

    // Chart 3: By clinic
    const clinicCounts = {};
    allBookings.forEach(b => {
        const name = b.kliinik?.nimi || 'Tundmatu';
        clinicCounts[name] = (clinicCounts[name] || 0) + 1;
    });
    makeChart('chartClinics', 'pie',
        Object.keys(clinicCounts),
        [{ data: Object.values(clinicCounts), backgroundColor: colors }]
    );

    // Chart 4: Weekly (last 7 days)
    const today = new Date(); today.setHours(23, 59, 59, 0);
    const weekDays = [];
    const weekCounts = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const label = d.toLocaleDateString('et-EE', { weekday: 'short', day: 'numeric' });
        weekDays.push(label);
        const dayStr = d.toISOString().split('T')[0];
        weekCounts.push(allBookings.filter(b => b.kuupAev?.split('T')[0] === dayStr).length);
    }
    makeChart('chartWeekly', 'line',
        weekDays,
        [{
            label: 'Broneeringud',
            data: weekCounts,
            borderColor: '#0d7c5f',
            backgroundColor: 'rgba(13,124,95,0.12)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#0d7c5f'
        }],
        { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
    );
}

function renderCalendar() {
    if (!allBookings.length) {
        api.get('/Broneering/all').then(data => { allBookings = data || []; _renderCal(); }).catch(() => _renderCal());
    } else {
        _renderCal();
    }
}

function calPrevMonth() { calMonth--; if (calMonth < 0) { calMonth = 11; calYear--; } _renderCal(); }
function calNextMonth() { calMonth++; if (calMonth > 11) { calMonth = 0; calYear++; } _renderCal(); }

function _renderCal() {
    const months = ['Jaanuar','Veebruar','Märts','Aprill','Mai','Juuni','Juuli','August','September','Oktoober','November','Detsember'];
    document.getElementById('calMonthLabel').textContent = `${months[calMonth]} ${calYear}`;

    const firstDay = new Date(calYear, calMonth, 1);
    const lastDay = new Date(calYear, calMonth + 1, 0);
    // Monday-first: Sunday = 6, Monday = 0
    let startDow = firstDay.getDay() - 1;
    if (startDow < 0) startDow = 6;

    const today = new Date();
    const grid = document.getElementById('calGrid');
    let html = '';

    // Empty cells before first day
    for (let i = 0; i < startDow; i++) {
        html += '<div class="cal-cell other-month"></div>';
    }

    for (let d = 1; d <= lastDay.getDate(); d++) {
        const dateStr = `${calYear}-${String(calMonth + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        const count = allBookings.filter(b => b.kuupAev?.startsWith(dateStr)).length;
        const isToday = today.getFullYear() === calYear && today.getMonth() === calMonth && today.getDate() === d;
        html += `<div class="cal-cell ${isToday ? 'today' : ''} ${count > 0 ? 'has-bookings' : ''}" onclick="showCalDay('${dateStr}')">
            <span>${d}</span>
            ${count > 0 ? `<div class="cal-dot" title="${count} broneeringut"></div>` : ''}
            ${count > 0 ? `<span style="font-size:10px;color:var(--accent);">${count}</span>` : ''}
        </div>`;
    }

    grid.innerHTML = html;
    document.getElementById('calDayDetail').style.display = 'none';
}

function showCalDay(dateStr) {
    const dayBookings = allBookings.filter(b => b.kuupAev?.startsWith(dateStr));
    const detail = document.getElementById('calDayDetail');
    const title = document.getElementById('calDayTitle');
    const container = document.getElementById('calDayBookings');

    title.textContent = `📅 ${new Date(dateStr).toLocaleDateString('et-EE', { weekday:'long', day:'numeric', month:'long' })} — ${dayBookings.length} broneeringut`;

    if (!dayBookings.length) {
        container.innerHTML = '<p style="color:var(--text-muted);font-size:14px;">Sel päeval broneeringuid ei ole.</p>';
    } else {
        container.innerHTML = dayBookings.map(b => `
            <div class="booking-card" style="margin-bottom:0;">
                <div class="booking-card-header">
                    <div style="display:flex;align-items:center;gap:8px;">
                        <span>${b.protseduur?.ikoon || '🏥'}</span>
                        <div>
                            <div style="font-weight:700;">${b.protseduur?.nimi || '—'}</div>
                            <div style="font-size:12px;color:var(--text-muted);">${new Date(b.kuupAev).toLocaleTimeString('et-EE',{hour:'2-digit',minute:'2-digit'})} · ${b.user?.name || '—'}</div>
                        </div>
                    </div>
                    ${statusBadge(b.staatus)}
                </div>
            </div>`).join('');
    }

    detail.style.display = 'block';
    detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// admin med records
async function initAdminMedRecords() {
    if (!allPets.length) {
        try {
            allPets = await api.get('/Lemmikloom/all');
        } catch { allPets = []; }
    }
    const sel = document.getElementById('medAdminPetFilter');
    sel.innerHTML = '<option value="">Vali lemmikloom...</option>' +
        allPets.map(p => `<option value="${p.id}">${petIcon(p.liik)} ${p.nimi} (${p.owner?.name || ''})</option>`).join('');
    document.getElementById('adminMedRecordsList').innerHTML = '';
}

async function loadAdminMedRecords() {
    const petId = document.getElementById('medAdminPetFilter').value;
    const container = document.getElementById('adminMedRecordsList');
    if (!petId) { container.innerHTML = ''; return; }
    container.innerHTML = '<div class="loader"><div class="spinner"></div></div>';
    try {
        const records = await api.get(`/MedRecord/pet/${petId}`);
        if (!records || records.length === 0) {
            container.innerHTML = `<div class="empty-state"><div class="empty-icon">🩺</div><div class="empty-title">Kirjed puuduvad</div></div>`;
            return;
        }
        container.innerHTML = records.map(r => `
            <div class="med-record-card">
                <div class="med-record-header">
                    <span class="med-record-date">📅 ${new Date(r.kuupAev).toLocaleDateString('et-EE')}</span>
                    <div style="display:flex;gap:8px;align-items:center;">
                        <span class="med-record-vet">${r.arstNimi ? '👨‍⚕️ ' + r.arstNimi : ''}</span>
                        <button class="action-btn action-transfer" onclick="editMedRecord(${r.id})">✏️</button>
                        <button class="action-btn action-reject" onclick="deleteMedRecord(${r.id})">🗑</button>
                    </div>
                </div>
                <div class="med-record-field"><strong>Diagnoos:</strong> ${r.diagnoos}</div>
                <div class="med-record-field"><strong>Ravi:</strong> ${r.ravi}</div>
                ${r.ravimid ? `<div class="med-record-field"><strong>💊 Ravimid:</strong> ${r.ravimid}</div>` : ''}
                ${r.kaal ? `<div class="med-record-field"><strong>⚖️ Kaal:</strong> ${r.kaal} kg</div>` : ''}
                ${r.markused ? `<div class="med-record-field"><strong>📝 Märkused:</strong> ${r.markused}</div>` : ''}
            </div>`).join('');
    } catch { container.innerHTML = '<div class="alert alert-error">❌ Laadimine ebaõnnestus.</div>'; }
}

function openMedModal(record = null) {
    document.getElementById('medModalTitle').textContent = record ? 'Muuda kirjet' : 'Lisa meditsiinikirje';
    document.getElementById('editMedId').value = record?.id || '';
    const petSel = document.getElementById('medPetId');
    petSel.innerHTML = '<option value="">Vali lemmikloom...</option>' +
        allPets.map(p => `<option value="${p.id}">${petIcon(p.liik)} ${p.nimi}</option>`).join('');
    if (record) {
        petSel.value = record.lemmikloomId;
        document.getElementById('medDate').value = record.kuupAev?.split('T')[0] || '';
        document.getElementById('medDiagnoos').value = record.diagnoos || '';
        document.getElementById('medRavi').value = record.ravi || '';
        document.getElementById('medArst').value = record.arstNimi || '';
        document.getElementById('medKaal').value = record.kaal || '';
        document.getElementById('medRavimid').value = record.ravimid || '';
        document.getElementById('medMarkused').value = record.markused || '';
    } else {
        const petId = document.getElementById('medAdminPetFilter').value;
        petSel.value = petId;
        document.getElementById('medDate').value = new Date().toISOString().split('T')[0];
        ['medDiagnoos','medRavi','medArst','medKaal','medRavimid','medMarkused'].forEach(id => document.getElementById(id).value = '');
    }
    document.getElementById('medModal').classList.remove('hidden');
}

function closeMedModal() { document.getElementById('medModal').classList.add('hidden'); }

async function editMedRecord(id) {
    try {
        const petId = document.getElementById('medAdminPetFilter').value;
        const records = await api.get(`/MedRecord/pet/${petId}`);
        const r = records.find(x => x.id === id);
        if (r) openMedModal(r);
    } catch { showToast('Laadimine ebaõnnestus.', 'error'); }
}

async function saveMedRecord() {
    const id = document.getElementById('editMedId').value;
    const dto = {
        lemmikloomId: parseInt(document.getElementById('medPetId').value),
        kuupAev: document.getElementById('medDate').value,
        diagnoos: document.getElementById('medDiagnoos').value.trim(),
        ravi: document.getElementById('medRavi').value.trim(),
        arstNimi: document.getElementById('medArst').value.trim() || null,
        kaal: parseFloat(document.getElementById('medKaal').value) || null,
        ravimid: document.getElementById('medRavimid').value.trim() || null,
        markused: document.getElementById('medMarkused').value.trim() || null
    };
    if (!dto.lemmikloomId || !dto.kuupAev || !dto.diagnoos || !dto.ravi) {
        showToast('Lemmikloom, kuupäev, diagnoos ja ravi on kohustuslikud.', 'error'); return;
    }
    const btn = document.getElementById('saveMedBtn');
    btn.disabled = true;
    try {
        if (id) {
            await api.put(`/MedRecord/${id}`, dto);
            showToast('Kirje uuendatud! ✅', 'success');
        } else {
            await api.post('/MedRecord', dto);
            showToast('Kirje lisatud! 🩺', 'success');
        }
        closeMedModal();
        loadAdminMedRecords();
    } catch (err) { showToast('Viga: ' + err.message, 'error'); }
    finally { btn.disabled = false; }
}

async function deleteMedRecord(id) {
    if (!confirm('Kustuta see meditsiinikirje?')) return;
    try {
        await api.del(`/MedRecord/${id}`);
        showToast('Kirje kustutatud.', 'info');
        loadAdminMedRecords();
    } catch (err) { showToast('Viga: ' + err.message, 'error'); }
}

['statusModal', 'clinicModal', 'procModal', 'medModal'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', function(e) {
        if (e.target === this) this.classList.add('hidden');
    });
});
