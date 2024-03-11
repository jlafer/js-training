const numbers = [1, 23, 7, 11, 5, 9, 2, 10, 6, 3, 8, 4];
const evenNumbers = [];
const numbersOverFive = [];
let sum = 0;
let maxNumber = 0;
const numbersAscending = [];

for (let i = 0; i < numbers.length; i++) {
  const number = numbers[i];
  
  if (number % 2 === 0) {
    evenNumbers.push(number);
  }
  
  if (number > 5) {
    numbersOverFive.push(number);
  }
  
  sum += number;
  
  if (number > maxNumber) {
    maxNumber = number;
  }
  
  numbersAscending.push(number);
}

numbersAscending.sort((a, b) => a - b);

console.log(`evenNumbers = ${evenNumbers}`);
console.log(`numbersOverFive = ${numbersOverFive}`);
console.log(`sum = ${sum}`);
console.log(`maxNumber = ${maxNumber}`);
console.log(`numbersAscending = ${numbersAscending}`);
