var snakeProto = {
	getLength() {
		return this.bodyParts.length;
	},

	getHead() {
		return this.bodyParts[0];
	},

	getTail() {
		return this.bodyParts[this.bodyParts.length - 1];
	},
};

export
default snakeProto;
