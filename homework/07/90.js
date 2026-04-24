const contents = [
  "Very long content here",
  "Another Very long content here",
  "3rd Very long content here"
];
const previews = contents.map(text => {
  return text.substring(0, 10) + "...";
});
console.log(previews); 