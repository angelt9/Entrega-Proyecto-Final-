const listProds = [
    {
        id: 1, name: "Creatina", amount: 1, price: 5000,
    },
    {
        id: 2, name: "Remera Hombre", amount: 1, price: 3000,
    },
    {
        id: 3, name: "Remera Mujer", amount: 1, price: 3000,
    }
];

let cart = [];

const container = document.querySelector("#container");
const cartContainer = document.querySelector("#cartContainer");
const clearCart = document.querySelector("#clearCart");
const totalPrice = document.querySelector("#totalPrice");
const pushFunct = document.querySelector("#pushFunct");
const processBuy = document.querySelector("#processBuy");
const totalProc = document.querySelector("#totalProc");
const form = document.querySelector('#procPayment')

if (pushFunct) {
    pushFunct.addEventListener("click", procOrder);
}

document.addEventListener("DOMContentLoaded", () => {
    cart = JSON.parse(localStorage.getItem("cart")) || [];
    showCart();
    document.querySelector("#pushFunct").click(procOrder);
});
if (form) {
    form.addEventListener('submit', sendPurch)
}

if (clearCart) {
    clearCart.addEventListener("click", () => {
        cart.length = [];
        showCart();
    });
}

if (processBuy) {
    processBuy.addEventListener("click", () => {
        if (cart.length === 0) {
            Swal.fire({
                title: "El carrito está vacío!",
                text: "Compra algo para continuar con la compra",
                confirmButtonText: "Aceptar",
            });
        } else {
            location.href = "compra.html";
        }
    });
}

listProds.forEach((prod) => {
    const { id, name, price} = prod;
    if (container) {
        container.innerHTML += `
        <div class="card mt-3" style="width: 18rem;">
            <div class="card-body">
                <h5 class="card-title">${name}</h5>
                <p class="card-text">Precio: ${price}</p>
                <button class="btn btn-primary" onclick="addProd(${id})">Agregar Producto</button>
            </div>
        </div>`;
    }
});

const addProd = (id) => {
    const exist = cart.some(prod => prod.id === id)
    if (exist) {
        const prod = cart.map(prod => {
            if (prod.id === id) {
                prod.amount++
            }
        })
    } else {
        const item = listProds.find((prod) => prod.id === id)
        cart.push(item)
    }
    showCart()
};

const showCart = () => {
    const modalBody = document.querySelector(".modal .modal-body");
    if (modalBody) {
        modalBody.innerHTML = "";
        cart.forEach((prod) => {
            const { id, name, price, amount } = prod;
            modalBody.innerHTML += `
        <div class="modal-contenedor">
            <div>
                <p>Producto: ${name}</p>
                <p>Precio: ${price}</p>
                <p>Cantidad :${amount}</p>
                <button class="btn btn-danger"  onclick="delProd(${id})">Eliminar del carrito</button>
            </div>
        </div>`;
        });
    }

    if (cart.length === 0) {
        modalBody.innerHTML = `<p class="text-center text-primary parrafo">Todavía no agregaste nada!</p>`;
    }
    cartContainer.textContent = cart.length;
    if (totalPrice) {
        totalPrice.innerText = cart.reduce(
            (acc, prod) => acc + prod.amount * prod.price,
            0
        );
    }
    saveStorage();
};

function saveStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function delProd(id) {
    const prodId = id;
    cart = cart.filter((prod) => prod.id !== prodId);
    showCart();
}
function procOrder() {
    cart.forEach((prod) => {
        const listaCompra = document.querySelector("tbody");
        const {name, price, amount } = prod;
        if (listaCompra) {
            const row = document.createElement("tr");
            row.innerHTML += `
                <td>${name}</td>
                <td>${price}</td>
                <td>${amount}</td>
                <td>${price * amount}</td>`;
            listaCompra.appendChild(row);
        }
    });
    totalProc.innerText = cart.reduce(
        (acc, prod) => acc + prod.amount * prod.price,
        0
    );
}

function sendPurch(e) {
    e.preventDefault()
    const client = document.querySelector('#client').value
    const email = document.querySelector('#correo').value

    if (email === '' || client == '') {
        Swal.fire({
            title: "Completa con tu nombre y email",
            confirmButtonText: "Aceptar",
        })
    } else {
        const successAlert = document.createElement('p')
        successAlert.classList.add('alert', 'alerta', 'd-block', 'text-center', 'col-12', 'mt-2', 'alert-success')
        successAlert.textContent = `Muchas gracias ${client} por su compra!`
        form.appendChild(successAlert)
        form.reset()
        setTimeout(() => {
            successAlert.remove()
        }, 2000)
    }
    localStorage.clear()
}