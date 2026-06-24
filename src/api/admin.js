const libros = [
  { id: 1, title: "El Principito", author: "Antoine de Saint-Exupéry", price: 4500, publishedYear: 1943, categoryId: 1 }
];

const usuarios = [
  { id: 1, name: "Administrador Principal", email: "admin@libreria.com", password: "1234" }
];

// ===== LIBROS =====
const libroId = document.getElementById("libroId");
const title = document.getElementById("title");
const author = document.getElementById("author");
const price = document.getElementById("price");
const publishedYear = document.getElementById("publishedYear");
const categoryId = document.getElementById("categoryId");
const tablaLibros = document.getElementById("tabla-libros-body");

document.getElementById("btn-crear-libro").addEventListener("click", crearLibro);
document.getElementById("btn-modificar-libro").addEventListener("click", modificarLibro);
document.getElementById("btn-eliminar-libro").addEventListener("click", eliminarLibro);

// ===== USUARIOS =====
const userId = document.getElementById("userId");
const nameUser = document.getElementById("name");
const email = document.getElementById("email");
const password = document.getElementById("password");
const tablaUsuarios = document.getElementById("tabla-usuarios-body");

document.getElementById("btn-crear-user").addEventListener("click", crearUsuario);
document.getElementById("btn-modificar-user").addEventListener("click", modificarUsuario);
document.getElementById("btn-eliminar-user").addEventListener("click", eliminarUsuario);

// ===== TOAST =====
const toast = document.createElement("div");
toast.style.cssText = `
  position:fixed; top:20px; right:20px; background:#1f7a4f; color:#fff;
  padding:12px 18px; border-radius:10px; font-weight:600; z-index:9999;
  opacity:0; transition:.3s; box-shadow:0 10px 25px rgba(0,0,0,.2)
`;
document.body.appendChild(toast);

function mostrarToast(texto) {
  toast.textContent = texto;
  toast.style.opacity = "1";
  setTimeout(() => toast.style.opacity = "0", 2200);
}

// ===== MODAL =====
const modal = document.createElement("div");
modal.style.cssText = `
  position:fixed; inset:0; background:rgba(0,0,0,.45); display:none;
  align-items:center; justify-content:center; z-index:9998;
`;
modal.innerHTML = `
  <div style="background:#fff; padding:25px; border-radius:14px; width:320px; text-align:center;">
    <h3 style="margin-bottom:10px;">Confirmar</h3>
    <p id="modal-texto">¿Seguro?</p>
    <div style="margin-top:20px; display:flex; justify-content:center; gap:10px;">
      <button id="cancelar-modal" style="padding:10px 16px; border:none; border-radius:8px; background:#ddd; cursor:pointer;">Cancelar</button>
      <button id="confirmar-modal" style="padding:10px 16px; border:none; border-radius:8px; background:#c0392b; color:#fff; cursor:pointer;">Eliminar</button>
    </div>
  </div>
`;
document.body.appendChild(modal);

const modalTexto = modal.querySelector("#modal-texto");
const btnCancelar = modal.querySelector("#cancelar-modal");
const btnConfirmar = modal.querySelector("#confirmar-modal");
let accion = null;

function abrirModal(texto, callback) {
  modalTexto.textContent = texto;
  accion = callback;
  modal.style.display = "flex";
}
btnCancelar.onclick = () => modal.style.display = "none";
btnConfirmar.onclick = () => {
  if (accion) accion();
  modal.style.display = "none";
};

// ===== RENDER =====
function renderLibros() {
  tablaLibros.innerHTML = libros.map(l => `
    <tr onclick="cargarLibro(${l.id})" style="cursor:pointer">
      <td>${l.id}</td>
      <td>${l.title}</td>
      <td>${l.author}</td>
      <td><strong>$${Number(l.price).toLocaleString("es-AR")}</strong></td>
      <td>${l.publishedYear}</td>
      <td><span class="badge-cat">${l.categoryId}</span></td>
    </tr>
  `).join("");
}

function renderUsuarios() {
  tablaUsuarios.innerHTML = usuarios.map(u => `
    <tr onclick="cargarUsuario(${u.id})" style="cursor:pointer">
      <td>${u.id}</td>
      <td>${u.name}</td>
      <td>${u.email}</td>
    </tr>
  `).join("");
}

// ===== LIBROS FUNCIONES =====
function cargarLibro(id) {
  const l = libros.find(libro => libro.id === id);
  libroId.value = l.id;
  title.value = l.title;
  author.value = l.author;
  price.value = l.price;
  publishedYear.value = l.publishedYear;
  categoryId.value = l.categoryId;
}

function crearLibro() {
  if (!title.value || !author.value || !price.value || !publishedYear.value || !categoryId.value) {
    return mostrarToast("Completá todos los campos del libro");
  }

  libros.push({
    id: libros.length ? libros[libros.length - 1].id + 1 : 1,
    title: title.value,
    author: author.value,
    price: price.value,
    publishedYear: publishedYear.value,
    categoryId: categoryId.value
  });

  renderLibros();
  limpiarLibro();
  mostrarToast("Libro guardado correctamente");
}

function modificarLibro() {
  const l = libros.find(libro => libro.id == libroId.value);
  if (!l) return mostrarToast("Ingresá un ID válido de libro");

  l.title = title.value;
  l.author = author.value;
  l.price = price.value;
  l.publishedYear = publishedYear.value;
  l.categoryId = categoryId.value;

  renderLibros();
  limpiarLibro();
  mostrarToast("Libro modificado correctamente");
}

function eliminarLibro() {
  const index = libros.findIndex(libro => libro.id == libroId.value);
  if (index === -1) return mostrarToast("Ingresá un ID válido de libro");

  abrirModal(`¿Eliminar el libro "${libros[index].title}"?`, () => {
    libros.splice(index, 1);
    renderLibros();
    limpiarLibro();
    mostrarToast("Libro eliminado correctamente");
  });
}

function limpiarLibro() {
  libroId.value = title.value = author.value = price.value = publishedYear.value = categoryId.value = "";
}

// ===== USUARIOS FUNCIONES =====
function cargarUsuario(id) {
  const u = usuarios.find(user => user.id === id);
  userId.value = u.id;
  nameUser.value = u.name;
  email.value = u.email;
  password.value = u.password;
}

function crearUsuario() {
  if (!nameUser.value || !email.value || !password.value) {
    return mostrarToast("Completá todos los campos del usuario");
  }

  usuarios.push({
    id: usuarios.length ? usuarios[usuarios.length - 1].id + 1 : 1,
    name: nameUser.value,
    email: email.value,
    password: password.value
  });

  renderUsuarios();
  limpiarUsuario();
  mostrarToast("Usuario registrado correctamente");
}

function modificarUsuario() {
  const u = usuarios.find(user => user.id == userId.value);
  if (!u) return mostrarToast("Ingresá un ID válido de usuario");

  u.name = nameUser.value;
  u.email = email.value;
  u.password = password.value;

  renderUsuarios();
  limpiarUsuario();
  mostrarToast("Usuario modificado correctamente");
}

function eliminarUsuario() {
  const index = usuarios.findIndex(user => user.id == userId.value);
  if (index === -1) return mostrarToast("Ingresá un ID válido de usuario");

  abrirModal(`¿Eliminar al usuario "${usuarios[index].name}"?`, () => {
    usuarios.splice(index, 1);
    renderUsuarios();
    limpiarUsuario();
    mostrarToast("Usuario eliminado correctamente");
  });
}

function limpiarUsuario() {
  userId.value = nameUser.value = email.value = password.value = "";
}

window.cargarLibro = cargarLibro;
window.cargarUsuario = cargarUsuario;

renderLibros();
renderUsuarios();