
//function to shuffle array provided.
module.exports = {
    async shuffleArray(array) {
        await array.sort(() => Math.random() - 0.5);
    return array;
	},
};
