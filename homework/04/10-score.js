let cart = [
    { name: "Apple", price: 30 },
    { name: "Banana", price: 20 },
    { name: "Cherry", price: 50 }
];

let sum = 0;
for (let i = 0; i < cart.length; i++) {
    sum += cart[i].price;
}
console.log("購物車總額:", sum);