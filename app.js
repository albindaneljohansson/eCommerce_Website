// ************************************************** //
//                       Variables

const cartBtn = document.querySelector('.cart-btn');
const CloseCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const checkoutBtn = document.getElementById("checkout-btn");
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const cartSumPerItem = document.querySelector('.sum-items');
const productsDOM = document.querySelector('.products-center');


// Cart
let cart = [];

// Buttons
let buttonsDOM = [];

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
            result += `
        <article class="product">
            <div class="img-container">
                <img src=${product.image} alt="product" class="product-img">            
                <button class="info-btn" data-id=${product.id}>
                <i class="fas fa-search"></i>
                info
            </button>       
                <button class="bag-btn" data-id=${product.id}>
                    <i class="fas fa-shopping-cart"></i>
                    add to cart
                </button>
            </div>
            <h3>${product.title}</h3>
            <h4>$${Number(product.price).toFixed(2)}</h4>
        </article>`;
        });
        productsDOM.innerHTML = result;
    }
    // Add listener to info buttons and call showModal
    getInfoButtons() {
        const infoButtons = [...document.querySelectorAll(".info-btn")];
        infoButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                let id = button.dataset.id;
                event.preventDefault();
                this.showModal(id);
            })
        });
    }
    // Get all bagbuttons and add product ID to add-to-cart-button
    getBagButtons() {
        const buttons = [...document.querySelectorAll(".bag-btn")];
        buttonsDOM = buttons;
        buttons.forEach(button => {
            let id = button.dataset.id;                     // Get ID from button
            let inCart = cart.find(item => item.id == id); // ForEach b - is ID in cart - Boolean

            if (inCart) {                                      // When ID is in cart - disable button
                button.innerText = "In Cart";
                button.disable = true;
            }

            button.addEventListener('click', (event) => {
                event.target.innerText = "In Cart";
                event.target.disabled = true;
                // get product & create 
                let cartItem = { ...Storage.getProduct(id), amount: 1 };

                // add product to cart
                cart = [...cart, cartItem]

                // save cart in local storage
                Storage.saveCart(cart);

                // set cart values
                this.setCartValues(cart);

                // display cart item
                this.addCartItem(cartItem);

                // show the cart
                this.showCart();
            })
        })
    }


    // Show modal - setText - close modal
    showModal(id) {
        let item = Storage.getProduct(id);
        let myModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('info-modal'));
        myModal.show();
        document.getElementById("modal-title").innerText = item.title;
        document.getElementById("modal-bodyText").innerText = item.description;
        document.getElementById("modal-image").src = item.image;
        document.getElementById("modal-button").addEventListener('click', (event) => { myModal.hide(); });
    }

    // Update cart values
    setCartValues(cart) {
        let tempTotal = 0;
        let itemsTotal = 0;
        // Update sum per item
        this.updateItemSum(cart);
        cart.map(item => {
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        })
        cartTotal.innerText = Number(parseFloat(tempTotal.toFixed(2))).toFixed(2);
        cartItems.innerText = itemsTotal;



    }
    // Add items to sidecart
    addCartItem(item) {
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `<img src=${item.image} alt="product">
<div>
    <h4>${item.title}</h4>
    <h5>$${Number(item.price).toFixed(2)}</h5>
   
    <span class="remove-item fas fa-trash" data-id=${item.id}>
    <span class="sum-items" data-id=${item.id}>Item Total: $${Number(item.price).toFixed(2)} </span></span>
</div>
<div>
<i class="fas fa-chevron-up" data-id=${item.id}></i>
<p class="item-amount">${item.amount}</p>
<i class="fas fa-chevron-down" data-id=${item.id}></i>
</div>`;
        cartContent.appendChild(div);
    }
    // Shows the sidecart & toggle visibility on buttons
    showCart() {
        cartOverlay.classList.add('transparentBcg');
        cartDOM.classList.add('showCart');
        cart = Storage.getCart();
        if (cart.length == 0) {
            checkoutBtn.style.display = "none";
            clearCartBtn.style.display = "none";
        }
        else {
            checkoutBtn.style.display = "inline";
            clearCartBtn.style.display = "inline";
        }
    }
    // Check and load from local storage, set cart values and populate sidecart with items
    setupAPP() {
        cart = Storage.getCart();
        this.setCartValues(cart);
        this.populateCart(cart);
        cartBtn.addEventListener('click', this.showCart); // add listener to cart icon in <Nav>
        CloseCartBtn.addEventListener('click', this.hideCart);
    }
    populateCart(cart) {
        cart.forEach(item => this.addCartItem(item));
    }
    hideCart() {
        cartOverlay.classList.remove('transparentBcg');
        cartDOM.classList.remove('showCart');
    }
    // Add functinality to clear cart-button
    cartLogic() {
        checkoutBtn.addEventListener('click', () => { window.location.href = "checkout.html" });
        clearCartBtn.addEventListener('click', () => { this.clearCart(); });  // add listener to clear cart button & Clear cart
        cartContent.addEventListener('click', event => {                    // Add listener to all buttons in sidecart

            if (event.target.classList.contains('remove-item')) {                // If remove item-button
                let removeItem = event.target;
                let id = removeItem.dataset.id;
                cartContent.removeChild(removeItem.parentElement.parentElement); // Remove item <Div>
                this.removeItem(id);
                cart = Storage.getCart();
                if (cart.length == 0) {
                    this.hideCart();
                }                                           // Remove item from storage
            }
            else if (event.target.classList.contains('fa-chevron-up')) {
                let addAmount = event.target;
                let id = addAmount.dataset.id;
                let tempItem = cart.find(item => item.id == id);
                tempItem.amount = tempItem.amount + 1;                               // Update item.amount parameter
                Storage.saveCart(cart);                                              // save cart with updated item
                this.setCartValues(cart);                                            // Update cartbutton and cartvalues
                addAmount.nextElementSibling.innerText = tempItem.amount;            // Update number netween arrows
            }

            else if (event.target.classList.contains('fa-chevron-down')) {
                let lowerAmount = event.target;
                let id = lowerAmount.dataset.id;
                let tempItem = cart.find(item => item.id == id);
                tempItem.amount = tempItem.amount - 1;
                if (tempItem.amount > 0) {
                    Storage.saveCart(cart);
                    this.setCartValues(cart);
                    lowerAmount.previousElementSibling.innerText = tempItem.amount;
                }
                else {
                    cartContent.removeChild(lowerAmount.parentElement.parentElement);
                    this.removeItem(id);
                    cart = Storage.getCart();
                    if (cart.length == 0) {
                        this.hideCart();
                    }
                }
            }
        });
    }

    updateItemSum(cart) {
        if (cart.length > 0) {
            const allItemTags = [...document.querySelectorAll("span.sum-items")];
            cart.forEach(item => {
                let itemSum = "Item Total: $ " + item.amount * item.price;
                allItemTags.forEach(tag => {
                    let id = tag.dataset.id;
                    if (id == item.id) { tag.innerText = itemSum }
                })
            });
        }
    }

    // Empty local storage by calling removeItem for all items in cart
    clearCart() {
        let cartItems = cart.map(item => item.id);
        cartItems.forEach(id => this.removeItem(id));
        console.log(cartContent.children);
        while (cartContent.children.length > 0) {
            cartContent.removeChild(cartContent.children[0]);
        }
        this.hideCart();
    }
    // Remove item from cart & resave cart to local storage
    removeItem(id) {
        cart = cart.filter(item => item.id != id);
        this.setCartValues(cart);
        Storage.saveCart(cart);
        let button = this.getSingleButton(id);
        button.disabled = false;
        button.innerHTML = `<i class="fas fa-shopping-cart"></i>add to cart`;
    }
    getSingleButton(id) {
        return buttonsDOM.find(button => button.dataset.id == id);
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
    static saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    // Return local storage, if null -> return empty array
    static getCart() {
        return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];

    }
}

// ************************************************** //
// Initialize - fetch products - save to LS - call UI

document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    const products = new Products();

    // setup App
    ui.setupAPP();

    products.getProducts().then(products => {
        ui.displayProducts(products);
        Storage.saveProducts(products);
    }).then(() => {
        ui.getInfoButtons();
        ui.getBagButtons();
        ui.cartLogic();
    });
});
