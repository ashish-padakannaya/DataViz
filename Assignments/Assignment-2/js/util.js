// get random rgb colors
const random_rgba = () => {
    var o = Math.round, r = Math.random, s = 255;
    return 'rgb(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ')';
}

//generate m*n matrix of zeros
const zeros = (m, n) => [...Array(m)].map(e => Array(n).fill(0));

//remove bracket from scores
const removeBracket = (string) => {
    return string.replace(/\(.*?\)/g, "");
}

//return inv color
const lightOrDark = (color) => {
    var r, g, b, hsp;
    color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
    r = color[1];
    g = color[2];
    b = color[3];

    // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
    hsp = Math.sqrt(
        0.299 * (r * r) +
        0.587 * (g * g) +
        0.114 * (b * b)
    );

    // Using the HSP value, determine whether the color is light or dark
    return hsp > 127.5 ? 'black' : 'white';
}

const genRandom = () => {
    return Math.floor(Math.random() * 100) + 1; 
}