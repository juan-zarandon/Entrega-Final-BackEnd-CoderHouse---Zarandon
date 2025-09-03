const socket = io();
const productsList = document.getElementById("listaProductos");
const formCreate = document.getElementById("formCrear");
const formDelete = document.getElementById("formEliminar");

socket.on("productos:lista", (products) => {
  productsList.innerHTML = "";
  products.forEach((product) => {
    const li = document.createElement("li");
    li.textContent = `${product.title} - $${product.price}`;
    productsList.appendChild(li);
  });
});

formCreate.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const precio = parseFloat(document.getElementById("precio").value);

  socket.emit("producto:crear", { title: nombre, price: precio });
  formCreate.reset();
});

formDelete.addEventListener("submit", (e) => {
  e.preventDefault();

  const productId = document.getElementById("idProducto").value;

  socket.emit("producto:eliminar", productId);
  formDelete.reset();
});
