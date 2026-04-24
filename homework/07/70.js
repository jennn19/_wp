function fakeGet(sql, params, callback) {
  callback(null, { title: "Fake Title" });
}
fakeGet("SELECT * FROM posts WHERE id = ?", [1], (err, row) => {
  if (err) {
    console.error("查詢出錯");
    return;
  }
  console.log("資料庫回傳的標題：", row.title);
});