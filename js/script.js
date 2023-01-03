let items = document.querySelectorAll(".add-btn");
let noti = document.querySelector('.addedToCart');
let removed = document.querySelector('.removedItem');
let products = [
    {
    name: 'Shoe Cleaning',
    id: 0,
    price: 750,
    amount: 0
},
{
    name: 'Shoe Restoration',
    id: 1,
    price: 2500,
    amount: 0
},
{
    name: 'Shoe Customization',
    id: 2,
    price: 2500,
    amount: 0
},
{
    name: 'Recycled Shoe',
    id: 3,
    price: 2750,
    amount: 0
}
];

for(let i = 0; i < items.length; i++){
    items[i].addEventListener('click', () => {
        noti.id = 'show';
        addToCart(1);
        updateCount(products[i], 1);
        updateTotal(products[i], 1);
    });
}

function cartDel(){
    noti.id = 'hide';
}
function remDel(){
    removed.id = 'hide';
}

function init(){
    let cartNums = localStorage.getItem('cartNo');
    document.querySelector('li span').textContent = cartNums;

}

function addToCart(qty){
    let cartNums = parseInt(localStorage.getItem('cartNo'));
    if(cartNums)
        cartNums += qty;
    else
        cartNums = qty;
    
    localStorage.setItem('cartNo',  cartNums);
    document.querySelector('li span').textContent = cartNums;
}

function updateCount(item, qty){
    let cartProducts = JSON.parse(localStorage.getItem('inCart'));
    if(cartProducts != null){
        if(cartProducts[item.name] == undefined){
            cartProducts = {
                ...cartProducts,
                [item.name]: item
            };
        }
        cartProducts[item.name].amount += qty;
    }
    else{
        item.amount = 1;
        cartProducts = {
            [item.name]: item
        };
    }
    localStorage.setItem('inCart', JSON.stringify(cartProducts));
}

function updateTotal(item, qty){
    let total = parseInt(localStorage.getItem('total'));
    if(total)
        total += qty*item.price;
    else
        total = item.price;
    localStorage.setItem('total', total);
}

function displayCart(){
    let cartProducts = JSON.parse(localStorage.getItem('inCart'));
    let cartTable = document.querySelector('.cartTable');
    let total = parseInt(localStorage.getItem('total'));
    let amount = localStorage.getItem('cartNo');
    let cartTotal = document.getElementById('total');
    let amnt = document.getElementById('amnt');
    if(cartProducts && cartTable && total){
        Object.values(cartProducts).map(item => {
            let tr = document.getElementById(`${item.id}`);
            if(tr){
                let q = document.getElementById(`itemTotal${item.id}`);
                let inp = document.getElementById(`inp${item.id}`);
                let remBtn = document.getElementById(`remove-btn${item.id}`);   
             
                q.textContent = `₱${(item.price * item.amount).toLocaleString()}`;
                inp.outerHTML = `<input id="inp${item.id}" type="text" value="${item.amount}" size="1" maxlength="2" disabled></input>`
                remBtn.outerHTML = `<button id="remove-btn${item.id}" class="remove-btn" onclick="count(${item.id}, ${-item.amount})">Remove</button>`;

                return;
            }
            cartTable.innerHTML += `
            <tr id="${item.id}">
                <td>
                    ${item.name}<br>
                    <img class="prodPic"src="images/${item.name}.png">
                </td>
                <td>₱${item.price.toLocaleString()}</td>
                <td>
                    <button class="dec-btn" onclick="count(${item.id}, -1)">-</button>
                    <input id="inp${item.id}" type="text" value="${item.amount}" size="1" maxlength="2" disabled>
                    <button class="inc-btn" onclick="count(${item.id}, 1)">+</button>
                    <br>
                    <button id="remove-btn${item.id}"class="remove-btn" onclick="count(${item.id}, ${-item.amount})">Remove</button>
                </td>
                <td id="itemTotal${item.id}">₱${(item.price * item.amount).toLocaleString()}</td>
            </tr>
            `;
        });
        if(cartTotal && amnt){
            cartTotal.textContent = `₱${total.toLocaleString()}`;
            amnt.textContent = amount;
            return;
        }
        cartTable.innerHTML += `
            <tr id="all">
                <td></td>
                <td></td>
                <td id="amnt">${amount}</td> 
                <td id="total">₱${total.toLocaleString()}</td>
            </tr>
            <tr id="checkout">
                <td></td>
                <td></td>
                <td></td>
                <td>
                    <button class="checkout">Checkout</button>
                </td>

            </tr>
            </table>
        `;
    }
}

function count(id, qty){
    let cartProducts = JSON.parse(localStorage.getItem('inCart'));
    qty = parseInt(qty);
    addToCart(qty);
    if(cartProducts[products[id].name].amount + qty >= 0){
        updateTotal(products[id], qty);
    }
    if(cartProducts[products[id].name].amount + qty > 0){
        updateCount(products[id], qty);
    }
    else{
        removed.id = 'show';
        cartProducts[products[id].name].amount = 0;
        delete cartProducts[products[id].name];
        let tr = document.getElementById(`${id}`);
        let all = document.getElementById('all');
        let checkout = document.getElementById('checkout');
        checkout.remove();
        tr.remove();
        all.remove();
        localStorage.setItem('inCart', JSON.stringify(cartProducts));
    }
    displayCart(); 
}

init()
displayCart()
