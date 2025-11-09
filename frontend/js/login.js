// js/login.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const API_BASE = 'http://localhost:5000/api';

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const userInput = document.getElementById('loginUser').value.trim();
    const pass = document.getElementById('loginPass').value.trim();

    if (!userInput || !pass) {
      alert('Por favor ingresa usuario (nombre o correo) y contraseña.');
      return;
    }

    try {
      // enviamos { user, pass } al endpoint /api/login
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: userInput, password: pass })
      });

      if (!res.ok) {
        const err = await res.json().catch(()=>({message: 'Error de autenticación'}));
        alert(err.message || 'Usuario o contraseña incorrectos.');
        return;
      }

      const usuario = await res.json(); // { id, nombre, correo, rol }

      // guardamos datos en localStorage para usar en menu.html
      localStorage.setItem('biblio_user', JSON.stringify(usuario));

      // redirigimos a menu.html (asegúrate de que exista)
      window.location.href = 'main.html';
    } catch (err) {
      console.error('Error en login:', err);
      alert('No se pudo conectar con el servidor. Revisa que backend esté en http://localhost:5000');
    }
  });
});
