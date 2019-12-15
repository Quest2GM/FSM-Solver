/* This algorithm simplifies boolean logic through the Quinn-McCluskey Method */

// let A = [0,4,5,7,8,11,12,15];
// let A = [0,1,3,4,6,7,8,9,11,12,13,14,15]
let A = [0, 1, 2, 3, 6, 8, 9, 10, 11, 17, 20, 21, 23, 25, 28, 30, 31];  // Input list
// let A = [2,4,6,9,10,11,12,13,15]; - Don't Care Example

let B = [];                 // Iteration list
let notDoneList = [];       // Another iteration list, supporting B
let doneList = [];          // The elements which go through to the final stage
let doneIter = false;       // Done iterations?
let numV = 0;               // Number of variables

// Class used to produce ternary elements (Consisting of '1', '0' or '-')
class Num {
    constructor(bin, D1, D2) {
        this.bin = bin;
        this.count1s = 0;
        this.decComb = D1 + "-" + D2;
        this.logic = "";
        this.done = true;
        this.padZeros();
        this.numOfOnes();
    }
    padZeros() {
        while (this.bin.length < numV)
            this.bin = "0" + this.bin;
    }
    numOfOnes() {
        for (let i = 0; i < numV; i++) {
            if (this.bin.charAt(i) === "1")
                this.count1s++;
        }
    }
}

// Determines the maximum number of bits required to represent the maximum decimal element in the list
while (Math.max(...A) >= Math.pow(2, numV)) {
    numV++;
}

// Main boolean simplification function
function main() {
    // Store copy of A
    let Acopy = [...A];

    // Converts every array element from decimal to class element
    Acopy.forEach(function (value, index, array) {
        array[index] = new Num(Number(value).toString(2), value, "");
    });

    // List B groups each binary number by the number of 1s it contains. Add 'n' lists to B, where n is the maximum number of groups possible
    while (B.length < numV + 1) {
        B.push([]);
        notDoneList.push([]);
    }

    // Determines the number of 1s in each binary element and places it into its corresponding list in B
    Acopy.forEach(function (value) {
        B[value.count1s].push(value);
    });

    // Determines which elements are to continue in the iteration and which are complete. Continued until no more iterations can be performed.
    while (!doneIter) {
        iteration();
    }

    // This function cleans up the final list by removing duplicates
    remExtra();

    // Determines boolean expression for each element in doneList 
    calcLogic();

    // Organizes data into a table
    let elemArr = graph();

    return;

}

function iteration() {
    let comparison = false;
    for (let i = 0; i < B.length - 1; i++) {
        for (let j = 0; j < B[i].length; j++) {
            for (let k = 0; k < B[i + 1].length; k++) {
                let outXOR = XOR(B[i][j], B[i + 1][k]);
                if (outXOR[1]) {
                    val = new Num(outXOR[0], B[i][j].decComb, B[i + 1][k].decComb);
                    B[i][j].done = false;
                    B[i + 1][k].done = false;
                    notDoneList[i].push(val);
                    comparison = true;
                }
            }
            if (B[i][j].done !== false)
                doneList.push(B[i][j]);
        }
    }


    for (let k = 0; k < B[B.length - 1].length; k++) {
        if (B[B.length - 1][k].done !== false)
            doneList.push(B[B.length - 1][k]);
    }

    let x = notDoneList.length;
    while (Array.isArray(notDoneList[x - 1]) && notDoneList[x - 1].length === 0) {
        notDoneList.pop();
        x--;
    }

    B = notDoneList;
    notDoneList = [];
    for (let i = 0; i < numV; i++)
        notDoneList.push([]);

    if (!comparison)
        doneIter = true;

    return;

}

// XOR compares two values to see if they differ by one digit
function XOR(val1, val2) {
    let count = 0;
    let res = "";
    for (let i = 0; i < numV; i++) {
        if (val1.bin.charAt(i) !== val2.bin.charAt(i)) {
            res = res + "-";
            count++;
        } else {
            res = res + val1.bin.charAt(i);
        }
    }
    if (count === 1)
        return [res, true];
    else
        return [res, false];
}

function remExtra() {
    let nums = [];
    doneList.forEach(function () {
        nums.push([]);
    });
    let contNum = false;
    doneList.forEach(function (value, index) {
        for (let i = 0; i < value.decComb.length; i++) {
            if (isNaN(value.decComb.charAt(i)))
                contNum = false;
            else if (!isNaN(value.decComb.charAt(i)) && contNum === false) {
                nums[index].push(value.decComb.charAt(i));
                contNum = true;
            } else if (!isNaN(value.decComb.charAt(i)) && contNum === true) {
                nums[index][nums[index].length - 1] += value.decComb.charAt(i);
            }
        }
        value.decComb = nums[index];
    });

    let trueList = [];
    for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            if (nums[i].every(elem => nums[j].indexOf(elem) > -1) && !trueList.includes(j))
                trueList.push(j);
        }
    }

    for (let i = 0; i < trueList.length; i++) {
        doneList = doneList.slice(0, trueList[i]).concat(doneList.slice(trueList[i] + 1, doneList.length));
        for (j = i + 1; j < trueList.length; j++) {
            trueList[j]--;
        }
    }

    return;
}

function calcLogic () {
    doneList.forEach(function(value) {
        for (let i = 0; i < numV; i++) {
            if (value.bin.charAt(i) === '0')
                value.logic = value.logic + alphabet(i) + "'";
            else if (value.bin.charAt(i) === '1')
                value.logic = value.logic + alphabet(i);
        }
    });

    return;
}

function alphabet(i) {
    let alpha = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    return alpha[i];
}

function graph() {
    let graphArr = [];
    doneList.forEach(function(value) {
        let x = [...value.decComb];
        for (let i = 0; i < A.length; i++) {
            if (x[i] != A[i] && !isNaN(x[i]))
                x.splice(i,0,'');
            if (i >= x.length)
                x.push('');
        }
        graphArr.push(x);
    });

    return graphArr;
}

main();
console.log(A);
console.log(doneList)

//console.log(B)
//console.log(notDoneList)