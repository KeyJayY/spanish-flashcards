function getUniqueNumbers(count = 10, maxValue = 8000) {
	const numbers = new Set();
	while (numbers.size < count) {
		numbers.add(Math.floor(Math.random() * maxValue) + 1);
	}
	return Array.from(numbers);
}

export default getUniqueNumbers;
