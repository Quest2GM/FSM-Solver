/* This project was initiated on December 9, 2019. The purpose of this software is to solve Finite State Machines (FSMs) */

"use strict"; // Helpful for debugging

// DOM Variables
let stateTable = document.getElementById("stateTable");
let leftCol = document.getElementById("leftCol");
let rightCol = document.getElementById("rightCol");
let synchRad = document.getElementById("synchRad");
let asynchRad = document.getElementById("asynchRad");
let binRad = document.getElementById("binRad");
let OHRad = document.getElementById("OHRad");
let MOHRad = document.getElementById("MOHRad");

// Verilog FSM Variables
let typeBin;    // 0 = binary, 1 = one-hot, 2 = modified one-hot
let synch;   // Synchronous or asynchronous reset
let initialState = "A";
let numV = 0;
let binStates = [];

// State Minimization Variables
let w0 = [];
let w1 = [];
let Z = [];
let states = [];
let newState = [[], []];
let stateTableRC = 1;

// Boolean Expression Variables
// let A = [];
// let DC = [];

let C = [];                 // Concatenation of both A and don't cares
let B = [];                 // Iteration list
let notDoneList = [];       // Another iteration list, supporting B
let doneList = [];          // The elements which go through to the final stage
let doneIter = false;       // Done iterations?
let check = false;          // Checks whether all 'x's in graph are crossed
let boolExpr = "";          // Final boolean expression
let tabVals = [[], [], [], []]; // Binary Table of Values
let Asub = [];              // A subsitute for preliminary calculation

// __________________________________________________________________

function addRow() {
    if (stateTableRC > 25)
        return;

    let row = document.createElement("tr");

    let td1 = document.createElement("td");
    let td2 = document.createElement("td");
    let td3 = document.createElement("td");
    let td4 = document.createElement("td");
    let tb2 = document.createElement("input");
    let tb3 = document.createElement("input");
    let tb4 = document.createElement("input");

    td1.textContent = literalAlpha(stateTableRC);
    td1.style.textAlign = "center";

    tb2.setAttribute("type", "text");
    tb2.style.height = "15px";
    tb2.style.width = "90px";
    tb2.style.textAlign = "center";

    tb3.setAttribute("type", "text");
    tb3.style.height = "15px";
    tb3.style.width = "90px";
    tb3.style.textAlign = "center";

    tb4.setAttribute("type", "text");
    tb4.style.height = "15px";
    tb4.style.width = "90px";
    tb4.style.textAlign = "center";

    td2.appendChild(tb2);
    td3.appendChild(tb3);
    td4.appendChild(tb4);
    row.appendChild(td1);
    row.appendChild(td2);
    row.appendChild(td3);
    row.appendChild(td4);
    stateTable.appendChild(row);

    stateTableRC++;

    return;
}

function delRow() {
    if (stateTableRC !== 1) {
        stateTable.removeChild(stateTable.lastChild);
        stateTableRC--;
    }
    return;
}

function literalAlpha(i) {
    let alpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    return alpha[i];
}

function extData() {

    resetVars();
    selectRadio();

    for (let i = 2; i < stateTable.rows.length; i++) {
        for (let j = 1; j < 4; j++) {
            if (j === 1)
                w0.push("" + stateTable.rows[i].cells[j].children[0].value + "");
            else if (j === 2)
                w1.push("" + stateTable.rows[i].cells[j].children[0].value + "");
            else
                Z.push(Number(stateTable.rows[i].cells[j].children[0].value));
        }
        states.push(literalAlpha(i - 2));
    }

    mainSM();
    binStates = binTrans(states, binStates);

    // Left Column Functions
    dispState(states, binStates, leftCol);
    dispBinTable(states, binStates, w0, w1, Z, leftCol);
    //verilogOutput(states, binStates, w0, w1, Z);
    findBoolExpr();

    // Right Column Functions
    let minFSMVar = minFSM();
    dispBinTable(minFSMVar[0], minFSMVar[0], minFSMVar[2], minFSMVar[3], minFSMVar[4], rightCol);
    dispState(minFSMVar[0], minFSMVar[1], rightCol);
    dispBinTable(minFSMVar[0], minFSMVar[1], minFSMVar[2], minFSMVar[3], minFSMVar[4], rightCol);

    return;
}

// ------------------------
// Reset Variables
// ------------------------

function resetVars() {

    // Verilog FSM Variables
    synch = true;
    initialState = "A";
    numV = 0;
    binStates = [];

    // State Minimization Variables
    w0 = [];
    w1 = [];
    Z = [];
    states = [];
    newState = [[], []];

    // Remove Existing Tables
    while (leftCol.hasChildNodes()) {
        leftCol.removeChild(leftCol.lastChild);
    }
    while (rightCol.hasChildNodes()) {
        rightCol.removeChild(rightCol.lastChild);
    }

    return;

}

// ------------------------
// Selections
// ------------------------

function selectRadio() {
    if (synchRad.checked)
        synch = true;
    else if (asynchRad.checked)
        synch = false;
    else
        throw new Error("Select synch!");

    if (binRad.checked)
        typeBin = 0;
    else if (OHRad.checked)
        typeBin = 1;
    else if (MOHRad.checked)
        typeBin = 2;
    else
        throw new Error("Select typeBin!");

    return;
}

// ------------------------
// Display State Assignment Table
// ------------------------

function dispState(s, bS, xCol) {
    let row, h1, h2, c1, c2, tab1;
    tab1 = document.createElement("table");
    row = document.createElement("tr");
    h1 = document.createElement("th");
    h2 = document.createElement("th");
    row.appendChild(h1);
    row.appendChild(h2);
    tab1.appendChild(row);

    h1.textContent = "State";
    h2.textContent = "Binary Assignment";

    for (let i = 0; i < s.length; i++) {
        row = document.createElement("tr");
        c1 = document.createElement("td");
        c2 = document.createElement("td");
        c1.textContent = s[i];
        c2.textContent = bS[i];
        row.appendChild(c1);
        row.appendChild(c2);
        tab1.appendChild(row);
    }
    xCol.appendChild(tab1);

    return;
}

// ------------------------
// Display Binary State Table
// ------------------------

function dispBinTable(s, bS, w0Min, w1Min, zMin, xCol) {
    let row, h1, h2, h3, h4, c1, c2, c3, c4, tab1;
    let x1, x2, x3, x4;

    tab1 = document.createElement("table");
    row = document.createElement("tr");

    h1 = document.createElement("th");
    h2 = document.createElement("th");
    h3 = document.createElement("th");
    h4 = document.createElement("th");

    row.appendChild(h1);
    row.appendChild(h2);
    row.appendChild(h3);
    row.appendChild(h4);
    tab1.appendChild(row);

    h1.textContent = "Current State";
    h2.textContent = "Next State";
    h4.textContent = "Output";

    for (let i = 0; i < s.length; i++) {
        row = document.createElement("tr");
        c1 = document.createElement("td");
        c2 = document.createElement("td");
        c3 = document.createElement("td");
        c4 = document.createElement("td");

        x1 = bS[i];
        x2 = bS[s.findIndex(function (val) {
            if (val === w0Min[i])
                return true;
        })];
        x3 = bS[s.findIndex(function (val) {
            if (val === w1Min[i])
                return true;
        })];
        x4 = zMin[i];

        c1.textContent = x1;
        c2.textContent = x2;
        c3.textContent = x3;
        c4.textContent = x4;

        row.appendChild(c1);
        row.appendChild(c2);
        row.appendChild(c3);
        row.appendChild(c4);
        tab1.appendChild(row);

        tabVals[0].push("" + x1 + "");
        tabVals[1].push("" + x2 + "");
        tabVals[2].push("" + x3 + "");
        tabVals[3].push("" + x4 + "");

    }

    xCol.appendChild(tab1);

    return tabVals;
}

// ------------------------
// FSM Verilog
// ------------------------

/* Produces the Verilog for the Finite State Machine */

// Finds the max power of the elements
// Pads and finds binary translation of each element in the state list (binary translation is based on typeBin)
function binTrans(S, X) {
    if (typeBin === 0) {
        while (S.length - 1 >= Math.pow(2, numV))
            numV++;
        for (let i = 0; i < S.length; i++)
            X.push(padZeros(i.toString(2)));
    } else if (typeBin === 1) {
        numV = S.length;
        let currBin = "1";
        for (let i = 0; i < S.length; i++) {
            X.push(padZeros(currBin.toString(2)));
            currBin = currBin << 1;
        }
    } else {
        numV = S.length;
        let currBin = "0";
        let powDec;
        X.push(padZeros(currBin.toString(2)));
        for (let i = 1; i < S.length; i++) {
            powDec = Math.pow(2, i) + 1;
            X.push(padZeros(Number(powDec).toString(2)));
        }
    }
    return X;
}

// Function used to pad binary numbers with leading zeros
function padZeros(num) {
    while (num.length < numV)
        num = "0" + num;
    return num;
}

function verilogOutput(s, bS, wL0, wL1, zL) {

    // Verilog Code Output
    console.log("module FSM (SW, LEDR, KEY);");
    console.log("   input [9:0] SW;");
    console.log("   input [0:0] KEY;");
    console.log("   output [9:0] LEDR;");
    console.log("   wire W, clock, resetn, Z;");
    console.log("");
    console.log("   assign W = SW[1];");
    console.log("   assign resetn = SW[0];");
    console.log("   assign clock = KEY[0];");
    console.log("");
    console.log("   reg [3:0] y_Q, Y_D;");

    let parameters = "   parameter ";
    for (let i = 0; i < bS.length; i++) {
        parameters += s[i] + " = " + numV + "\'b" + bS[i] + ", ";
    }
    parameters = parameters.substring(0, parameters.length - 2) + ";";
    console.log(parameters);
    console.log("");
    console.log("   always @ (W, y_Q)");
    console.log("   begin");
    console.log("      case(y_Q)");

    for (let i = 0; i < s.length; i++) {
        console.log("         " + s[i] + ": if (W) Y_D = " + wL1[i] + ";");
        console.log("            else Y_D = " + wL0[i] + ";");
    }
    let defaultVerilog = "         default: y_D = " + numV + "\'b";

    for (let i = 0; i < numV; i++)
        defaultVerilog += "x";
    defaultVerilog += ";";

    console.log(defaultVerilog);

    console.log("      endcase");
    console.log("   end");
    console.log("");
    if (synch)
        console.log("   always @ (posedge clock)");
    else
        console.log("   always @ (posedge clock, negedge resetn)");
    console.log("   begin");
    console.log("      if (resetn == 1'b0)");
    console.log("         y_Q <= " + initialState + ";");
    console.log("      else");
    console.log("         y_Q <= y_D;");
    console.log("   end");
    console.log("");

    let zVerilog = "   assign Z = ";
    for (let i = 0; i < zL.length; i++) {
        if (zL[i] === 1)
            zVerilog += "(y_Q == " + s[i] + ") | ";
    }
    zVerilog = zVerilog.substring(0, zVerilog.length - 3) + ";";
    console.log(zVerilog);
    console.log("   assign LEDR[9] = Z;");
    console.log("   assign LEDR[3:0] = y_Q;");
    console.log("");
    console.log("endmodule");

    return;
}

// ------------------------
// State Minimization
// ------------------------

function mainSM() {
    // Divides the initial states based on the value of Z
    divideByZ();

    // While the statelist is not minimized, loop through every element to check if there needs to be a division
    while (!minimized()) {
        for (let i = 0; i < newState.length; i++) {
            if (!contained(extractWX(0, newState[i]))) {
                divStates(i, newState[i], extractWX(0, newState[i]));   // Division for W0
                break;
            } else if (!contained(extractWX(1, newState[i]))) {
                divStates(i, newState[i], extractWX(1, newState[i]));   // Division for W1
                break;
            }
        }
    }
    return;
}

function divideByZ() {
    for (let i = 0; i < states.length; i++)
        newState[Z[i]].push(states[i]);
}

// Divides list based on whether states are contained in the Nth list of newState or not. It then updates the new state list from the division.
function divStates(N, S, E) {
    let divList = [[], []];
    for (let i = 0; i < E.length; i++) {
        if (newState[stateIndex(E[0])].includes(E[i]))
            divList[0].push(S[i]);
        else
            divList[1].push(S[i]);
    }

    newState = newState.slice(0, N).concat(newState.slice(N + 1, newState.length));
    newState.push(divList[0]);
    newState.push(divList[1]);

    return;
}

// Checks if minimization is complete
function minimized() {
    for (let i = 0; i < newState.length; i++) {
        let C1 = contained(extractWX(0, newState[i]));
        let C2 = contained(extractWX(1, newState[i]));

        if (!C1 || !C2)
            return false;
    }
    return true;
}

// Checks if each element of 'L' is contained in one list in the state list
function contained(L) {
    let contain = true;
    for (let i = 0; i < newState.length; i++) {
        for (let j = 0; j < L.length; j++) {
            if (!newState[i].includes(L[j])) {
                contain = false;
                break;
            }
        }
        if (contain)
            return true;
        contain = true;
    }
    return false;
}

// Extracts the W0 or W1 state sequence for inList
function extractWX(valW, inList) {
    let extract = [];
    let useW = [];

    if (valW === 0)
        useW = [...w0];
    else
        useW = [...w1];

    for (let i = 0; i < inList.length; i++) {
        extract.push(useW[states.findIndex(function (value) {
            if (value === inList[i])
                return true;
        })]);
    }
    return extract;
}

// The list index in newState for which an element can be found
function stateIndex(X) {
    for (let i = 0; i < newState.length; i++) {
        if (newState[i].includes(X))
            return i;
    }
}

// Changes State and Bin State Variables to match minimize FSM
function minFSM() {
    let minStates = [];
    let minBinStates = [];
    let minW0 = [];
    let minW1 = [];
    let minZ = [...Z];
    let eqStateM = [];
    let eqStateC = [];

    for (let i = 0; i < newState.length; i++) {
        if (newState[i].length !== 1) {
            for (let j = 0; j < newState[i].length - 1; j++) {
                eqStateM.push(newState[i][newState[i].length - 1]);
                eqStateC.push(newState[i][j]);
            }
        }
    }

    minStates = eqStateChange(states, minStates, eqStateC, eqStateM);
    minW0 = eqStateChange(w0, minW0, eqStateC, eqStateM);
    minW1 = eqStateChange(w1, minW1, eqStateC, eqStateM);

    let mS = [], mW0 = [], mW1 = [], mZ = [];
    for (let i = minStates.length - 1; i >= 0; i--) {
        if (!mS.includes(minStates[i])) {
            mS.unshift(minStates[i]);
            mW0.unshift(minW0[i]);
            mW1.unshift(minW1[i]);
            mZ.unshift(minZ[i]);
        }
    }
    minStates = mS;
    minW0 = mW0;
    minW1 = mW1;
    minZ = mZ;

    minBinStates = binTrans(minStates, minBinStates);

    return [minStates, minBinStates, minW0, minW1, minZ];
}

function eqStateChange(L, R, C, M) {
    for (let i = 0; i < L.length; i++) {
        if (C.includes(L[i])) {
            let idx = C.findIndex(function (val) {
                if (val === L[i])
                    return true;
            });
            R.push(M[idx]);
        } else {
            R.push(L[i]);
        }
    }
    return R;
}

// ------------------------
// Boolean Expression Output
// ------------------------

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

function initializeBool(A, DC) {

    // Reset all variables
    C = [];
    B = [];
    notDoneList = [];
    doneList = [];
    doneIter = false;
    check = false;
    numV = 0;
    boolExpr = "";

    // Concatenate A with Don't Care List
    C = [...A].concat(...DC);
    C = C.sort(function (a, b) {
        return a - b;
    });

    // Determines the maximum number of bits required to represent the maximum decimal element in the list
    while (Math.max(...C) >= Math.pow(2, numV))
        numV++;
}

// Main boolean simplification function
function mainBoolOut(A, DC) {

    // Initialize
    initializeBool(A, DC);

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
    let elemArr = graph(DC);

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

    return boolExpr;

}

function iteration() {
    let comparison = false, val;
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
        for (let j = i + 1; j < trueList.length; j++) {
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
function graph(DC) {
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

function findBoolExpr() {
    findANumber();

    let dcA = [];

    for (let i = states.length; i < Math.pow(2, numV); i++) {
        dcA.push(parseInt(i.toString(2) + "0", 2));
        dcA.push(parseInt(i.toString(2) + "1", 2));
    }

    for (let i = 0; i < Asub.length; i++) {
        let expr = mainBoolOut(Asub[i], dcA);
        
        if (i !== Asub.length - 1)
            expr = "Y" + (Asub.length - i - 2) + " = " + expr;
        else
            expr = "Z = " + expr;
        console.log(expr);
    }

    return;
}

function findANumber() {
    // For tabVals: 0 = current state, 1 = W0, 2 = W1, 3 = Z
    let decNumW0 = "", decNumW1 = "", decNumZ0 = "", decNumZ1 = "";
    let contZ = true;

    for (let i = 0; i < numV + 1; i++)
        Asub.push([]);

    for (let i = 0; i < numV; i++) {
        for (let j = 0; j < states.length; j++) {
            if (Number(tabVals[1][j].charAt(i)) === 1) {
                decNumW0 = "" + tabVals[0][j] + "0";
                Asub[i].push(parseInt(decNumW0, 2));
            }
            if (Number(tabVals[2][j].charAt(i)) === 1) {
                decNumW1 = "" + tabVals[0][j] + "1";
                Asub[i].push(parseInt(decNumW1, 2));
            }
            if (Number(tabVals[3][j]) === 1 && contZ) {
                decNumZ0 = "" + tabVals[0][j] + "0";
                decNumZ1 = "" + tabVals[0][j] + "1";
                Asub[Asub.length - 1].push(parseInt(decNumZ0, 2));
                Asub[Asub.length - 1].push(parseInt(decNumZ1, 2));
            }
        }
        contZ = false;
    }

    return;
}
