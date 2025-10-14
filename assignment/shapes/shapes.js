function areaOfCircle(radius) {
    return Math.PI * radius * radius;
}
function areaOfSquare(side) {
    return side * side;
}
function areaOfRectangle(length, width) {
    return length * width;
}
function areaOfTriangle(base, height) {
    return 0.5 * base * height;
}
module.exports = {
    areaOfCircle,
    areaOfSquare,
    areaOfRectangle,
    areaOfTriangle
};