document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('formContacto');
  const tabla = document.getElementById('tablaContactos');

  // 🔹 URL fija de Render
  const API_URL = 'https://agenda-contactos-i19h.onrender.com/api/contactos';

  // Cargar contactos al iniciar
  cargarContactos();

  // Manejar envío del formulario (crear o actualizar)
  if (form) {
    form.addEventListener('submit', async function (e) {
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

        alert('✅ Contacto guardado con éxito');
        window.location.href = 'index.html';
      } catch (error) {
        console.error('Error:', error);
        alert(`❌ ${error.message}`);
      }
    });
  }

  // Función para cargar contactos
  async function cargarContactos() {
    const buscar = document.getElementById('buscar')?.value || '';
    let url = `${API_URL}?nombre=${buscar}`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Error al cargar contactos");

      const contactos = await res.json();
      mostrarContactos(contactos);
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al cargar contactos');
    }
  }

  // Mostrar contactos en la tabla
  function mostrarContactos(contactos) {
    if (!tabla) return;

    tabla.innerHTML = '';

    if (contactos.length === 0) {
      tabla.innerHTML = `<tr><td colspan="4">No hay contactos</td></tr>`;
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
  window.editarContacto = async function (id) {
    try {
      const res = await fetch(`${API_URL}/${id}`);
      if (!res.ok) throw new Error("Error al obtener contacto");

      const c = await res.json();
      window.location.href =
        `form.html?id=${id}&nombre=${encodeURIComponent(c.nombre)}&telefono=${encodeURIComponent(c.telefono)}&correo=${encodeURIComponent(c.correo || '')}`;
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al cargar contacto para editar');
    }
  };

  // Eliminar contacto
  window.eliminarContacto = async function (id) {
    if (!confirm('¿Seguro que deseas eliminar este contacto?')) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Error al eliminar contacto");

      alert('✅ Contacto eliminado');
      cargarContactos();
    } catch (error) {
      console.error('Error:', error);
      alert(`❌ ${error.message}`);
    }
  };

  // Pre-cargar datos en formulario al editar
  const params = new URLSearchParams(window.location.search);
  if (params.get('id')) {
    document.getElementById('contactoId').value = params.get('id');
    document.getElementById('nombre').value = params.get('nombre');
    document.getElementById('telefono').value = params.get('telefono');
    document.getElementById('correo').value = params.get('correo');
  }

  // Hacer accesible cargarContactos para botones de búsqueda
  window.cargarContactos = cargarContactos;
});
