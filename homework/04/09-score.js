let data = JSON.parse('{"users": [{"name": "Alice", "active": true}, {"name": "Bob", "active": false}]}');
for (let user of data.users) {
    if (user.active) console.log("活躍使用者:", user.name);
}