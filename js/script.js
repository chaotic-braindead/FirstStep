// TODO: add checkout button

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
    name: 'Shoe customization',
    id: 2,
    price: 2500,
    amount: 0
},
{
    name: 'Recycled shoe',
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

// delBtn.addEventListener('click', () => {
//     noti.id = 'hide';
// })
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
    if(cartProducts && cartTable && total){
        Object.values(cartProducts).map(item => {
            let tr = document.getElementById(`${item.id}`);
            if(tr) return;
            cartTable.innerHTML += `
            <tr id="${item.id}">
                <td>
                    ${item.name}
                </td>
                <td><img class="prodPic"src="images/${item.name}.png"></td>
                <td>₱${item.price.toLocaleString()}</td>
                <td>
                    <button class="dec-btn" onclick="count(${item.id}, -1)">-</button>
                    <input type="text" value="${item.amount}" size="1" maxlength="2" disabled>
                    <button class="inc-btn" onclick="count(${item.id}, 1)">+</button>
                    <br>
                    <button class="remove-btn" onclick="count(${item.id}, ${-item.amount})">Remove</button>
                </td>
                <td>₱${(item.price * item.amount).toLocaleString()}</td>
            </tr>
            `;
        });
        cartTable.innerHTML += `
            <tr id="all">
                <td></td>
                <td></td>
                <td></td>
                <td>${amount}</td> 
                <td>₱${total.toLocaleString()}</td>
            </tr>
            <tr id="checkout">
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>
                    <button class="checkout">Checkout</button>
                </td>

            </tr>
            </table>
        `;
        // thank god for toLocalString() 
    }
}
// for some reason, passing the product id directly to the update functions outputs an error, so i made this function which acts as a "middle-man" 
//  lmao i hate javascript T_T

function count(id, qty){
    let cartProducts = JSON.parse(localStorage.getItem('inCart'));
    qty = parseInt(qty);
    if(cartProducts[products[id].name].amount + qty >= 0){
        addToCart(qty);
    }

    if(cartProducts[products[id].name].amount + qty > 0){
        updateCount(products[id], qty);
        updateTotal(products[id], qty);
        window.location.reload(); // i'm sure there's a better way to reload the page to show the new total but i suck at js 
    }
    else{
        removed.id = 'show';
        cartProducts[products[id].name].amount = 0;
        updateTotal(products[id], qty);
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

// resets the localStorage (or just clear cookies lool)
// localStorage.setItem('cartNo',  0);
// localStorage.setItem('inCart',  null);
// localStorage.setItem('total',  null);