// ── SUPABASE CLIENT ──────────────────────────────────────────
const SUPABASE_URL = 'https://glowanhhntkudzsncfmt.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Pr_n8o2I4vaHQD56hYBPKw_BE92Na-c';
const ADMIN_OCCUPATION = 'administrador'; // nombre exacto en la tabla occupation
const STAFF_ROLES = ['piloto','copiloto','asistente de vuelo','chofer'];

// Se inicializa tras cargar el SDK (ver final del script)
let _sb = null;

function getSB() {
  if (!_sb) {
    const { createClient } = window.supabase;
    _sb = createClient(SUPABASE_URL, SUPABASE_KEY);
  }
  return _sb;
}

// ── ESTADO ───────────────────────────────────────────────────
const state = {
  selectedSeat:      null,
  selectedFlight:    null,  // objeto completo del vuelo seleccionado
  pendingBookingId:  null,  // id de flight_booking pendiente
  pendingBSeatId:    null,  // id de booking_seat pendiente
  pendingTrolleyId:  null,  // id de trolley_booking pendiente
  bookingType:       null,  // 'flight' | 'trolleybus'
  timerInterval:     null,
  timerSeconds:      600,
  ticketItems:       [],
  ticketDownloaded:  false,
  currentUser:       null,  // { id_user, id_person, name, lastNames, email, username }
  confirmedBookings: [],    // llenado desde Supabase en renderTicketPage
  _trolleyPrice: 0,
  _trolleyName:  '',
  _trolleyTripId: null,
  _trolleyStop:   '',
  // Admin panel caches
  flightsCache: [],
  routesCache: [],
  tripsCache: [],
  staffCache: [],
  fbCache: [],
  tbCache: [],
  occupations: [],
  stations: [],
  airplanes: [],
  trolleys: [],
  editFlightId: null,
  editStaffId: null,
  tempRouteStops: [],
  crewCache: [],
  currentFlight: null,
  currentFlightBookings: [],
  currentPassengerBookings: [],
  currentTripDetail: null,
  currentTripBookings: [],
};

// ── NAVEGACIÓN ──────────────────────────────────────────────────
const PAGES_WITH_NAV      = ['page-dashboard','page-flights','page-seatmap','page-trolleybus','page-payment','page-ticket'];
const PROTECTED_PAGES     = ['page-dashboard','page-flights','page-seatmap','page-trolleybus','page-payment','page-ticket'];

function requireAuth(pageId) {
  if (PROTECTED_PAGES.includes(pageId) && !state.currentUser) {
    showToast('Debes iniciar sesión para acceder', 'warn');
    go('page-login');
    return false;
  }
  return true;
}

function go(pageId) {
  if (!requireAuth(pageId)) return;

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById(pageId);
  page.classList.add('active');

  if (PAGES_WITH_NAV.includes(pageId)) {
    let existingNav = page.querySelector('nav');
    if (!existingNav) {
      const tpl = document.getElementById('nav-tpl').content.cloneNode(true);
      page.insertBefore(tpl, page.firstChild);
    }
    setTimeout(() => {
      page.querySelectorAll('.nav-links button').forEach(b => b.classList.remove('active'));
      const map = { 'page-dashboard':'nb-dash','page-flights':'nb-flights','page-seatmap':'nb-flights','page-trolleybus':'nb-trolley','page-payment':'nb-dash','page-ticket':'nb-ticket' };
      const activeBtn = page.querySelector('#' + map[pageId]);
      if (activeBtn) activeBtn.classList.add('active');
      const nameEl = page.querySelector('#nav-fullname');
      if (nameEl && state.currentUser) {
        nameEl.textContent = `${state.currentUser.name} ${state.currentUser.lastNames}`;
      }
    }, 0);
  }

  if (pageId === 'page-flights')    loadFlightCities();
  if (pageId === 'page-seatmap')    renderSeatMap();
  if (pageId === 'page-trolleybus') renderRoutes();
  if (pageId === 'page-payment')    initPayment();
  if (pageId === 'page-ticket')     renderTicketPage();

  window.scrollTo(0, 0);
}

// ── HELPERS ──────────────────────────────────────────────────
function togglePw(id, btn) {
  const input = document.getElementById(id);
  const hidden = input.type === 'password';
  input.type = hidden ? 'text' : 'password';
  btn.textContent = hidden ? 'Ocultar' : 'Mostrar';
}

async function hashPassword(plain) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(plain));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}

// ── LOGIN — US-02 ─────────────────────────────────────────────
async function doLogin() {
  const username = document.getElementById('l-user').value.trim();
  const pass     = document.getElementById('l-pass').value;
  let err = false;
  const pathname = window.location.pathname.toLowerCase();
  const isAdminPage = pathname.endsWith('panel-admin.html') || pathname.endsWith('/panel-admin');
  const isStaffPage = pathname.endsWith('panel-staff.html') || pathname.endsWith('/panel-staff');

  ['l-user-err','l-pass-err'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('show');
  });
  ['login-alert','login-ok','login-role-err'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('show');
  });

  if (!username) { document.getElementById('l-user-err').classList.add('show'); err = true; }
  if (!pass)     { document.getElementById('l-pass-err').classList.add('show'); err = true; }
  if (err) return;

  const hashed = await hashPassword(pass);
  const sb = getSB();

  const { data: users, error } = await sb
    .from('users')
    .select('id_person, user_name, password_hash')
    .eq('user_name', username)
    .eq('password_hash', hashed)
    .limit(1);

  if (error || !users || users.length === 0) {
    const alertEl = document.getElementById('login-alert');
    if (alertEl) alertEl.classList.add('show');
    return;
  }

  const u = users[0];
  const { data: person } = await sb
    .from('person')
    .select('name, last_names, email')
    .eq('id_person', u.id_person)
    .single();

  const { data: empRow } = await sb
    .from('employee')
    .select('id_occupation, occupation(name)')
    .eq('id_person', u.id_person)
    .maybeSingle();

  const role = empRow?.occupation?.name?.toLowerCase();
  state.currentUser = {
    id_user:    u.id_person,
    id_person:  u.id_person,
    name:       person?.name       || username,
    lastNames:  person?.last_names || '',
    email:      person?.email      || '',
    username:   u.user_name,
    role:       role || null,
  };

  if (isAdminPage) {
    if (role !== ADMIN_OCCUPATION) {
      const roleErr = document.getElementById('login-role-err');
      if (roleErr) roleErr.classList.add('show');
      return;
    }

    document.getElementById('login-ok').classList.add('show');
    setTimeout(() => {
      document.getElementById('page-login').classList.remove('active');
      document.getElementById('page-dashboard').classList.add('active');
      document.getElementById('sb-name').textContent  = `${state.currentUser.name} ${state.currentUser.lastNames}`;
      document.getElementById('sb-email').textContent = state.currentUser.email;
      loadFlights();
      loadCatalogData();
    }, 900);
    return;
  }

  if (isStaffPage) {
    if (!STAFF_ROLES.includes(role)) {
      const roleErr = document.getElementById('login-role-err');
      if (roleErr) roleErr.classList.add('show');
      return;
    }

    document.getElementById('login-ok').classList.add('show');
    setTimeout(async () => {
      const fullName = `${state.currentUser.name} ${state.currentUser.lastNames}`;
      document.getElementById('page-login')?.classList.remove('active');
      document.getElementById('page-dashboard')?.classList.add('active');
      document.querySelectorAll('#sb-name').forEach(el => el.textContent = fullName);
      document.querySelectorAll('#sb-role').forEach(el => el.textContent = role ? role.replace(/\b\w/g, c => c.toUpperCase()) : '');
      buildStaffSidebar(role);
      await initStaffDashboard();
    }, 900);
    return;
  }

  if (role === ADMIN_OCCUPATION) {
    document.getElementById('login-ok').classList.add('show');
    setTimeout(() => { window.location.href = 'panel-admin.html'; }, 900);
    return;
  }

  if (STAFF_ROLES.includes(role)) {
    document.getElementById('login-ok').classList.add('show');
    setTimeout(async () => {
      const onStaffPage = window.location.pathname.endsWith('panel-staff.html') || window.location.pathname.endsWith('/panel-staff');
      const fullName = `${state.currentUser.name} ${state.currentUser.lastNames}`;
      if (onStaffPage) {
        document.getElementById('page-login')?.classList.remove('active');
        document.getElementById('page-dashboard')?.classList.add('active');
        document.querySelectorAll('#sb-name').forEach(el => el.textContent = fullName);
        document.querySelectorAll('#sb-role').forEach(el => el.textContent = role ? role.replace(/\b\w/g, c => c.toUpperCase()) : '');
        buildStaffSidebar(role);
        await initStaffDashboard();
      } else {
        window.location.href = 'panel-staff.html';
      }
    }, 900);
    return;
  }

  document.getElementById('login-ok').classList.add('show');
  setTimeout(() => {
    document.querySelectorAll('#nav-fullname').forEach(el => {
      el.textContent = `${state.currentUser.name} ${state.currentUser.lastNames}`;
    });
    go('page-dashboard');
  }, 1000);
}

// ── LOGOUT — US-03 ────────────────────────────────────────────
function doLogout() {
  state.currentUser       = null;
  state.confirmedBookings = [];
  state.ticketItems       = [];
  state.ticketDownloaded  = false;
  state.pendingBookingId  = null;
  state.pendingBSeatId    = null;
  state.pendingTrolleyId  = null;
  state.currentFlight      = null;
  state.currentFlightBookings = [];
  state.currentPassengerBookings = [];
  state.currentTripDetail  = null;
  state.currentTripBookings = [];
  if (state.timerInterval) clearInterval(state.timerInterval);
  document.querySelectorAll('.page nav').forEach(n => n.remove());
  go('page-login');
}

function buildStaffSidebar(role) {
  const nav = document.getElementById('sidebar-nav');
  if (!nav) return;
  const sections = [];
  if (['piloto','copiloto'].includes(role)) {
    sections.push({ id:'s-flights', label:'Mis vuelos' });
  }
  if (role === 'asistente de vuelo') {
    sections.push({ id:'s-passengers', label:'Pasajeros' });
    sections.push({ id:'s-incidents', label:'Incidentes' });
  }
  if (role === 'chofer') {
    sections.push({ id:'s-trips', label:'Viajes del día' });
  }
  nav.innerHTML = sections.map(item => `
    <button type="button" class="sidebar-btn" data-section="${item.id}" onclick="showSection('${item.id}')">
      <span class="sb-icon">•</span>${item.label}
    </button>
  `).join('');
  nav.querySelector('button')?.classList.add('active');
}

async function initStaffDashboard() {
  const role = state.currentUser?.role;
  if (!role) return;
  state.currentTripDetail = null;
  if (['piloto','copiloto'].includes(role)) {
    await loadStaffFlights();
    showSection('s-flights');
    return;
  }
  if (role === 'asistente de vuelo') {
    await loadAttendantFlight();
    showSection('s-passengers');
    return;
  }
  if (role === 'chofer') {
    const tripDateFilter = document.getElementById('trip-date-filter');
    if (tripDateFilter && !tripDateFilter.value) {
      tripDateFilter.value = new Date().toISOString().split('T')[0];
    }
    await loadDriverTrips();
    showSection('s-trips');
  }
}

function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  const section = document.getElementById(id);
  if (!section) return;
  section.classList.add('active');
  document.querySelectorAll('.sidebar-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.section === id));

  const isAdminDashboard = !!document.getElementById('flights-tbody');
  const isStaffDashboard = !!document.getElementById('flights-list');

  if (id === 's-flights') {
    if (isAdminDashboard) loadFlights();
    else if (isStaffDashboard) loadStaffFlights();
  }
  if (id === 's-routes') {
    loadRoutes();
    if (document.getElementById('tab-trips')?.classList.contains('active')) loadTrips();
  }
  if (id === 's-staff') loadStaff();
  if (id === 's-bookings') {
    loadFBookings();
    if (document.getElementById('tab-tbookings')?.classList.contains('active')) loadTBookings();
  }
  if (id === 's-reports') loadReports();
  if (id === 's-manifest') loadManifest();
  if (id === 's-passengers') loadPassengers();
  if (id === 's-incidents') loadIncidents();
  if (id === 's-trips') {
    if (isStaffDashboard) loadDriverTrips();
  }
}

function switchTab(group, tabId) {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    const onclick = btn.getAttribute('onclick') || '';
    btn.classList.toggle('active', onclick.includes(`switchTab('${group}','${tabId}')`));
  });

  document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
  const activePanel = document.getElementById(tabId);
  if (activePanel) activePanel.classList.add('active');

  if (tabId === 'tab-routes') loadRoutes();
  if (tabId === 'tab-trips') loadTrips();
  if (tabId === 'tab-fbookings') loadFBookings();
  if (tabId === 'tab-tbookings') loadTBookings();
}

function renderFlightItems(flights) {
  if (!flights || flights.length === 0) {
    return '<div class="loading-msg" style="color:var(--muted)">No hay vuelos asignados.</div>';
  }
  return flights.map(f => {
    const statusLabel = f.status ? f.status.replace('_', ' ') : '—';
    return `
      <div class="flight-item" onclick="openManifest(${f.id_flight})">
        <div class="fi-header">
          <div>
            <div class="fi-number">${f.flight_number}</div>
            <div class="fi-route">${f.origin_city} → ${f.destination_city}</div>
          </div>
          <div class="fi-badge">${statusLabel}</div>
        </div>
        <div class="fi-meta">
          <span>${fmtDate(f.flight_date)}</span>
          <span>${f.departure_time?.slice(0,5) || '—'} → ${f.arrival_time?.slice(0,5) || '—'}</span>
          <span>${fmtMXN(f.base_price || 0)}</span>
        </div>
      </div>`;
  }).join('');
}

async function loadStaffFlights() {
  const list = document.getElementById('flights-list');
  if (!list) return;
  list.innerHTML = '<div class="loading-msg"><span class="spinner"></span> Cargando vuelos...</div>';
  const userId = state.currentUser?.id_person;
  const role = state.currentUser?.role;
  if (!userId || !role) {
    list.innerHTML = '<div class="loading-msg" style="color:var(--muted)">Usuario no identificado.</div>';
    return;
  }
  const field = role === 'piloto' ? 'id_pilot' : role === 'copiloto' ? 'id_copilot' : role === 'asistente de vuelo' ? 'id_attendant' : null;
  if (!field) {
    list.innerHTML = '<div class="loading-msg" style="color:var(--muted)">No hay vuelos para este rol.</div>';
    return;
  }
  const { data, error } = await getSB()
    .from('flight')
    .select('id_flight, flight_number, origin_city, destination_city, flight_date, departure_time, arrival_time, base_price, status')
    .eq(field, userId)
    .order('flight_date', { ascending: true });
  if (error || !data || data.length === 0) {
    list.innerHTML = '<div class="loading-msg" style="color:var(--muted)">No hay vuelos asignados.</div>';
    state.flightsCache = [];
    return;
  }
  state.flightsCache = data;
  list.innerHTML = renderFlightItems(data);
}

async function openManifest(idFlight) {
  const flight = state.flightsCache.find(f => f.id_flight === idFlight) || null;
  if (flight) {
    state.currentFlight = flight;
  } else {
    const { data, error } = await getSB()
      .from('flight')
      .select('id_flight, flight_number, origin_city, destination_city, flight_date, departure_time, arrival_time, base_price, status')
      .eq('id_flight', idFlight)
      .single();
    if (error || !data) {
      showToast('No se pudo cargar el vuelo seleccionado', 'err');
      return;
    }
    state.currentFlight = data;
  }
  await loadManifest();
  showSection('s-manifest');
}

async function loadManifest() {
  const flight = state.currentFlight;
  if (!flight) return;
  document.getElementById('manifest-title').textContent = `Manifiesto de Pasajeros`;
  document.getElementById('manifest-sub').textContent = `${fmtDate(flight.flight_date)} · ${flight.departure_time?.slice(0,5) || '—'} → ${flight.arrival_time?.slice(0,5) || '—'}`;
  const detailCard = document.getElementById('flight-detail-card');
  if (detailCard) {
    detailCard.innerHTML = `
      <div class="card-title">${flight.flight_number} · ${flight.origin_city} → ${flight.destination_city}</div>
      <div class="card-sub">${fmtDate(flight.flight_date)} · ${flight.departure_time?.slice(0,5) || '—'} → ${flight.arrival_time?.slice(0,5) || '—'}</div>
      <div class="detail-row"><div class="detail-label">Precio</div><div class="detail-val">${fmtMXN(flight.base_price || 0)}</div></div>
      <div class="detail-row"><div class="detail-label">Estado</div><div class="detail-val">${flight.status || '—'}</div></div>
    `;
  }

  const statusControls = document.getElementById('status-controls');
  const statusButtons = document.getElementById('status-buttons');
  if (state.currentUser?.role === 'piloto') {
    if (statusControls) statusControls.style.display = '';
    if (statusButtons) {
      statusButtons.innerHTML = ['scheduled','departed','cancelled'].map(s => `<button class="btn-status" onclick="updateFlightStatus(${flight.id_flight}, '${s}')">${s.replace('_',' ')}</button>`).join('');
    }
  } else if (statusControls) {
    statusControls.style.display = 'none';
  }

  const { data, error } = await getSB()
    .from('flight_booking')
    .select('id_booking, status, users(id_person, person(name, last_names)), booking_seat(seat_number,status)')
    .eq('id_flight', flight.id_flight)
    .order('booking_date', { ascending: true });

  const bookings = data || [];
  state.currentFlightBookings = bookings;

  const statsContainer = document.getElementById('manifest-stats');
  if (statsContainer) {
    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    const pending = bookings.filter(b => b.status === 'pending').length;
    statsContainer.innerHTML = `
      <div class="stat-card"><div class="stat-label">Total pasajeros</div><div class="stat-val">${bookings.length}</div></div>
      <div class="stat-card"><div class="stat-label">Confirmados</div><div class="stat-val">${confirmed}</div></div>
      <div class="stat-card"><div class="stat-label">Pendientes</div><div class="stat-val">${pending}</div></div>
    `;
  }

  const tbody = document.getElementById('manifest-tbody');
  if (tbody) {
    tbody.innerHTML = bookings.length > 0 ? bookings.map((b, idx) => {
      const name = b.users?.person ? `${b.users.person.name} ${b.users.person.last_names}` : 'Pasajero desconocido';
      const seat = b.booking_seat?.[0]?.seat_number || '—';
      return `<tr>
        <td>${idx + 1}</td>
        <td>${name}</td>
        <td>${seat}</td>
        <td>${badgeFor(b.status)}</td>
      </tr>`;
    }).join('') : '<tr><td colspan="4" class="empty-row">No hay pasajeros en este vuelo</td></tr>';
  }
}

async function updateFlightStatus(flightId, status) {
  const { error } = await getSB().from('flight').update({ status }).eq('id_flight', flightId);
  if (error) {
    showToast('No se pudo actualizar el estado del vuelo', 'err');
    return;
  }
  showToast('Estado del vuelo actualizado', 'ok');
  await loadManifest();
}

async function loadAttendantFlight() {
  const card = document.getElementById('attendant-flight-card');
  if (!card) return;
  const userId = state.currentUser?.id_person;
  if (!userId) {
    card.innerHTML = '<div class="loading-msg" style="color:var(--muted)">Usuario no identificado.</div>';
    return;
  }
  card.innerHTML = '<div class="loading-msg"><span class="spinner"></span> Cargando vuelo asignado...</div>';
  const { data, error } = await getSB()
    .from('flight')
    .select('id_flight, flight_number, origin_city, destination_city, flight_date, departure_time, arrival_time, base_price, status')
    .eq('id_attendant', userId)
    .order('flight_date', { ascending: true });
  if (error || !data || data.length === 0) {
    card.innerHTML = '<div class="loading-msg" style="color:var(--muted)">No hay vuelos asignados.</div>';
    state.flightsCache = [];
    return;
  }
  state.flightsCache = data;
  if (data.length === 1) {
    state.currentFlight = data[0];
    card.innerHTML = `
      <div class="card-title">Vuelo asignado</div>
      <div class="card-sub">${data[0].flight_number} · ${data[0].origin_city} → ${data[0].destination_city}</div>
    `;
    await loadPassengers();
    return;
  }
  card.innerHTML = `
    <div class="fg">
      <label>Selecciona vuelo</label>
      <select id="attendant-flight-select">
        <option value="">— Selecciona vuelo —</option>
        ${data.map(f => `<option value="${f.id_flight}">${fmtDate(f.flight_date)} · ${f.flight_number} · ${f.origin_city} → ${f.destination_city}</option>`).join('')}
      </select>
    </div>
    <button class="btn btn-primary btn-sm" onclick="chooseAttendantFlight()">Ver vuelo</button>
  `;
}

function chooseAttendantFlight() {
  const select = document.getElementById('attendant-flight-select');
  if (!select) return;
  const flightId = Number(select.value);
  const flight = state.flightsCache.find(f => f.id_flight === flightId);
  if (!flight) return;
  state.currentFlight = flight;
  loadPassengers();
}

async function loadPassengers() {
  const flight = state.currentFlight;
  if (!flight) return;
  const seatMapCard = document.getElementById('seat-map-card');
  const tableCard = document.getElementById('passengers-table-card');
  if (seatMapCard) seatMapCard.style.display = '';
  if (tableCard) tableCard.style.display = '';
  const { data, error } = await getSB()
    .from('flight_booking')
    .select('id_booking, status, users(id_person, person(name, last_names)), booking_seat(seat_number,status)')
    .eq('id_flight', flight.id_flight)
    .order('booking_date', { ascending: true });
  if (error) {
    showToast('Error al cargar pasajeros', 'err');
    return;
  }
  const bookings = data || [];
  state.currentPassengerBookings = bookings;
  renderReadOnlySeatMap();
  const tbody = document.getElementById('passengers-tbody');
  if (!tbody) return;
  tbody.innerHTML = bookings.length > 0 ? bookings.map((b, idx) => {
    const name = b.users?.person ? `${b.users.person.name} ${b.users.person.last_names}` : 'Pasajero desconocido';
    const seat = b.booking_seat?.[0]?.seat_number || '—';
    return `<tr><td>${idx + 1}</td><td>${name}</td><td>${seat}</td></tr>`;
  }).join('') : '<tr><td colspan="3" class="empty-row">No hay pasajeros confirmados</td></tr>';
}

function renderReadOnlySeatMap() {
  const container = document.getElementById('seat-map-container');
  if (!container) return;
  const bookings = state.currentPassengerBookings || [];
  const occupied = new Set(bookings.flatMap(b => (b.booking_seat || []).map(s => String(s.seat_number))));
  const rows = 12;
  const cols = 6;
  let html = '<div class="seat-grid">';
  for (let r = 0; r < rows; r++) {
    html += '<div class="seat-row">';
    for (let c = 1; c <= cols; c++) {
      const seatNumber = String(r * cols + c);
      const isOccupied = occupied.has(seatNumber);
      html += `<button class="seat ${isOccupied ? 'oc' : 'av' }" disabled>${seatNumber}</button>`;
    }
    html += '</div>';
  }
  html += '</div>';
  container.innerHTML = html;
}

async function loadIncidents() {
  const flight = state.currentFlight;
  const info = document.getElementById('incident-flight-info');
  const tbody = document.getElementById('incidents-tbody');
  if (!info || !tbody) return;
  if (!flight) {
    info.innerHTML = '<div class="loading-msg" style="color:var(--muted)">Selecciona un vuelo para registrar incidentes.</div>';
    tbody.innerHTML = '<tr><td colspan="3" class="empty-row">No hay vuelo seleccionado</td></tr>';
    return;
  }
  info.innerHTML = `
    <div class="card-title">${flight.flight_number} · ${flight.origin_city} → ${flight.destination_city}</div>
    <div class="card-sub">${fmtDate(flight.flight_date)}</div>
  `;
  const { data, error } = await getSB()
    .from('incident')
    .select('incident_type, description, created_at')
    .eq('id_flight', flight.id_flight)
    .order('created_at', { ascending: false });
  if (error || !data || data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3" class="empty-row">No se encontraron incidentes registrados</td></tr>';
    return;
  }
  tbody.innerHTML = data.map(incident => `
    <tr>
      <td>${incident.incident_type}</td>
      <td>${incident.description}</td>
      <td>${fmtDateTime(incident.created_at)}</td>
    </tr>
  `).join('');
}

async function saveIncident() {
  const flight = state.currentFlight;
  const type = document.getElementById('inc-type')?.value;
  const desc = document.getElementById('inc-desc')?.value.trim();
  ['inc-type-err','inc-desc-err'].forEach(id => document.getElementById(id)?.classList.remove('show'));
  if (!type) { document.getElementById('inc-type-err')?.classList.add('show'); }
  if (!desc) { document.getElementById('inc-desc-err')?.classList.add('show'); }
  if (!type || !desc || !flight) return;
  const { error } = await getSB().from('incident').insert({
    id_flight: flight.id_flight,
    incident_type: type,
    description: desc,
    id_person: state.currentUser?.id_person,
    created_at: new Date().toISOString(),
  });
  if (error) {
    showToast('Error al registrar el incidente', 'err');
    return;
  }
  document.getElementById('inc-type').value = '';
  document.getElementById('inc-desc').value = '';
  showToast('Incidente registrado', 'ok');
  await loadIncidents();
}

async function loadDriverTrips() {
  const list = document.getElementById('trips-list');
  if (!list) return;
  list.innerHTML = '<div class="loading-msg"><span class="spinner"></span> Cargando viajes...</div>';
  const userId = state.currentUser?.id_person;
  if (!userId) {
    list.innerHTML = '<div class="loading-msg" style="color:var(--muted)">Usuario no identificado.</div>';
    return;
  }
  const dateFilter = document.getElementById('trip-date-filter')?.value;
  let query = getSB()
    .from('trolley_trip')
    .select('id_trip, trip_date, departure_time, arrival_time, status, base_price, trolley(plate_number), trolley_route_schedule(route(route_name))')
    .eq('id_driver', userId)
    .order('trip_date', { ascending: true });
  if (dateFilter) query = query.eq('trip_date', dateFilter);
  const { data, error } = await query;
  if (error || !data || data.length === 0) {
    list.innerHTML = '<div class="loading-msg" style="color:var(--muted)">No hay viajes registrados.</div>';
    state.currentTripBookings = [];
    return;
  }
  state.currentTripBookings = data;
  list.innerHTML = data.map(trip => {
    const routeName = trip.trolley_route_schedule?.route?.route_name || 'Viaje';
    const plate = trip.trolley?.plate_number || '—';
    return `
      <div class="flight-item" onclick="openTripDetail(${trip.id_trip})">
        <div class="fi-header">
          <div>
            <div class="fi-number">${routeName}</div>
            <div class="fi-route">Unidad ${plate}</div>
          </div>
          <div class="fi-badge">${trip.status || '—'}</div>
        </div>
        <div class="fi-meta">
          <span>${fmtDate(trip.trip_date)}</span>
          <span>${trip.departure_time?.slice(0,5) || '—'} → ${trip.arrival_time?.slice(0,5) || '—'}</span>
          <span>${fmtMXN(trip.base_price || 0)}</span>
        </div>
      </div>`;
  }).join('');
}

async function openTripDetail(tripId) {
  const { data: trip, error: tripError } = await getSB()
    .from('trolley_trip')
    .select('id_trip, trip_date, departure_time, arrival_time, status, base_price, trolley(plate_number), trolley_route_schedule(route(route_name))')
    .eq('id_trip', tripId)
    .single();
  if (tripError || !trip) {
    showToast('No se pudo cargar el viaje seleccionado', 'err');
    return;
  }
  const { data: bookings, error: bookingError } = await getSB()
    .from('trolley_booking')
    .select('id_booking, status, users(id_person, person(name, last_names)), route_stop!trolley_booking_boarding_stop_id_fkey(station_name)')
    .eq('id_trip', tripId)
    .order('booking_date', { ascending: true });
  if (bookingError) {
    showToast('No se pudieron cargar los pasajeros del viaje', 'err');
    return;
  }
  state.currentTripDetail = { trip, bookings: bookings || [] };
  const detailCard = document.getElementById('trip-detail-card');
  if (detailCard) {
    const routeName = trip.trolley_route_schedule?.route?.route_name || 'Viaje asignado';
    detailCard.innerHTML = `
      <div class="card-title">${routeName}</div>
      <div class="card-sub">Unidad ${trip.trolley?.plate_number || '—'}</div>
      <div class="detail-row"><div class="detail-label">Fecha</div><div class="detail-val">${fmtDate(trip.trip_date)}</div></div>
      <div class="detail-row"><div class="detail-label">Horario</div><div class="detail-val">${trip.departure_time?.slice(0,5) || '—'} → ${trip.arrival_time?.slice(0,5) || '—'}</div></div>
      <div class="detail-row"><div class="detail-label">Precio</div><div class="detail-val">${fmtMXN(trip.base_price || 0)}</div></div>
      <div class="detail-row"><div class="detail-label">Estado</div><div class="detail-val">${trip.status || '—'}</div></div>
    `;
  }
  const buttons = document.getElementById('trip-status-buttons');
  if (buttons) {
    buttons.innerHTML = ['scheduled','in_progress','completed','cancelled'].map(status => `
      <button class="btn-status" onclick="updateTripStatus(${tripId}, '${status}')">${status.replace('_',' ')}</button>
    `).join('');
  }
  const tbody = document.getElementById('trip-pax-tbody');
  if (tbody) {
    tbody.innerHTML = (bookings || []).length > 0 ? bookings.map((b, idx) => {
      const name = b.users?.person ? `${b.users.person.name} ${b.users.person.last_names}` : 'Pasajero desconocido';
      const stop = b.route_stop?.station_name || '—';
      return `<tr><td>${idx + 1}</td><td>${name}</td><td>${stop}</td><td>${badgeFor(b.status)}</td></tr>`;
    }).join('') : '<tr><td colspan="4" class="empty-row">No hay pasajeros registrados</td></tr>';
  }
  showSection('s-trip-detail');
}

async function updateTripStatus(tripId, status) {
  const { error } = await getSB().from('trolley_trip').update({ status }).eq('id_trip', tripId);
  if (error) {
    showToast('No se pudo actualizar el estado del viaje', 'err');
    return;
  }
  showToast('Estado del viaje actualizado', 'ok');
  await loadDriverTrips();
  if (state.currentTripDetail?.trip?.id_trip === tripId) {
    await openTripDetail(tripId);
  }
}

function filterFlights() {
  const query = document.getElementById('fl-search')?.value.toLowerCase() || '';
  const status = document.getElementById('fl-filter')?.value || '';
  const filtered = (state.flightsCache || []).filter(f => {
    const text = `${f.flight_number} ${f.origin_city} ${f.destination_city}`.toLowerCase();
    return (!query || text.includes(query)) && (!status || f.status === status);
  });
  const list = document.getElementById('flights-list');
  if (!list) return;
  list.innerHTML = renderFlightItems(filtered);
}

function filterManifest() {
  const query = document.getElementById('manifest-search')?.value.toLowerCase() || '';
  document.querySelectorAll('#manifest-tbody tr').forEach(row => {
    row.style.display = !query || row.textContent.toLowerCase().includes(query) ? '' : 'none';
  });
}

function filterPassengers() {
  const query = document.getElementById('pax-search')?.value.toLowerCase() || '';
  document.querySelectorAll('#passengers-tbody tr').forEach(row => {
    row.style.display = !query || row.textContent.toLowerCase().includes(query) ? '' : 'none';
  });
}

// ── REGISTRO — US-01 ─────────────────────────────────────────
async function doRegister() {
  const name      = document.getElementById('r-name').value.trim();
  const lastnames = document.getElementById('r-lastnames').value.trim();
  const curp      = document.getElementById('r-curp').value.trim().toUpperCase();
  const birth     = document.getElementById('r-birth').value;
  const email     = document.getElementById('r-email').value.trim().toLowerCase();
  const username  = document.getElementById('r-username').value.trim();
  const pass      = document.getElementById('r-pass').value;
  const conf      = document.getElementById('r-conf').value;
  let err = false;

  ['r-name-err','r-lastnames-err','r-curp-err','r-birth-err',
   'r-email-err','r-username-err','r-pass-err','r-conf-err'].forEach(id => {
    document.getElementById(id).classList.remove('show');
  });
  ['reg-ok','reg-dup-email','reg-dup-user','reg-dup-curp'].forEach(id => {
    document.getElementById(id).classList.remove('show');
  });

  if (!name)      { document.getElementById('r-name-err').classList.add('show'); err = true; }
  if (!lastnames) { document.getElementById('r-lastnames-err').classList.add('show'); err = true; }
  if (!curp || curp.length !== 18) {
    document.getElementById('r-curp-err').textContent = !curp ? 'La CURP es obligatoria' : 'La CURP debe tener exactamente 18 caracteres';
    document.getElementById('r-curp-err').classList.add('show'); err = true;
  }
  if (!birth)    { document.getElementById('r-birth-err').classList.add('show'); err = true; }
  if (!email)    { document.getElementById('r-email-err').classList.add('show'); err = true; }
  if (!username) { document.getElementById('r-username-err').classList.add('show'); err = true; }
  if (!pass)     { document.getElementById('r-pass-err').classList.add('show'); err = true; }
  if (!conf)     { document.getElementById('r-conf-err').classList.add('show'); err = true; }
  if (err) return;

  if (pass !== conf) {
    document.getElementById('r-conf-err').textContent = 'Las contraseñas no coinciden';
    document.getElementById('r-conf-err').classList.add('show'); return;
  }
  if (pass.length < 6) {
    document.getElementById('r-pass-err').textContent = 'Mínimo 6 caracteres';
    document.getElementById('r-pass-err').classList.add('show'); return;
  }

  const sb = getSB();

  const { data: dupEmailRow }    = await sb.from('person').select('id_person').eq('email', email).maybeSingle();
  const { data: dupUsernameRow } = await sb.from('users').select('id_person').eq('user_name', username).maybeSingle();
  const { data: dupCurpRow }     = await sb.from('person').select('id_person').eq('curp', curp).maybeSingle();

  if (dupEmailRow)    { document.getElementById('reg-dup-email').classList.add('show'); return; }
  if (dupUsernameRow) { document.getElementById('reg-dup-user').classList.add('show'); return; }
  if (dupCurpRow)     { document.getElementById('reg-dup-curp').classList.add('show'); return; }

  const { data: newPerson, error: personErr } = await sb
    .from('person')
    .insert({ name, last_names: lastnames, curp, birth_date: birth, email })
    .select('id_person')
    .single();

  if (personErr) { showToast('Error al crear la cuenta: ' + personErr.message, 'err'); return; }

  const hashed = await hashPassword(pass);
  const { error: userErr } = await sb
    .from('users')
    .insert({ id_person: newPerson.id_person, user_name: username, password_hash: hashed });

  if (userErr) {
    await sb.from('person').delete().eq('id_person', newPerson.id_person);
    showToast('Error al guardar credenciales: ' + userErr.message, 'err'); return;
  }

  document.getElementById('reg-ok').classList.add('show');
  setTimeout(() => {
    go('page-login');
    const loginUser = document.getElementById('l-user');
    if (loginUser) loginUser.value = username;
  }, 2000);
}

// ── CARGAR CIUDADES EN SELECTS ────────────────────────────────
async function loadFlightCities() {
  const sb = getSB();
  const { data, error } = await sb
    .from('flight')
    .select('origin_city, destination_city')
    .eq('status', 'scheduled');

  if (error || !data) return;

  const origins = [...new Set(data.map(f => f.origin_city))].sort();
  const dests   = [...new Set(data.map(f => f.destination_city))].sort();

  const oriSel  = document.getElementById('f-ori');
  const destSel = document.getElementById('f-dest');
  if (!oriSel || !destSel) return;

  oriSel.innerHTML  = '<option value="">— Cualquier origen —</option>'  + origins.map(c => `<option value="${c}">${c}</option>`).join('');
  destSel.innerHTML = '<option value="">— Cualquier destino —</option>' + dests.map(c => `<option value="${c}">${c}</option>`).join('');
}

// ── BÚSQUEDA DE VUELOS ────────────────────────────────────────
async function searchFlights() {
  const ori  = document.getElementById('f-ori').value.trim();
  const dest = document.getElementById('f-dest').value.trim();
  const date = document.getElementById('f-date').value;

  ['f-ori-err','f-dest-err','f-date-err'].forEach(id => document.getElementById(id).classList.remove('show'));
  if (!ori && !dest && !date) {
    document.getElementById('f-ori-err').classList.add('show');
    document.getElementById('f-dest-err').classList.add('show');
    document.getElementById('f-date-err').classList.add('show');
    return;
  }

  const results = document.getElementById('flight-results');
  results.innerHTML = '<div style="color:var(--muted);font-size:.84rem;padding:20px;text-align:center">🔍 Buscando vuelos...</div>';

  const sb = getSB();
  let query = sb
    .from('flight')
    .select('id_flight, flight_number, flight_name, origin_city, destination_city, flight_date, departure_time, arrival_time, base_price, status, id_airplane')
    .eq('status', 'scheduled');

  if (date) query = query.eq('flight_date', date);
  if (ori)  query = query.ilike('origin_city', `%${ori}%`);
  if (dest) query = query.ilike('destination_city', `%${dest}%`);

  const { data: flights, error } = await query;

  if (error) {
    results.innerHTML = `<div style="color:var(--red);padding:20px;text-align:center">Error al buscar vuelos: ${error.message}</div>`;
    return;
  }

  if (!flights || flights.length === 0) {
    const filtros = [ori && `origen: ${ori}`, dest && `destino: ${dest}`, date && `fecha: ${date}`].filter(Boolean).join(', ');
    results.innerHTML = `<div style="text-align:center;padding:60px 20px;color:var(--muted)">
      <div style="font-size:3rem;margin-bottom:14px;opacity:.35">✈</div>
      <div style="font-size:1.1rem;margin-bottom:6px;color:var(--white)">Sin vuelos disponibles</div>
      <div style="font-size:.84rem">No hay vuelos para: <strong>${filtros}</strong></div>
    </div>`;
    return;
  }

  results.innerHTML = `<div style="color:var(--muted);font-size:.84rem;margin-bottom:20px">${flights.length} vuelo(s) encontrado(s)</div>`;

  flights.forEach(f => {
    const dep = f.departure_time ? f.departure_time.slice(0,5) : '—';
    const arr = f.arrival_time   ? f.arrival_time.slice(0,5)   : '—';
    const div = document.createElement('div');
    div.className = 'flight-card';
    div.innerHTML = `
      <div><div class="fc-city">${f.origin_city}</div><div class="fc-time">${dep} · ${f.flight_number}</div></div>
      <div class="fc-arrow">✈ ───</div>
      <div><div class="fc-city">${f.destination_city}</div><div class="fc-time">${arr}</div></div>
      <div class="fc-badge">Disponible</div>
      <div class="fc-price">
        <div class="fc-price-label">desde</div>
        <div class="fc-price-num">$${Number(f.base_price).toLocaleString('es-MX')}</div>
        <div style="font-size:.68rem;color:var(--muted)">MXN</div>
      </div>`;
    div.onclick = () => selectFlight({
      id:       f.id_flight,
      num:      f.flight_number,
      origin:   f.origin_city,
      dest:     f.destination_city,
      date:     f.flight_date,
      dep,
      arr,
      price:    f.base_price,
      capacity: 72,
    });
    results.appendChild(div);
  });
}

function selectFlight(f) {
  state.selectedFlight = f;
  document.getElementById('sm-flight-title').textContent = `${f.num} · ${f.origin} → ${f.dest}`;
  document.getElementById('sm-flight-date').textContent = f.date;
  go('page-seatmap');
}

// ── MAPA DE ASIENTOS ──────────────────────────────────────────
async function renderSeatMap() {
  const container = document.getElementById('seat-grid-container');
  if (!container) return;
  container.innerHTML = '<div style="color:var(--muted);font-size:.84rem;padding:20px;text-align:center">Cargando asientos...</div>';

  const f = state.selectedFlight;
  if (!f) { container.innerHTML = '<div style="color:var(--red);padding:20px">Error: no hay vuelo seleccionado</div>'; return; }

  const sb = getSB();
  const { data: bookedSeats, error } = await sb
    .from('booking_seat')
    .select('seat_number, status')
    .eq('id_flight', f.id)
    .in('status', ['pending', 'confirmed']);

  if (error) {
    container.innerHTML = `<div style="color:var(--red);padding:20px">Error al cargar asientos: ${error.message}</div>`;
    return;
  }

  const occupied = new Set((bookedSeats || []).map(s => s.seat_number));
  const cols = ['A','B','C','D','E','F'];
  const capacity = f.capacity || 72;
  const rows = Math.min(Math.ceil(capacity / cols.length), 20);

  let html = '<div class="seat-grid">';
  html += '<div class="seat-row"><span class="row-lbl"></span>';
  ['A','B','C'].forEach(c => { html += `<span style="width:36px;text-align:center;font-size:.65rem;color:var(--muted)">${c}</span>`; });
  html += '<span class="aisle"></span>';
  ['D','E','F'].forEach(c => { html += `<span style="width:36px;text-align:center;font-size:.65rem;color:var(--muted)">${c}</span>`; });
  html += '</div>';

  for (let r = 1; r <= rows; r++) {
    html += `<div class="seat-row"><span class="row-lbl">${r}</span>`;
    ['A','B','C'].forEach(col => {
      const lbl = `${r}${col}`;
      const cls = occupied.has(lbl) ? 'oc' : 'av';
      html += `<button class="seat ${cls}" data-seat="${lbl}" title="Asiento ${lbl}" onclick="pickSeat(this,'${lbl}')">${lbl}</button>`;
    });
    html += '<span class="aisle"></span>';
    ['D','E','F'].forEach(col => {
      const lbl = `${r}${col}`;
      const cls = occupied.has(lbl) ? 'oc' : 'av';
      html += `<button class="seat ${cls}" data-seat="${lbl}" title="Asiento ${lbl}" onclick="pickSeat(this,'${lbl}')">${lbl}</button>`;
    });
    html += '</div>';
  }
  html += '</div>';
  container.innerHTML = html;
  state.selectedSeat = null;
  document.getElementById('seat-display').textContent = 'Ningún asiento seleccionado';
  document.getElementById('seat-display').classList.remove('selected');
  document.getElementById('btn-confirm-seat').disabled = true;
}

function pickSeat(btn, label) {
  if (btn.classList.contains('oc')) { showToast('Este asiento no está disponible', 'warn'); return; }
  document.querySelectorAll('.seat.sl').forEach(s => { s.classList.remove('sl'); s.classList.add('av'); });
  if (state.selectedSeat === label) {
    state.selectedSeat = null;
    document.getElementById('seat-display').textContent = 'Ningún asiento seleccionado';
    document.getElementById('seat-display').classList.remove('selected');
    document.getElementById('btn-confirm-seat').disabled = true;
    return;
  }
  btn.classList.remove('av'); btn.classList.add('sl');
  state.selectedSeat = label;
  const disp = document.getElementById('seat-display');
  disp.textContent = `Asiento seleccionado: ${label}`;
  disp.classList.add('selected');
  document.getElementById('btn-confirm-seat').disabled = false;
}

async function confirmSeat() {
  if (!state.selectedSeat) return;
  const f = state.selectedFlight;
  if (!f || !state.currentUser) return;

  const btn = document.getElementById('btn-confirm-seat');
  btn.disabled = true;
  btn.textContent = 'Reservando...';

  const sb = getSB();
  const now       = new Date().toISOString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  const { data: booking, error: bErr } = await sb
    .from('flight_booking')
    .insert({
      id_user:         state.currentUser.id_user,
      id_flight:       f.id,
      number_of_seats: 1,
      booking_date:    now,
      status:          'pending',
    })
    .select('id_booking')
    .single();

  if (bErr) {
    showToast('Error al reservar: ' + bErr.message, 'err');
    btn.disabled = false; btn.textContent = 'Confirmar asiento'; return;
  }

  const { data: bseat, error: sErr } = await sb
    .from('booking_seat')
    .insert({
      id_booking:  booking.id_booking,
      id_flight:   f.id,
      seat_number: state.selectedSeat,
      selected_at: now,
      expires_at:  expiresAt,
      status:      'pending',
    })
    .select('id_booking_seat')
    .single();

  if (sErr) {
    await sb.from('flight_booking').delete().eq('id_booking', booking.id_booking);
    showToast('Error al reservar asiento: ' + sErr.message, 'err');
    btn.disabled = false; btn.textContent = 'Confirmar asiento'; return;
  }

  state.pendingBookingId = booking.id_booking;
  state.pendingBSeatId   = bseat.id_booking_seat;
  state.bookingType      = 'flight';
  state.timerSeconds     = 600;

  document.getElementById('sum-service').textContent = `Vuelo ${f.num}`;
  document.getElementById('sum-route').textContent   = `${f.origin} → ${f.dest}`;
  document.getElementById('sum-date').textContent    = f.date;
  document.getElementById('sum-seat').textContent    = state.selectedSeat;
  document.getElementById('sum-total').textContent   = `$${Number(f.price).toLocaleString('es-MX')} MXN`;
  document.getElementById('expired-msg').classList.remove('show');
  document.getElementById('btn-pay').disabled = false;

  btn.textContent = 'Confirmar asiento';
  go('page-payment');
}

async function renderRoutes() {
  const container = document.getElementById('routes-list');
  if (!container) return;
  container.innerHTML = '<div style="color:var(--muted);font-size:.84rem;padding:20px;text-align:center">Cargando rutas...</div>';

  const sb = getSB();
  const { data: routes, error } = await sb
    .from('route')
    .select(`
      id_route, route_name,
      route_stop(stop_order, bus_station(station_name, city_name))
    `)
    .order('id_route');

  if (error) {
    container.innerHTML = `<div style="color:var(--red);padding:20px">Error al cargar rutas: ${error.message}</div>`;
    return;
  }

  if (!routes || routes.length === 0) {
    container.innerHTML = '<div style="color:var(--muted);padding:20px;text-align:center">No hay rutas disponibles.</div>';
    return;
  }

  container.innerHTML = routes.map(r => {
    const stops = (r.route_stop || [])
      .sort((a,b) => a.stop_order - b.stop_order)
      .map(s => s.bus_station?.station_name || s.bus_station?.city_name || '?');
    return `
    <div class="route-card">
      <div class="rc-name">🚌 ${r.route_name}</div>
      <div class="stops-row">
        ${stops.map((s,i) => `<span class="stop-chip">${s}</span>${i < stops.length-1 ? '<span class="stop-arrow">→</span>' : ''}`).join('')}
      </div>
      <div class="rc-meta">
        <span>📍 ${stops.length} paradas</span>
      </div>
      <button class="btn btn-primary btn-sm" onclick="openTrolleyModal(${r.id_route},'${r.route_name.replace(/'/g,"\\'")}',0,[${stops.map(s=>`'${s.replace(/'/g,"\\'")}' `).join(',')}])">Reservar este recorrido</button>
    </div>`;
  }).join('');
}

function openTrolleyModal(id, name, price, stops) {
  state._trolleyPrice  = price;
  state._trolleyName   = name;
  state._trolleyTripId = id;
  document.getElementById('modal-route-title').textContent = name;
  document.getElementById('t-date').value = '';

  const sel = document.getElementById('t-stop');
  sel.innerHTML = (stops||[]).map(s => `<option value="${s}">${s}</option>`).join('');

  document.getElementById('modal-trolley').classList.add('open');
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('open');
  el.classList.remove('show');
}

async function confirmTrolley() {
  const date = document.getElementById('t-date').value;
  const stop = document.getElementById('t-stop').value;
  if (!date) { showToast('Selecciona una fecha', 'warn'); return; }
  if (!state.currentUser) { showToast('Debes iniciar sesión', 'err'); return; }

  const sb = getSB();
  const { data: schedules } = await sb
    .from('trolley_route_schedule')
    .select('id_route_schedule')
    .eq('id_route', state._trolleyTripId);

  if (!schedules || schedules.length === 0) {
    showToast('No hay horarios para esta ruta', 'warn'); return; }
  const scheduleIds = schedules.map(s => s.id_route_schedule);

  const { data: trips, error: tErr } = await sb
    .from('trolley_trip')
    .select('id_trip, trip_date, status, base_price')
    .in('id_route_schedule', scheduleIds)
    .eq('trip_date', date)
    .eq('status', 'scheduled')
    .limit(1);

  if (tErr || !trips || trips.length === 0) {
    showToast('No hay viajes disponibles para esa fecha. Prueba 2026-07-10 al 2026-07-13', 'warn'); return; }

  const trip = trips[0];
  const tripPrice = trip.base_price || 0;
  const now = new Date().toISOString();

  const { data: stopRows } = await sb
    .from('route_stop')
    .select('id_route_stop, stop_order')
    .eq('id_route', state._trolleyTripId)
    .order('stop_order');

  const boardingStopId  = stopRows?.[0]?.id_route_stop || 1;
  const alightingStopId = stopRows?.[1]?.id_route_stop || (boardingStopId + 1);

  const { data: tbooking, error: tbErr } = await sb
    .from('trolley_booking')
    .insert({
      id_user:           state.currentUser.id_user,
      id_trip:           trip.id_trip,
      boarding_stop_id:  boardingStopId,
      alighting_stop_id: alightingStopId,
      number_of_seats:  1,
      booking_date:     now,
      status:           'pending',
    })
    .select('id_booking')
    .single();

  if (tbErr) { showToast('Error al reservar trolebús: ' + tbErr.message, 'err'); return; }

  state.pendingTrolleyId = tbooking.id_booking;
  state.bookingType      = 'trolleybus';
  state.timerSeconds     = 600;
  state._trolleyStop     = stop;
  state._trolleyPrice    = tripPrice;

  closeModal('modal-trolley');

  document.getElementById('sum-service').textContent = state._trolleyName;
  document.getElementById('sum-route').textContent   = stop + ' → última parada';
  document.getElementById('sum-date').textContent    = date;
  document.getElementById('sum-seat').textContent    = stop;
  document.getElementById('sum-total').textContent   = `$${Number(tripPrice).toLocaleString('es-MX')} MXN`;
  document.getElementById('expired-msg').classList.remove('show');
  document.getElementById('btn-pay').disabled = false;

  go('page-payment');
}

function initPayment() {
  if (state.timerInterval) clearInterval(state.timerInterval);
  state.timerSeconds = 600;
  updateTimerDisplay();
  const passengerEl = document.getElementById('sum-passenger');
  if (passengerEl && state.currentUser) {
    passengerEl.textContent = `${state.currentUser.name} ${state.currentUser.lastNames}`;
  } else if (passengerEl) {
    passengerEl.textContent = 'Demo User';
  }
  state.timerInterval = setInterval(async () => {
    state.timerSeconds--;
    updateTimerDisplay();
    if (state.timerSeconds <= 0) {
      clearInterval(state.timerInterval);
      document.getElementById('expired-msg').classList.add('show');
      document.getElementById('btn-pay').disabled = true;
      document.getElementById('timer-bar').style.borderColor = 'var(--red)';

      const sb = getSB();
      if (state.pendingBookingId) {
        await sb.from('flight_booking').update({ status:'expired' }).eq('id_booking', state.pendingBookingId);
        if (state.pendingBSeatId) await sb.from('booking_seat').update({ status:'expired' }).eq('id_booking_seat', state.pendingBSeatId);
        state.pendingBookingId = null; state.pendingBSeatId = null;
      }
      if (state.pendingTrolleyId) {
        await sb.from('trolley_booking').update({ status:'expired' }).eq('id_booking', state.pendingTrolleyId);
        state.pendingTrolleyId = null;
      }
    }
  }, 1000);
}

function updateTimerDisplay() {
  const m = Math.floor(state.timerSeconds / 60);
  const s = state.timerSeconds % 60;
  const el = document.getElementById('timer-clock');
  if (!el) return;
  el.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  el.className = 'timer-clock' + (state.timerSeconds < 120 ? ' warn' : '');
}

function fmtCard(input) {
  let v = input.value.replace(/\D/g,'');
  v = v.replace(/(.{4})/g,'$1 ').trim();
  input.value = v.slice(0,19);
  const disp = input.value.padEnd(19,'•').replace(/[^ •]/g,'•').slice(0,19);
  document.getElementById('card-num-display').textContent = disp || '•••• •••• •••• ••••';
}

function fmtExp(input) {
  let v = input.value.replace(/\D/g,'');
  if (v.length >= 2) v = v.slice(0,2) + '/' + v.slice(2,4);
  input.value = v;
}

async function doPay() {
  const name = document.getElementById('p-name').value.trim();
  const num  = document.getElementById('p-num').value.replace(/\s/g,'');
  const exp  = document.getElementById('p-exp').value;
  const cvv  = document.getElementById('p-cvv').value;

  if (!name || num.length < 16 || !exp.includes('/') || cvv.length < 3) {
    showToast('Completa todos los datos de la tarjeta', 'warn'); return;
  }

  clearInterval(state.timerInterval);
  const btn = document.getElementById('btn-pay');
  btn.disabled = true;
  btn.textContent = 'Procesando...';

  const sb = getSB();
  const last4 = num.slice(-4);
  const tot   = document.getElementById('sum-total').textContent.replace(/[^0-9]/g,'');
  const amount = parseInt(tot) || 0;

  try {
    if (state.bookingType === 'flight' && state.pendingBookingId) {
      const { error: pErr } = await sb.from('payment').insert({
        id_user:           state.currentUser.id_user,
        id_flight_booking: state.pendingBookingId,
        payment_method:    'card',
        booking_type:      'flight',
        amount,
        card_last_four:    last4,
        payment_status:    'completed',
        payment_date:      new Date().toISOString(),
        completed_at:      new Date().toISOString(),
      });
      if (pErr) throw new Error(pErr.message);

      await sb.from('flight_booking').update({ status:'confirmed' }).eq('id_booking', state.pendingBookingId);
      if (state.pendingBSeatId) {
        await sb.from('booking_seat').update({ status:'confirmed' }).eq('id_booking_seat', state.pendingBSeatId);
      }

    } else if (state.bookingType === 'trolleybus' && state.pendingTrolleyId) {
      const { error: pErr } = await sb.from('payment').insert({
        id_user:            state.currentUser.id_user,
        id_trolley_booking: state.pendingTrolleyId,
        payment_method:     'card',
        booking_type:       'trolley',
        amount,
        card_last_four:     last4,
        payment_status:     'completed',
        payment_date:       new Date().toISOString(),
        completed_at:       new Date().toISOString(),
      });
      if (pErr) throw new Error(pErr.message);

      await sb.from('trolley_booking').update({ status:'confirmed' }).eq('id_booking', state.pendingTrolleyId);
    }

    setTimeout(() => {
      document.getElementById('success-overlay').classList.add('show');
    }, 400);

  } catch(e) {
    btn.disabled = false;
    btn.textContent = 'Pagar y confirmar reservación';
    showToast('Error al procesar pago: ' + e.message, 'err');
  }
}

function goToTicket() {
  document.getElementById('success-overlay').classList.remove('show');
  go('page-ticket');
}

async function renderTicketPage() {
  const list = document.getElementById('res-list');
  if (!list) return;
  list.innerHTML = '<div style="color:var(--muted);font-size:.84rem;padding:20px;text-align:center">Cargando reservaciones...</div>';

  if (!state.currentUser) return;
  const sb = getSB();

  const { data: fbs } = await sb
    .from('flight_booking')
    .select(`
      id_booking, status,
      flight:flight(flight_number, flight_date, base_price, origin_city, destination_city),
      booking_seat(seat_number)
    `)
    .eq('id_user', state.currentUser.id_user)
    .eq('status', 'confirmed');

  const { data: tbs } = await sb
    .from('trolley_booking')
    .select(`
      id_booking, status, boarding_stop_id,
      trolley_trip:trolley_trip(trip_date, base_price,
        trolley_route_schedule:trolley_route_schedule(route:route(route_name)))
    `)
    .eq('id_user', state.currentUser.id_user)
    .eq('status', 'confirmed');

  const bookings = [];

  (fbs || []).forEach(b => {
    const f = b.flight;
    const seat = b.booking_seat?.[0]?.seat_number || '—';
    bookings.push({
      id:    b.id_booking,
      type:  'flight',
      title: `Vuelo ${f?.flight_number || '—'}`,
      route: `${f?.origin_city || '—'} → ${f?.destination_city || '—'}`,
      date:  f?.flight_date  || '—',
      seat,
      price: f?.base_price || 0,
      status: 'confirmed',
    });
  });

  (tbs || []).forEach(b => {
    const trip  = b.trolley_trip;
    const sched = trip?.trolley_route_schedule;
    const route = sched?.route;
    bookings.push({
      id:    b.id_booking,
      type:  'trolleybus',
      title: route?.route_name || 'Trolebús',
      route: `Parada ${b.boarding_stop_id} → última parada`,
      date:  trip?.trip_date || '—',
      seat:  `Parada ${b.boarding_stop_id}`,
      price: trip?.base_price || 0,
      status: 'confirmed',
    });
  });

  state.confirmedBookings = bookings;

  if (bookings.length === 0) {
    list.innerHTML = '<div style="text-align:center;padding:50px 20px;color:var(--muted)"><div style="font-size:2.5rem;margin-bottom:12px;opacity:.3">🎫</div><div>Sin reservaciones todavía</div></div>';
    return;
  }

  list.innerHTML = bookings.map(b => {
    const added = state.ticketItems.some(t => t.id === b.id);
    return `
    <div class="res-card">
      <div class="res-info">
        <h4>${b.title}</h4>
        <p>${b.route} · ${b.date}</p>
        <span class="status-badge sb-confirmed">confirmed</span>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px">
        <span style="font-family:'Cormorant Garamond',serif;font-size:1.1rem;color:var(--gold)">$${Number(b.price).toLocaleString('es-MX')} MXN</span>
        ${!added && !state.ticketDownloaded
          ? `<button class="btn btn-outline btn-sm" onclick="addToTicket(${b.id})">+ Agregar al boleto</button>`
          : added
            ? `<span style="font-size:.72rem;color:var(--gold)">✔ Agregado</span>`
            : ''}
      </div>
    </div>`;
  }).join('');

  if (state.ticketDownloaded) {
    const btn = document.getElementById('btn-download');
    if (btn) { btn.disabled = true; btn.textContent = 'Boleto ya emitido'; }
  }
}

function addToTicket(id) {
  const booking = state.confirmedBookings.find(b => b.id === id);
  if (!booking || state.ticketItems.some(t => t.id === id)) return;
  state.ticketItems.push(booking);
  updateTicketPreview();
  renderTicketPage();
  showToast('"' + booking.title + '" agregado al boleto', 'ok');
}

function updateTicketPreview() {
  const preview = document.getElementById('ticket-preview');
  const btn     = document.getElementById('btn-download');
  if (!preview) return;

  if (state.ticketItems.length === 0) {
    preview.innerHTML = '<div style="text-align:center;color:var(--muted);font-size:.8rem;padding:16px">Ninguna reservación agregada aún</div>';
    if (btn) btn.disabled = true;
    return;
  }

  preview.innerHTML = state.ticketItems.map(item => `
    <div class="ticket-preview-item">
      <div class="tpi-info">
        <strong>${item.title}</strong>
        <small>${item.route} · ${item.date}</small>
      </div>
      <span class="tpi-price">$${Number(item.price).toLocaleString('es-MX')}</span>
    </div>`).join('');

  if (btn && !state.ticketDownloaded) btn.disabled = false;
}

async function downloadTicket() {
  if (state.ticketItems.length === 0) { showToast('Agrega al menos una reservación', 'warn'); return; }
  if (state.ticketDownloaded) { showToast('Este boleto ya fue emitido', 'err'); return; }

  if (!window.jspdf) {
    showToast('jsPDF no cargado — en producción se descargará el PDF', 'warn'); return;
  }

  const sb = getSB();
  for (const item of state.ticketItems) {
    const row = item.type === 'flight'
      ? { id_booking: item.id, booking_date: new Date().toISOString(), passenger_full_name: `${state.currentUser.name} ${state.currentUser.lastNames}`, ticket_price: item.price }
      : { id_booking: item.id, booking_date: new Date().toISOString(), passenger_full_name: `${state.currentUser.name} ${state.currentUser.lastNames}`, ticket_price: item.price };
    await sb.from('ticket').insert(row);
  }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit:'mm', format:'a4' });
  const pw = doc.internal.pageSize.getWidth();
  let y = 20;

  doc.setFillColor(8,15,30);
  doc.rect(0,0,pw,40,'F');
  doc.setTextColor(201,168,76);
  doc.setFont('helvetica','bold');
  doc.setFontSize(20);
  doc.text('FLYGTH WITH YOU', pw/2, 16, { align:'center' });
  doc.setTextColor(122,144,170);
  doc.setFont('helvetica','normal');
  doc.setFontSize(8);
  doc.text('Boleto de reservación · CBTis 47', pw/2, 24, { align:'center' });
  doc.text('Emitido: ' + new Date().toLocaleString('es-MX'), pw/2, 30, { align:'center' });

  y = 52;
  doc.setFillColor(17,34,64);
  doc.roundedRect(14, y-6, pw-28, 16, 3, 3, 'F');
  doc.setTextColor(201,168,76);
  doc.setFontSize(9);
  doc.setFont('helvetica','bold');
  doc.text('PASAJERO', 20, y+3);
  doc.setTextColor(240,234,216);
  doc.setFont('helvetica','normal');
  const pdfName = state.currentUser
    ? `${state.currentUser.name} ${state.currentUser.lastNames}`.toUpperCase()
    : 'USUARIO DEMO';
  doc.text(pdfName, 60, y+3);
  y += 22;

  state.ticketItems.forEach((item, idx) => {
    doc.setDrawColor(201,168,76);
    doc.setLineWidth(.2);
    doc.line(14, y, pw-14, y);
    y += 7;
    doc.setFillColor(17,34,64);
    doc.roundedRect(14, y-2, pw-28, 38, 3, 3, 'F');
    doc.setTextColor(201,168,76);
    doc.setFont('helvetica','bold');
    doc.setFontSize(11);
    doc.text(`${idx+1}. ${item.title}`, 20, y+7);
    doc.setFont('helvetica','normal');
    doc.setFontSize(8);
    doc.setTextColor(122,144,170);
    doc.text('RUTA', 20, y+16); doc.text('FECHA', 80, y+16); doc.text('ASIENTO', 130, y+16); doc.text('PRECIO', pw-40, y+16);
    doc.setTextColor(240,234,216);
    doc.setFontSize(9);
    doc.text(item.route.slice(0,30), 20, y+24);
    doc.text(item.date, 80, y+24);
    doc.text(String(item.seat).slice(0,14), 130, y+24);
    doc.setTextColor(201,168,76);
    doc.text('$'+Number(item.price).toLocaleString('es-MX')+' MXN', pw-14, y+24, {align:'right'});
    y += 46;
  });

  const total = state.ticketItems.reduce((s,i) => s + Number(i.price||0), 0);
  doc.setDrawColor(201,168,76); doc.setLineWidth(.4);
  doc.line(14,y,pw-14,y); y+=10;
  doc.setTextColor(122,144,170); doc.setFontSize(9); doc.text('TOTAL', pw-50, y);
  doc.setTextColor(201,168,76); doc.setFont('helvetica','bold'); doc.setFontSize(13);
  doc.text('$'+total.toLocaleString('es-MX')+' MXN', pw-14, y, {align:'right'});

  const fh = doc.internal.pageSize.getHeight();
  doc.setFillColor(8,15,30);
  doc.rect(0, fh-18, pw, 18, 'F');
  doc.setTextColor(122,144,170); doc.setFont('helvetica','normal'); doc.setFontSize(7);
  doc.text('Flygth With You · CBTis 47 · Uso académico · v1.0 · Precios en MXN', pw/2, fh-9, {align:'center'});

  doc.save('boleto-flygth.pdf');

  state.ticketDownloaded = true;
  const btn = document.getElementById('btn-download');
  btn.disabled = true;
  btn.textContent = 'Boleto ya emitido';
  showToast('¡Boleto descargado! No podrás descargarlo de nuevo.', 'ok');
}

function showToast(msg, type='ok') {
  const colors = { ok:'var(--green)', warn:'var(--pending)', err:'var(--red)', info:'var(--blue)' };
  const toast = document.createElement('div');
  toast.style.cssText = `
    position:fixed; top:16px; right:16px; z-index:9999;
    background:var(--navy-mid); border:1px solid rgba(255,255,255,.1);
    border-left: 3px solid ${colors[type] || colors.ok};
    border-radius:8px; padding:12px 18px; max-width:320px;
    font-size:.84rem; box-shadow:0 8px 28px rgba(0,0,0,.5);
    animation:fadeUp .3s ease;
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

function openModal(id) {
  document.getElementById(id).classList.add('open');
}

function openConfirm(title, msg, detail, onConfirm, warnMsg = '') {
  const titleEl = document.getElementById('mc-title');
  const msgEl   = document.getElementById('mc-msg');
  const detailEl = document.getElementById('mc-detail');
  const warnEl  = document.getElementById('mc-warn');

  if (titleEl) titleEl.textContent = title;
  if (msgEl) msgEl.innerHTML = msg;
  if (detailEl) detailEl.textContent = detail;

  if (warnEl) {
    if (warnMsg) {
      warnEl.textContent = warnMsg;
      warnEl.classList.add('show');
    } else {
      warnEl.classList.remove('show');
    }
  }

  const btn = document.getElementById('mc-confirm-btn');
  if (btn) {
    btn.onclick = () => {
      closeModal('modal-confirm');
      onConfirm();
    };
  }
  openModal('modal-confirm');
}

function showAlertModal(id, msg) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = msg;
    el.classList.add('show');
  }
}

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d + 'T00:00:00').toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
}

function fmtDateTime(d) {
  if (!d) return '—';
  return new Date(d).toLocaleString('es-MX', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function fmtMXN(n) {
  return '$' + Number(n || 0).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function badgeFor(status) {
  const map = {
    scheduled:'Programado', boarding:'Abordando', completed:'Completado',
    canceled:'Cancelado', cancelled:'Cancelado', confirmed:'Confirmado',
    pending:'Pendiente', expired:'Expirado', in_progress:'En progreso',
    failed:'Fallido', active:'Activo', inactive:'Inactivo'
  };
  return `<span class="badge badge-${status}">${map[status] || status}</span>`;
}

async function loadCatalogData() {
  const sb = getSB();
  const [{ data: airplanes }, { data: trolleys }, { data: stations }, { data: occupations }, { data: airports }] = await Promise.all([
    sb.from('airplane').select('id_airplane, registration_number, status').eq('status','active'),
    sb.from('trolley').select('id_trolley, plate_number'),
    sb.from('bus_station').select('id_station, station_name, city_name').order('station_name'),
    sb.from('occupation').select('id_occupation, name').order('name'),
    sb.from('airport').select('id_airport, airport_name, city_name, airport_code').order('airport_name'),
  ]);

  state.airplanes   = airplanes   || [];
  state.trolleys    = trolleys    || [];
  state.stations    = stations    || [];
  state.occupations = occupations || [];
  state.airports    = airports    || [];

  const airportOpts = '<option value="">— Selecciona aeropuerto —</option>' +
    state.airports.map(a => `<option value="${a.id_airport}">${a.airport_name} (${a.city_name}) · ${a.airport_code}</option>`).join('');
  const originSel = document.getElementById('mf-origin-airport');
  const destSel   = document.getElementById('mf-dest-airport');
  if (originSel) originSel.innerHTML = airportOpts;
  if (destSel)   destSel.innerHTML   = airportOpts;

  const airplaneSelect = document.getElementById('mf-airplane');
  if (airplaneSelect) airplaneSelect.innerHTML = '<option value="">— Selecciona avión —</option>' +
    state.airplanes.map(a => `<option value="${a.id_airplane}">${a.registration_number}</option>`).join('');

  const trolleySelect = document.getElementById('mt-trolley');
  if (trolleySelect) trolleySelect.innerHTML = '<option value="">— Selecciona trolebús —</option>' +
    state.trolleys.map(t => `<option value="${t.id_trolley}">${t.plate_number}</option>`).join('');

  const stationSelect = document.getElementById('mr-stop-select');
  if (stationSelect) stationSelect.innerHTML = '<option value="">— Selecciona estación —</option>' +
    state.stations.map(s => `<option value="${s.id_station}">${s.station_name} (${s.city_name})</option>`).join('');

  const occSelects = [document.getElementById('ms-occupation'), document.getElementById('staff-filter-occ')];
  occSelects.forEach(sel => {
    if (!sel) return;
    const base = sel.id === 'staff-filter-occ' ? '<option value="">Todas las ocupaciones</option>' : '<option value="">— Selecciona —</option>';
    sel.innerHTML = base + state.occupations.map(o => `<option value="${o.id_occupation}">${o.name}</option>`).join('');
  });

  await populateCrewSelects();
}

async function populateCrewSelects() {
  const sb = getSB();
  const { data: allEmp } = await sb
    .from('employee')
    .select('id_person, id_occupation, active, occupation(name), person(name, last_names)')
    .eq('active', true);

  const pilots     = (allEmp || []).filter(e => e.occupation?.name?.toLowerCase() === 'piloto');
  const copilots   = (allEmp || []).filter(e => e.occupation?.name?.toLowerCase() === 'copiloto');
  const attendants = (allEmp || []).filter(e => e.occupation?.name?.toLowerCase() === 'asistente de vuelo');
  const drivers    = (allEmp || []).filter(e => e.occupation?.name?.toLowerCase() === 'chofer');

  const toOpts = (arr, placeholder) => `<option value="">${placeholder}</option>` +
    arr.map(e => `<option value="${e.id_person}">${e.person?.name} ${e.person?.last_names}</option>`).join('');

  const mfPilot = document.getElementById('mf-pilot');
  const mfCopilot = document.getElementById('mf-copilot');
  const mfAttendant = document.getElementById('mf-attendant');
  const mtDriver = document.getElementById('mt-driver');

  if (mfPilot) mfPilot.innerHTML     = toOpts(pilots,     '— Sin asignar —');
  if (mfCopilot) mfCopilot.innerHTML = toOpts(copilots,   '— Sin asignar —');
  if (mfAttendant) mfAttendant.innerHTML = toOpts(attendants, '— Sin asignar —');
  if (mtDriver) mtDriver.innerHTML    = toOpts(drivers,    '— Sin asignar —');

  state.crewCache = allEmp || [];
}

// ADMIN PANEL: FLIGHTS
async function loadFlights() {
  const tbody = document.getElementById('flights-tbody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="9" class="loading-row"><span class="spinner"></span> Cargando...</td></tr>';

  const { data, error } = await getSB()
    .from('flight')
    .select('id_flight, flight_number, flight_name, origin_city, destination_city, flight_date, departure_time, arrival_time, base_price, status, id_airplane, id_pilot, id_copilot, id_attendant')
    .order('flight_date', { ascending: false });

  if (error) {
    tbody.innerHTML = `<tr><td colspan="9" class="empty-row" style="color:var(--red)">Error: ${error.message}</td></tr>`;
    return;
  }

  state.flightsCache = data || [];
  renderFlightsTable(state.flightsCache);
}

function renderFlightsTable(rows) {
  const tbody = document.getElementById('flights-tbody');
  if (!tbody) return;
  if (!rows.length) {
    tbody.innerHTML = '<tr><td colspan="9" class="empty-row">No hay vuelos que coincidan</td></tr>';
    return;
  }

  tbody.innerHTML = rows.map(f => `
    <tr>
      <td><strong style="color:var(--gold)">${f.flight_number}</strong></td>
      <td>${f.flight_name}</td>
      <td style="white-space:nowrap">${f.origin_city} → ${f.destination_city}</td>
      <td style="white-space:nowrap">${fmtDate(f.flight_date)}</td>
      <td>${f.departure_time?.slice(0,5) || '—'}</td>
      <td>${f.arrival_time?.slice(0,5) || '—'}</td>
      <td>${fmtMXN(f.base_price)}</td>
      <td>${badgeFor(f.status)}</td>
      <td style="white-space:nowrap">
        ${f.status === 'scheduled' ? `<button class="btn-icon edit" title="Editar" onclick="openFlightModal(${f.id_flight})">✏️</button>` : ''}
        <button class="btn-icon del" title="Eliminar" onclick="confirmDeleteFlight(${f.id_flight},'${f.flight_number}')">🗑️</button>
      </td>
    </tr>`).join('');
}

function filterFlightsTable() {
  const q      = document.getElementById('flights-search').value.toLowerCase();
  const status = document.getElementById('flights-filter-status').value;
  const rows   = state.flightsCache.filter(f => {
    const matchQ = !q || f.flight_number.toLowerCase().includes(q) || f.flight_name.toLowerCase().includes(q) || f.origin_city.toLowerCase().includes(q) || f.destination_city.toLowerCase().includes(q);
    const matchS = !status || f.status === status;
    return matchQ && matchS;
  });
  renderFlightsTable(rows);
}

async function openFlightModal(id = null) {
  state.editFlightId = id;
  ['mf-number','mf-name','mf-airplane','mf-origin-airport','mf-dest-airport','mf-origin-city','mf-dest-city','mf-date','mf-price','mf-dep','mf-arr','mf-pilot','mf-copilot','mf-attendant'].forEach(f => {
    const errEl = document.getElementById(f + '-err');
    if (errEl) errEl.classList.remove('show');
    if (!id) {
      const el = document.getElementById(f);
      if (el) el.value = '';
    }
  });
  const alertEl = document.getElementById('mf-alert');
  if (alertEl) alertEl.classList.remove('show');

  if (id) {
    document.getElementById('mf-title').textContent = 'Editar vuelo';
    const f = state.flightsCache.find(x => x.id_flight === id);
    if (f) {
      document.getElementById('mf-number').value      = f.flight_number;
      document.getElementById('mf-name').value        = f.flight_name;
      document.getElementById('mf-origin-city').value = f.origin_city;
      document.getElementById('mf-dest-city').value   = f.destination_city;
      document.getElementById('mf-date').value        = f.flight_date;
      document.getElementById('mf-price').value       = f.base_price;
      document.getElementById('mf-dep').value         = f.departure_time?.slice(0,5) || '';
      document.getElementById('mf-arr').value         = f.arrival_time?.slice(0,5) || '';
      document.getElementById('mf-airplane').value    = f.id_airplane || '';
      document.getElementById('mf-pilot').value       = f.id_pilot     || '';
      document.getElementById('mf-copilot').value     = f.id_copilot   || '';
      document.getElementById('mf-attendant').value   = f.id_attendant || '';
    }
  } else {
    document.getElementById('mf-title').textContent = 'Nuevo vuelo';
  }
  openModal('modal-flight');
}

async function saveFlight() {
  const number       = document.getElementById('mf-number').value.trim();
  const name         = document.getElementById('mf-name').value.trim();
  const airplane     = document.getElementById('mf-airplane').value;
  const origAirport  = document.getElementById('mf-origin-airport').value;
  const destAirport  = document.getElementById('mf-dest-airport').value;
  const origCity     = document.getElementById('mf-origin-city').value.trim();
  const destCity     = document.getElementById('mf-dest-city').value.trim();
  const date         = document.getElementById('mf-date').value;
  const price        = document.getElementById('mf-price').value;
  const dep          = document.getElementById('mf-dep').value;
  const arr          = document.getElementById('mf-arr').value;
  const pilotId      = document.getElementById('mf-pilot').value || null;
  const copilotId    = document.getElementById('mf-copilot').value || null;
  const attendantId  = document.getElementById('mf-attendant').value || null;

  let err = false;
  const req = [['mf-number',number],['mf-name',name],['mf-airplane',airplane],['mf-origin-airport',origAirport],['mf-dest-airport',destAirport],['mf-origin-city',origCity],['mf-dest-city',destCity],['mf-date',date],['mf-price',price],['mf-dep',dep],['mf-arr',arr]];
  req.forEach(([id, val]) => {
    const el = document.getElementById(id+'-err');
    if (el) el.classList.toggle('show', !val);
    if (!val) err = true;
  });
  if (err) return;

  const today = new Date().toISOString().split('T')[0];
  if (!state.editFlightId && date < today) {
    const al = document.getElementById('mf-alert');
    if (al) {
      al.textContent = 'No se pueden registrar vuelos en fechas pasadas.';
      al.classList.add('show');
    }
    return;
  }

  if (origCity.toLowerCase() === destCity.toLowerCase()) {
    const al = document.getElementById('mf-alert');
    if (al) {
      al.textContent = 'Ciudad origen y destino no pueden ser iguales.';
      al.classList.add('show');
    }
    return;
  }

  const sb = getSB();
  const payload = {
    flight_number: number,
    flight_name: name,
    id_airplane: parseInt(airplane),
    origin_airport_id: parseInt(origAirport),
    dest_airport_id: parseInt(destAirport),
    origin_city: origCity,
    destination_city: destCity,
    flight_date: date,
    base_price: parseFloat(price),
    departure_time: dep,
    arrival_time: arr,
    id_pilot:     pilotId     ? parseInt(pilotId)     : null,
    id_copilot:   copilotId   ? parseInt(copilotId)   : null,
    id_attendant: attendantId ? parseInt(attendantId) : null,
  };

  let dbErr;
  if (state.editFlightId) {
    const { data: dup } = await sb.from('flight').select('id_flight').eq('flight_number', number).neq('id_flight', state.editFlightId).maybeSingle();
    if (dup) {
      const al = document.getElementById('mf-alert');
      if (al) {
        al.textContent = 'El número de vuelo ya está en uso por otro vuelo.';
        al.classList.add('show');
      }
      return;
    }
    const { error } = await sb.from('flight').update(payload).eq('id_flight', state.editFlightId);
    dbErr = error;
  } else {
    const { data: dup } = await sb.from('flight').select('id_flight').eq('flight_number', number).maybeSingle();
    if (dup) {
      const al = document.getElementById('mf-alert');
      if (al) {
        al.textContent = 'El número de vuelo ya existe.';
        al.classList.add('show');
      }
      return;
    }
    payload.status = 'scheduled';
    const { error } = await sb.from('flight').insert(payload);
    dbErr = error;
  }

  if (dbErr) { showToast('Error al guardar: ' + dbErr.message, 'err'); return; }
  showToast(state.editFlightId ? 'Vuelo actualizado ✓' : 'Vuelo creado ✓', 'ok');
  closeModal('modal-flight');
  loadFlights();
}

function confirmDeleteFlight(id, num) {
  openConfirm(
    '¿Eliminar vuelo?',
    `Se eliminará el vuelo <strong>${num}</strong> permanentemente.`,
    'Solo se puede eliminar si no tiene reservaciones activas.',
    async () => {
      const sb = getSB();
      const { data: active } = await sb.from('flight_booking').select('id_booking').eq('id_flight', id).in('status',['pending','confirmed']).limit(1);
      if (active && active.length > 0) {
        showToast('No se puede eliminar: hay reservaciones activas para este vuelo.', 'warn');
        return;
      }
      const { error } = await sb.from('flight').delete().eq('id_flight', id);
      if (error) { showToast('Error al eliminar: ' + error.message, 'err'); return; }
      showToast('Vuelo eliminado ✓', 'ok');
      loadFlights();
    }
  );
}

// ADMIN PANEL: ROUTES & TRIPS
async function loadRoutes() {
  const tbody = document.getElementById('routes-tbody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="4" class="loading-row"><span class="spinner"></span> Cargando...</td></tr>';

  const { data: routes, error } = await getSB()
    .from('route')
    .select('id_route, route_name')
    .order('route_name');

  if (error) { tbody.innerHTML = `<tr><td colspan="4" class="empty-row" style="color:var(--red)">Error: ${error.message}</td></tr>`; return; }

  const { data: stops } = await getSB().from('route_stop').select('id_route');
  const stopCount = {};
  (stops || []).forEach(s => { stopCount[s.id_route] = (stopCount[s.id_route] || 0) + 1; });

  state.routesCache = routes || [];
  renderRoutesTable(state.routesCache, stopCount);

  const rtSelect = document.getElementById('mt-route');
  if (rtSelect) rtSelect.innerHTML = '<option value="">— Selecciona ruta —</option>' +
    state.routesCache.map(r => `<option value="${r.id_route}">${r.route_name}</option>`).join('');
}

function renderRoutesTable(rows, stopCount = {}) {
  const tbody = document.getElementById('routes-tbody');
  if (!tbody) return;
  if (!rows.length) { tbody.innerHTML = '<tr><td colspan="4" class="empty-row">No hay rutas registradas</td></tr>'; return; }

  tbody.innerHTML = rows.map(r => `
    <tr>
      <td>${r.id_route}</td>
      <td><strong>${r.route_name}</strong></td>
      <td>${stopCount[r.id_route] || 0} paradas</td>
      <td><button class="btn-icon del" title="Eliminar" onclick="confirmDeleteRoute(${r.id_route},'${r.route_name}')">🗑️</button></td>
    </tr>`).join('');
}

function filterRoutesTable() {
  const q = document.getElementById('routes-search').value.toLowerCase();
  renderRoutesTable(state.routesCache.filter(r => r.route_name.toLowerCase().includes(q)));
}

function openRouteModal() {
  state.tempRouteStops = [];
  const list = document.getElementById('mr-stops-list');
  if (list) list.innerHTML = '';
  ['mr-name-err','mr-stops-err'].forEach(id => document.getElementById(id)?.classList.remove('show'));
  document.getElementById('mr-alert')?.classList.remove('show');
  document.getElementById('mr-name').value = '';
  openModal('modal-route');
}

function addRouteStop() {
  const sel = document.getElementById('mr-stop-select');
  const id  = parseInt(sel.value);
  if (!id) return;
  const station = state.stations.find(s => s.id_station === id);
  if (!station) return;
  if (state.tempRouteStops.find(s => s.id_station === id)) { showToast('Esa estación ya fue agregada', 'warn'); return; }
  state.tempRouteStops.push({ id_station: id, station_name: `${station.station_name} (${station.city_name})`, stop_order: state.tempRouteStops.length + 1 });
  renderTempStops();
  sel.value = '';
}

function removeRouteStop(idx) {
  state.tempRouteStops.splice(idx, 1);
  state.tempRouteStops.forEach((s, i) => s.stop_order = i + 1);
  renderTempStops();
}

function renderTempStops() {
  const c = document.getElementById('mr-stops-list');
  if (!c) return;
  c.innerHTML = state.tempRouteStops.map((s, i) => `
    <div class="stop-item">
      <div class="stop-order">${s.stop_order}</div>
      <div class="stop-name">${s.station_name}</div>
      <button class="stop-rm" onclick="removeRouteStop(${i})">✕</button>
    </div>`).join('');
}

async function saveRoute() {
  const name = document.getElementById('mr-name').value.trim();
  const nameErr = document.getElementById('mr-name-err');
  const stopsErr = document.getElementById('mr-stops-err');

  nameErr.classList.toggle('show', !name);
  stopsErr.classList.toggle('show', state.tempRouteStops.length < 2);
  if (!name || state.tempRouteStops.length < 2) return;

  const sb = getSB();
  const { data: dup } = await sb.from('route').select('id_route').eq('route_name', name).maybeSingle();
  if (dup) { showAlertModal('mr-alert','Ya existe una ruta con ese nombre.'); return; }

  const { data: newRoute, error: rErr } = await sb.from('route').insert({ route_name: name }).select('id_route').single();
  if (rErr) { showToast('Error al crear ruta: ' + rErr.message, 'err'); return; }

  const stopsPayload = state.tempRouteStops.map(s => ({ id_route: newRoute.id_route, id_station: s.id_station, stop_order: s.stop_order }));
  const { error: sErr } = await sb.from('route_stop').insert(stopsPayload);
  if (sErr) {
    await sb.from('route').delete().eq('id_route', newRoute.id_route);
    showToast('Error al guardar paradas: ' + sErr.message, 'err');
    return;
  }

  showToast('Ruta creada ✓', 'ok');
  closeModal('modal-route');
  loadRoutes();
}

function confirmDeleteRoute(id, name) {
  openConfirm('¿Eliminar ruta?', `Se eliminará la ruta <strong>${name}</strong> y todas sus paradas.`, 'No se puede eliminar si tiene viajes activos.',
    async () => {
      const sb = getSB();
      const { data: sch } = await sb.from('trolley_route_schedule').select('id_route_schedule').eq('id_route', id).limit(1);
      if (sch && sch.length > 0) {
        const schedIds = sch.map(s => s.id_route_schedule);
        const { data: trips } = await sb.from('trolley_trip').select('id_trip').in('id_route_schedule', schedIds).in('status',['scheduled','in_progress']).limit(1);
        if (trips && trips.length > 0) { showToast('No se puede eliminar: hay viajes activos en esta ruta.', 'warn'); return; }
      }
      await sb.from('route_stop').delete().eq('id_route', id);
      await sb.from('route').delete().eq('id_route', id);
      showToast('Ruta eliminada ✓', 'ok');
      loadRoutes();
    }
  );
}

async function loadTrips() {
  const tbody = document.getElementById('trips-tbody');
  if (!tbody) return;
  const dateFilter   = document.getElementById('trips-filter-date').value;
  const statusFilter = document.getElementById('trips-filter-status').value;

  tbody.innerHTML = '<tr><td colspan="9" class="loading-row"><span class="spinner"></span> Cargando...</td></tr>';

  let query = getSB()
    .from('trolley_trip')
    .select('id_trip, trip_date, departure_time, arrival_time, base_price, status, id_trolley, id_route_schedule, trolley(plate_number), trolley_route_schedule(id_route, route(route_name))')
    .order('trip_date', { ascending: false });

  if (dateFilter)   query = query.eq('trip_date', dateFilter);
  if (statusFilter) query = query.eq('status', statusFilter);

  const { data, error } = await query;
  if (error) { tbody.innerHTML = `<tr><td colspan="9" class="empty-row" style="color:var(--red)">Error: ${error.message}</td></tr>`; return; }

  state.tripsCache = data || [];
  if (!data || !data.length) { tbody.innerHTML = '<tr><td colspan="9" class="empty-row">No hay viajes con esos filtros</td></tr>'; return; }

  tbody.innerHTML = data.map(t => {
    const routeName = t.trolley_route_schedule?.route?.route_name || '—';
    const plate = t.trolley?.plate_number || '—';
    return `<tr>
      <td>${t.id_trip}</td>
      <td>${routeName}</td>
      <td>${plate}</td>
      <td>${fmtDate(t.trip_date)}</td>
      <td>${t.departure_time?.slice(0,5) || '—'}</td>
      <td>${t.arrival_time?.slice(0,5) || '—'}</td>
      <td>${fmtMXN(t.base_price)}</td>
      <td>${badgeFor(t.status)}</td>
      <td><button class="btn-icon del" onclick="confirmDeleteTrip(${t.id_trip})">🗑️</button></td>
    </tr>`;
  }).join('');
}

async function loadRouteSchedules() {
  const routeId = document.getElementById('mt-route').value;
  const sel = document.getElementById('mt-schedule');
  if (!sel) return;
  sel.innerHTML = '<option value="">Cargando...</option>';
  if (!routeId) { sel.innerHTML = '<option value="">— Primero selecciona una ruta —</option>'; return; }

  const { data } = await getSB().from('trolley_route_schedule').select('id_route_schedule, departure_time, arrival_time').eq('id_route', routeId);
  sel.innerHTML = '<option value="">— Selecciona horario —</option>' +
    (data || []).map(s => `<option value="${s.id_route_schedule}">${s.departure_time?.slice(0,5)} → ${s.arrival_time?.slice(0,5)}</option>`).join('');
}

function openTripModal() {
  ['mt-route','mt-schedule','mt-trolley','mt-driver','mt-date','mt-price','mt-dep','mt-arr'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
    const err = document.getElementById(id + '-err');
    if (err) err.classList.remove('show');
  });
  document.getElementById('mt-alert')?.classList.remove('show');
  openModal('modal-trip');
}

async function saveTrip() {
  const routeId    = document.getElementById('mt-route').value;
  const scheduleId = document.getElementById('mt-schedule').value;
  const trolleyId  = document.getElementById('mt-trolley').value;
  const driverId   = document.getElementById('mt-driver').value || null;
  const date       = document.getElementById('mt-date').value;
  const price      = document.getElementById('mt-price').value;
  const dep        = document.getElementById('mt-dep').value;
  const arr        = document.getElementById('mt-arr').value;

  let err = false;
  [['mt-route',routeId],['mt-schedule',scheduleId],['mt-trolley',trolleyId],['mt-date',date],['mt-price',price],['mt-dep',dep],['mt-arr',arr]].forEach(([id, val]) => {
    const e = document.getElementById(id + '-err');
    if (e) { e.classList.toggle('show', !val); if (!val) err = true; }
  });
  if (err) return;

  const today = new Date().toISOString().split('T')[0];
  if (date < today) {
    const al = document.getElementById('mt-alert');
    if (al) {
      al.textContent = 'No se pueden registrar viajes en fechas pasadas.';
      al.classList.add('show');
    }
    return;
  }

  const { data: stops } = await getSB().from('route_stop').select('id_station, stop_order').eq('id_route', routeId).order('stop_order');
  if (!stops || stops.length < 2) { showToast('La ruta necesita al menos 2 paradas', 'warn'); return; }

  const payload = {
    id_route_schedule: parseInt(scheduleId),
    id_trolley: parseInt(trolleyId),
    origin_station_id: stops[0].id_station,
    dest_station_id: stops[stops.length - 1].id_station,
    trip_date: date,
    base_price: parseFloat(price),
    departure_time: dep,
    arrival_time: arr,
    status: 'scheduled',
    id_driver: driverId ? parseInt(driverId) : null,
  };

  const { error } = await getSB().from('trolley_trip').insert(payload);
  if (error) { showToast('Error al crear viaje: ' + error.message, 'err'); return; }
  showToast('Viaje creado ✓', 'ok');
  closeModal('modal-trip');
  loadTrips();
}

function confirmDeleteTrip(id) {
  openConfirm('¿Eliminar viaje?', `Se eliminará el viaje #${id}.`, 'No se puede eliminar si tiene reservaciones activas.',
    async () => {
      const { data: active } = await getSB().from('trolley_booking').select('id_booking').eq('id_trip', id).in('status',['pending','confirmed']).limit(1);
      if (active && active.length > 0) { showToast('No se puede eliminar: hay reservaciones activas.', 'warn'); return; }
      const { error } = await getSB().from('trolley_trip').delete().eq('id_trip', id);
      if (error) { showToast('Error al eliminar: ' + error.message, 'err'); return; }
      showToast('Viaje eliminado ✓', 'ok');
      loadTrips();
    }
  );
}

// ADMIN PANEL: STAFF
async function loadStaff() {
  const tbody = document.getElementById('staff-tbody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="7" class="loading-row"><span class="spinner"></span> Cargando...</td></tr>';

  const sb = getSB();
  const [{ data: employees, error }, { data: usersData }, { data: personsData }] = await Promise.all([
    sb.from('employee').select('id_person, rfc, id_occupation, active, occupation(name)').order('id_person'),
    sb.from('users').select('id_person, user_name'),
    sb.from('person').select('id_person, name, last_names, email, curp'),
  ]);

  if (error) { tbody.innerHTML = `<tr><td colspan="7" class="empty-row" style="color:var(--red)">Error: ${error.message}</td></tr>`; return; }

  const usersMap = {};
  (usersData || []).forEach(u => { usersMap[u.id_person] = u.user_name; });
  const personsMap = {};
  (personsData || []).forEach(p => { personsMap[p.id_person] = p; });

  state.staffCache = (employees || []).map(e => {
    const p = personsMap[e.id_person] || {};
    return {
      id_person:     e.id_person,
      rfc:           e.rfc,
      name:          p.name       || '—',
      lastNames:     p.last_names || '',
      email:         p.email      || '—',
      curp:          p.curp       || '—',
      occupation:    e.occupation?.name || '—',
      id_occupation: e.id_occupation,
      username:      usersMap[e.id_person] || '—',
      active:        e.active !== false,
    };
  });

  renderStaffTable(state.staffCache);
}

function renderStaffTable(rows) {
  const tbody = document.getElementById('staff-tbody');
  if (!tbody) return;
  if (!rows.length) { tbody.innerHTML = '<tr><td colspan="7" class="empty-row">No hay empleados que coincidan</td></tr>'; return; }

  tbody.innerHTML = rows.map(e => `
    <tr style="${!e.active ? 'opacity:.6' : ''}">
      <td><strong>${e.name} ${e.lastNames}</strong></td>
      <td style="font-family:monospace;font-size:.8rem">${e.rfc}</td>
      <td>${e.occupation}</td>
      <td style="font-family:monospace;font-size:.8rem">${e.username}</td>
      <td style="font-size:.8rem">${e.email}</td>
      <td>${e.active ? badgeFor('active') : badgeFor('inactive')}</td>
      <td style="white-space:nowrap">
        ${e.active ? `<button class="btn-icon edit" title="Editar" onclick="openStaffModal(${e.id_person})">✏️</button>` : ''}
        ${e.active
          ? `<button class="btn-icon del" title="Desactivar" onclick="toggleStaffActive(${e.id_person}, false, '${e.name} ${e.lastNames}')">🚫</button>`
          : `<button class="btn-icon check" title="Reactivar" onclick="toggleStaffActive(${e.id_person}, true, '${e.name} ${e.lastNames}')">✅</button>`
        }
      </td>
    </tr>`).join('');
}

function filterStaffTable() {
  const q      = document.getElementById('staff-search').value.toLowerCase();
  const occ    = document.getElementById('staff-filter-occ').value;
  const active = document.getElementById('staff-filter-active').value;
  const rows = state.staffCache.filter(e => {
    const matchQ = !q || `${e.name} ${e.lastNames} ${e.rfc} ${e.username}`.toLowerCase().includes(q);
    const matchO = !occ || String(e.id_occupation) === occ;
    const matchA = active === 'all' || (active === 'active' && e.active) || (active === 'inactive' && !e.active);
    return matchQ && matchO && matchA;
  });
  renderStaffTable(rows);
}

async function toggleStaffActive(id, activate, fullName) {
  const action = activate ? 'reactivar' : 'desactivar';
  const title  = activate ? '¿Reactivar empleado?' : '¿Desactivar empleado?';
  const detail = activate ? 'El empleado podrá volver a iniciar sesión.' : 'El empleado no podrá iniciar sesión.';

  if (!activate) {
    // Nota: la validación del flight/bookings no se incluye porque el esquema actual no lista empleado en flight.
  }

  openConfirm(title, `Se va a ${action} a <strong>${fullName}</strong>.`, detail,
    async () => {
      const { error } = await getSB().from('employee').update({ active: activate }).eq('id_person', id);
      if (error) { showToast('Error: ' + error.message, 'err'); return; }
      showToast(activate ? 'Empleado reactivado ✓' : 'Empleado desactivado ✓', 'ok');
      loadStaff();
    }
  );
}

function openStaffModal(id = null) {
  state.editStaffId = id;
  ['ms-name','ms-lastnames','ms-curp','ms-rfc','ms-birth','ms-email','ms-username','ms-pass'].forEach(f => {
    const field = document.getElementById(f);
    if (field) field.value = '';
    const err = document.getElementById(f + '-err');
    if (err) err.classList.remove('show');
  });
  const msAlert = document.getElementById('ms-alert');
  if (msAlert) msAlert.classList.remove('show');
  const msOccupation = document.getElementById('ms-occupation');
  if (msOccupation) msOccupation.value = '';

  const userGroup = document.getElementById('ms-user-group');
  const passGroup = document.getElementById('ms-pass-group');

  if (id) {
    const e = state.staffCache.find(x => x.id_person === id);
    if (e) {
      document.getElementById('ms-title').textContent = 'Editar empleado';
      document.getElementById('ms-sub').textContent   = 'Modifica los campos que necesites cambiar';
      document.getElementById('ms-save-btn').textContent = 'Guardar cambios';
      document.getElementById('ms-name').value      = e.name;
      document.getElementById('ms-lastnames').value = e.lastNames;
      document.getElementById('ms-curp').value      = e.curp;
      document.getElementById('ms-rfc').value       = e.rfc;
      document.getElementById('ms-email').value     = e.email;
      document.getElementById('ms-occupation').value = e.id_occupation;
      if (userGroup) userGroup.style.display = 'none';
      if (passGroup) passGroup.style.display = 'none';
    }
  } else {
    document.getElementById('ms-title').textContent = 'Nuevo empleado';
    document.getElementById('ms-sub').textContent   = 'Registra los datos personales y credenciales';
    document.getElementById('ms-save-btn').textContent = 'Registrar empleado';
    if (userGroup) userGroup.style.display = '';
    if (passGroup) passGroup.style.display = '';
  }
  openModal('modal-staff');
}

async function saveStaff() {
  const name       = document.getElementById('ms-name').value.trim();
  const lastnames  = document.getElementById('ms-lastnames').value.trim();
  const curp       = document.getElementById('ms-curp').value.trim().toUpperCase();
  const rfc        = document.getElementById('ms-rfc').value.trim().toUpperCase();
  const birth      = document.getElementById('ms-birth').value;
  const email      = document.getElementById('ms-email').value.trim().toLowerCase();
  const occId      = document.getElementById('ms-occupation').value;
  const username   = document.getElementById('ms-username').value.trim();
  const pass       = document.getElementById('ms-pass').value;
  const isEdit     = !!state.editStaffId;

  let err = false;
  const checkFields = [['ms-name',name],['ms-lastnames',lastnames],['ms-curp',curp],['ms-rfc',rfc],['ms-email',email],['ms-occupation',occId]];
  if (!isEdit) checkFields.push(['ms-username',username], ['ms-pass', pass]);
  checkFields.forEach(([id, val]) => {
    const el = document.getElementById(id + '-err');
    if (el) el.classList.toggle('show', !val);
    if (!val) err = true;
  });
  if (curp && curp.length !== 18) {
    const el = document.getElementById('ms-curp-err');
    if (el) { el.textContent = 'La CURP debe tener exactamente 18 caracteres'; el.classList.add('show'); }
    err = true;
  }
  if (!isEdit && pass && pass.length < 6) {
    const el = document.getElementById('ms-pass-err');
    if (el) { el.textContent = 'Mínimo 6 caracteres'; el.classList.add('show'); }
    err = true;
  }
  if (err) return;

  const sb = getSB();

  if (!isEdit) {
    const [dupCurpRow, dupUserRow, dupRfcRow] = await Promise.all([
      sb.from('person').select('id_person').eq('curp', curp).maybeSingle(),
      sb.from('users').select('id_person').eq('user_name', username).maybeSingle(),
      sb.from('employee').select('id_person').eq('rfc', rfc).maybeSingle(),
    ]);
    if (dupCurpRow.data) { showAlertModal('ms-alert','Ya existe un registro con esa CURP.'); return; }
    if (dupUserRow.data) { showAlertModal('ms-alert','El nombre de usuario ya está en uso.'); return; }
    if (dupRfcRow.data)  { showAlertModal('ms-alert','Ya existe un empleado con ese RFC.'); return; }

    const { data: newPerson, error: pErr } = await sb.from('person').insert({ name, last_names: lastnames, curp, birth_date: birth || null, email }).select('id_person').single();
    if (pErr) { showToast('Error al crear persona: ' + pErr.message, 'err'); return; }

    const { error: eErr } = await sb.from('employee').insert({ id_person: newPerson.id_person, rfc, id_occupation: parseInt(occId) });
    if (eErr) { await sb.from('person').delete().eq('id_person', newPerson.id_person); showToast('Error al crear empleado: ' + eErr.message, 'err'); return; }

    const hashed = await hashPassword(pass);
    const { error: uErr } = await sb.from('users').insert({ id_person: newPerson.id_person, user_name: username, password_hash: hashed });
    if (uErr) {
      await sb.from('employee').delete().eq('id_person', newPerson.id_person);
      await sb.from('person').delete().eq('id_person', newPerson.id_person);
      showToast('Error al crear credenciales: ' + uErr.message, 'err');
      return;
    }
  } else {
    const { error: pErr } = await sb.from('person').update({ name, last_names: lastnames, curp, email }).eq('id_person', state.editStaffId);
    if (pErr) { showToast('Error al actualizar: ' + pErr.message, 'err'); return; }
    const { error: eErr } = await sb.from('employee').update({ rfc, id_occupation: parseInt(occId) }).eq('id_person', state.editStaffId);
    if (eErr) { showToast('Error al actualizar empleado: ' + eErr.message, 'err'); return; }
  }

  showToast(isEdit ? 'Empleado actualizado ✓' : 'Empleado registrado ✓', 'ok');
  closeModal('modal-staff');
  loadStaff();
}

// ADMIN PANEL: BOOKINGS
async function loadBookings() {
  await Promise.all([loadFBookings(), loadTBookings()]);
}

async function loadFBookings() {
  const tbody = document.getElementById('fb-tbody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="7" class="loading-row"><span class="spinner"></span> Cargando...</td></tr>';

  const { data, error } = await getSB()
    .from('flight_booking')
    .select('id_booking, id_flight, id_user, number_of_seats, booking_date, status, flight(flight_number, origin_city, destination_city), users(id_person, person(name, last_names)), booking_seat(seat_number, status)')
    .order('booking_date', { ascending: false })
    .limit(100);

  if (error) { tbody.innerHTML = `<tr><td colspan="7" class="empty-row" style="color:var(--red)">Error: ${error.message}</td></tr>`; return; }

  state.fbCache = data || [];
  renderFBookings(state.fbCache);
}

function renderFBookings(rows) {
  const tbody = document.getElementById('fb-tbody');
  if (!tbody) return;
  if (!rows.length) { tbody.innerHTML = '<tr><td colspan="7" class="empty-row">No hay reservaciones de vuelo</td></tr>'; return; }

  tbody.innerHTML = rows.map(b => {
    const person  = b.users?.person;
    const fullName = person ? `${person.name} ${person.last_names}` : `Usuario #${b.id_user}`;
    const flight  = b.flight;
    const route   = flight ? `${flight.flight_number} · ${flight.origin_city}→${flight.destination_city}` : `Vuelo #${b.id_flight}`;
    const seats   = (b.booking_seat || []).map(s => s.seat_number).join(', ') || '—';
    return `<tr>
      <td>#${b.id_booking}</td>
      <td>${fullName}</td>
      <td style="font-size:.8rem">${route}</td>
      <td>${seats}</td>
      <td style="font-size:.78rem">${fmtDateTime(b.booking_date)}</td>
      <td>${badgeFor(b.status)}</td>
      <td style="white-space:nowrap">
        ${b.status !== 'cancelled' ? `<button class="btn-icon cancel-action" title="Cancelar" onclick="cancelBooking('flight',${b.id_booking},'${b.status}')">❌</button>` : ''}
        ${b.status === 'pending' ? `<button class="btn-icon check" title="Confirmar manualmente" onclick="confirmBookingManual('flight',${b.id_booking})">✅</button>` : ''}
      </td>
    </tr>`;
  }).join('');
}

function filterFBookings() {
  const q  = document.getElementById('fb-search').value.toLowerCase();
  const st = document.getElementById('fb-filter-status').value;
  renderFBookings(state.fbCache.filter(b => {
    const person = b.users?.person;
    const name = person ? `${person.name} ${person.last_names}`.toLowerCase() : '';
    const matchQ = !q || name.includes(q) || String(b.id_booking).includes(q);
    return matchQ && (!st || b.status === st);
  }));
}

async function loadTBookings() {
  const tbody = document.getElementById('tb-tbody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="7" class="loading-row"><span class="spinner"></span> Cargando...</td></tr>';

  const { data, error } = await getSB()
    .from('trolley_booking')
    .select('id_booking, id_trip, id_user, booking_date, status, users(id_person, person(name, last_names)), trolley_trip(trip_date, trolley_route_schedule(route(route_name))), boarding_stop_id, route_stop!trolley_booking_boarding_stop_id_fkey(bus_station(station_name))')
    .order('booking_date', { ascending: false })
    .limit(100);

  if (error) { tbody.innerHTML = `<tr><td colspan="7" class="empty-row" style="color:var(--red)">Error: ${error.message}</td></tr>`; return; }

  state.tbCache = data || [];
  renderTBookings(state.tbCache);
}

function renderTBookings(rows) {
  const tbody = document.getElementById('tb-tbody');
  if (!tbody) return;
  if (!rows.length) { tbody.innerHTML = '<tr><td colspan="7" class="empty-row">No hay reservaciones de trolebús</td></tr>'; return; }

  tbody.innerHTML = rows.map(b => {
    const person   = b.users?.person;
    const fullName = person ? `${person.name} ${person.last_names}` : `Usuario #${b.id_user}`;
    const routeName = b.trolley_trip?.trolley_route_schedule?.route?.route_name || '—';
    const boardStop = b.route_stop?.bus_station?.station_name || '—';
    return `<tr>
      <td>#${b.id_booking}</td>
      <td>${fullName}</td>
      <td>${routeName}</td>
      <td>${boardStop}</td>
      <td style="font-size:.78rem">${fmtDateTime(b.booking_date)}</td>
      <td>${badgeFor(b.status)}</td>
      <td style="white-space:nowrap">
        ${b.status !== 'cancelled' ? `<button class="btn-icon cancel-action" title="Cancelar" onclick="cancelBooking('trolley',${b.id_booking},'${b.status}')">❌</button>` : ''}
        ${b.status === 'pending' ? `<button class="btn-icon check" title="Confirmar manualmente" onclick="confirmBookingManual('trolley',${b.id_booking})">✅</button>` : ''}
      </td>
    </tr>`;
  }).join('');
}

function filterTBookings() {
  const q  = document.getElementById('tb-search').value.toLowerCase();
  const st = document.getElementById('tb-filter-status').value;
  renderTBookings(state.tbCache.filter(b => {
    const person = b.users?.person;
    const name = person ? `${person.name} ${person.last_names}`.toLowerCase() : '';
    const matchQ = !q || name.includes(q) || String(b.id_booking).includes(q);
    return matchQ && (!st || b.status === st);
  }));
}

function cancelBooking(type, id, currentStatus) {
  if (currentStatus === 'cancelled') { showToast('Esta reservación ya estaba cancelada.', 'warn'); return; }
  openConfirm('¿Cancelar reservación?', `Se cancelará la reservación #${id}.`, 'Esta acción actualizará el estado en la base de datos.',
    async () => {
      const sb = getSB();
      if (type === 'flight') {
        await sb.from('flight_booking').update({ status: 'cancelled' }).eq('id_booking', id);
        await sb.from('booking_seat').update({ status: 'cancelled' }).eq('id_booking', id);
        loadFBookings();
      } else {
        await sb.from('trolley_booking').update({ status: 'cancelled' }).eq('id_booking', id);
        loadTBookings();
      }
      showToast('Reservación cancelada ✓', 'ok');
    }
  );
}

function confirmBookingManual(type, id) {
  openConfirm('¿Confirmar reservación manualmente?', `Se confirmará la reservación #${id} sin verificar pago.`, '',
    async () => {
      const sb = getSB();
      const col = type === 'flight' ? 'id_flight_booking' : 'id_trolley_booking';
      const { data: payments } = await sb.from('payment').select('id_payment').eq(col, id).eq('payment_status','completed').limit(1);

      const doConfirm = async () => {
        if (type === 'flight') {
          await sb.from('flight_booking').update({ status: 'confirmed' }).eq('id_booking', id);
          await sb.from('booking_seat').update({ status: 'confirmed' }).eq('id_booking', id);
          loadFBookings();
        } else {
          await sb.from('trolley_booking').update({ status: 'confirmed' }).eq('id_booking', id);
          loadTBookings();
        }
        showToast('Reservación confirmada manualmente ✓', 'ok');
      };

      if (!payments || payments.length === 0) {
        openConfirm(
          '⚠️ Sin pago registrado',
          `No hay pago completado para la reservación #${id}.`,
          '¿Deseas confirmarla de todas formas? (override manual)',
          doConfirm
        );
      } else {
        await doConfirm();
      }
    }
  );
}

// ADMIN PANEL: REPORTES
async function loadReports() {
  const from    = document.getElementById('rep-from').value;
  const to      = document.getElementById('rep-to').value;
  const service = document.getElementById('rep-service').value;
  const status  = document.getElementById('rep-status').value;
  const sb = getSB();

  let fq = sb.from('flight_booking').select('id_booking, status, booking_date');
  let tq = sb.from('trolley_booking').select('id_booking, status, booking_date');
  let pq = sb.from('payment').select('id_payment, id_user, id_flight_booking, id_trolley_booking, payment_method, amount, payment_status, payment_date, users(person(name, last_names))').eq('payment_status','completed').order('payment_date', { ascending: false });

  if (from)   { fq = fq.gte('booking_date', from); tq = tq.gte('booking_date', from); pq = pq.gte('payment_date', from); }
  if (to)     { fq = fq.lte('booking_date', to + 'T23:59:59'); tq = tq.lte('booking_date', to + 'T23:59:59'); pq = pq.lte('payment_date', to + 'T23:59:59'); }
  if (status) { fq = fq.eq('status', status); tq = tq.eq('status', status); }

  const [fbRes, tbRes, payRes] = await Promise.all([fq, tq, pq]);
  const fb = fbRes.data || [];
  const tb = tbRes.data || [];
  const payments = payRes.data || [];

  let allBookings = [];
  if (!service || service === 'flight')  allBookings = allBookings.concat(fb.map(b => ({...b, _type:'flight'})));
  if (!service || service === 'trolley') allBookings = allBookings.concat(tb.map(b => ({...b, _type:'trolley'})));

  const total     = allBookings.length;
  const confirmed = allBookings.filter(b => b.status === 'confirmed').length;
  const cancelled = allBookings.filter(b => b.status === 'cancelled' || b.status === 'expired').length;

  let filteredPayments = payments;
  if (service === 'flight')  filteredPayments = payments.filter(p => p.id_flight_booking);
  if (service === 'trolley') filteredPayments = payments.filter(p => p.id_trolley_booking);

  const revenue = filteredPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const cash     = filteredPayments.filter(p => p.payment_method === 'cash').reduce((s, p) => s + Number(p.amount), 0);
  const card     = filteredPayments.filter(p => p.payment_method === 'card').reduce((s, p) => s + Number(p.amount), 0);
  const transfer = filteredPayments.filter(p => p.payment_method === 'transfer').reduce((s, p) => s + Number(p.amount), 0);

  document.getElementById('rep-total').textContent     = total;
  document.getElementById('rep-confirmed').textContent = confirmed;
  document.getElementById('rep-cancelled').textContent = cancelled;
  document.getElementById('rep-revenue').textContent   = fmtMXN(revenue);
  document.getElementById('rep-cash').textContent      = fmtMXN(cash);
  document.getElementById('rep-card').textContent      = fmtMXN(card);
  document.getElementById('rep-transfer').textContent  = fmtMXN(transfer);

  const tbody = document.getElementById('rep-payments-tbody');
  if (!tbody) return;
  if (!filteredPayments.length) {
    tbody.innerHTML = '<tr><td colspan="7" class="empty-row">No hay pagos con esos filtros</td></tr>';
    return;
  }

  tbody.innerHTML = filteredPayments.slice(0, 50).map(p => {
    const person = p.users?.person;
    const name   = person ? `${person.name} ${person.last_names}` : `#${p.id_user}`;
    const type   = p.id_flight_booking ? '✈ Vuelo' : '🚎 Trolebús';
    return `<tr>
      <td>#${p.id_payment}</td>
      <td>${name}</td>
      <td>${type}</td>
      <td style="text-transform:capitalize">${p.payment_method}</td>
      <td><strong style="color:var(--green)">${fmtMXN(p.amount)}</strong></td>
      <td>${badgeFor(p.payment_status)}</td>
      <td style="font-size:.78rem">${fmtDateTime(p.payment_date)}</td>
    </tr>`;
  }).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) overlay.classList.remove('open');
    });
  });

  const today = new Date().toISOString().split('T')[0];
  const repFrom = document.getElementById('rep-from');
  const repTo = document.getElementById('rep-to');
  const tripDateFilter = document.getElementById('trip-date-filter');
  if (repTo) repTo.value = today;
  if (repFrom) repFrom.value = new Date(Date.now() - 30*24*60*60*1000).toISOString().split('T')[0];
  if (tripDateFilter && !tripDateFilter.value) tripDateFilter.value = today;
});

const sbScript = document.createElement('script');
sbScript.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
document.head.appendChild(sbScript);

const jspdfScript = document.createElement('script');
jspdfScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
document.head.appendChild(jspdfScript);
