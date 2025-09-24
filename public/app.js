const API_URL = "/api/contactos";

// Cargar contactos
async function cargarContactos() {
  const nombre = document.getElementById("buscar")?.value || "";
  const res = await fetch(`${API_URL}?nombre=${nombre}`);
  const contactos = await res.json();

  const tabla = document.getElementById("tablaContactos");
  if (tabla) {
    tabla.innerHTML = contactos.map(c => `
      <tr>
        <td>${c.nombre}</td>
        <td>${c.telefono}</td>
        <td>${c.correo || ""}</td>
        <td>
          <button onclick="editarContacto('${c._id}')">Editar</button>
          <button onclick="eliminarContacto('${c._id}')">Eliminar</button>
        </td>
      </tr>`).join("");
  }
}

// Guardar contacto
document.getElementById("formContacto")?.addEventListener("submit", async e => {
  e.preventDefault();
  const id = document.getElementById("contactoId").value;
  const data = {
    nombre: document.getElementById("nombre").value,
    telefono: document.getElementById("telefono").value,
    correo: document.getElementById("correo").value
  };
  const method = id ? "PUT" : "POST";
  const url = id ? `${API_URL}/${id}` : API_URL;

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (res.ok) {
    alert("Contacto guardado con éxito");
    window.location.href = "index.html";
  } else {
    alert("Error al guardar");
  }
});

// Editar
async function editarContacto(id) {
  const res = await fetch(`${API_URL}/${id}`);
  const c = await res.json();
  window.location.href = `form.html?id=${id}&nombre=${c.nombre}&telefono=${c.telefono}&correo=${c.correo || ""}`;
}

// Eliminar
async function eliminarContacto(id) {
  if (confirm("¿Eliminar contacto?")) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    alert("Contacto eliminado");
    cargarContactos();
  }
}

// Pre-cargar datos en form
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
