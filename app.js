/* ==========================================================================
   Musas Salón de Belleza Spa - Public Client Application (app.js)
   Handles Catalog, Category Filters, Booking Modal & WhatsApp Flow
   ========================================================================== */

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

const DEFAULT_BOOKINGS = [
  { id: 'b101', date: '2026-07-24', time: '11:00', clientName: 'Camila Rojas', phone: '+56 9 7654 3210', serviceName: 'Limpieza Facial Profunda', status: 'confirmada' },
  { id: 'b102', date: '2026-07-25', time: '15:30', clientName: 'Valentina Silva', phone: '+56 9 8765 4321', serviceName: 'Técnica Balayage', status: 'confirmada' },
  { id: 'b103', date: '2026-07-27', time: '10:30', clientName: 'Isadora Fuentes', phone: '+56 9 5432 1098', serviceName: 'Uñas de Acrílico Esculpidas', status: 'pendiente' }
];

// --- State Management ---
let servicesState = JSON.parse(localStorage.getItem('musas_services')) || DEFAULT_SERVICES;
let bookingsState = JSON.parse(localStorage.getItem('musas_bookings')) || DEFAULT_BOOKINGS;

let activeCategory = 'all';

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  renderServicesCatalog();
  populateBookingServiceSelect();
  setupEventListeners();
});

// --- Helper Utilities ---
function formatCLP(amount) {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
}

function saveBookingsState() {
  localStorage.setItem('musas_bookings', JSON.stringify(bookingsState));
}

// --- Public Services Catalog ---
function renderServicesCatalog() {
  const grid = document.getElementById('servicesGrid');
  if (!grid) return;

  const filtered = activeCategory === 'all' 
    ? servicesState 
    : servicesState.filter(s => s.category === activeCategory);

  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">No hay servicios disponibles en esta categoría.</div>`;
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

// --- Client Reservation Modal & WhatsApp Flow ---
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
  saveBookingsState();

  // Create WhatsApp URL for Salon
  const phoneSalón = '56981542607';
  const textMessage = `¡Hola Musas Salón de Belleza Spa! 🌸%0A%0AQuisiera agendar una cita:%0A✨ *Servicio:* ${encodeURIComponent(serviceObj.name)} (${formatCLP(serviceObj.price)})%0A📅 *Fecha:* ${date}%0A⏰ *Hora:* ${time} hrs%0A👤 *Nombre:* ${encodeURIComponent(clientName)}%0A📞 *Teléfono:* ${encodeURIComponent(phone)}%0A%0AQuedo atenta a la confirmación. ¡Muchas gracias!`;

  const waUrl = `https://wa.me/${phoneSalón}?text=${textMessage}`;
  
  closeBookingModal();
  window.open(waUrl, '_blank');
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
