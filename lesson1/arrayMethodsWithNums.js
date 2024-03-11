const numbers = [1, 23, 7, 11, 5, 9, 2, 10, 6, 3, 8, 4];

const evenNumbers = numbers.filter(number => number % 2 === 0);
const numbersOverFive = numbers.filter(number => number > 5);
const sum = numbers.reduce((acc, number) => acc + number, 0);
const maxNumber = numbers.reduce((acc, number) => Math.max(acc, number), 0);
const numbersAscending = numbers.sort((a, b) => a - b);
console.log(`evenNumbers = ${evenNumbers}`);
console.log(`numbersOverFive = ${numbersOverFive}`);
console.log(`sum = ${sum}`);
console.log(`maxNumber = ${maxNumber}`);
console.log(`numbersAscending = ${numbersAscending}`);