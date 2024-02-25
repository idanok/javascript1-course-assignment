// Hamburger menu
function openNav() {
    document.getElementById("myNav").style.height = "100%";
}

function closeNav() {
    document.getElementById("myNav").style.height = "0%";
}


const apiURL = 'https://api.noroff.dev/api/v1/rainy-days';
const productContainer = document.getElementById('product-container');
const filterForm = document.querySelector('.filter');


filterForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const color = document.getElementById('color').value;
    const gender = document.getElementById('gender').value;

    if (color === 'all' && gender === 'all') {
        fetchAllProducts();
    } else {
        fetchFilteredProducts(color, gender);
    }
});

function fetchAllProducts() {
    fetch(apiURL)
        .then(response => response.json())
        .then(products => {
            displayProducts(products);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function fetchFilteredProducts(color, gender) {
    const filteredApiURL = `${apiURL}?color=${color}&gender=${gender}`;

    fetch(filteredApiURL)
        .then(response => response.json())
        .then(products => {
            displayProducts(products);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function displayProducts(products) {
    productContainer.innerHTML = '';

    if (products.length === 0) {
        productContainer.innerHTML = '<p>No products match the filter criteria.</p>';
    } else {
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product');

            productElement.innerHTML = `
                <img src="${product.image}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p>${product.description}</p>
                <p>Price: $${product.price.toFixed(2)}</p>
                <button><a href="jacketSpecific.html">View detail</a></button>
                <button>Add to cart</button>
            `;

            productContainer.appendChild(productElement);
        });
    }
}

function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0];
    var cartRows = cartItemContainer.getElementsByClassName('cart-row');
    var total = 0;

    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i];
        var priceElement = cartRow.getElementsByClassName('cart-price')[0];
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0];
        var price = parseFloat(priceElement.innerText.replace('$', ''));
        var quantity = quantityElement.value;
        total += price * quantity;
    }

    total = Math.round(total * 100) / 100;

    var totalPriceElement = document.querySelector('.cart-total-price');
    totalPriceElement.innerText = '$' + total.toFixed(2);
}




const cartItemsContainer = document.querySelector('.cart-items');
const cartTotalPriceDisplay = document.querySelector('.cart-total-price');

let cartItems = [];


// Pop up
function openPopup(title, message) {
    const popup = document.createElement('div');
    popup.classList.add('popup');

    popup.innerHTML = `
        <div class="popup-content">
            <h2>${title}</h2>
            <p>${message}</p>
        </div>
    `;

    document.body.appendChild(popup);


    setTimeout(() => {
        closePopup(popup);
    }, 5000); 
    
    popup.addEventListener('click', () => {
        closePopup(popup);
    });
}

function closePopup(popup) {
    document.body.removeChild(popup);
}



// Add to cart
function addToCart(product) {
    const existingItem = cartItems.find(item => item.title === product.title);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cartItems.push({ ...product, quantity: 1 });
    }

    renderCart();

    openPopup('Item Added', `${product.title} has been added to your cart!`);
}

function removeFromCart(title) {
    const index = cartItems.findIndex(item => item.title === title);

    if (index !== -1) {
        cartItems.splice(index, 1);
    }

    renderCart();
}


function renderCart() {
    cartItemsContainer.innerHTML = '';

    let totalPrice = 0;

    cartItems.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('cart-item');
        cartItemElement.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="cart-item-image">
            <div class="cart-item-details">
                <span class="cart-item-title">${item.title}</span>
                <span class="cart-item-price">$${item.price.toFixed(2)}</span>
                <div class="cart-item-actions">
                    <button class="btn btn-remove">Remove</button>
                    <input class="cart-item-quantity" type="number" value="${item.quantity}" min="1">
                </div>
            </div>
        `;

        const removeButton = cartItemElement.querySelector('.btn-remove');
        removeButton.addEventListener('click', () => removeFromCart(item.title));

        const quantityInput = cartItemElement.querySelector('.cart-item-quantity');
        quantityInput.addEventListener('change', (event) => updateCartItemQuantity(item.title, event.target.value));

        cartItemsContainer.appendChild(cartItemElement);

        totalPrice += item.price * item.quantity;
    });

    cartTotalPriceDisplay.textContent = `$${totalPrice.toFixed(2)}`;
}

function updateCartItemQuantity(title, quantity) {
    const item = cartItems.find(item => item.title === title);

    item.quantity = parseInt(quantity);

    renderCart();
}

productContainer.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
        const productElement = event.target.closest('.product');

        const title = productElement.querySelector('h3').textContent;
        const price = parseFloat(productElement.querySelector('p').textContent.replace('Price: $', ''));
        const image = productElement.querySelector('img').src;

        addToCart({ title, price, image });
    }
});



function renderCart() {
    const cartItemContainer = document.querySelector('.cart-item-container');
    cartItemContainer.innerHTML = '';

    let totalPrice = 0;

    cartItems.forEach(item => {

        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('cart-item');
        cartItemElement.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="cart-item-image">
            <div class="cart-item-details">
                <span class="cart-item-title">${item.title}</span>
                <span class="cart-item-price">$${item.price.toFixed(2)}</span>
                <div class="cart-item-actions">
                    <button class="btn btn-remove">Remove</button>
                    <input class="cart-item-quantity" type="number" value="${item.quantity}" min="1">
                </div>
            </div>
        `;

        const removeButton = cartItemElement.querySelector('.btn-remove');
        removeButton.addEventListener('click', () => removeFromCart(item.title));

        const quantityInput = cartItemElement.querySelector('.cart-item-quantity');
        quantityInput.addEventListener('change', (event) => updateCartItemQuantity(item.title, event.target.value));

        cartItemContainer.appendChild(cartItemElement);

        totalPrice += item.price * item.quantity;
    });

    cartTotalPriceDisplay.textContent = `$${totalPrice.toFixed(2)}`;
}



document.getElementById('check-out-button').addEventListener('click', function() {
    const cartItems = document.querySelector('.cart-item-container').innerHTML;

    window.location.href = 'checkoutSuccess.html?cartItems=' + encodeURIComponent(cartItems);
});


let cartItemCount = 0; 

function addToCart(product) {
    cartItemCount++;
    
    document.getElementById('cart-item-count').textContent = cartItemCount;

    const existingItem = cartItems.find(item => item.title === product.title);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cartItems.push({ ...product, quantity: 1 });
    }

    renderCart();

    openPopup('Item Added', `${product.title} has been added to your cart!`);
}





