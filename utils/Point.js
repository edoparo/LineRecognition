class Point {

    constructor(option) {
        if (typeof option !== 'object')
            throw new Error('Invalid point object: object empty');

        if (!option.hasOwnProperty('x'))
            throw new Error('Invalid point object: missing required property x');

        if (!option.hasOwnProperty('y'))
            throw new Error('Invalid point object: missing required property y');

        if (isNaN(option.x))
            throw new Error('Parameter x is not a number');

        if (isNaN(option.y))
            throw new Error('Parameter y is not a number');

        this.x = parseFloat(option.x);
        this.y = parseFloat(option.y);
    }

    toObject() {
        return Object.assign({}, {x: this.x, y: this.y});
    }

    equals(point = new Point({x: 0, y: 0})) {
        return this.x === point.x && this.y === point.y;
    }
}

module.exports = Point;