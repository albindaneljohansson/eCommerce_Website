// Variables

const cartBtn = document.querySelector('.cart-btn');
const CloseCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center');

// Cart
let cart = [];

// Buttons
//let buttonsDOM = buttons;



// ************************************************** //
//               fetch all products
class Products {
    async getProducts() {
        try {
            let result = await fetch("https://fakestoreapi.com/products/");
            let products = await result.json();
            return products;
        } catch (error) {
            console.log(error);
        }
    }

}

// ************************************************** //
//                class UI - 8 methods

class UI {
    // Load all products to UI
    displayProducts(products) {
        let result = '';
        products.forEach(product => {
            result += `  <!-- single product -->
        <article class="product">
            <div class="img-container">
                <img src=${product.image} alt="product" class="product-img">
                <button class="bag-btn" data-id=${product.id}>
                    <i class="fas fa-shopping-cart"></i>
                    add to cart
                </button>
            </div>
            <h3>${product.title}</h3>
            <h4>$${Number(product.price).toFixed(2)}</h4>
        </article>
        <!-- end of single product -->`;
        });
        productsDOM.innerHTML = result;
    }
    // Get all bagbuttons and add product ID to add-to-cart-button
    getBagButtons() {
        const buttons = [...document.querySelectorAll(".bag-btn")];

        buttons.forEach(button => {
            let id = button.dataset.id;                     // Get ID from button
            let inCart = cart.find(item => item.id === id); // ForEach b - is ID in cart - Boolean

            if (inCart) {                                      // When ID is in cart - disable button
                button.innerText = "In Cart";
                button.disable = true;
            }

            button.addEventListener('click', (event) => {
                event.target.innerText = "In Cart";
                event.target.disabled = true;
                // get product & create 
                let cartItem = { ...Storage.getProduct(id), amount: 1 };
                console.log(cartItem);

                // add product to cart
                cart = [...cart, cartItem]

                // save cart in local storage
                Storage.saveCart(cart);

                // set cart values
                this.setCartValues(cart);

                // display cart item
                this.addCartItem(cartItem);

                // show the cart
            })

        })
    }
    // Update cart values
    setCartValues(cart){
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map(item => {
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        })
        cartTotal.innerText = Number(parseFloat(tempTotal.toFixed(2))).toFixed(2);
        cartItems.innerText = itemsTotal;
    }
    addCartItem(item){

    }
}

// ************************************************** //
//                    local storage

class Storage {
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products));
    }
    static getProduct(id) {
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find(product => product.id == id);

    }
    static saveCart (cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
}

// ************************************************** //
// Initialize - fetch products - save to LS - call UI

document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    const products = new Products();

    products.getProducts().then(products => {
        ui.displayProducts(products);
        Storage.saveProducts(products);
    }).then(() => {
        ui.getBagButtons();
    });
});
