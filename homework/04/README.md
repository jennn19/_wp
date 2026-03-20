## 習題4

AI 問答 -- https://gemini.google.com/share/eb88a9e81db9

## 摘要
為了讓你清楚看到程式執行的邏輯與產出，我將每一題的**核心程式碼**與 **Console（控制台）印出的結果**整理如下：

---

### 1. 數值範圍判斷 (if)
* **測試條件：** `score = 85`
```javascript
let score = 85;
if (score >= 90) { console.log("A"); } 
else if (score >= 80) { console.log("B"); } 
else { console.log("F"); }
```
> **測試結果：**
> `B`

### 2. 偶數產生器 (for)
* **測試範圍：** 1 到 50
```javascript
for (let i = 1; i <= 50; i++) {
    if (i % 2 === 0) console.log(i);
}
```
> **測試結果：**
> `2`, `4`, `6`, `8`, `10` ... (中間略) ... `48`, `50`

### 3. 倒數計時器 (while)
* **起始值：** 10
```javascript
let n = 10;
while (n > 0) { console.log(n); n--; }
console.log("Blast off!");
```
> **測試結果：**
> `10`, `9`, `8`, `7`, `6`, `5`, `4`, `3`, `2`, `1`
> `Blast off!`

### 4. 溫度轉換器 (function)
* **輸入：** 華氏 98.6 度
```javascript
function toCelsius(fahrenheit) { return (fahrenheit - 32) * 5 / 9; }
console.log(toCelsius(98.6));
```
> **測試結果：**
> `37`

### 5. 陣列總和計算 (array + for)
* **資料：** `[10, 20, 30, 40, 50]`
```javascript
let numbers = [10, 20, 30, 40, 50];
let total = 0;
for (let i = 0; i < numbers.length; i++) { total += numbers[i]; }
console.log("總和為:", total);
```
> **測試結果：**
> `總和為: 150`

---

### 6. 物件資訊操作 (object)
* **操作：** 讀取姓名、新增屬性、呼叫方法
```javascript
let person = { name: "Jasper", sayHello: function() { console.log("Hi, I am " + this.name); } };
console.log(person.name);
person.isStudent = true;
person.sayHello();
```
> **測試結果：**
> `Jasper`
> `Hi, I am Jasper`

### 7. 尋找最大值 (function + array)
* **輸入：** `[5, 2, 9, 1, 7]`
```javascript
function findMax(arr) {
    let max = arr[0];
    for (let i = 1; i < arr.length; i++) { if (arr[i] > max) max = arr[i]; }
    return max;
}
console.log(findMax([5, 2, 9, 1, 7]));
```
> **測試結果：**
> `9`

### 8. 購物清單小計 (array of objects)
* **資料：** Apple(30), Banana(20), Cherry(50)
```javascript
let cart = [{price: 30}, {price: 20}, {price: 50}];
let sum = 0;
for (let i = 0; i < cart.length; i++) { sum += cart[i].price; }
console.log("購物車總額:", sum);
```
> **測試結果：**
> `購物車總額: 100`

### 9. JSON 資料解析 (json)
* **資料：** 包含 Alice (active) 與 Bob (inactive) 的 JSON 字串
```javascript
let data = JSON.parse('{"users": [{"name": "Alice", "active": true}, {"name": "Bob", "active": false}]}');
for (let user of data.users) {
    if (user.active) console.log("活躍使用者:", user.name);
}
```
> **測試結果：**
> `活躍使用者: Alice`

### 10. 簡單銀行系統 (object + if)
* **操作：** 存 500，提 2000（失敗），提 300（成功）
```javascript
let account = { balance: 1000, ... }; // 包含 deposit 與 withdraw 方法
account.deposit(500);
account.withdraw(2000);
account.withdraw(300);
```
> **測試結果：**
> `存入 500，目前餘額: 1500`
> `餘額不足！提款失敗。`
> `取出 300，目前餘額: 1200`

---

這 10 個練習基本涵蓋了初學者最常碰到的語法情境。**你想試試看把這些邏輯寫成一個簡單的網頁介面（例如按下按鈕才執行計算）嗎？**