document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('formContacto');
  const tabla = document.getElementById('tablaContactos');

  // URL según entorno
  const API_URL = window.location.hostname.includes('localhost')
    ? 'http://localhost:3000/api/contactos'
    : 'https://agenda-contactos-i19h.onrender.com/api/contactos';

  // Cargar contactos al iniciar
  if (tabla) cargarContactos();

  // Envío del formulario
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const id = document.getElementById('contactoId').value;
      const data = {
        nombre: document.getElementById('nombre').value.trim(),
        telefono: document.getElementById('telefono').value.trim(),
        correo: document.getElementById('correo').value.trim()
      };

      const method = id ? 'PUT' : 'POST';
      const url = id ? `${API_URL}/${id}` : API_URL;

      try {
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        if (!res.ok) throw new Error("Error al guardar contacto");
        alert('✅ Contacto guardado');
        window.location.href = 'index.html';
      } catch (err) {
        console.error(err);
        alert(`❌ ${err.message}`);
      }
    });
  }

  // Función para cargar contactos
  async function cargarContactos() {
    const buscar = document.getElementById('buscar')?.value || '';
    const url = `${API_URL}?nombre=${buscar}`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Error al cargar contactos");

      const contactos = await res.json();
      mostrarContactos(contactos);
    } catch (err) {
      console.error(err);
      alert('❌ Error al cargar contactos');
    }
  }

  // Mostrar contactos
  function mostrarContactos(contactos) {
    if (!tabla) return;
    tabla.innerHTML = `
      <tr>
        <th>Nombre</th>
        <th>Teléfono</th>
        <th>Correo</th>
        <th>Acciones</th>
      </tr>
    `;

    if (contactos.length === 0) {
      tabla.innerHTML += `<tr><td colspan="4">No hay contactos</td></tr>`;
      return;
    }

    contactos.forEach(c => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${c.nombre}</td>
        <td>${c.telefono}</td>
        <td>${c.correo || ''}</td>
        <td>
          <button onclick="editarContacto('${c._id}')">Editar</button>
          <button onclick="eliminarContacto('${c._id}')">Eliminar</button>
        </td>
      `;
      tabla.appendChild(row);
    });
  }

  // Editar contacto
  window.editarContacto = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`);
      if (!res.ok) throw new Error("Error al obtener contacto");
      const c = await res.json();
      window.location.href =
        `form.html?id=${id}&nombre=${encodeURIComponent(c.nombre)}&telefono=${encodeURIComponent(c.telefono)}&correo=${encodeURIComponent(c.correo || '')}`;
    } catch (err) {
      console.error(err);
      alert('❌ Error al cargar contacto');
    }
  };

  // Eliminar contacto
  window.eliminarContacto = async (id) => {
    if (!confirm('¿Seguro que deseas eliminar este contacto?')) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Error al eliminar contacto");
      alert('✅ Contacto eliminado');
      cargarContactos();
    } catch (err) {
      console.error(err);
      alert(`❌ ${err.message}`);
    }
  };

  // Precargar formulario
  const params = new URLSearchParams(window.location.search);
  if (params.get('id')) {
    document.getElementById('contactoId').value = params.get('id');
    document.getElementById('nombre').value = params.get('nombre');
    document.getElementById('telefono').value = params.get('telefono');
    document.getElementById('correo').value = params.get('correo');
  }

  window.cargarContactos = cargarContactos;
});
