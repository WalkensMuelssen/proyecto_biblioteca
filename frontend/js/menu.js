// js/menu.js
// ===== MENÚ LATERAL =====
const menuBtn = document.getElementById('menu-btn');
const sidebar = document.getElementById('sidebar');
const main = document.querySelector('main');
const content = document.getElementById('content');
const welcomeEl = document.getElementById('welcome');

function closeMenu() {
  sidebar.classList.remove('active');
  main.classList.remove('shift');
}

if (menuBtn) {
  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    sidebar.classList.toggle('active');
    main.classList.toggle('shift');
  });
}

document.addEventListener('click', (e) => {
  if (sidebar && sidebar.classList.contains('active') && !sidebar.contains(e.target)) {
    closeMenu();
  }
});

// ===== CONFIG =====
const API_BASE = 'http://localhost:5000/api';

// Leer usuario de localStorage y mostrar saludo
const storedUser = localStorage.getItem('biblio_user');
const currentUser = storedUser ? JSON.parse(storedUser) : null;
if (currentUser && welcomeEl) {
  welcomeEl.textContent = `Bienvenido, ${currentUser.nombre} (${currentUser.rol})`;
}

// ===== SECCIONES DINÁMICAS =====
const secciones = {
  inicio: `
    <h1>Inicio</h1>
    <p>Bienvenido al sistema de gestión de biblioteca.</p>
  `,
  registrar: `
    <h1>Registrar Libros</h1>
    <form id="formRegistrarLibro" style="display:flex; flex-direction:column; gap:10px; max-width:420px; margin:auto;">
        <input type="text" id="tituloLibro" placeholder="Título del libro" required>
        <input type="text" id="autorLibro" placeholder="Autor" required>
        <input type="text" id="categoriaLibro" placeholder="Categoría" required>
        <input type="number" id="anioLibro" placeholder="Año de lanzamiento" required>
        <input type="number" id="cantidadLibro" placeholder="Cantidad" required>
        <button type="submit">Registrar Libro</button>
    </form>
    <div id="mensajeRegistro" style="margin-top:15px; font-weight:bold; text-align:center;"></div>
  `,
  consultar: `
    <h1>Consultar Libros</h1>
    <input type="text" id="buscarLibro" placeholder="Buscar por título, autor o categoría">
    <div id="listaLibros"></div>
  `,
  usuarios: `
    <h1>Usuarios Registrados</h1>
    <form id="formUsuario" style="display:flex; flex-direction:column; gap:8px; max-width:420px; margin:auto;">
      <input id="nombreUsuario" placeholder="Nombre" required />
      <input id="correoUsuario" placeholder="Correo" required />
      <input id="contrasenaUsuario" placeholder="Contraseña" required />
      <select id="rolUsuario">
        <option value="Administrador">Administrador</option>
        <option value="Bibliotecario">Bibliotecario</option>
        <option value="Docente">Docente</option>
        <option value="Estudiante">Estudiante</option>
      </select>
      <button type="submit">Agregar usuario</button>
    </form>
    <div id="listaUsuarios"></div>
  `,
  prestamos: `
    <h1>Préstamos</h1>
    <div id="formPrestamo" style="max-width:540px; margin:auto;">
      <select id="selectLibroPrestamo"></select>
      <select id="selectUsuarioPrestamo"></select>
      <button id="btnPrestar">Prestar libro</button>
    </div>
    <h3>Préstamos activos</h3>
    <div id="listaPrestamos"></div>
  `,
  reservas: `
    <h1>Reservas</h1>
    <div id="formReserva" style="max-width:540px; margin:auto;">
      <select id="selectLibroReserva"></select>
      <select id="selectUsuarioReserva"></select>
      <button id="btnReservar">Reservar libro</button>
    </div>
    <h3>Reservas activas</h3>
    <div id="listaReservas"></div>
  `,
  salir: `
    <h1>Sesión cerrada</h1>
    <p>Redirigiendo al inicio de sesión...</p>
  `
};

// ===== FUNCIONES: LIBROS =====
async function mostrarLibros() {
  content.innerHTML = secciones.consultar;
  const lista = document.getElementById('listaLibros');
  try {
    const res = await fetch(`${API_BASE}/libros`);
    if (!res.ok) throw new Error('Error al obtener libros');
    const libros = await res.json();
    lista.innerHTML = libros.map(libro => `
      <div style="border:1px solid #ccc; margin:8px; padding:10px;">
        <strong>${libro.titulo}</strong><br>
        Autor: ${libro.autor}<br>
        Categoría: ${libro.categoria || 'N/A'}<br>
        Año: ${libro.anio || 'N/A'}<br>
        Cantidad: ${libro.cantidad}
      </div>
    `).join('');
  } catch (err) {
    console.error(err);
    lista.innerHTML = '<p style="color:red;">Error al conectar con el servidor.</p>';
  }
}

async function registrarLibro() {
  content.innerHTML = secciones.registrar;
  const form = document.getElementById('formRegistrarLibro');
  const msg = document.getElementById('mensajeRegistro');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nuevo = {
      titulo: document.getElementById('tituloLibro').value.trim(),
      autor: document.getElementById('autorLibro').value.trim(),
      categoria: document.getElementById('categoriaLibro').value.trim(),
      anio: parseInt(document.getElementById('anioLibro').value, 10),
      cantidad: parseInt(document.getElementById('cantidadLibro').value, 10)
    };
    try {
      const res = await fetch(`${API_BASE}/libros`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(nuevo)
      });
      if (!res.ok) throw new Error('No se pudo registrar');
      msg.textContent = '✅ Libro registrado correctamente.';
      msg.style.color = 'green';
      form.reset();
    } catch (err) {
      msg.textContent = '❌ Error al registrar el libro.';
      msg.style.color = 'red';
    }
  });
}

// ===== FUNCIONES: USUARIOS =====
async function mostrarUsuarios() {
  content.innerHTML = secciones.usuarios;
  const lista = document.getElementById('listaUsuarios');
  const form = document.getElementById('formUsuario');

  async function cargarLista() {
    try {
      const res = await fetch(`${API_BASE}/usuarios`);
      const usuarios = await res.json();
      lista.innerHTML = usuarios.map(u => `
        <div style="border-bottom:1px solid #ccc; padding:8px;">
          👤 <strong>${u.nombre}</strong> - ${u.correo} (${u.rol_id || u.rol || 'N/A'})
        </div>
      `).join('');
    } catch (err) {
      lista.innerHTML = '<p style="color:red;">Error al cargar usuarios.</p>';
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nuevo = {
      nombre: document.getElementById('nombreUsuario').value.trim(),
      correo: document.getElementById('correoUsuario').value.trim(),
      contraseña: document.getElementById('contrasenaUsuario').value.trim(),
      rol: document.getElementById('rolUsuario').value
    };
    try {
      const res = await fetch(`${API_BASE}/usuarios`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(nuevo)
      });
      if (!res.ok) throw new Error('Error al crear usuario');
      form.reset();
      cargarLista();
    } catch (err) {
      alert('No se pudo crear el usuario');
    }
  });

  cargarLista();
}

// ===== FUNCIONES: PRÉSTAMOS =====
async function mostrarPrestamos() {
  content.innerHTML = secciones.prestamos;
  const lista = document.getElementById('listaPrestamos');
  const selectLibro = document.getElementById('selectLibroPrestamo');
  const selectUsuario = document.getElementById('selectUsuarioPrestamo');
  const btnPrestar = document.getElementById('btnPrestar');

  // cargar opciones
  const [librosRes, usuariosRes] = await Promise.all([
    fetch(`${API_BASE}/libros`),
    fetch(`${API_BASE}/usuarios`)
  ]);
  const libros = await librosRes.json();
  const usuarios = await usuariosRes.json();

  selectLibro.innerHTML = libros.map(l => `<option value="${l.id}">${l.titulo}</option>`).join('');
  selectUsuario.innerHTML = usuarios.map(u => `<option value="${u.id}">${u.nombre}</option>`).join('');

  // cargar prestamos
  async function refresh() {
    try {
      const res = await fetch(`${API_BASE}/prestamos`);
      const prestamos = await res.json();
      lista.innerHTML = prestamos.map(p => `
        <div style="border-bottom:1px solid #ccc; padding:8px;">
          📚 <strong>${p.Libro || p.titulo}</strong> — Usuario: ${p.Usuario || p.nombre} — Fecha: ${new Date(p.fecha_prestamo).toLocaleString()} — Estado: ${p.estado}
          ${p.estado === 'Activo' ? `<button data-id="${p.id}" class="devolver">Devolver</button>` : ''}
        </div>
      `).join('');

      // listeners para devolver
      document.querySelectorAll('.devolver').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const id = e.target.dataset.id;
          try {
            const res = await fetch(`${API_BASE}/prestamos/${id}`, { method: 'PUT' });
            if (res.ok) refresh();
          } catch (err) { console.error(err); }
        });
      });
    } catch (err) {
      lista.innerHTML = '<p style="color:red;">Error al cargar préstamos.</p>';
    }
  }

  btnPrestar.addEventListener('click', async () => {
    const payload = {
      usuario_id: parseInt(selectUsuario.value, 10),
      libro_id: parseInt(selectLibro.value, 10)
    };
    try {
      const res = await fetch(`${API_BASE}/prestamos`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(payload)
      });
      if (res.ok) refresh();
      else alert('No se pudo registrar préstamo');
    } catch (err) { console.error(err); }
  });

  refresh();
}

// ===== FUNCIONES: RESERVAS =====
async function mostrarReservas() {
  content.innerHTML = secciones.reservas;
  const lista = document.getElementById('listaReservas');
  const selectLibro = document.getElementById('selectLibroReserva');
  const selectUsuario = document.getElementById('selectUsuarioReserva');
  const btnReservar = document.getElementById('btnReservar');

  // cargar opciones
  const [librosRes, usuariosRes] = await Promise.all([
    fetch(`${API_BASE}/libros`),
    fetch(`${API_BASE}/usuarios`)
  ]);
  const libros = await librosRes.json();
  const usuarios = await usuariosRes.json();

  selectLibro.innerHTML = libros.map(l => `<option value="${l.id}">${l.titulo}</option>`).join('');
  selectUsuario.innerHTML = usuarios.map(u => `<option value="${u.id}">${u.nombre}</option>`).join('');

  // cargar reservas
  async function refresh() {
    try {
      const res = await fetch(`${API_BASE}/reservas`);
      const reservas = await res.json();
      lista.innerHTML = reservas.map(r => `
        <div style="border-bottom:1px solid #ccc; padding:8px;">
          📌 <strong>${r.titulo || r.Libro}</strong> — Usuario: ${r.nombre || r.Usuario} — Fecha: ${new Date(r.fecha_reserva).toLocaleString()} — Estado: ${r.estado}
        </div>
      `).join('');
    } catch (err) {
      lista.innerHTML = '<p style="color:red;">Error al cargar reservas.</p>';
    }
  }

  btnReservar.addEventListener('click', async () => {
    const payload = {
      usuario_id: parseInt(selectUsuario.value, 10),
      libro_id: parseInt(selectLibro.value, 10)
    };
    try {
      const res = await fetch(`${API_BASE}/reservas`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(payload)
      });
      if (res.ok) refresh();
      else alert('No se pudo crear la reserva');
    } catch (err) { console.error(err); }
  });

  refresh();
}

// ===== CAMBIO DE SECCIONES =====
document.querySelectorAll('.sidebar a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const section = e.target.closest('a').dataset.section;
    content.innerHTML = secciones[section] || '<h1>Sección no encontrada</h1>';

    if (section === 'salir') {
      localStorage.removeItem('biblio_user');
      setTimeout(() => window.location.href = 'index.html', 800);
      return;
    }

    switch (section) {
      case 'consultar': mostrarLibros(); break;
      case 'registrar': registrarLibro(); break;
      case 'usuarios': mostrarUsuarios(); break;
      case 'prestamos': mostrarPrestamos(); break;
      case 'reservas': mostrarReservas(); break;
    }

    closeMenu();
  });
});
