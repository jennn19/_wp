function fetchData(id, callback) {
  const data = { id: id, status: "success" };
  callback(null, data);
}
fetchData(123, (err, result) => {
  if (err) {
    console.error("發生錯誤");
    return;
  }
  console.log("取得的資料：", result);
});