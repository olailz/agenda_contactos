const API_URL = window.location.hostname.includes("localhost")
  ? "http://localhost:3000/api/contactos"
  : "/api/contactos";

/* ========== VALIDACIONES ========== */
function validarFormulario(data) {
  if (!data.nombre || data.nombre.trim().length < 3) {
    mostrarNotificacion("❌ El nombre debe tener al menos 3 caracteres", "error");
    return false;
  }
  const telRegex = /^[0-9]{8,15}$/;
  if (!telRegex.test(data.telefono)) {
    mostrarNotificacion("❌ El teléfono debe tener entre 8 y 15 dígitos", "error");
    return false;
  }
  if (data.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.correo)) {
    mostrarNotificacion("❌ Correo inválido", "error");
    return false;
  }
  return true;
}

/* ========== NOTIFICACIONES ========== */
function mostrarNotificacion(msg, tipo="info") {
  const notif = document.createElement("div");
  notif.textContent = msg;
  notif.className = `notif ${tipo}`;
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 3000);
}

/* ========== CARGAR CONTACTOS ========== */
async function cargarContactos() {
  try {
    const nombre = document.getElementById("inputBusqueda")?.value || "";
    const res = await fetch(`${API_URL}?nombre=${nombre}`);
    if (!res.ok) throw new Error("Error al obtener contactos");
    const contactos = await res.json();
    const tabla = document.getElementById("tablaContactos").querySelector("tbody");
    tabla.innerHTML = contactos.map(c => `
      <tr>
        <td>${c.nombre}</td>
        <td>${c.telefono}</td>
        <td>${c.correo || ""}</td>
        <td>
          <button onclick="editarContacto('${c._id}')">Editar</button>
          <button onclick="eliminarContacto('${c._id}')">Eliminar</button>
        </td>
      </tr>
    `).join("");
  } catch (error) {
    console.error(error);
    mostrarNotificacion("❌ No se pudieron cargar los contactos", "error");
  }
}

/* ========== GUARDAR CONTACTO ========== */
document.getElementById("formContacto")?.addEventListener("submit", async e => {
  e.preventDefault();
  const id = document.getElementById("contactoId").value;
  const data = {
    nombre: document.getElementById("nombre").value.trim(),
    telefono: document.getElementById("telefono").value.trim(),
    correo: document.getElementById("correo").value.trim()
  };
  if (!validarFormulario(data)) return;

  const method = id ? "PUT" : "POST";
  const url = id ? `${API_URL}/${id}` : API_URL;

  try {
    const res = await fetch(url, {
      method,
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data)
    });
    if (res.ok) {
      mostrarNotificacion("✅ Contacto guardado", "success");
      setTimeout(() => window.location.href = "index.html", 1000);
    } else {
      const err = await res.json();
      mostrarNotificacion("❌ Error: " + (err.error || "No se pudo guardar"), "error");
    }
  } catch(err) {
    console.error(err);
    mostrarNotificacion("❌ Error de conexión", "error");
  }
});

/* ========== EDITAR CONTACTO ========== */
async function editarContacto(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error("No se pudo obtener el contacto");
    const c = await res.json();
    window.location.href = `form.html?id=${id}&nombre=${encodeURIComponent(c.nombre)}&telefono=${encodeURIComponent(c.telefono)}&correo=${encodeURIComponent(c.correo || "")}`;
  } catch(err) {
    console.error(err);
    mostrarNotificacion("❌ Error al cargar el contacto", "error");
  }
}

/* ========== ELIMINAR CONTACTO ========== */
async function eliminarContacto(id) {
  if (confirm("⚠️ ¿Seguro que quieres eliminar este contacto?")) {
    try {
      const res = await fetch(`${API_URL}/${id}`, {method:"DELETE"});
      if (res.ok) {
        mostrarNotificacion("🗑️ Contacto eliminado", "success");
        cargarContactos();
      } else {
        const err = await res.json();
        mostrarNotificacion("❌ Error: " + (err.error || "No se pudo eliminar"), "error");
      }
    } catch(err) {
      console.error(err);
      mostrarNotificacion("❌ Error de conexión", "error");
    }
  }
}

/* ========== PRECARGAR DATOS FORMULARIO ========== */
window.onload = () => {
  const params = new URLSearchParams(window.location.search);
  if (params.get("id")) {
    document.getElementById("contactoId").value = params.get("id");
    document.getElementById("nombre").value = params.get("nombre");
    document.getElementById("telefono").value = params.get("telefono");
    document.getElementById("correo").value = params.get("correo");
  }
  cargarContactos();
};
