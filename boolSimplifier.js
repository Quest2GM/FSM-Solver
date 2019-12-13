/* This algorithm simplifies boolean logic through the Quinn-McCluskey Method */

//let A = [0,4,5,7,8,11,12,15];
let A = [0,1,3,4,6,7,8,9,11,12,13,14,15]
let B = [];
let doneList = [];
let notDoneList = [];
let defaultL = [[],[],[],[]];
let numA = 0;
let doneIter = false;

// Determines the maximum number of bits required to represent the maximum decimal element in the list
while (Math.max(...A) >= Math.pow(2, numA)) {
    numA++;
}

class Num {
    constructor(dec, bin, m, d1, d2) {
        this.dec = dec;
        this.bin = bin;
        this.padZeros();
        this.count1s = 0;
        this.numOfX("1");
        this.mask = m;
        this.decComb = d1 + "-" + d2;
        this.done = "";
    }
    padZeros () {
        while (this.bin.length < numA)
            this.bin = "0" + this.bin;  
    }
    numOfX (X) {
        for (let i = 0; i < numA; i++) {
            if (this.bin.charAt(i) === X)
                this.count1s++;
        }
    }
}

// Main boolean simplification function
function boolSimplify(A) {

    // Converts every array element from decimal to class element
    A.forEach(function (value, index, array) {
        array[index] = new Num(value, Number(value).toString(2), "x", value, "");
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
    //remExtra(doneList);

}

function remExtra(L) {
    L.forEach(function(value,index,array){

    });
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
            for (let k = 0; k < B[i+1].length; k++) {
                if (XOR(B[i][j], B[i+1][k])[1]) {
                    val = new Num("0", XOR(B[i][j], B[i+1][k])[0], XOR(B[i][j], B[i+1][k])[0], B[i][j].decComb, B[i+1][k].decComb);
                    B[i][j].done = false;
                    B[i+1][k].done = false;
                    notDoneList[i].push(val);
                    comparison = true;
                }
            }
            if (B[i][j].done !== false) 
                doneList.push(B[i][j]);
        }
    }
    for (let k = 0; k < B[B.length-1].length; k++) {
        if (B[B.length-1][k].done !== false) 
            doneList.push(B[B.length-1][k]);
    }

    while(notDoneList[notDoneList.length-1].length === 0) {
        notDoneList.pop();
    }

    B = notDoneList;
    notDoneList = defaultL;

    if (!comparison)
        doneIter = true;

}

boolSimplify(A);
//console.log(A)
//console.log(B)
//console.log(notDoneList)
console.log(doneList)
