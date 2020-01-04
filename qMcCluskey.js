/* This algorithm simplifies boolean logic using the Quinn-McCluskey Algorithm */

// One-Hot Case One
// let A = [4, 16];
// let DC = [6, 8, 10, 12, 14, 18, 20, 22, 24, 26, 28, 30]

// One-Hot Case Two
// let A = [9];
// let DC = [11, 13, 15];

// One-Hot Case Three
// let A = [3, 5, 17];
// let DC = [7, 9, 11, 13, 15, 19, 21, 23, 25, 27, 29, 31];

// One-Hot Case Four
// let A = [2, 8];
// let DC = [4, 6, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30];

// One-Hot Case Five
let A = [0, 1, 2, 3, 4, 5, 14, 15, 16, 17];
let DC = [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];

let B = [];                 // Iteration list
let notDoneList = [];       // Another iteration list, supporting B
let doneList = [];          // The elements which go through to the final stage
let doneIter = false;       // Done iterations?
let numV = 0;               // Number of variables
let check = false;          // Checks whether all 'x's in graph are crossed
let boolExpr = "";          // Final boolean expression

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

// Concatenate A with Don't Care List
let C = [...A].concat(...DC);
C = C.sort(function (a, b) { return a - b; });

// Determines the maximum number of bits required to represent the maximum decimal element in the list
while (Math.max(...C) >= Math.pow(2, numV)) {
    numV++;
}

// Main boolean simplification function
function main() {

    // Use copy of C to preserve original list
    let Acopy = [...C];

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

    // Finds the potential for each row in the table : the potential is determined by a prioritization algorithm - priority is given to rows with essential prime implicants and then those with the maximum number of 'x's the row can cancel
    let pntl = potentialFcn(elemArr);

    // Iteration loop that finds optimal boolean expression.
    while (!check) {
        boolExpr += doneList[pntl[0][2]].logic + " + "; // Update boolean expression
        elemArr = newGraph(elemArr, pntl[0][2]);        // Reproduce graph
        pntl = potentialFcn(elemArr);                   // Reproduce new potential function for the new graph
        checkElem(elemArr);                             // Checks whether the all 'x's are cancelled.
    }

    boolExpr = boolExpr.substring(0, boolExpr.length - 3);  // Remove the last three characters, ie. ' + ', to produce final expression

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

// Finds the boolean expression for the specific element in the doneList
function calcLogic() {
    doneList.forEach(function (value) {
        for (let i = 0; i < numV; i++) {
            if (value.bin.charAt(i) === '0')
                value.logic = value.logic + literal(i) + "'";
            else if (value.bin.charAt(i) === '1')
                value.logic = value.logic + literal(i);
        }
    });

    return;
}

// Outputs the literals in alphabetical order
function literal(i) {
    let alphaL = ['(y25)', '(y24)', '(y23)', '(y22)', '(y21)', '(y20)', '(y19)', '(y18)', '(y17)', '(y16)', '(y15)', '(y14)', '(y13)', '(y12)', '(y11)', '(y10)', '(y9)', '(y8)', '(y7)', '(y6)', '(y5)', '(y4)', '(y3)', '(y2)', '(y1)', '(y0)', 'w'];

    return alphaL[alphaL.length - numV + i];
}

// Initializes the graph. Handles don't cares.
function graph() {
    let graphArr = [];
    doneList.forEach(function (value) {
        let newDecComb = [];
        for (let i = 0; i < value.decComb.length; i++) {
            if (!DC.includes(Number(value.decComb[i])))
                newDecComb.push(value.decComb[i]);
        }
        graphArr.push(newDecComb);
    });

    return graphArr;
}

function potentialFcn(element) {
    let elemCount = [];
    let pntl = [];
    let count = 0;

    C.forEach(function (value) {
        for (let i = 0; i < element.length; i++) {
            if (element[i].includes("" + value + "")) {
                count++;
            }
        }
        elemCount.push(count);
        count = 0;
    });

    let pntlCount = 0;
    let pntlPI = false;
    for (let i = 0; i < element.length; i++) {
        pntl.push([]);
        for (let j = 0; j < element[i].length; j++) {
            let I = C.findIndex(function (value) { if (value == element[i][j]) { return true; } });
            if (I === -1)
                pntlCount += 0;
            else
                pntlCount += elemCount[I];
            if (elemCount[I] === 1)
                pntlPI = true;
        }
        pntl[i].push(pntlCount);
        pntl[i].push(pntlPI);
        pntl[i].push(i);
        pntlCount = 0;
        pntlPI = false;
    }

    pntl.sort(function (a, b) {
        if (a[1] && !b[1])
            return -1;
        else if (!a[1] && b[1])
            return 1;
        else
            return b[0] - a[0];
    });

    return pntl;

}

function newGraph(elemArr, indx) {
    let E = [...elemArr];
    let Echk = [...E[indx]];

    for (let i = 0; i < elemArr.length; i++) {
        for (let j = 0; j < elemArr[i].length; j++) {
            if (Echk.includes(E[i][j])) {
                E[i][j] = '';
            }
        }
    }

    return E;
}

function checkElem(elemArr) {
    for (let i = 0; i < elemArr.length; i++) {
        for (let j = 0; j < elemArr[i].length; j++) {
            if (elemArr[i][j] !== '') {
                check = false;
                return;
            }
        }
    }
    check = true;
    return;
}

main();

console.log(boolExpr);