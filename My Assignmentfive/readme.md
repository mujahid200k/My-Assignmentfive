1️⃣ Difference between var, let, and const
var: Function-scoped, can be redeclared and updated. It is hoisted with undefined.

let: Block-scoped (within {}), can be updated but not redeclared.

const: Block-scoped, cannot be updated or redeclared. It must be initialized during declaration.

2️⃣ What is the spread operator (...)?
The spread operator allows an iterable (like an array or object) to be expanded into individual elements. It is commonly used to copy arrays or merge objects.

Example: const newArray = [...oldArray, 4, 5];

3️⃣ Difference between map(), filter(), and forEach()
forEach(): Executes a function for each element. Returns nothing (undefined).

map(): Transforms each element and returns a new array of the same length.

filter(): Checks each element against a condition and returns a new array containing only the elements that pass.

4️⃣ What is an arrow function?
An arrow function is a compact way to write functions using the => syntax. They do not have their own this context, making them ideal for callbacks.

Example: const greet = () => console.log("Hello");

5️⃣ What are template literals?
Template literals are strings enclosed in backticks (`). They allow for multi-line strings and string interpolation (inserting variables directly) using the ${variable} syntax.

Example: `Total count: ${count}`