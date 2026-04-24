function checkAdmin(role, callback) {
  if (role !== "admin") {
    return callback("Access Denied");
  }

  callback(null, "Welcome");
}

checkAdmin("user", (err, data) => {
  if (err) {
    console.log("失敗原因：", err); 
    return;
  }
  console.log(data);
});

checkAdmin("admin", (err, data) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("結果：", data); 
});