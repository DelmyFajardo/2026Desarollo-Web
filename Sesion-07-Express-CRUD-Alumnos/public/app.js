/**
 * app.js — Lógica del sitio (Fetch + Dialogs)
 * Tarea Sesión 7 · Desarrollo Web · UMG
 *
 * TODO: implementa las funciones marcadas. La API exige el header
 * `x-api-key` en las operaciones de escritura (POST, PUT, DELETE).
 */


const API = '/alumnos';
const API_KEY = 'umg-2026'; // debe coincidir con config.env

// Helper ya resuelto: cabeceras para las peticiones
const cabeceras = (conJson = true) => ({
    ...(conJson ? { 'Content-Type': 'application/json' } : {}),
    'x-api-key': API_KEY,
});

// Referencias del DOM (ya resueltas)
const tabla = document.querySelector('#tablaAlumnos tbody');
const mensaje = document.querySelector('#mensaje');
const dialogoForm = document.querySelector('#dialogoForm');
const dialogoEliminar = document.querySelector('#dialogoEliminar');
const form = document.querySelector('#formAlumno');
const tituloForm = document.querySelector('#tituloForm');
const nombreEliminar = document.querySelector('#nombreEliminar');

let idEnEdicion = null;        // null = crear | string = editar
let idAEliminar = null;

/**
 * TODO: GET /alumnos y pinta las filas en la tabla.
 * Cada fila debe incluir botones "Editar" y "Eliminar".
 */
async function cargarAlumnos() {
    try {
        const res = await fetch(API);
        if (!res.ok) throw new Error('Error al cargar la lista de alumnos');
        const alumnos = await res.json();

        tabla.innerHTML = '';
        alumnos.forEach((alumno) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${alumno.nombre} ${alumno.apellido}</td>
                <td>${alumno.email}</td>
                <td>${alumno.edad ?? ''}</td>
                <td>
                    <button class="btn-editar" data-id="${alumno.id}">Editar</button>
                    <button class="btn-eliminar" data-id="${alumno.id}">Eliminar</button>
                </td>
            `;

            // Eventos para botones dentro de la fila
            tr.querySelector('.btn-editar').addEventListener('click', () => abrirDialogoEditar(alumno.id));
            tr.querySelector('.btn-eliminar').addEventListener('click', () => eliminarAlumno(alumno.id, `${alumno.nombre} ${alumno.apellido}`));

            tabla.appendChild(tr);
        });
    } catch (error) {
        mostrarMensaje(error.message, 'error');
    }
}

/**
 * TODO: limpia el formulario, pone el título "Nuevo alumno",
 * idEnEdicion = null y abre dialogoForm con showModal().
 */
function abrirDialogoNuevo() {
    idEnEdicion = null;
    form.reset();
    if (tituloForm) tituloForm.textContent = 'Nuevo alumno';
    dialogoForm.showModal();
}

/**
 * TODO: precarga los datos del alumno en el formulario,
 * guarda su id en idEnEdicion, cambia el título a "Editar alumno"
 * y abre dialogoForm.
 */
function abrirDialogoEditar(id) {
    try {
        if (typeof alumno === 'object' && alumno !== null) {
        idEnEdicion = alumno.id;
        if (tituloForm) tituloForm.textContent = 'Editar alumno';

            form.nombre.value = alumno.nombre;
            form.apellido.value = alumno.apellido;
            form.email.value = alumno.email;
            form.edad.value = alumno.edad ?? '';

            dialogoForm.showModal();
        } 
        if (dialogoForm) dialogoForm.showModal();
    }
    catch (error) {
        mostrarMensaje('Error al abrir el diálogo de edición', 'error');
    }
S}

/**
 * TODO: lee los campos del formulario y llama a la API.
 *   - Si idEnEdicion es null → POST /alumnos            (201)
 *   - Si hay id             → PUT /alumnos/:id          (200)
 * Usa cabeceras() y JSON.stringify(). Al terminar: cierra el dialog,
 * recarga la lista y muestra un mensaje.
 */
async function guardarAlumno(event) {
    if (event) event.preventDefault();

  const datos = {
    nombre: form.nombre.value,
    apellido: form.apellido.value,
    email: form.email.value,
    ...(form.edad.value !== '' ? { edad: Number(form.edad.value) } : {})
  };

  const esEdicion = Boolean(idEnEdicion);
  const url = esEdicion ? `${API}/${idEnEdicion}` : API;
  const metodo = esEdicion ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method: metodo,
      headers: cabeceras(true),
      body: JSON.stringify(datos)
    });

    const respuesta = await res.json();

    if (!res.ok) {
      throw new Error(respuesta.error || 'Error al guardar');
    }

    if (dialogoForm) dialogoForm.close();
    await cargarAlumnos();
    mostrarMensaje(esEdicion ? 'Alumno actualizado' : 'Alumno creado', 'ok');
  } catch (error) {
    mostrarMensaje(error.message, 'error');
  }
}

/**
 * TODO: abre dialogoEliminar guardando el id, y al confirmar hace
 * DELETE /alumnos/:id con cabeceras(false). Luego recarga y avisa.
 */
function eliminarAlumno(id) {
    idAEliminar = id;
    if (nombreEliminar) {
        nombreEliminar.textContent = nombreCompleto;
    }
    dialogoEliminar.showModal();
}

/**
 * TODO: helper para mostrar mensajes (error en rojo, éxito en verde).
 */
function mostrarMensaje(texto, tipo = 'ok') {
    if (!mensaje) return;
    mensaje.textContent = texto;
    mensaje.className = tipo; // Permite aplicar clases CSS como .ok o .error
    mensaje.hidden = false;

    setTimeout(() => {
        mensaje.hidden = true;
    }, 4000);
}

// ============================================================
// Conexión de eventos (TODO: completa lo que falte)
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    btnNuevo?.addEventListener('click', abrirDialogoNuevo);
    form?.addEventListener('submit', guardarAlumno);
    btnCancelarForm?.addEventListener('click', () => dialogoForm.close());
    btnCancelarEliminar?.addEventListener('click', () => dialogoEliminar.close());
    btnConfirmarEliminar?.addEventListener('click', ejecutarEliminar);
    // TODO: botón "Nuevo alumno" → abrirDialogoNuevo()
    // TODO: form submit → guardarAlumno(event)
    // TODO: botón cancelar → dialogoForm.close()
    // TODO: botón cancelar eliminar → dialogoEliminar.close()
    // TODO: botón confirmar eliminar → ejecutar el DELETE
    // TODO: llamar cargarAlumnos() al iniciar
})
