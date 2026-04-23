const apiBase = "https://localhost:7261/api";

function showPopup(message, isSuccess = true) {
    const el = document.getElementById("alert");

    el.innerText = message;
    el.style.background = isSuccess ? "#22c55e" : "#dc3545";
    el.style.display = "block";

    setTimeout(() => {
        el.style.display = "none";
    }, 2000);
}

async function loadClinics() {
    const res = await fetch(`${apiBase}/Kliinik/list`);
    const clinics = await res.json();

    const select = document.getElementById("petClinicId");

    clinics.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.id;
        opt.textContent = `${c.nimi} (ID: ${c.id})`;
        select.appendChild(opt);
    });
}

loadClinics();

/* ===================================
      LIVE SEARCH
=================================== */
document.getElementById("searchInput").addEventListener("input", async function () {
    const query = this.value.trim();
    const box = document.getElementById("searchResults");

    if (query.length < 2) {
        box.style.display = "none";
        return;
    }

    const res = await fetch(`${apiBase}/Omanik/search?name=${encodeURIComponent(query)}`);
    const owners = await res.json();

    box.innerHTML = "";
    if (owners.length === 0) {
        box.style.display = "none";
        return;
    }

    owners.forEach(o => {
        const row = document.createElement("div");
        row.textContent = `${o.nimi} (${o.phone ?? "telefon puudub"})`;
        row.onclick = () => {
            document.getElementById("searchInput").value = o.nimi;
            box.style.display = "none";
            showUserInfo(o);
        };
        box.appendChild(row);
    });

    box.style.display = "block";
});

/* ===================================
      SEARCH BUTTON
=================================== */
document.getElementById("searchBtn").addEventListener("click", async () => {
    const q = document.getElementById("searchInput").value.trim();
    if (!q) return;

    const res = await fetch(`${apiBase}/Omanik/search?name=${encodeURIComponent(q)}`);
    const owners = await res.json();

    if (owners.length === 0) {
        showUserNotFound();
        return;
    }

    showUserInfo(owners[0]);
});

/* ===================================
      USER INFO CARD
=================================== */
function showUserNotFound() {
    const box = document.getElementById("userInfo");
    box.style.display = "block";
    box.innerHTML = `
        <h3>Kasutajat ei leitud</h3>
        <p>Proovi teist nime.</p>
    `;
}

function showUserInfo(user) {
    const box = document.getElementById("userInfo");
    box.style.display = "block";

    const petsHtml = user.lemmikloomad && user.lemmikloomad.length > 0
        ? user.lemmikloomad.map(p => `
            <li>
                <strong>${p.nimetus}</strong> — ${p.kaal} kg
                (Kliinik: ${p.kliinik?.nimi ?? "—"})
            </li>
        `).join("")
        : "<li>Pole loomi</li>";

    box.innerHTML = `
        <h3>Omaniku info</h3>

        <p><strong>Nimi:</strong> ${user.nimi}</p>
        <p><strong>Telefon:</strong> ${user.phone ?? "puudub"}</p>
        <p><strong>Loodud:</strong> ${new Date(user.createdAt).toLocaleString()}</p>

        <h4>Lemmikloomad:</h4>
        <ul>${petsHtml}</ul>
    `;
}

/* ===================================
      ADD OWNER + PET
=================================== */
async function addOwnerWithPet() {
    const body = {
        nimi: document.getElementById("ownerName").value.trim(),
        phone: document.getElementById("ownerPhone").value.trim(),
        petName: document.getElementById("petName").value.trim(),
        petWeight: Number(document.getElementById("petWeight").value),
        clinicId: Number(document.getElementById("petClinicId").value)
    };

    const res = await fetch(`${apiBase}/Omanik/add-with-pet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    let data;
    try {
        data = await res.json();
    } catch {
        data = await res.text();
    }

    if (res.ok) {
        showPopup("Omanik ja loom lisatud!", true);
        clearOwnerWithPetForm();
    } else {
        showPopup(data, false);
    }
}


function renderOwnerCard(owner) {
    const petsHtml = owner.lemmikloomad.length === 0
        ? "<p>Ühtegi looma pole.</p>"
        : owner.lemmikloomad.map(p => {
            return `
                <li>
                    <strong>${p.nimetus}</strong> — ${p.kaal} kg  
                    <br>
                    <span style="font-size: 13px; color: #666;">
                        Kliinik: 
                        ${p.kliinik
                    ? `<a href="#" onclick="openClinic(${p.kliinik.id})">${p.kliinik.nimi}</a>`
                    : "—"
                }
                    </span>
                </li>
            `;
        }).join("");

    document.getElementById("searchResult").innerHTML = `
        <div class="result-card">
            <h3>Omaniku info</h3>

            <p><strong>Nimi:</strong> ${owner.nimi}</p>
            <p><strong>Telefon:</strong> ${owner.phone || "—"}</p>
            <p><strong>Loodud:</strong> ${new Date(owner.createdAt).toLocaleString()}</p>

            <h4>Lemmikloomad:</h4>
            <ul>${petsHtml}</ul>
        </div>
    `;
}

async function openClinic(clinicId) {
    const res = await fetch(`${apiBase}/Kliinik/${clinicId}`);
    if (!res.ok) return alert("Kliinikut ei leitud");

    const clinic = await res.json();

    document.getElementById("searchResult").innerHTML = `
        <div class="result-card">
            <h3>Kliiniku info</h3>
            <p><strong>Nimi:</strong> ${clinic.nimi}</p>

            <h4>Lemmikloomad selles kliinikus:</h4>
            <ul>
                ${clinic.lemmikloomad.map(p => `
                    <li>
                        <strong>${p.nimetus}</strong> — ${p.kaal} kg  
                    </li>
                `).join("")}
            </ul>

            <button onclick="location.reload()">Tagasi</button>
        </div>
    `;
}

function clearOwnerWithPetForm() {
    document.getElementById("ownerName").value = "";
    document.getElementById("ownerPhone").value = "";
    document.getElementById("petName").value = "";
    document.getElementById("petWeight").value = "";
    document.getElementById("petClinicId").value = "";
}



