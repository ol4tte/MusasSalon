/* ==========================================================================
   Musas Salón de Belleza Spa - Main Application Script
   Includes Chilean Calendar, Local Storage Manager & WhatsApp Booking
   ========================================================================== */

// --- Default Data Repositories ---
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
let servicesState = JSON.parse(localStorage.getItem('musas_services')) || DEFAULT_SERVICES;
let bookingsState = JSON.parse(localStorage.getItem('musas_bookings')) || DEFAULT_BOOKINGS;

let currentCalendarDate = new Date(); // Defaults to today
let activeCategory = 'all';

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  renderServicesCatalog();
  populateBookingServiceSelect();
  renderChileanCalendar();
  renderBookingsTable();
  renderServicesAdminTable();
  setupEventListeners();
});

// --- Helper Utilities ---
function formatCLP(amount) {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
}

function saveState() {
  localStorage.setItem('musas_services', JSON.stringify(servicesState));
  localStorage.setItem('musas_bookings', JSON.stringify(bookingsState));
}

// --- Public Client View: Services Catalog ---
function renderServicesCatalog() {
  const grid = document.getElementById('servicesGrid');
  if (!grid) return;

  const filtered = activeCategory === 'all' 
    ? servicesState 
    : servicesState.filter(s => s.category === activeCategory);

  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">No hay servicios registrados en esta categoría.</div>`;
    return;
  }

  grid.innerHTML = filtered.map(s => `
    <div class="service-card">
      <div class="service-card-top">
        ${s.badge ? `<span class="service-badge">${s.badge}</span>` : ''}
        <h3 class="service-name">${s.name}</h3>
        <p class="service-desc">${s.desc}</p>
      </div>
      <div class="service-bottom">
        <div class="service-meta">
          <div class="service-price">${formatCLP(s.price)}</div>
          <div class="service-duration"><i class="far fa-clock"></i> ${s.duration}</div>
        </div>
        <button class="btn btn-primary" style="width: 100%; margin-top: 16px;" onclick="openBookingModal('${s.id}')">
          <i class="far fa-calendar-check"></i> Agendar Hora
        </button>
      </div>
    </div>
  `).join('');
}

function filterCategory(cat, btnElement) {
  activeCategory = cat;
  document.querySelectorAll('.category-tabs .tab-btn').forEach(btn => btn.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');
  renderServicesCatalog();
}

// --- Chilean Calendar Logic (Salón Local Admin View) ---
function renderChileanCalendar() {
  const monthTitle = document.getElementById('calendarMonthTitle');
  const daysGrid = document.getElementById('calendarDaysGrid');
  if (!daysGrid) return;

  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  monthTitle.innerText = `${monthNames[month]} ${year}`;
  daysGrid.innerHTML = '';

  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
  const totalDays = new Date(year, month + 1, 0).getDate();

  // Adjust for Monday start (0: Mon, ..., 6: Sun)
  // Standard JS getDay(): 0:Sun, 1:Mon, 2:Tue, 3:Wed, 4:Thu, 5:Fri, 6:Sat
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
    const dayOfWeek = cellDateObj.getDay(); // 0: Sunday, 6: Saturday, 1-5: Mon-Fri

    const dayCell = document.createElement('div');
    dayCell.className = 'calendar-day-cell';

    // Color classification
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

    // Check bookings count for date
    const dayBookings = bookingsState.filter(b => b.date === dateStr);

    dayCell.innerHTML = `
      <div class="day-number-badge">${day}</div>
      ${holidayName ? `<div class="holiday-tag-label"><i class="fas fa-flag"></i> ${holidayName}</div>` : ''}
      ${dayBookings.length > 0 ? `<div class="booking-indicator-badge"><i class="far fa-calendar"></i> ${dayBookings.length} cita(s)</div>` : ''}
    `;

    dayCell.onclick = () => filterBookingsByDate(dateStr);

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

// --- Bookings Table & Actions ---
function renderBookingsTable(filterDate = null) {
  const tbody = document.getElementById('bookingsTableBody');
  if (!tbody) return;

  let list = bookingsState;
  if (filterDate) {
    list = list.filter(b => b.date === filterDate);
  }

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 20px; color: var(--text-muted);">No se encontraron citas para esta selección.</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(b => `
    <tr>
      <td><strong>${b.date}</strong> <br><small class="text-muted">${b.time} hrs</small></td>
      <td><strong>${b.clientName}</strong><br><small>${b.phone}</small></td>
      <td>${b.serviceName}</td>
      <td><span class="status-badge status-${b.status}">${b.status}</span></td>
      <td>
        <button class="btn btn-outline" style="padding: 4px 10px; font-size: 0.8rem;" onclick="changeBookingStatus('${b.id}')">
          <i class="fas fa-sync-alt"></i> Estado
        </button>
        <button class="btn btn-admin" style="padding: 4px 10px; font-size: 0.8rem; color: #C5221F;" onclick="deleteBooking('${b.id}')">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function filterBookingsByDate(dateStr) {
  renderBookingsTable(dateStr);
  const infoSpan = document.getElementById('selectedDateFilterInfo');
  if (infoSpan) infoSpan.innerText = `Filtrando por fecha: ${dateStr}`;
}

function resetBookingDateFilter() {
  renderBookingsTable();
  const infoSpan = document.getElementById('selectedDateFilterInfo');
  if (infoSpan) infoSpan.innerText = `Todas las citas`;
}

function changeBookingStatus(bookingId) {
  const booking = bookingsState.find(b => b.id === bookingId);
  if (!booking) return;

  const nextStatusMap = {
    'pendiente': 'confirmada',
    'confirmada': 'atendida',
    'atendida': 'pendiente'
  };

  booking.status = nextStatusMap[booking.status] || 'confirmada';
  saveState();
  renderBookingsTable();
  renderChileanCalendar();
}

function deleteBooking(bookingId) {
  if (confirm('¿Deseas eliminar esta cita?')) {
    bookingsState = bookingsState.filter(b => b.id !== bookingId);
    saveState();
    renderBookingsTable();
    renderChileanCalendar();
  }
}

// --- Autoadministrable Services Admin ---
function renderServicesAdminTable() {
  const tbody = document.getElementById('servicesAdminTableBody');
  if (!tbody) return;

  tbody.innerHTML = servicesState.map(s => `
    <tr>
      <td><strong>${s.name}</strong></td>
      <td><span class="service-badge" style="margin:0;">${s.category}</span></td>
      <td><strong>${formatCLP(s.price)}</strong></td>
      <td>${s.duration}</td>
      <td>
        <button class="btn btn-admin" style="padding: 4px 10px; font-size: 0.8rem; color: #C5221F;" onclick="deleteService('${s.id}')">
          <i class="fas fa-trash"></i> Eliminar
        </button>
      </td>
    </tr>
  `).join('');
}

function addNewServiceFromAdmin(event) {
  event.preventDefault();
  const name = document.getElementById('newServiceName').value.trim();
  const category = document.getElementById('newServiceCategory').value;
  const price = parseInt(document.getElementById('newServicePrice').value);
  const duration = document.getElementById('newServiceDuration').value.trim();
  const desc = document.getElementById('newServiceDesc').value.trim();

  if (!name || isNaN(price)) return;

  const newService = {
    id: 's_' + Date.now(),
    category,
    name,
    price,
    duration: duration || '60 min',
    desc: desc || 'Servicio profesional de belleza y cuidado en Musas Salón.',
    badge: null
  };

  servicesState.push(newService);
  saveState();
  renderServicesCatalog();
  renderServicesAdminTable();
  populateBookingServiceSelect();

  document.getElementById('addServiceForm').reset();
  alert('¡Servicio agregado con éxito!');
}

function deleteService(serviceId) {
  if (confirm('¿Eliminar este servicio del catálogo?')) {
    servicesState = servicesState.filter(s => s.id !== serviceId);
    saveState();
    renderServicesCatalog();
    renderServicesAdminTable();
    populateBookingServiceSelect();
  }
}

// --- Booking Modal & WhatsApp Booking Flow ---
function populateBookingServiceSelect() {
  const select = document.getElementById('bookingServiceSelect');
  if (!select) return;

  select.innerHTML = servicesState.map(s => `
    <option value="${s.id}">${s.name} - ${formatCLP(s.price)}</option>
  `).join('');
}

function openBookingModal(serviceId = null) {
  const modal = document.getElementById('bookingModal');
  if (!modal) return;

  if (serviceId) {
    const select = document.getElementById('bookingServiceSelect');
    if (select) select.value = serviceId;
  }

  modal.classList.add('active');
}

function closeBookingModal() {
  const modal = document.getElementById('bookingModal');
  if (modal) modal.classList.remove('active');
}

function submitBookingForm(event) {
  event.preventDefault();
  
  const serviceId = document.getElementById('bookingServiceSelect').value;
  const date = document.getElementById('bookingDate').value;
  const time = document.getElementById('bookingTime').value;
  const clientName = document.getElementById('bookingClientName').value.trim();
  const phone = document.getElementById('bookingClientPhone').value.trim();

  const serviceObj = servicesState.find(s => s.id === serviceId) || { name: 'Servicio Musas', price: 0 };

  // Save new booking to system
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
  saveState();
  renderChileanCalendar();
  renderBookingsTable();

  // Create WhatsApp URL
  const phoneSalón = '56981542607';
  const textMessage = `¡Hola Musas Salón de Belleza Spa! 🌸%0A%0AQuisiera confirmar mi reserva:%0A✨ *Servicio:* ${encodeURIComponent(serviceObj.name)} (${formatCLP(serviceObj.price)})%0A📅 *Fecha:* ${date}%0A⏰ *Hora:* ${time} hrs%0A👤 *Nombre:* ${encodeURIComponent(clientName)}%0A📞 *Teléfono:* ${encodeURIComponent(phone)}%0A%0AQuedo atenta a la confirmación. ¡Muchas gracias!`;

  const waUrl = `https://wa.me/${phoneSalón}?text=${textMessage}`;
  
  closeBookingModal();
  window.open(waUrl, '_blank');
}

// --- Admin Section Toggle ---
function toggleAdminView() {
  const adminSec = document.getElementById('adminSection');
  if (!adminSec) return;

  if (adminSec.classList.contains('active')) {
    adminSec.classList.remove('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    const pin = prompt('Ingrese la clave de administración local del salón:', 'musas2026');
    if (pin === 'musas2026') {
      adminSec.classList.add('active');
      adminSec.scrollIntoView({ behavior: 'smooth' });
    } else {
      alert('Clave incorrecta. Acceso denegado.');
    }
  }
}

function switchAdminTab(tabName, btnElement) {
  document.querySelectorAll('.admin-tab-btn').forEach(btn => btn.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');

  const tabCal = document.getElementById('adminTabCalendar');
  const tabServices = document.getElementById('adminTabServices');

  if (tabName === 'calendar') {
    tabCal.style.display = 'block';
    tabServices.style.display = 'none';
  } else {
    tabCal.style.display = 'none';
    tabServices.style.display = 'block';
  }
}

function setupEventListeners() {
  // Mobile Nav Toggle
  const toggleBtn = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    });
  }
}
