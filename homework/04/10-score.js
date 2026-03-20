let fruitList = ["蘋果", "香蕉", "西瓜", "葡萄", "芒果"];

function checkFruit(target) {
    let found = false;
    for (let i = 0; i < fruitList.length; i++) {
        if (fruitList[i] === target) {
            found = true;
            break;
        }
    }
    if (found) {
        console.log("找到 " + target + " 了！");
    } else {
        console.log(target + " 不在清單內。");
    }
}

checkFruit("西瓜");
checkFruit("草莓");