/* This algorithm simplifies boolean logic through the Quinn-McCluskey Method */

let A = [0,4,5,7,8,11,12,15];
let B = [];
let C = [];
let numA = 0;

// Determines the maximum number of bits required to represent the maximum decimal element in the list
while (Math.max(...A) >= Math.pow(2, numA)) {
    numA++;
}

// Main boolean simplification function
function boolSimplify(A) {

    // Converts every array element from decimal to binary
    A.forEach(function (value, index, array) {
        array[index] = padZeros(Number(value).toString(2));
    });

    // List B groups each binary number by the number of 1s it contains. Add 'n' lists to B, where n is the maximum number of groups possible
    while (B.length < numA + 1)
        B.push([]);

    // Determines the number of 1s in each binary element and places it into its corresponding list in B
    A.forEach(function (value) {
        B[numOnes(value)].push(value);
    });

    for (let i = 0; i < B.length - 1; i++) {   
        for (let j = 0; j < B[i].length; j++) {
            for (let k = 0; k < B[i+1].length; k++) {
                let val = padZeros(Number(parseInt(B[i][j], 2) ^ parseInt(B[i+1][k], 2)).toString(2));
                if (numOnes(val) === 1)
                    C.push(val);
            }
        }
    }

}

// Pads each binary number with the appropriate number of zeroes
function padZeros(V) {
    while (V.length < numA)
        V = "0" + V;
    return V
}

// Function to determine number of ones in a binary element
function numOnes(V) {
    let count = 0;
    for (let i = 0; i < numA; i++) {
        if (V.charAt(i) === "1")
            count++;
    }
    return count;
};

boolSimplify(A);
console.log(A)
console.log(B)
console.log(C)