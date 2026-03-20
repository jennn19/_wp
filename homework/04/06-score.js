let person = { name: "Jasper", sayHello: function() { console.log("Hi, I am " + this.name); } };
console.log(person.name);
person.isStudent = true;
person.sayHello();