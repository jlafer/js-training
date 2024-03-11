const numbers = [1, 23, 7, 11, 5, 9, 2, 10, 6, 3, 8, 4];

for (let i = 0; i < numbers.length - 1; i++) {
  for (let j = 0; j < numbers.length - i - 1; j++) {
    if (numbers[j] > numbers[j + 1]) {
      // Swap numbers[j] and numbers[j + 1]
      let temp = numbers[j];
      numbers[j] = numbers[j + 1];
      numbers[j + 1] = temp;
    }
  }
}

console.log(`numbersAscending = ${numbers}`);
