/* This algorithm simplifies boolean logic through the Quinn-McCluskey Method */

// let A = [0,4,5,7,8,11,12,15];
// let A = [0,1,3,4,6,7,8,9,11,12,13,14,15]
let A = [0, 1, 2, 3, 6, 8, 9, 10, 11, 17, 20, 21, 23, 25, 28, 30, 31];
// let A = [2,4,6,9,10,11,12,13,15]; - Don't Care Example

let B = [];
let doneList = [];
let notDoneList = [];
let numA = 0;
let doneIter = false;

class Num {
    constructor(bin, d1, d2) {
        this.bin = bin;
        this.padZeros();
        this.count1s = 0;
        this.numOfOnes();
        this.decComb = d1 + "-" + d2;
        this.done = true;
    }
    padZeros() {
        while (this.bin.length < numA)
            this.bin = "0" + this.bin;
    }
    numOfOnes() {
        for (let i = 0; i < numA; i++) {
            if (this.bin.charAt(i) === "1")
                this.count1s++;
        }
    }
}

// Determines the maximum number of bits required to represent the maximum decimal element in the list
while (Math.max(...A) >= Math.pow(2, numA)) {
    numA++;
}

// Main boolean simplification function
function main(A) {

    // Converts every array element from decimal to class element
    A.forEach(function (value, index, array) {
        array[index] = new Num(Number(value).toString(2), value, "");
    });

    // List B groups each binary number by the number of 1s it contains. Add 'n' lists to B, where n is the maximum number of groups possible
    while (B.length < numA + 1) {
        B.push([]);
        notDoneList.push([]);
    }

    // Determines the number of 1s in each binary element and places it into its corresponding list in B
    A.forEach(function (value) {
        B[value.count1s].push(value);
    });

    while (!doneIter) {
        iteration();
    }

    remExtra();
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
                nums[index][nums[index].length - 1] = nums[index][nums[index].length - 1] + value.decComb.charAt(i);
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
}

function XOR(val1, val2) {
    let count = 0;
    let res = "";
    for (let i = 0; i < numA; i++) {
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
    for (let i = 0; i < numA; i++)
        notDoneList.push([]);

    if (!comparison)
        doneIter = true;

}

main(A);
console.log(doneList)

//console.log(B)
//console.log(notDoneList)