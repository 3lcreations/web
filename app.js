// ========== GESTIONE SEZIONI ==========
function showSection(sectionName) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        if (section.id === sectionName) {
            section.classList.add('active');
            section.classList.remove('fade-out');
        } else {
            section.classList.remove('active');
        }
    });
    window.location.hash = sectionName;
    window.scrollTo(0, 0);
}

// ========== MENU LATERALE ==========
function openNav() {
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("menuOverlay").style.display = "block";
    document.getElementById("menuOverlay").style.opacity = "1";
}

function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("menuOverlay").style.display = "none";
    document.getElementById("menuOverlay").style.opacity = "0";
}

// ========== LIGHTBOX ==========
function openLightbox(imgSrc) {
    const lightbox = document.getElementById('lightbox');
    document.getElementById('lightbox-img').src = imgSrc;
    lightbox.classList.add('active');
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
}

// ========== TORNA SU ==========
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('scroll', function() {
    const btn = document.getElementById('backToTopBtn');
    if (window.scrollY > 300) {
        btn.classList.add('show');
    } else {
        btn.classList.remove('show');
    }
});

// ========== SPLASH SCREEN ==========
window.addEventListener('load', function() {
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if (splash) {
            splash.style.opacity = '0';
            splash.style.visibility = 'hidden';
            splash.style.transition = 'all 0.5s ease';
        }
    }, 1500);
});

// ========== COOKIE BANNER ==========
function acceptCookies() {
    localStorage.setItem('cookies-accepted', 'true');
    document.getElementById('cookie-banner').classList.remove('show');
}

window.addEventListener('load', function() {
    if (!localStorage.getItem('cookies-accepted')) {
        document.getElementById('cookie-banner').classList.add('show');
    }
});

// ========== TOAST NOTIFICATIONS ==========
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast show`;
    toast.style.backgroundColor = type === 'error' ? '#ff4d4d' : '#d81b60';
    toast.textContent = message;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ========== ADMIN FUNCTIONS ==========
async function loginAdmin() {
    const email = document.getElementById('admin-email').value;
    const pwd = document.getElementById('admin-pwd').value;
    
    try {
        await window.fbSignIn(window.auth, email, pwd);
        showToast('Accesso riuscito!');
        document.getElementById('admin-login-box').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'block';
        document.getElementById('admin-user-email').textContent = email;
    } catch (error) {
        showToast('Errore di accesso: ' + error.message, 'error');
    }
}

function aggiornaUIAdmin(user) {
    if (user) {
        document.getElementById('admin-login-box').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'block';
        document.getElementById('admin-user-email').textContent = user.email;
    }
}

function logoutAdmin() {
    window.fbSignOut(window.auth).then(() => {
        document.getElementById('admin-login-box').style.display = 'block';
        document.getElementById('admin-panel').style.display = 'none';
        document.getElementById('admin-email').value = '';
        document.getElementById('admin-pwd').value = '';
        showToast('Disconnesso con successo');
    });
}

// ========== CATEGORIA PRODOTTI ==========
function cambiaCategoria(category, btn) {
    // Nascondi tutte le categorie
    document.querySelectorAll('.cat-content').forEach(cat => {
        cat.classList.remove('active');
    });
    
    // Deseleziona tutti i bottoni
    document.querySelectorAll('.cat-btn').forEach(b => {
        b.classList.remove('active');
    });
    
    // Mostra categoria selezionata
    const catElement = document.getElementById('cat-' + category);
    if (catElement) {
        catElement.classList.add('active');
    }
    
    // Seleziona bottone
    if (btn) {
        btn.classList.add('active');
    }
}

// ========== FILTRO E RICERCA PRODOTTI ==========
function filtraProdotti() {
    const searchTerm = document.getElementById('searchBar').value.toLowerCase();
    const products = document.querySelectorAll('.product-card:not(.skeleton-card)');
    
    products.forEach(product => {
        const title = product.querySelector('h3')?.textContent.toLowerCase() || '';
        if (title.includes(searchTerm)) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// ========== ORDINAMENTO PRODOTTI ==========
function applicaOrdinamento() {
    const sortValue = document.getElementById('sortProdotti')?.value || '';
    // Implementare logica di ordinamento
    console.log('Ordinamento:', sortValue);
}

// ========== PERSONALIZZAZIONE MAGLIETTA ==========
function aggiornaAnteprima(imgId, tipo) {
    const img = document.getElementById(imgId);
    if (!img) return;
    
    // Mappa dei nomi file immagini
    const imageMaps = {
        'tshirt_bianca': 'bianco-tshirt.png',
        'tshirt_nera': 'nero-tshirt.png',
        'pelosetto_bianco': 'bianco-pelosetto.png',
        'pelosetto_nero': 'nero-pelosetto.png',
        'pochette_azzurra': 'azzurro-p.png',
        'pochette_rosa': 'rosa-p.png',
        'pochette_nera': 'nero-p.png',
        'borsa_bianca': 'bianco-borsa.png'
    };
    
    const fileName = imageMaps[tipo] || 'logo.png';
    img.src = fileName;
}

// ========== GUIDA TAGLIE ==========
function openSizeGuide(type) {
    const modal = document.getElementById('sizeGuideModal');
    const title = document.getElementById('sizeGuideTitle');
    const body = document.getElementById('sizeGuideBody');
    
    const guides = {
        'umani': {
            title: 'Guida Taglie - Magliette Umane',
            content: `<table class="size-table">
                <thead><tr><th>Taglia</th><th>XS</th><th>S</th><th>M</th><th>L</th><th>XL</th><th>XXL</th></tr></thead>
                <tbody><tr><td>Petto (cm)</td><td>34</td><td>36</td><td>38</td><td>40</td><td>42</td><td>44</td></tr></tbody>
            </table>`
        },
        'cani': {
            title: 'Guida Taglie - Magliette Cani',
            content: `<table class="size-table">
                <thead><tr><th>Taglia</th><th>XS</th><th>S</th><th>M</th><th>L</th><th>XL</th></tr></thead>
                <tbody><tr><td>Lunghezza (cm)</td><td>20</td><td>25</td><td>30</td><td>35</td><td>40</td></tr></tbody>
            </table>`
        }
    };
    
    if (guides[type]) {
        title.textContent = guides[type].title;
        body.innerHTML = guides[type].content;
        modal.classList.add('active');
    }
}

function closeSizeGuide(event, force = false) {
    if (force || event.target.id === 'sizeGuideModal') {
        document.getElementById('sizeGuideModal').classList.remove('active');
    }
}

// ========== CIONDOLI E PERLINE ==========
function calcolaTotaleCiondoli() {
    const prezzoBase = 5.00;
    let totale = prezzoBase;
    
    // Conta ciondoli e perline selezionati
    const ciondoli = document.querySelectorAll('.charm-checkbox:checked');
    const perline = document.querySelectorAll('.perlina-checkbox:checked');
    
    ciondoli.forEach(c => {
        const prezzo = parseFloat(c.dataset.price) || 0;
        totale += prezzo;
    });
    
    perline.forEach(p => {
        const prezzo = parseFloat(p.dataset.price) || 0;
        totale += prezzo;
    });
    
    document.getElementById('prezzo-totale-ciondoli').textContent = totale.toFixed(2);
}

// ========== RICHIESTA COLLANA PERSONALIZZATA ==========
function richiestaCollanaPersonalizzata(event) {
    event.preventDefault();
    
    const catenina = document.querySelector('input[name="catenina"]:checked')?.value;
    const ciondoli = Array.from(document.querySelectorAll('.charm-checkbox:checked')).map(c => c.dataset.name);
    const perline = Array.from(document.querySelectorAll('.perlina-checkbox:checked')).map(p => p.dataset.name);
    const totale = document.getElementById('prezzo-totale-ciondoli').textContent;
    
    const messaggio = `Richiesta Collana Personalizzata:\n\nCatenina: ${catenina}\nCiondoli: ${ciondoli.join(', ')}\nPerline: ${perline.join(', ')}\nTotale: €${totale}`;
    
    const url = `https://www.instagram.com/_3l_creations`;
    window.open(url, '_blank');
    showToast('Apri Instagram per inviare la richiesta!');
}

// ========== RICHIESTA PRODOTTO PERSONALIZZATO ==========
function inviaRichiestaProdotto(tipo, notaId, coloreId, tagliId) {
    const nota = document.getElementById(notaId)?.value || '';
    const colore = document.querySelector(`input[name="${coloreId}"]:checked`)?.value || '';
    const taglia = tagliId ? document.querySelector(`input[name="${tagliId}"]:checked`)?.value || '' : '';
    
    if (!nota.trim()) {
        showToast('Inserisci una descrizione!', 'error');
        return;
    }
    
    const messaggio = `Richiesta ${tipo}:\n\nColore: ${colore}\nTaglia: ${taglia}\nDescrizione: ${nota}`;
    
    const url = `https://www.instagram.com/_3l_creations`;
    window.open(url, '_blank');
    showToast('Apri Instagram e invia la richiesta!');
}

// ========== CONDIVIDI PRODOTTO ==========
function condividiProdotto() {
    const title = document.getElementById('dettaglio-titolo')?.textContent || 'Un prodotto 3L Creations';
    
    if (navigator.share) {
        navigator.share({
            title: '3L Creations',
            text: `Guarda questo meraviglioso prodotto: ${title}`,
            url: window.location.href
        }).catch(err => console.log('Errore share:', err));
    } else {
        showToast('Copia il link da condividere');
    }
}

// ========== SCROLL PROGRESS BAR ==========
window.addEventListener('scroll', function() {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / scrollHeight) * 100;
    document.getElementById('scroll-progress-bar').style.width = scrolled + '%';
});

// ========== REVEAL ANIMATIONS ==========
function setupRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    });
    
    reveals.forEach(el => observer.observe(el));
}

window.addEventListener('DOMContentLoaded', setupRevealAnimations);

// ========== MAGIC CURSOR (se su desktop) ==========
function setupMagicCursor() {
    if (window.matchMedia('(pointer: fine)').matches) {
        const cursor = document.getElementById('magic-cursor');
        if (!cursor) return;
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        
        document.querySelectorAll('a, button, input, select, textarea, .product-image, .charm-image, .home-slide img').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }
}

window.addEventListener('DOMContentLoaded', setupMagicCursor);

// ========== INSTALLAZIONE APP ==========
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const btn = document.getElementById('btn-installa-app-top');
    if (btn) btn.style.display = 'flex';
});

document.getElementById('btn-installa-app-top')?.addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
            showToast('App installata!');
        }
        deferredPrompt = null;
    }
});

// ========== ONLINE/OFFLINE ==========
window.addEventListener('online', () => {
    document.getElementById('offline-screen').style.display = 'none';
});

window.addEventListener('offline', () => {
    document.getElementById('offline-screen').style.display = 'flex';
});

// ========== NAVIGAZIONE HASH ==========
window.addEventListener('hashchange', () => {
    const section = window.location.hash.replace('#', '') || 'home';
    showSection(section);
});

window.addEventListener('DOMContentLoaded', () => {
    const section = window.location.hash.replace('#', '') || 'home';
    showSection(section);
});
