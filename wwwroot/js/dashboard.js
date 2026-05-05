let myPets = [];
let procedures = [];
let clinics = [];
let allBookings = [];
let allMedRecords = [];
let weightChartInstance = null;
let selectedSlot = null;
let currentPhotoUploadPetId = null;

function localName(p) {
    if (i18n.lang === 'ru' && p.nimiRu) return p.nimiRu;
    if (i18n.lang === 'en' && p.nimiEn) return p.nimiEn;
    return p.nimi;
}
function localDesc(p) {
    if (i18n.lang === 'ru' && p.kirjeldusRu) return p.kirjeldusRu;
    if (i18n.lang === 'en' && p.kirjeldusEn) return p.kirjeldusEn;
    return p.kirjeldus;
}

document.addEventListener('DOMContentLoaded', async () => {
    if (!api.isLoggedIn()) { window.location.href = '/auth.html'; return; }
    if (api.isAdmin()) { window.location.href = '/admin.html'; return; }

    const user = api.getUser();
    document.getElementById('sidebarAvatar').textContent = user?.name?.[0]?.toUpperCase() || '?';
    document.getElementById('sidebarName').textContent = user?.name || 'Kasutaja';
    document.getElementById('topbarUser').textContent = user?.email || '';
    document.getElementById('profileName').textContent = user?.name || '';
    document.getElementById('profileEmail').textContent = user?.email || '';
    document.getElementById('profilePhone').textContent = user?.phone || '—';
    document.getElementById('profileAvatar').textContent = user?.name?.[0]?.toUpperCase() || '?';

    const menuBtn = document.getElementById('menuBtn');
    if (menuBtn) menuBtn.style.display = 'flex';

    initStarPicker();
    await Promise.all([loadPets(), loadProcedures(), loadClinics()]);
    showSection('pets');
});

const SECTIONS = ['pets', 'book', 'bookings', 'medcard', 'vaccines', 'reviews', 'profile'];

function showSection(name) {
    SECTIONS.forEach(s => {
        const el = document.getElementById(`section-${s}`);
        if (el) el.style.display = s === name ? 'block' : 'none';
        const nav = document.getElementById(`nav-${s}`);
        if (nav) nav.classList.toggle('active', s === name);
    });

    const titles = {
        pets: i18n.t('myPets'), book: i18n.t('bookTitle'),
        bookings: i18n.t('myBookingsTitle'), medcard: i18n.t('medCardTitle'),
        reviews: i18n.t('reviewsTitle'), profile: i18n.t('profileTitle')
    };
    document.getElementById('topbarTitle').textContent = titles[name] || '';

    if (name === 'bookings') loadBookings();
    if (name === 'book') populateBookForm();
    if (name === 'medcard') initMedCard();
    if (name === 'reviews') initReviews();
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

// pets
async function loadPets() {
    try {
        myPets = await api.get('/Lemmikloom');
        renderPets();
    } catch(e) {
        console.warn('pets load failed', e);
        document.getElementById('petsGrid').innerHTML =
            `<p class="text-muted">${i18n.t('loadError')}</p>`;
    }
}

function renderPets() {
    const grid = document.getElementById('petsGrid');
    if (!myPets || myPets.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column:1/-1;">
                <div class="empty-icon">🐾</div>
                <div class="empty-title">${i18n.t('noPets')}</div>
                <div class="empty-text" style="margin-bottom:20px;">${i18n.t('noPetsText')}</div>
                <button class="btn btn-primary" onclick="openAddPetModal()">${i18n.t('addPet')}</button>
            </div>`;
        return;
    }
    grid.innerHTML = myPets.map(p => {
        const photoHtml = p.photoUrl
            ? `<img src="${p.photoUrl}" class="pet-photo" alt="${p.nimi}">`
            : `<span style="font-size:40px;">${petIcon(p.liik)}</span>`;
        return `
        <div class="pet-card">
            <div class="pet-avatar-wrap" onclick="triggerPhotoUpload(${p.id})" title="📷">
                ${photoHtml}
                <div class="upload-overlay">📷</div>
            </div>
            <div class="pet-info">
                <div class="pet-name">${p.nimi}</div>
                <div class="pet-meta">${p.liik} · ${p.kaal} kg${p.vanus ? ' · ' + p.vanus + ' a.' : ''}</div>
            </div>
            <div class="pet-actions">
                <button class="btn btn-outline btn-sm" onclick="showMedCardForPet(${p.id})">🩺</button>
                <button class="btn btn-outline btn-sm" onclick="editPet(${p.id})">✏️</button>
                <button class="btn btn-danger btn-sm" onclick="deletePet(${p.id}, '${p.nimi.replace(/'/g,"\\'")}')">🗑</button>
            </div>
        </div>`;
    }).join('');
}

function showMedCardForPet(petId) {
    showSection('medcard');
    setTimeout(() => {
        const sel = document.getElementById('medPetSelect');
        if (sel) { sel.value = petId; loadMedRecords(); }
    }, 50);
}

// photo
function triggerPhotoUpload(petId) {
    currentPhotoUploadPetId = petId;
    document.getElementById('photoInput').click();
}

async function uploadPhoto(event) {
    const file = event.target.files[0];
    if (!file || !currentPhotoUploadPetId) return;
    const form = new FormData();
    form.append('file', file);
    try {
        const result = await api.postForm(`/Lemmikloom/${currentPhotoUploadPetId}/photo`, form);
        const pet = myPets.find(p => p.id === currentPhotoUploadPetId);
        if (pet) pet.photoUrl = result.photoUrl;
        renderPets();
        showToast('📷 ' + i18n.t('petUpdated'), 'success');
    } catch (err) {
        showToast('❌ ' + err.message, 'error');
    }
    event.target.value = '';
    currentPhotoUploadPetId = null;
}

function openAddPetModal() {
    document.getElementById('petModalTitle').textContent = i18n.t('addPet');
    document.getElementById('savePetBtn').textContent = i18n.t('addPet');
    document.getElementById('editPetId').value = '';
    document.getElementById('petName').value = '';
    document.getElementById('petLiik').value = 'Koer';
    document.getElementById('petKaal').value = '';
    document.getElementById('petVanus').value = '';
    document.getElementById('petModalAlert').innerHTML = '';
    document.getElementById('addPetModal').classList.remove('hidden');
}

function editPet(id) {
    const pet = myPets.find(p => p.id === id);
    if (!pet) return;
    document.getElementById('petModalTitle').textContent = i18n.t('editPet');
    document.getElementById('savePetBtn').textContent = i18n.t('save');
    document.getElementById('editPetId').value = pet.id;
    document.getElementById('petName').value = pet.nimi;
    document.getElementById('petLiik').value = pet.liik;
    document.getElementById('petKaal').value = pet.kaal;
    document.getElementById('petVanus').value = pet.vanus || '';
    document.getElementById('petModalAlert').innerHTML = '';
    document.getElementById('addPetModal').classList.remove('hidden');
}

function closePetModal() {
    document.getElementById('addPetModal').classList.add('hidden');
}

async function savePet() {
    const id = document.getElementById('editPetId').value;
    const dto = {
        nimi: document.getElementById('petName').value.trim(),
        liik: document.getElementById('petLiik').value,
        kaal: parseInt(document.getElementById('petKaal').value) || 0,
        vanus: parseInt(document.getElementById('petVanus').value) || null
    };

    if (!dto.nimi || !dto.kaal) {
        document.getElementById('petModalAlert').innerHTML =
            `<div class="alert alert-error">${i18n.t('fillRequired')}</div>`;
        return;
    }

    const btn = document.getElementById('savePetBtn');
    btn.disabled = true; btn.textContent = '...';

    try {
        if (id) {
            const updated = await api.put(`/Lemmikloom/${id}`, dto);
            myPets = myPets.map(p => p.id === parseInt(id) ? { ...p, ...updated } : p);
            showToast(i18n.t('petUpdated'), 'success');
        } else {
            const created = await api.post('/Lemmikloom', dto);
            myPets.push(created);
            showToast(i18n.t('petAdded'), 'success');
        }
        renderPets();
        closePetModal();
    } catch (err) {
        document.getElementById('petModalAlert').innerHTML =
            `<div class="alert alert-error">❌ ${err.message}</div>`;
    } finally {
        btn.disabled = false;
        btn.textContent = id ? i18n.t('save') : i18n.t('addPet');
    }
}

async function deletePet(id, name) {
    if (!confirm(i18n.t('confirmDelete').replace('{name}', name))) return;
    try {
        await api.del(`/Lemmikloom/${id}`);
        myPets = myPets.filter(p => p.id !== id);
        renderPets();
        showToast(i18n.t('petDeleted'), 'info');
    } catch (err) {
        showToast('❌ ' + err.message, 'error');
    }
}

async function loadProcedures() {
    try { procedures = await api.get('/Proceduur'); } catch { procedures = []; }
}

async function loadClinics() {
    try { clinics = await api.get('/Kliinik/list'); } catch { clinics = []; }
}

function populateBookForm(prefill) {
    const petSel = document.getElementById('bookPet');
    petSel.innerHTML = `<option value="">${i18n.t('selectPet')}</option>` +
        myPets.map(p => `<option value="${p.id}">${petIcon(p.liik)} ${p.nimi} (${p.liik})</option>`).join('');

    const procSel = document.getElementById('bookProcedure');
    procSel.innerHTML = `<option value="">${i18n.t('selectProc')}</option>` +
        procedures.map(p => `<option value="${p.id}" data-desc="${localDesc(p)}" data-hind="${p.hind}" data-dur="${p.kestus}">${p.ikoon} ${localName(p)} — ${p.hind}€</option>`).join('');

    const clinicSel = document.getElementById('bookClinic');
    clinicSel.innerHTML = `<option value="">${i18n.t('selectClinic')}</option>` +
        clinics.map(c => `<option value="${c.id}">${c.nimi} — ${c.aadress}</option>`).join('');

    document.getElementById('bookDateOnly').min = new Date().toISOString().split('T')[0];
    selectedSlot = null;
    document.getElementById('slotsSection').style.display = 'none';
    document.getElementById('bookDate').value = '';
    document.getElementById('bookNotes').value = '';
    document.getElementById('procInfo').style.display = 'none';
    document.getElementById('bookAlert').innerHTML = '';

    if (prefill) {
        if (prefill.lemmikloom?.id) petSel.value = prefill.lemmikloom.id;
        if (prefill.protseduur?.id) { procSel.value = prefill.protseduur.id; updateProcInfo(); }
        if (prefill.kliinik?.id) clinicSel.value = prefill.kliinik.id;
        if (prefill.markused) document.getElementById('bookNotes').value = prefill.markused;
    }
}

function updateProcInfo() {
    const sel = document.getElementById('bookProcedure');
    const opt = sel.options[sel.selectedIndex];
    const box = document.getElementById('procInfo');
    if (!sel.value) { box.style.display = 'none'; return; }
    document.getElementById('procDesc').textContent = opt.dataset.desc;
    document.getElementById('procPrice').textContent = opt.dataset.hind + ' €';
    document.getElementById('procDuration').textContent = opt.dataset.dur;
    box.style.display = 'block';
}

async function loadSlots() {
    const clinicId = document.getElementById('bookClinic').value;
    const procId = document.getElementById('bookProcedure').value;
    const dateVal = document.getElementById('bookDateOnly').value;
    const slotsSection = document.getElementById('slotsSection');

    if (!clinicId || !procId || !dateVal) { slotsSection.style.display = 'none'; return; }

    slotsSection.style.display = 'block';
    document.getElementById('slotsGrid').innerHTML = '<div class="loader" style="padding:16px;"><div class="spinner"></div></div>';
    selectedSlot = null;
    document.getElementById('bookDate').value = '';

    try {
        const slots = await api.get(`/Broneering/slots?kliinikId=${clinicId}&protseduurId=${procId}&date=${dateVal}`);
        renderSlots(slots);
    } catch {
        document.getElementById('slotsGrid').innerHTML = `<p style="font-size:13px;color:var(--danger);">${i18n.t('loadError')}</p>`;
    }
}

function renderSlots(slots) {
    const grid = document.getElementById('slotsGrid');
    if (!slots || slots.length === 0) {
        grid.innerHTML = `<p style="font-size:13px;color:var(--text-muted);">${i18n.t('noBookings')}</p>`;
        return;
    }
    grid.innerHTML = slots.map(s => {
        const t = new Date(s.time);
        const label = t.toLocaleTimeString('et-EE', { hour: '2-digit', minute: '2-digit' });
        if (!s.available) return `<div class="slot-btn taken">${label}</div>`;
        return `<div class="slot-btn available" onclick="selectSlot('${s.time}', this)">${label}</div>`;
    }).join('');
}

function selectSlot(isoTime, el) {
    document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));
    el.classList.add('selected');
    selectedSlot = isoTime;
    document.getElementById('bookDate').value = isoTime;
}

async function doBook() {
    const petId = parseInt(document.getElementById('bookPet').value);
    const procId = parseInt(document.getElementById('bookProcedure').value);
    const clinicId = parseInt(document.getElementById('bookClinic').value);
    const date = document.getElementById('bookDate').value;
    const notes = document.getElementById('bookNotes').value.trim();

    if (!petId || !procId || !clinicId || !date) {
        document.getElementById('bookAlert').innerHTML =
            `<div class="alert alert-error">${i18n.t('fillRequired')}</div>`;
        return;
    }

    const btn = document.getElementById('bookBtn');
    btn.disabled = true; btn.textContent = '...';
    document.getElementById('bookAlert').innerHTML = '';

    try {
        await api.post('/Broneering', {
            lemmikloomId: petId, protseduurId: procId, kliinikId: clinicId,
            kuupAev: new Date(date).toISOString(), markused: notes || null
        });
        showToast(i18n.t('bookingDone'), 'success');
        populateBookForm();
        setTimeout(() => showSection('bookings'), 1200);
    } catch (err) {
        document.getElementById('bookAlert').innerHTML =
            `<div class="alert alert-error">❌ ${err.message}</div>`;
    } finally {
        btn.disabled = false;
        btn.textContent = i18n.t('bookBtn');
    }
}

// TODO: add pagination at some point
async function loadBookings() {
    const container = document.getElementById('bookingsList');
    container.innerHTML = '<div class="loader"><div class="spinner"></div></div>';
    try {
        allBookings = await api.get('/Broneering/my');
        filterBookings();
    } catch {
        container.innerHTML = `<div class="alert alert-error">❌ ${i18n.t('loadError')}</div>`;
    }
}

function filterBookings() {
    const search = (document.getElementById('bookingSearch')?.value || '').toLowerCase();
    const status = document.getElementById('bookingStatusFilter')?.value || '';

    const filtered = allBookings.filter(b => {
        const matchStatus = !status || b.staatus === status;
        const matchSearch = !search ||
            (b.protseduur?.nimi || '').toLowerCase().includes(search) ||
            (b.lemmikloom?.nimi || '').toLowerCase().includes(search) ||
            (b.kliinik?.nimi || '').toLowerCase().includes(search);
        return matchStatus && matchSearch;
    });
    renderBookings(filtered);
}

function renderBookings(bookings) {
    const container = document.getElementById('bookingsList');
    if (!bookings || bookings.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📋</div>
                <div class="empty-title">${i18n.t('noBookings')}</div>
                <div class="empty-text" style="margin-bottom:20px;">${i18n.t('noBookingsText')}</div>
                <button class="btn btn-primary" onclick="showSection('book')">${i18n.t('newBooking')}</button>
            </div>`;
        return;
    }
    const locale = i18n.lang === 'en' ? 'en-GB' : (i18n.lang === 'ru' ? 'ru-RU' : 'et-EE');
    container.innerHTML = bookings.map(b => `
        <div class="booking-card">
            <div class="booking-card-header">
                <div style="display:flex;align-items:center;gap:10px;">
                    <span style="font-size:24px;">${b.protseduur?.ikoon || '🏥'}</span>
                    <div>
                        <div style="font-weight:700;">${b.protseduur?.nimi || '—'}</div>
                        <div style="font-size:12px;color:var(--text-muted);">${i18n.t('bookingNr')}${b.id}</div>
                    </div>
                </div>
                ${statusBadge(b.staatus)}
            </div>
            <div class="booking-card-body">
                <div class="booking-row">
                    <span class="booking-row-icon">🐾</span>
                    <span class="booking-row-label">${i18n.t('pet')}:</span>
                    <span>${b.lemmikloom ? petIcon(b.lemmikloom.liik) + ' ' + b.lemmikloom.nimi : '—'}</span>
                </div>
                <div class="booking-row">
                    <span class="booking-row-icon">🏥</span>
                    <span class="booking-row-label">${i18n.t('clinic')}:</span>
                    <span>${b.kliinik?.nimi || '—'}</span>
                </div>
                <div class="booking-row">
                    <span class="booking-row-icon">📍</span>
                    <span class="booking-row-label">${i18n.t('address')}:</span>
                    <span>${b.kliinik?.aadress || '—'}</span>
                </div>
                <div class="booking-row">
                    <span class="booking-row-icon">📅</span>
                    <span class="booking-row-label">${i18n.t('date')}:</span>
                    <strong>${new Date(b.kuupAev).toLocaleString(locale, { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' })}</strong>
                </div>
                <div class="booking-row">
                    <span class="booking-row-icon">💶</span>
                    <span class="booking-row-label">${i18n.t('price')}:</span>
                    <strong style="color:var(--primary);">${b.protseduur?.hind} €</strong>
                </div>
                ${b.markused ? `<div class="booking-row"><span class="booking-row-icon">📝</span><span class="booking-row-label">${i18n.t('notesLabel')}:</span><span>${b.markused}</span></div>` : ''}
            </div>
            <div style="display:flex;gap:8px;padding:12px 20px;border-top:1px solid var(--border);flex-wrap:wrap;">
                ${b.staatus !== 'Lükatud' ? `<button class="btn btn-danger btn-sm" onclick="cancelBooking(${b.id})">${i18n.t('cancelBookingBtn')}</button>` : ''}
                <button class="btn btn-outline btn-sm" onclick="repeatBooking(${b.id})">${i18n.t('repeatBookingBtn')}</button>
            </div>
        </div>
    `).join('');
}

async function cancelBooking(id) {
    if (!confirm(i18n.t('cancelConfirm').replace('{id}', id))) return;
    try {
        await api.patch(`/Broneering/${id}/cancel`, {});
        showToast(i18n.t('statusRejected') + ' ✓', 'info');
        loadBookings();
    } catch (err) {
        showToast('❌ ' + err.message, 'error');
    }
}

function repeatBooking(id) {
    const b = allBookings.find(x => x.id === id);
    if (!b) return;
    showSection('book');
    setTimeout(() => populateBookForm(b), 100);
}

function exportBookingsExcel() {
    if (!allBookings.length) { showToast(i18n.t('noBookings'), 'info'); return; }
    const rows = allBookings.map(b => ({
        '#': b.id,
        [i18n.t('date')]: new Date(b.kuupAev).toLocaleString('et-EE'),
        [i18n.t('pet')]: b.lemmikloom?.nimi || '',
        'Protseduur / Service': b.protseduur?.nimi || '',
        [i18n.t('clinic')]: b.kliinik?.nimi || '',
        [i18n.t('price')]: b.protseduur?.hind ? b.protseduur.hind + ' €' : '',
        'Status': b.staatus,
        [i18n.t('notesLabel')]: b.markused || ''
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Bookings');
    XLSX.writeFile(wb, 'broneeringud.xlsx');
}

// med card
function initMedCard() {
    const sel = document.getElementById('medPetSelect');
    sel.innerHTML = `<option value="">${i18n.t('selectPetMed')}</option>` +
        myPets.map(p => `<option value="${p.id}">${petIcon(p.liik)} ${p.nimi}</option>`).join('');
    allMedRecords = [];
    document.getElementById('medRecordsList').innerHTML = '';
    document.getElementById('weightChartWrap').style.display = 'none';
}

async function loadMedRecords() {
    const petId = document.getElementById('medPetSelect').value;
    const container = document.getElementById('medRecordsList');
    const chartWrap = document.getElementById('weightChartWrap');
    if (!petId) { container.innerHTML = ''; chartWrap.style.display = 'none'; return; }

    container.innerHTML = '<div class="loader"><div class="spinner"></div></div>';
    try {
        const records = await api.get(`/MedRecord/pet/${petId}`);
        allMedRecords = records || [];

        if (!records || records.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🩺</div>
                    <div class="empty-title">${i18n.t('noMedRecords')}</div>
                    <div class="empty-text">${i18n.t('noMedRecordsText')}</div>
                </div>`;
            chartWrap.style.display = 'none';
            return;
        }

        // Weight chart
        const weightData = records.filter(r => r.kaal).map(r => ({ x: r.kuupAev, y: r.kaal }));
        if (weightData.length > 1) {
            chartWrap.style.display = 'block';
            renderWeightChart(weightData);
        } else {
            chartWrap.style.display = 'none';
        }

        container.innerHTML = records.map(r => `
            <div class="med-record-card">
                <div class="med-record-header">
                    <span class="med-record-date">📅 ${new Date(r.kuupAev).toLocaleDateString('et-EE')}</span>
                    <span class="med-record-vet">${r.arstNimi ? '👨‍⚕️ ' + r.arstNimi : ''}</span>
                </div>
                <div class="med-record-field"><strong>${i18n.t('diagnosis')}:</strong> ${r.diagnoos}</div>
                <div class="med-record-field"><strong>${i18n.t('treatment')}:</strong> ${r.ravi}</div>
                ${r.ravimid ? `<div class="med-record-field"><strong>${i18n.t('medicines')}:</strong> ${r.ravimid}</div>` : ''}
                ${r.kaal ? `<div class="med-record-field"><strong>${i18n.t('weightLabel')}:</strong> ${r.kaal} kg</div>` : ''}
                ${r.markused ? `<div class="med-record-field"><strong>📝 ${i18n.t('notes')}:</strong> ${r.markused}</div>` : ''}
            </div>
        `).join('');
    } catch {
        container.innerHTML = `<div class="alert alert-error">❌ ${i18n.t('loadError')}</div>`;
    }
}

function renderWeightChart(data) {
    if (weightChartInstance) { weightChartInstance.destroy(); weightChartInstance = null; }
    const ctx = document.getElementById('weightChart').getContext('2d');
    weightChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(d => new Date(d.x).toLocaleDateString('et-EE')),
            datasets: [{
                label: i18n.t('weight') + ' (kg)',
                data: data.map(d => d.y),
                borderColor: '#0d7c5f',
                backgroundColor: 'rgba(13,124,95,0.1)',
                pointBackgroundColor: '#0d7c5f',
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: false } }
        }
    });
}

async function exportMedPdf() {
    const petId = document.getElementById('medPetSelect').value;
    const pet = myPets.find(p => p.id === parseInt(petId));
    if (!petId || !allMedRecords.length) { showToast(i18n.t('noMedRecords'), 'info'); return; }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(18);
    doc.setTextColor(13, 124, 95);
    doc.text('VetClinic – ' + i18n.t('medCardTitle'), 14, y); y += 10;
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.text(i18n.t('pet') + ': ' + (pet?.nimi || '') + ' (' + (pet?.liik || '') + ')', 14, y); y += 7;
    doc.text(i18n.t('date') + ': ' + new Date().toLocaleDateString('et-EE'), 14, y); y += 10;
    doc.setDrawColor(13, 124, 95);
    doc.line(14, y, 196, y); y += 8;

    allMedRecords.forEach((r, idx) => {
        if (y > 260) { doc.addPage(); y = 20; }
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text(`${idx + 1}. ${new Date(r.kuupAev).toLocaleDateString('et-EE')}${r.arstNimi ? ' – ' + r.arstNimi : ''}`, 14, y); y += 6;
        doc.setFont(undefined, 'normal');
        const lines = [
            i18n.t('diagnosis') + ': ' + r.diagnoos,
            i18n.t('treatment') + ': ' + r.ravi,
        ];
        if (r.ravimid) lines.push('Ravimid: ' + r.ravimid);
        if (r.kaal) lines.push(i18n.t('weight') + ': ' + r.kaal + ' kg');
        if (r.markused) lines.push(i18n.t('notes') + ': ' + r.markused);
        lines.forEach(line => {
            const wrapped = doc.splitTextToSize(line, 170);
            doc.text(wrapped, 20, y);
            y += 6 * wrapped.length;
        });
        y += 4;
    });

    doc.save(`medcard_${pet?.nimi || 'pet'}.pdf`);
}

function exportMedExcel() {
    const pet = myPets.find(p => p.id === parseInt(document.getElementById('medPetSelect').value));
    if (!allMedRecords.length) { showToast(i18n.t('noMedRecords'), 'info'); return; }
    const rows = allMedRecords.map(r => ({
        [i18n.t('date')]: new Date(r.kuupAev).toLocaleDateString('et-EE'),
        [i18n.t('vet')]: r.arstNimi || '',
        [i18n.t('diagnosis')]: r.diagnoos,
        [i18n.t('treatment')]: r.ravi,
        'Ravimid': r.ravimid || '',
        [i18n.t('weight') + ' (kg)']: r.kaal || '',
        [i18n.t('notes')]: r.markused || ''
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'MedCard');
    XLSX.writeFile(wb, `medcard_${pet?.nimi || 'pet'}.xlsx`);
}

function initVaccines() {
    const sel = document.getElementById('vaccinePetSelect');
    sel.innerHTML = `<option value="">${i18n.t('selectPetMed')}</option>` +
        myPets.map(p => `<option value="${p.id}">${petIcon(p.liik)} ${p.nimi}</option>`).join('');
    document.getElementById('vaccinesList').innerHTML = '';
}

async function loadVaccines() {
    const petId = document.getElementById('vaccinePetSelect').value;
    const container = document.getElementById('vaccinesList');
    if (!petId) { container.innerHTML = ''; return; }

    container.innerHTML = '<div class="loader"><div class="spinner"></div></div>';
    try {
        const vaccines = await api.get(`/Vaccine/pet/${petId}`);
        if (!vaccines || vaccines.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">💉</div>
                    <div class="empty-title">${i18n.t('noVaccines')}</div>
                    <div class="empty-text">${i18n.t('noVaccinesText')}</div>
                </div>`;
            return;
        }

        const now = new Date();
        const soon = new Date(); soon.setDate(soon.getDate() + 30);

        container.innerHTML = vaccines.map(v => {
            let badge = '';
            if (v.jargmineKuupAev) {
                const next = new Date(v.jargmineKuupAev);
                if (next < now) badge = `<span class="badge badge-rejected">${i18n.t('vaccineOverdue')}</span>`;
                else if (next < soon) badge = `<span class="badge badge-pending">${i18n.t('vaccineDue')}</span>`;
                else badge = `<span class="badge badge-approved">${i18n.t('vaccineOk')}</span>`;
            }
            return `
            <div class="med-record-card">
                <div class="med-record-header">
                    <span class="med-record-date" style="font-weight:700;">💉 ${v.nimetus}</span>
                    ${badge}
                </div>
                <div class="med-record-field"><strong>${i18n.t('vaccineDate')}:</strong> ${new Date(v.manustamisKuupAev).toLocaleDateString('et-EE')}</div>
                ${v.jargmineKuupAev ? `<div class="med-record-field"><strong>${i18n.t('vaccineNext')}:</strong> ${new Date(v.jargmineKuupAev).toLocaleDateString('et-EE')}</div>` : ''}
                ${v.arst ? `<div class="med-record-field"><strong>${i18n.t('vaccineVet')}:</strong> ${v.arst}</div>` : ''}
                ${v.partii ? `<div class="med-record-field"><strong>${i18n.t('vaccineBatch')}:</strong> ${v.partii}</div>` : ''}
                ${v.markused ? `<div class="med-record-field"><strong>${i18n.t('vaccineNotes')}:</strong> ${v.markused}</div>` : ''}
            </div>`;
        }).join('');
    } catch {
        container.innerHTML = `<div class="alert alert-error">❌ ${i18n.t('loadError')}</div>`;
    }
}

function initReviews() {
    const clinicSel = document.getElementById('reviewClinic');
    const filterSel = document.getElementById('reviewClinicFilter');
    clinicSel.innerHTML = `<option value="">${i18n.t('selectClinic')}</option>` +
        clinics.map(c => `<option value="${c.id}">${c.nimi}</option>`).join('');
    filterSel.innerHTML = `<option value="">${i18n.t('allClinics')}</option>` +
        clinics.map(c => `<option value="${c.id}">${c.nimi}</option>`).join('');
    loadReviews();
}

async function loadReviews() {
    const kliinikId = document.getElementById('reviewClinicFilter').value;
    const container = document.getElementById('reviewsList');
    container.innerHTML = '<div class="loader"><div class="spinner"></div></div>';
    try {
        const url = kliinikId ? `/Review?kliinikId=${kliinikId}` : '/Review';
        const reviews = await api.get(url);
        if (!reviews || reviews.length === 0) {
            container.innerHTML = `<div class="empty-state"><div class="empty-icon">⭐</div><div class="empty-title">${i18n.t('noReviews')}</div></div>`;
            return;
        }
        container.innerHTML = reviews.map(r => `
            <div class="review-card">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;">
                    <div>
                        <div class="review-stars">${starsHtml(r.hinnang)}</div>
                        <div class="review-author" style="margin-top:4px;">👤 ${r.user?.name || 'Kasutaja'}</div>
                    </div>
                    <div class="review-date">${new Date(r.loodudAeg).toLocaleDateString('et-EE')}</div>
                </div>
                <div class="review-comment">${r.kommentaar}</div>
            </div>
        `).join('');
    } catch {
        container.innerHTML = `<div class="alert alert-error">❌ ${i18n.t('loadError')}</div>`;
    }
}

function initStarPicker() {
    const stars = document.querySelectorAll('#starPicker .star');
    stars.forEach(star => {
        star.addEventListener('mouseover', () => highlightStars(parseInt(star.dataset.v)));
        star.addEventListener('mouseout', () => highlightStars(parseInt(document.getElementById('reviewRating').value) || 0));
        star.addEventListener('click', () => {
            document.getElementById('reviewRating').value = star.dataset.v;
            highlightStars(parseInt(star.dataset.v));
        });
    });
}

function highlightStars(n) {
    document.querySelectorAll('#starPicker .star').forEach((s, i) => {
        s.textContent = i < n ? '★' : '☆';
        s.style.color = i < n ? '#f59e0b' : 'var(--text-light)';
    });
}

function starsHtml(n) {
    return `<span style="color:#f59e0b;">${'★'.repeat(n)}</span>${'☆'.repeat(5 - n)}`;
}

async function submitReview() {
    const clinicId = document.getElementById('reviewClinic').value;
    const rating = parseInt(document.getElementById('reviewRating').value);
    const comment = document.getElementById('reviewComment').value.trim();

    if (!clinicId || !rating || !comment) {
        document.getElementById('reviewAlert').innerHTML =
            `<div class="alert alert-error">${i18n.t('fillRequired')}</div>`;
        return;
    }

    try {
        await api.post('/Review', { kliinikId: parseInt(clinicId), hinnang: rating, kommentaar: comment });
        document.getElementById('reviewComment').value = '';
        document.getElementById('reviewRating').value = '0';
        highlightStars(0);
        document.getElementById('reviewAlert').innerHTML = '';
        showToast('⭐ ' + i18n.t('addReview'), 'success');
        loadReviews();
    } catch (err) {
        document.getElementById('reviewAlert').innerHTML =
            `<div class="alert alert-error">❌ ${err.message}</div>`;
    }
}

function petIcon(liik) {
    const icons = { Koer: '🐕', Kass: '🐈', Küülik: '🐇', Lind: '🦜' };
    return icons[liik] || '🐾';
}

function statusBadge(s) {
    const labels = { 'Ootel': i18n.t('statusPending'), 'Kinnitatud': i18n.t('statusApproved'), 'Lükatud': i18n.t('statusRejected') };
    const map = { Ootel: 'badge-pending', Kinnitatud: 'badge-approved', 'Lükatud': 'badge-rejected' };
    return `<span class="badge ${map[s] || 'badge-primary'}">${labels[s] || s}</span>`;
}

function showToast(msg, type = 'info') {
    const t = document.getElementById('toast');
    t.className = `toast toast-${type} show`;
    t.textContent = msg;
    setTimeout(() => t.className = 'toast', 3500);
}

document.getElementById('addPetModal')?.addEventListener('click', function(e) {
    if (e.target === this) closePetModal();
});
