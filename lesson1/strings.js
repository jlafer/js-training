const text = 'Mary had a little lamb whose fleece was white as snow';
const words = text.split(' ');
const textWithHyphens = words.join('-');
const words3To6 = words.slice(2, 6);
const textReversed = words.reverse().join(' ');
console.log(`textWithHyphens = ${textWithHyphens}`);
console.log(`words3To6 = ${words3To6}`);
console.log(`textReversed = ${textReversed}`);
