// =====================================
// CONFIGURACIÓN DE ENDPOINTS
// =====================================
// Tus compañeros mañana pueden cambiar estas URLs si el backend usa otras rutas.
const API_BOOKS = "http://localhost:3000/books";
const API_USERS = "http://localhost:3000/users";

// =====================================
// REFERENCIAS DEL DOM - LIBROS
// =====================================
const libroIdInput = document.getElementById("libroId");
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const priceInput = document.getElementById("price");
const publishedYearInput = document.getElementById("publishedYear");
const categoryIdInput = document.getElementById("categoryId");

const btnCrearLibro = document.getElementById("btn-crear-libro");
const btnModificarLibro = document.getElementById("btn-modificar-libro");
const btnEliminarLibro = document.getElementById("btn-eliminar-libro");

const tablaLibrosBody = document.getElementById("tabla-libros-body");

// =====================================
// REFERENCIAS DEL DOM - USUARIOS
// =====================================
const userIdInput = document.getElementById("userId");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const btnCrearUser = document.getElementById("btn-crear-user");
const btnModificarUser = document.getElementById("btn-modificar-user");
const btnEliminarUser = document.getElementById("btn-eliminar-user");

const tablaUsuariosBody = document.getElementById("tabla-usuarios-body");

// =====================================
// FUNCIONES AUXILIARES - LIBROS
// =====================================
function obtenerDatosLibro() {
  return {
    id: libroIdInput.value.trim() ? Number(libroIdInput.value) : null,
    title: titleInput.value.trim(),
    author: authorInput.value.trim(),
    price: priceInput.value.trim() ? Number(priceInput.value) : null,
    publishedYear: publishedYearInput.value.trim()
      ? Number(publishedYearInput.value)
      : null,
    categoryId: categoryIdInput.value.trim()
      ? Number(categoryIdInput.value)
      : null
  };
}

function validarLibro(libro, requiereId = false) {
  if (requiereId && (!libro.id || libro.id <= 0)) {
    alert("Debés ingresar un ID válido del libro.");
    return false;
  }

  if (!libro.title) {
    alert("El título del libro es obligatorio.");
    return false;
  }

  if (!libro.author) {
    alert("El autor del libro es obligatorio.");
    return false;
  }

  if (libro.price === null || isNaN(libro.price) || libro.price <= 0) {
    alert("El precio debe ser un número mayor a 0.");
    return false;
  }
  
  if (
    libro.publishedYear === null ||
    isNaN(libro.publishedYear) ||
    libro.publishedYear <= 0
  ) {
    alert("El año de publicación debe ser un número válido.");
    return false;
  }

  if (
    libro.categoryId === null ||
    isNaN(libro.categoryId) ||
    libro.categoryId <= 0
  ) {
    alert("La categoría debe ser un ID válido.");
    return false;
  }

  return true;
}

function limpiarFormularioLibro() {
  libroIdInput.value = "";
  titleInput.value = "";
  authorInput.value = "";
  priceInput.value = "";
  publishedYearInput.value = "";
  categoryIdInput.value = "";
}

// =====================================
// FUNCIONES AUXILIARES - USUARIOS
// =====================================
function obtenerDatosUsuario() {
  return {
    id: userIdInput.value.trim() ? Number(userIdInput.value) : null,
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    password: passwordInput.value.trim()
  };
}

function validarUsuario(usuario, requiereId = false) {
  if (requiereId && (!usuario.id || usuario.id <= 0)) {
    alert("Debés ingresar un ID válido del usuario.");
    return false;
  }

  if (!usuario.name) {
    alert("El nombre del usuario es obligatorio.");
    return false;
  }

  if (!usuario.email) {
    alert("El email es obligatorio.");
    return false;
  }

  if (!usuario.email.includes("@")) {
    alert("Ingresá un email válido.");
    return false;
  }

  if (!usuario.password || usuario.password.length < 4) {
    alert("La contraseña debe tener al menos 4 caracteres.");
    return false;
  }

  return true;
}

function limpiarFormularioUsuario() {
  userIdInput.value = "";
  nameInput.value = "";
  emailInput.value = "";
  passwordInput.value = "";
}

// =====================================
// RENDER DE TABLAS
// =====================================
function renderizarLibros(libros) {
  tablaLibrosBody.innerHTML = "";

  if (!Array.isArray(libros) || libros.length === 0) {
    tablaLibrosBody.innerHTML = `
      <tr>
        <td colspan="6">No hay libros registrados.</td>
      </tr>
    `;
    return;
  }

  libros.forEach((libro) => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${libro.id ?? "-"}</td>
      <td>${libro.title ?? "-"}</td>
      <td>${libro.author ?? "-"}</td>
      <td><strong>$${Number(libro.price ?? 0).toLocaleString("es-AR")}</strong></td>
      <td>${libro.publishedYear ?? "-"}</td>
      <td><span class="badge-cat">${libro.categoryId ?? "-"}</span></td>
    `;

    tablaLibrosBody.appendChild(fila);
  });
}

function renderizarUsuarios(usuarios) {
  tablaUsuariosBody.innerHTML = "";

  if (!Array.isArray(usuarios) || usuarios.length === 0) {
    tablaUsuariosBody.innerHTML = `
      <tr>
        <td colspan="3">No hay usuarios registrados.</td>
      </tr>
    `;
    return;
  }

  usuarios.forEach((usuario) => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${usuario.id ?? "-"}</td>
      <td>${usuario.name ?? "-"}</td>
      <td>${usuario.email ?? "-"}</td>
    `;

    tablaUsuariosBody.appendChild(fila);
  });
}

// =====================================
// CRUD LIBROS
// =====================================
async function cargarLibros() {
  try {
    const response = await fetch(API_BOOKS);

    if (!response.ok) {
      throw new Error("No se pudieron cargar los libros.");
    }

    const libros = await response.json();
    renderizarLibros(libros);
  } catch (error) {
    console.error("Error al cargar libros:", error);
    alert("Error al cargar libros.");
  }
}

async function crearLibro() {
  const libro = obtenerDatosLibro();

  if (!validarLibro(libro, false)) return;

  try {
    const response = await fetch(API_BOOKS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: libro.title,
        author: libro.author,
        price: libro.price,
        publishedYear: libro.publishedYear,
        categoryId: libro.categoryId
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "No se pudo crear el libro.");
    }

    alert("Libro creado correctamente.");
    limpiarFormularioLibro();
    await cargarLibros();
  } catch (error) {
    console.error("Error al crear libro:", error);
    alert(error.message || "Error al crear el libro.");
  }
}

async function modificarLibro() {
  const libro = obtenerDatosLibro();

  if (!validarLibro(libro, true)) return;

  try {
    const response = await fetch(`${API_BOOKS}/${libro.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: libro.title,
        author: libro.author,
        price: libro.price,
        publishedYear: libro.publishedYear,
        categoryId: libro.categoryId
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "No se pudo modificar el libro.");
    }

    alert("Libro modificado correctamente.");
    limpiarFormularioLibro();
    await cargarLibros();
  } catch (error) {
    console.error("Error al modificar libro:", error);
    alert(error.message || "Error al modificar el libro.");
  }
}

async function eliminarLibro() {
  const id = Number(libroIdInput.value);

  if (!id || id <= 0) {
    alert("Debés ingresar un ID válido del libro a eliminar.");
    return;
  }

  const confirmar = confirm(`¿Seguro que querés eliminar el libro con ID ${id}?`);
  if (!confirmar) return;

  try {
    const response = await fetch(`${API_BOOKS}/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "No se pudo eliminar el libro.");
    }

    alert("Libro eliminado correctamente.");
    limpiarFormularioLibro();
    await cargarLibros();
  } catch (error) {
    console.error("Error al eliminar libro:", error);
    alert(error.message || "Error al eliminar el libro.");
  }
}

// =====================================
// CRUD USUARIOS
// =====================================
async function cargarUsuarios() {
  try {
    const response = await fetch(API_USERS);

    if (!response.ok) {
      throw new Error("No se pudieron cargar los usuarios.");
    }

    const usuarios = await response.json();
    renderizarUsuarios(usuarios);
  } catch (error) {
    console.error("Error al cargar usuarios:", error);
    alert("Error al cargar usuarios.");
  }
}

async function crearUsuario() {
  const usuario = obtenerDatosUsuario();

  if (!validarUsuario(usuario, false)) return;

  try {
    const response = await fetch(API_USERS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: usuario.name,
        email: usuario.email,
        password: usuario.password
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "No se pudo crear el usuario.");
    }

    alert("Usuario creado correctamente.");
    limpiarFormularioUsuario();
    await cargarUsuarios();
  } catch (error) {
    console.error("Error al crear usuario:", error);
    alert(error.message || "Error al crear el usuario.");
  }
}

async function modificarUsuario() {
  const usuario = obtenerDatosUsuario();

  if (!validarUsuario(usuario, true)) return;

  try {
    const response = await fetch(`${API_USERS}/${usuario.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: usuario.name,
        email: usuario.email,
        password: usuario.password
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "No se pudo modificar el usuario.");
    }

    alert("Usuario modificado correctamente.");
    limpiarFormularioUsuario();
    await cargarUsuarios();
  } catch (error) {
    console.error("Error al modificar usuario:", error);
    alert(error.message || "Error al modificar el usuario.");
  }
}

async function eliminarUsuario() {
  const id = Number(userIdInput.value);

  if (!id || id <= 0) {
    alert("Debés ingresar un ID válido del usuario a eliminar.");
    return;
  }

  const confirmar = confirm(`¿Seguro que querés eliminar el usuario con ID ${id}?`);
  if (!confirmar) return;

  try {
    const response = await fetch(`${API_USERS}/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "No se pudo eliminar el usuario.");
    }

    alert("Usuario eliminado correctamente.");
    limpiarFormularioUsuario();
    await cargarUsuarios();
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    alert(error.message || "Error al eliminar el usuario.");
  }
}

// =====================================
// EVENTOS
// =====================================
btnCrearLibro.addEventListener("click", crearLibro);
btnModificarLibro.addEventListener("click", modificarLibro);
btnEliminarLibro.addEventListener("click", eliminarLibro);

btnCrearUser.addEventListener("click", crearUsuario);
btnModificarUser.addEventListener("click", modificarUsuario);
btnEliminarUser.addEventListener("click", eliminarUsuario);

// =====================================
// INICIALIZACIÓN
// =====================================
document.addEventListener("DOMContentLoaded", () => {
  cargarLibros();
  cargarUsuarios();
});