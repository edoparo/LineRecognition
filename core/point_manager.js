let points = [];
let lines = {};

Array.prototype.containsPoint = function (p) {
  return this.filter(el => {
      return el.equals(p);
  }).length > 0;
};

//straight line => y = mx + q where m is the slope and q is the interception
//given two points P1 e P2, it is possibile to calculate q and m between them
function calculateCoefficients(p1, p2) {
    let ret = {
        m: null,
        q: null
    };

    if (p1.x === p2.x) {
        //vertical lines have the same x, no matter what y is
        //setting infinity as placeholder
        ret.m = p1.x;
        ret.q = Infinity;
    } else {
        ret.m = (p1.y - p2.y) / (p1.x - p2.x);
        ret.q = p1.y - (ret.m * p1.x);
    }

    return ret;
}

function calculateNewLines(newPoint) {
    let temp = Object.assign({}, lines);

    //for each point already in space, calculating the lines coefficients to fill the main object
    lines = points.reduce((temp, pointInSpace) => {
        if (pointInSpace) {
            fillLines(temp, newPoint, pointInSpace);
        }
        return temp;
    }, temp);
}

function fillLines(obj, newPoint, pointInSpace) {
    let coeff = calculateCoefficients(newPoint, pointInSpace);

    //concatenation of q and m in order to keep single level objects
    //loop will be faster
    let key = coeff.m + '_' + coeff.q;

    if (!obj.hasOwnProperty(key))
        obj[key] = [];

    //if not yet present, adding the points to the array;
    //array will contain collinear points
    !obj[key].containsPoint(newPoint) && obj[key].push(newPoint);
    !obj[key].containsPoint(pointInSpace) && obj[key].push(pointInSpace);
}

//++++++ public methods ++++++//

module.exports = {
    getSpace: getSpace,
    addPointToSpace: addPointToSpace,
    truncateSpace: truncateSpace,
    getLines: getLines,
    isPointInSpace: isPointInSpace
};

function getSpace() {
    return points;
}

function isPointInSpace(p) {
    return points.containsPoint(p);
}

function addPointToSpace(p) {

    if(points.length > 0)
        //firstly, generating new lines with the new point
        calculateNewLines(p);

    //secondly, adding point to the space
    points.push(p);
}

function truncateSpace() {
    points = [];
    lines = {}
}

function getLines(n) {
    let result = [];
    if (n === 1) {
        //n = 1 means that each point can be part of infinite lines
        result = points;
    } else {
        Object.keys(lines).forEach(key => {
            //at least N points
            lines[key] && Array.isArray(lines[key]) && lines[key].length >= n && result.push(lines[key]);
        });
    }
    return result;
}