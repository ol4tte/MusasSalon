/* ==========================================================================
   Musas Salón de Belleza Spa - Dedicated Admin Panel Logic (admin.js)
   Super Admin: ol4tte@gmail.com | Password: EquipoM-1
   ========================================================================== */

// --- Default Data Repositories ---
const DEFAULT_USERS = [
  {
    id: 'usr_super_admin',
    name: 'Almendra Olate',
    email: 'ol4tte@gmail.com',
    password: 'EquipoM-1',
    role: 'Super Administradora',
    status: 'aprobado',
    superAdmin: true,
    createdAt: '2026-07-24'
  },
  {
    id: 'usr_sample_1',
    name: 'Marcela González',
    email: 'marcela.estetica@musas.cl',
    password: 'EquipoM-1',
    role: 'Esteticista & Spa',
    status: 'pendiente',
    superAdmin: false,
    createdAt: '2026-07-24'
  }
];

const DEFAULT_GALLERY_PHOTOS = [
  { id: 'p1', title: 'Técnica Balayage & Nutrición Capilar', url: 'assets/balayage.png' },
  { id: 'p2', title: 'Uñas Acrílicas Esculpidas Nude & Rose Gold', url: 'assets/nails.png' },
  { id: 'p3', title: 'Limpieza Facial Profunda en Spa', url: 'assets/facial.png' },
  { id: 'p4', title: 'Instalaciones y Salón Errázuriz 166 Buin', url: 'assets/hero.png' }
];

const DEFAULT_SERVICES = [
  { id: 's1', category: 'cabello', name: 'Técnica Balayage', price: 45000, duration: '180 min', desc: 'Degradado de color personalizado y nutrición para un look luminoso.', badge: 'Destacado' },
  { id: 's2', category: 'cabello', name: 'Alisado & Nutrición Capilar', price: 30000, duration: '120 min', desc: 'Tratamiento sellador de cutícula, brillo espejo y control del frizz.', badge: 'Popular' },
  { id: 's3', category: 'cabello', name: 'Definición de Rizos & Hidratación', price: 25000, duration: '90 min', desc: 'Definición profesional y aporte intenso de humedad para rizos definidos.', badge: null },
  { id: 's4', category: 'cabello', name: 'Corte de Cabello & Peinado', price: 18000, duration: '60 min', desc: 'Corte adaptado a tu estilo de rostro con lavado y peinado final.', badge: null },
  { id: 's5', category: 'cejas-pestanas', name: 'Lifting de Pestañas', price: 20000, duration: '60 min', desc: 'Curvatura natural y tinte nutritivo para una mirada impactante.', badge: 'Popular' },
  { id: 's6', category: 'cejas-pestanas', name: 'Laminado & Delineado Cejas', price: 18000, duration: '50 min', desc: 'Diseño, fijación y tinte para cejas pobladas y perfectas.', badge: null },
  { id: 's7', category: 'faciales-spa', name: 'Limpieza Facial Profunda', price: 20000, duration: '60 min', desc: 'Exfoliación, vapor de ozono, extracción e hidratación intensiva.', badge: 'PROMO ESPECTACULAR' },
  { id: 's8', category: 'faciales-spa', name: 'Depilación con Cera Facial', price: 12000, duration: '30 min', desc: 'Depilación suave y humectación post-tratamiento.', badge: null },
  { id: 's9', category: 'unas', name: 'Uñas de Acrílico Esculpidas', price: 25000, duration: '90 min', desc: 'Diseño elegante, duradero con acabados nude y rose gold.', badge: 'Top Ventas' },
  { id: 's10', category: 'unas', name: 'Servicio de Manicuría Rusa & Esmaltado', price: 15000, duration: '60 min', desc: 'Limpieza de cutículas y esmaltado permanente de alta duración.', badge: null },
  { id: 's11', category: 'unas', name: 'Pedicura Spa & Hidratación', price: 18000, duration: '60 min', desc: 'Exfoliación, masajes relajantes y embellecimiento de uñas.', badge: null },
  { id: 's12', category: 'novias', name: 'Servicio de Maquillaje Novias & Eventos', price: 40000, duration: '90 min', desc: 'Maquillaje de alta definición a prueba de agua y larga duración.', badge: 'Especial' },
  { id: 's13', category: 'novias', name: 'Servicio Peinado Novia / Gala', price: 35000, duration: '90 min', desc: 'Recogidos y semirecogidos elegantes para tus mejores eventos.', badge: null }
];

const CHILEAN_HOLIDAYS_2026 = {
  '2026-01-01': 'Año Nuevo',
  '2026-04-03': 'Viernes Santo',
  '2026-04-04': 'Sábado Santo',
  '2026-05-01': 'Día del Trabajo',
  '2026-05-21': 'Glorias Navales',
  '2026-06-29': 'San Pedro y San Pablo',
  '2026-07-16': 'Virgen del Carmen',
  '2026-08-15': 'Asunción de la Virgen',
  '2026-09-18': 'Fiestas Patrias',
  '2026-09-19': 'Glorias del Ejército',
  '2026-10-12': 'Encuentro 2 Mundos',
  '2026-10-31': 'Día Iglesias Evangélicas',
  '2026-11-01': 'Todos los Santos',
  '2026-12-08': 'Inmaculada Concepción',
  '2026-12-25': 'Navidad'
};

const DEFAULT_BOOKINGS = [
  { id: 'b101', date: '2026-07-24', time: '11:00', clientName: 'Camila Rojas', phone: '+56 9 7654 3210', serviceName: 'Limpieza Facial Profunda', status: 'confirmada' },
  { id: 'b102', date: '2026-07-25', time: '15:30', clientName: 'Valentina Silva', phone: '+56 9 8765 4321', serviceName: 'Técnica Balayage', status: 'confirmada' },
  { id: 'b103', date: '2026-07-27', time: '10:30', clientName: 'Isadora Fuentes', phone: '+56 9 5432 1098', serviceName: 'Uñas de Acrílico Esculpidas', status: 'pendiente' }
];

// --- Application State ---
let usersState = JSON.parse(localStorage.getItem('musas_users')) || DEFAULT_USERS;
let galleryState = JSON.parse(localStorage.getItem('musas_gallery')) || DEFAULT_GALLERY_PHOTOS;
let servicesState = JSON.parse(localStorage.getItem('musas_services')) || DEFAULT_SERVICES;
let bookingsState = JSON.parse(localStorage.getItem('musas_bookings')) || DEFAULT_BOOKINGS;
let adminNotificationEmail = localStorage.getItem('musas_admin_email') || 'ol4tte@gmail.com';

let currentCalendarDate = new Date();
let selectedFilterDate = null;
let loggedInUser = null;

// --- Initialize ---
document.addEventListener('DOMContentLoaded', () => {
  updateNoticeElements();
  checkAuthSession();
});

function saveData() {
  localStorage.setItem('musas_users', JSON.stringify(usersState));
  localStorage.setItem('musas_gallery', JSON.stringify(galleryState));
  localStorage.setItem('musas_services', JSON.stringify(servicesState));
  localStorage.setItem('musas_bookings', JSON.stringify(bookingsState));
  localStorage.setItem('musas_admin_email', adminNotificationEmail);
}

function updateNoticeElements() {
  const elNotice = document.getElementById('notifyEmailNotice');
  if (elNotice) elNotice.innerText = adminNotificationEmail;

  const elSuperLabel = document.getElementById('superAdminEmailLabel');
  if (elSuperLabel) elSuperLabel.innerText = adminNotificationEmail;

  const elConfigInput = document.getElementById('configAdminEmailInput');
  if (elConfigInput) elConfigInput.value = adminNotificationEmail;
}

// --- Auth Toggle (Login vs Register) ---
function showAuthTab(tab) {
  const formLogin = document.getElementById('formLogin');
  const formReg = document.getElementById('formRegister');
  const btnLogin = document.getElementById('btnToggleLogin');
  const btnReg = document.getElementById('btnToggleRegister');

  if (tab === 'login') {
    formLogin.style.display = 'block';
    formReg.style.display = 'none';
    btnLogin.classList.add('active');
    btnReg.classList.remove('active');
  } else {
    formLogin.style.display = 'none';
    formReg.style.display = 'block';
    btnLogin.classList.remove('active');
    btnReg.classList.add('active');
  }
}

// --- Auth Logic & Session ---
function checkAuthSession() {
  const sessionUserId = sessionStorage.getItem('musas_logged_user_id');
  const loginScreen = document.getElementById('loginScreen');
  const dashboardWrapper = document.getElementById('dashboardWrapper');

  if (sessionUserId) {
    loggedInUser = usersState.find(u => u.id === sessionUserId);
  }

  if (loggedInUser && loggedInUser.status === 'aprobado') {
    loginScreen.style.display = 'none';
    dashboardWrapper.style.display = 'block';

    // Set User Badge Header
    const badge = document.getElementById('currentUserBadge');
    if (badge) {
      badge.innerHTML = `<i class="fas fa-user-shield"></i> ${loggedInUser.email} (${loggedInUser.role})`;
    }

    // Toggle Super Admin specific buttons
    const superAdminElements = document.querySelectorAll('.super-admin-only');
    superAdminElements.forEach(el => {
      el.style.display = loggedInUser.superAdmin ? 'inline-flex' : 'none';
    });

    initDashboard();
  } else {
    loginScreen.style.display = 'flex';
    dashboardWrapper.style.display = 'none';
    sessionStorage.removeItem('musas_logged_user_id');
    loggedInUser = null;
  }
}

function handleAdminLogin(event) {
  event.preventDefault();
  const email = document.getElementById('loginEmailInput').value.trim().toLowerCase();
  const password = document.getElementById('loginPasswordInput').value.trim();
  const errorMsg = document.getElementById('loginErrorMsg');

  // Verify Team Password
  if (password !== 'EquipoM-1') {
    errorMsg.innerHTML = '<i class="fas fa-exclamation-circle"></i> Contraseña de equipo incorrecta. La contraseña es <strong>EquipoM-1</strong>.';
    errorMsg.style.display = 'block';
    return;
  }

  // Find Account
  const account = usersState.find(u => u.email.toLowerCase() === email);

  if (!account) {
    errorMsg.innerHTML = `<i class="fas fa-exclamation-circle"></i> No existe una cuenta registrada con el correo <strong>${email}</strong>. Puedes registrarte en la pestaña "Crear Cuenta".`;
    errorMsg.style.display = 'block';
    return;
  }

  // Check Approval Status
  if (account.status === 'pendiente') {
    errorMsg.innerHTML = `<i class="fas fa-clock"></i> Tu cuenta está <strong>pendiente de aprobación</strong> por la Administradora (<strong>${adminNotificationEmail}</strong>). Se ha enviado un correo para autorizar tu ingreso.`;
    errorMsg.style.display = 'block';
    return;
  }

  if (account.status === 'rechazado') {
    errorMsg.innerHTML = `<i class="fas fa-times-circle"></i> El acceso para este usuario no fue aprobado por la Administradora. Contacta a ${adminNotificationEmail}.`;
    errorMsg.style.display = 'block';
    return;
  }

  // Success Login
  sessionStorage.setItem('musas_logged_user_id', account.id);
  loggedInUser = account;
  errorMsg.style.display = 'none';
  checkAuthSession();
}

function handleAccountRegistration(event) {
  event.preventDefault();
  const name = document.getElementById('regNameInput').value.trim();
  const email = document.getElementById('regEmailInput').value.trim().toLowerCase();
  const role = document.getElementById('regRoleInput').value;
  const password = document.getElementById('regPasswordInput').value.trim();

  if (password !== 'EquipoM-1') {
    alert('La contraseña de equipo debe ser exactamente: EquipoM-1');
    return;
  }

  // Check duplicate email
  const existing = usersState.find(u => u.email.toLowerCase() === email);
  if (existing) {
    alert(`El correo ${email} ya se encuentra registrado.`);
    return;
  }

  const newUser = {
    id: 'usr_' + Date.now(),
    name,
    email,
    password: 'EquipoM-1',
    role,
    status: 'pendiente',
    superAdmin: false,
    createdAt: new Date().toISOString().split('T')[0]
  };

  usersState.push(newUser);
  saveData();

  // Simulate Email Notification sent to Administrator (ol4tte@gmail.com)
  alert(`¡Cuenta solicitada con éxito!\n\n📧 NOTIFICACIÓN ENVIADA A: ${adminNotificationEmail}\n\nEstimada Administradora, ${name} (${email}) ha solicitado acceso al Panel con el rol de "${role}". Revisa el panel para autorizar su ingreso.`);

  // Reset form & return to login
  document.getElementById('formRegister').reset();
  showAuthTab('login');
  document.getElementById('loginEmailInput').value = email;
}

function handleAdminLogout() {
  if (confirm('¿Desea cerrar sesión en el Panel de Administración?')) {
    sessionStorage.removeItem('musas_logged_user_id');
    checkAuthSession();
  }
}

// --- Dashboard Initializer ---
function initDashboard() {
  renderChileanCalendar();
  renderBookingsTable();
  renderServicesAdminTable();
  populateManualBookingServiceSelect();
  renderGalleryAdminGrid();
  renderUsersAdminTable();
  updatePendingUsersBadge();
}

function formatCLP(amount) {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
}

// --- Tab Navigation ---
function switchTab(tabName) {
  const tabs = ['calendar', 'services', 'addBooking', 'photos', 'users', 'config'];
  
  tabs.forEach(t => {
    const btn = document.getElementById('tabBtn' + t.charAt(0).toUpperCase() + t.slice(1));
    const sec = document.getElementById('sec' + t.charAt(0).toUpperCase() + t.slice(1));
    if (btn) btn.classList.remove('active');
    if (sec) sec.style.display = 'none';
  });

  const activeBtn = document.getElementById('tabBtn' + tabName.charAt(0).toUpperCase() + tabName.slice(1));
  const activeSec = document.getElementById('sec' + tabName.charAt(0).toUpperCase() + tabName.slice(1));
  if (activeBtn) activeBtn.classList.add('active');
  if (activeSec) activeSec.style.display = 'block';
}

// --- Chilean Calendar Engine ---
function renderChileanCalendar() {
  const monthTitle = document.getElementById('calMonthTitle');
  const daysGrid = document.getElementById('calDaysGrid');
  if (!daysGrid) return;

  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  monthTitle.innerText = `${monthNames[month]} ${year}`;
  daysGrid.innerHTML = '';

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  let blankCount = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

  for (let i = 0; i < blankCount; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'calendar-day-cell empty';
    daysGrid.appendChild(emptyCell);
  }

  const todayStr = new Date().toISOString().split('T')[0];

  for (let day = 1; day <= totalDays; day++) {
    const cellDateObj = new Date(year, month, day);
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayOfWeek = cellDateObj.getDay();

    const dayCell = document.createElement('div');
    dayCell.className = 'calendar-day-cell';

    const holidayName = CHILEAN_HOLIDAYS_2026[dateStr];

    if (holidayName) {
      dayCell.classList.add('is-holiday');
    } else if (dayOfWeek === 0) {
      dayCell.classList.add('is-sunday');
    } else if (dayOfWeek === 6) {
      dayCell.classList.add('is-saturday');
    } else {
      dayCell.classList.add('is-weekday');
    }

    if (dateStr === todayStr) {
      dayCell.classList.add('is-today');
    }

    const dayBookings = bookingsState.filter(b => b.date === dateStr);

    dayCell.innerHTML = `
      <div class="day-number-badge">${day}</div>
      ${holidayName ? `<div class="holiday-tag-label"><i class="fas fa-flag"></i> ${holidayName}</div>` : ''}
      ${dayBookings.length > 0 ? `<div class="booking-indicator-badge"><i class="far fa-calendar"></i> ${dayBookings.length} cita(s)</div>` : ''}
    `;

    dayCell.onclick = () => filterByDate(dateStr);
    daysGrid.appendChild(dayCell);
  }
}

function prevMonth() {
  currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
  renderChileanCalendar();
}

function nextMonth() {
  currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
  renderChileanCalendar();
}

// --- Bookings Table ---
function renderBookingsTable() {
  const tbody = document.getElementById('adminBookingsTbody');
  const label = document.getElementById('dateFilterLabel');
  if (!tbody) return;

  let list = bookingsState;
  if (selectedFilterDate) {
    list = list.filter(b => b.date === selectedFilterDate);
    if (label) label.innerText = `Filtrando por la fecha: ${selectedFilterDate}`;
  } else {
    if (label) label.innerText = `Mostrando todas las citas (${list.length})`;
  }

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 24px; color: var(--text-muted);">No existen citas registradas para este criterio.</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(b => `
    <tr>
      <td><strong>${b.date}</strong><br><small style="color:var(--text-muted);">${b.time} hrs</small></td>
      <td><strong>${b.clientName}</strong></td>
      <td>${b.serviceName}</td>
      <td>${b.phone}</td>
      <td><span class="status-badge status-${b.status}">${b.status}</span></td>
      <td>
        <button class="btn btn-outline" style="padding: 4px 10px; font-size:0.775rem;" onclick="toggleStatus('${b.id}')">
          <i class="fas fa-sync-alt"></i> Estado
        </button>
        <button class="btn btn-admin" style="padding: 4px 10px; font-size:0.775rem; color:#C5221F;" onclick="deleteBooking('${b.id}')">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function filterByDate(dateStr) {
  selectedFilterDate = dateStr;
  renderBookingsTable();
}

function resetDateFilter() {
  selectedFilterDate = null;
  renderBookingsTable();
}

function toggleStatus(bookingId) {
  const item = bookingsState.find(b => b.id === bookingId);
  if (!item) return;

  const statusSeq = { 'pendiente': 'confirmada', 'confirmada': 'atendida', 'atendida': 'pendiente' };
  item.status = statusSeq[item.status] || 'confirmada';
  saveData();
  renderBookingsTable();
  renderChileanCalendar();
}

function deleteBooking(bookingId) {
  if (confirm('¿Confirma eliminar esta cita de la agenda?')) {
    bookingsState = bookingsState.filter(b => b.id !== bookingId);
    saveData();
    renderBookingsTable();
    renderChileanCalendar();
  }
}

// --- Autoadministrable Services ---
function renderServicesAdminTable() {
  const tbody = document.getElementById('adminServicesTbody');
  if (!tbody) return;

  tbody.innerHTML = servicesState.map(s => `
    <tr>
      <td><strong>${s.name}</strong></td>
      <td><span class="service-badge" style="margin:0;">${s.category}</span></td>
      <td><strong>${formatCLP(s.price)}</strong></td>
      <td>${s.duration}</td>
      <td>
        <button class="btn btn-admin" style="padding: 4px 10px; font-size:0.775rem; color:#C5221F;" onclick="deleteService('${s.id}')">
          <i class="fas fa-trash"></i> Eliminar
        </button>
      </td>
    </tr>
  `).join('');
}

function handleAddNewService(event) {
  event.preventDefault();
  const name = document.getElementById('newServName').value.trim();
  const category = document.getElementById('newServCategory').value;
  const price = parseInt(document.getElementById('newServPrice').value);
  const duration = document.getElementById('newServDuration').value.trim();
  const desc = document.getElementById('newServDesc').value.trim();

  if (!name || isNaN(price)) return;

  const newItem = {
    id: 's_' + Date.now(),
    category,
    name,
    price,
    duration: duration || '60 min',
    desc: desc || 'Servicio exclusivo de belleza en Musas Salón.',
    badge: null
  };

  servicesState.push(newItem);
  saveData();
  renderServicesAdminTable();
  populateManualBookingServiceSelect();

  document.getElementById('newServName').value = '';
  document.getElementById('newServPrice').value = '';
  document.getElementById('newServDuration').value = '';
  document.getElementById('newServDesc').value = '';

  alert('¡Servicio añadido exitosamente al sitio web público!');
}

function deleteService(serviceId) {
  if (confirm('¿Desea eliminar este servicio del catálogo público?')) {
    servicesState = servicesState.filter(s => s.id !== serviceId);
    saveData();
    renderServicesAdminTable();
    populateManualBookingServiceSelect();
  }
}

// --- Manual Booking Handler ---
function populateManualBookingServiceSelect() {
  const select = document.getElementById('manualBookServiceSelect');
  if (!select) return;

  select.innerHTML = servicesState.map(s => `
    <option value="${s.id}">${s.name} - ${formatCLP(s.price)}</option>
  `).join('');
}

function handleManualBooking(event) {
  event.preventDefault();
  const serviceId = document.getElementById('manualBookServiceSelect').value;
  const date = document.getElementById('manualBookDate').value;
  const time = document.getElementById('manualBookTime').value;
  const clientName = document.getElementById('manualBookClient').value.trim();
  const phone = document.getElementById('manualBookPhone').value.trim();

  const serviceObj = servicesState.find(s => s.id === serviceId) || { name: 'Servicio Musas' };

  const newBooking = {
    id: 'b_' + Date.now(),
    date,
    time,
    clientName,
    phone,
    serviceName: serviceObj.name,
    status: 'confirmada'
  };

  bookingsState.push(newBooking);
  saveData();
  renderChileanCalendar();
  renderBookingsTable();

  alert(`¡Cita agendada para ${clientName} el ${date} a las ${time} hrs!`);
  switchTab('calendar');
}

// --- SUPER ADMIN: Photo Gallery Management ---
function renderGalleryAdminGrid() {
  const grid = document.getElementById('galleryPhotosAdminGrid');
  if (!grid) return;

  grid.innerHTML = galleryState.map(p => `
    <div style="background:#FFF; border:1px solid var(--border-light); border-radius:12px; overflow:hidden; box-shadow:var(--shadow-sm);">
      <img src="${p.url}" alt="${p.title}" style="width:100%; height:160px; object-fit:cover;">
      <div style="padding:12px;">
        <h4 style="font-size:0.9rem; color:var(--primary-dark); margin-bottom:8px;">${p.title}</h4>
        <button class="btn btn-admin" style="width:100%; padding:4px 8px; font-size:0.775rem; color:#C5221F;" onclick="deleteGalleryPhoto('${p.id}')">
          <i class="fas fa-trash"></i> Eliminar Foto
        </button>
      </div>
    </div>
  `).join('');
}

function handleAddGalleryPhoto(event) {
  event.preventDefault();
  const title = document.getElementById('photoTitleInput').value.trim();
  const url = document.getElementById('photoUrlInput').value.trim();

  if (!title || !url) return;

  const newPhoto = { id: 'p_' + Date.now(), title, url };
  galleryState.push(newPhoto);
  saveData();
  renderGalleryAdminGrid();

  document.getElementById('photoTitleInput').value = '';
  document.getElementById('photoUrlInput').value = '';

  alert('¡Foto publicada en la galería del sitio web!');
}

function deleteGalleryPhoto(id) {
  if (confirm('¿Desea eliminar esta imagen de la galería?')) {
    galleryState = galleryState.filter(p => p.id !== id);
    saveData();
    renderGalleryAdminGrid();
  }
}

// --- SUPER ADMIN: User Accounts & Roles Management ---
function renderUsersAdminTable() {
  const tbody = document.getElementById('usersAdminTbody');
  if (!tbody) return;

  tbody.innerHTML = usersState.map(u => `
    <tr>
      <td>
        <strong>${u.name}</strong> ${u.superAdmin ? '<span class="badge-promo" style="font-size:0.65rem;">SUPER ADMIN</span>' : ''}<br>
        <small style="color:var(--text-muted);">${u.email}</small>
      </td>
      <td>
        <select class="form-control" style="padding:4px 8px; font-size:0.8rem;" onchange="changeUserRole('${u.id}', this.value)" ${u.superAdmin ? 'disabled' : ''}>
          <option value="Esteticista & Spa" ${u.role === 'Esteticista & Spa' ? 'selected' : ''}>Esteticista & Spa</option>
          <option value="Peluquera / Estilista" ${u.role === 'Peluquera / Estilista' ? 'selected' : ''}>Peluquera / Estilista</option>
          <option value="Manicurista" ${u.role === 'Manicurista' ? 'selected' : ''}>Manicurista</option>
          <option value="Recepcionista" ${u.role === 'Recepcionista' ? 'selected' : ''}>Recepcionista</option>
          <option value="Administradora" ${u.role === 'Administradora' || u.superAdmin ? 'selected' : ''}>Administradora</option>
        </select>
      </td>
      <td>
        <span class="status-badge status-${u.status === 'aprobado' ? 'confirmada' : (u.status === 'pendiente' ? 'pendiente' : 'atendida')}">
          ${u.status.toUpperCase()}
        </span>
      </td>
      <td>
        <small style="color:var(--text-muted);">
          ${u.status === 'pendiente' ? `⚡ Notificación enviada a ${adminNotificationEmail}` : 'Acceso Autorizado'}
        </small>
      </td>
      <td>
        ${!u.superAdmin ? `
          ${u.status === 'pendiente' ? `
            <button class="btn btn-primary" style="padding:4px 10px; font-size:0.775rem; background:#137333;" onclick="approveUser('${u.id}')">
              <i class="fas fa-check"></i> Aprobar Acceso
            </button>
            <button class="btn btn-outline" style="padding:4px 10px; font-size:0.775rem; color:#C5221F; border-color:#FAD2CF;" onclick="rejectUser('${u.id}')">
              Rechazar
            </button>
          ` : `
            <button class="btn btn-outline" style="padding:4px 10px; font-size:0.775rem;" onclick="toggleUserApproval('${u.id}')">
              ${u.status === 'aprobado' ? 'Pausar Acceso' : 'Reactivar'}
            </button>
          `}
          <button class="btn btn-admin" style="padding:4px 8px; font-size:0.775rem; color:#C5221F;" onclick="deleteUserAccount('${u.id}')">
            <i class="fas fa-trash"></i>
          </button>
        ` : '<span style="color:var(--text-muted); font-size:0.8rem;">Super Admin Principal</span>'}
      </td>
    </tr>
  `).join('');
}

function updatePendingUsersBadge() {
  const count = usersState.filter(u => u.status === 'pendiente').length;
  const badge = document.getElementById('pendingUsersBadgeCount');
  if (badge) {
    if (count > 0) {
      badge.innerText = count;
      badge.style.display = 'inline-block';
    } else {
      badge.style.display = 'none';
    }
  }
}

function approveUser(userId) {
  const u = usersState.find(x => x.id === userId);
  if (!u) return;

  u.status = 'aprobado';
  saveData();
  renderUsersAdminTable();
  updatePendingUsersBadge();
  alert(`¡Acceso APROBADO para ${u.name} (${u.email})! Ahora puede ingresar al panel.`);
}

function rejectUser(userId) {
  const u = usersState.find(x => x.id === userId);
  if (!u) return;

  u.status = 'rechazado';
  saveData();
  renderUsersAdminTable();
  updatePendingUsersBadge();
}

function toggleUserApproval(userId) {
  const u = usersState.find(x => x.id === userId);
  if (!u || u.superAdmin) return;

  u.status = u.status === 'aprobado' ? 'pendiente' : 'aprobado';
  saveData();
  renderUsersAdminTable();
  updatePendingUsersBadge();
}

function changeUserRole(userId, newRole) {
  const u = usersState.find(x => x.id === userId);
  if (!u || u.superAdmin) return;

  u.role = newRole;
  saveData();
}

function deleteUserAccount(userId) {
  const u = usersState.find(x => x.id === userId);
  if (!u || u.superAdmin) return;

  if (confirm(`¿Confirma eliminar definitivamente la cuenta de ${u.name} (${u.email})?`)) {
    usersState = usersState.filter(x => x.id !== userId);
    saveData();
    renderUsersAdminTable();
    updatePendingUsersBadge();
  }
}

// --- SUPER ADMIN: Email Notification Settings ---
function handleUpdateAdminEmail(event) {
  event.preventDefault();
  const newEmail = document.getElementById('configAdminEmailInput').value.trim().toLowerCase();

  if (!newEmail) return;

  adminNotificationEmail = newEmail;
  saveData();
  updateNoticeElements();
  renderUsersAdminTable();

  alert(`¡Correo de Administradora actualizado exitosamente a: ${adminNotificationEmail}!`);
}

function simulateTestNotificationEmail() {
  alert(`📧 [PRUEBA DE NOTIFICACIÓN DE SISTEMA]\n\nPara: ${adminNotificationEmail}\nDe: sistema@musassalon.cl\nAsunto: Nueva Solicitud de Cuenta en Salón Musas\n\nEl sistema de notificaciones está funcionando correctamente. Todas las trabajadoras enviarán su solicitud de aprobación a ${adminNotificationEmail}.`);
}
