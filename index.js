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

    td1.textContent = literal(stateTableRC);
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

function literal(i) {
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
        states.push(literal(i - 2));
    }

    mainSM();
    binStates = binTrans(states, binStates);

    // Left Column Functions
    dispState(states, binStates, leftCol);
    dispBinTable(states, binStates, w0, w1, Z, leftCol);

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

        c1.textContent = bS[i];
        c2.textContent = bS[s.findIndex(function (val) {
            if (val === w0Min[i])
                return true;
        })];
        c3.textContent = bS[s.findIndex(function (val) {
            if (val === w1Min[i])
                return true;
        })];
        c4.textContent = zMin[i];

        row.appendChild(c1);
        row.appendChild(c2);
        row.appendChild(c3);
        row.appendChild(c4);
        tab1.appendChild(row);
    }
    xCol.appendChild(tab1);
    return;
}

// ------------------------
// State Minimization
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
for (let i = 0; i < binStates.length; i++) {
    parameters += states[i] + " = " + numV + "\'b" + binStates[i] + ", ";
}
parameters = parameters.substring(0, parameters.length - 2) + ";";
console.log(parameters);
console.log("");
console.log("   always @ (W, y_Q)");
console.log("   begin");
console.log("      case(y_Q)");

for (let i = 0; i < states.length; i++) {
    console.log("         " + states[i] + ": if (W) Y_D = " + w1[i] + ";");
    console.log("            else Y_D = " + w0[i] + ";");
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
for (let i = 0; i < Z.length; i++) {
    if (Z[i] === 1)
        zVerilog += "(y_Q == " + states[i] + ") | ";
}
zVerilog = zVerilog.substring(0, zVerilog.length - 3) + ";";
console.log(zVerilog);
console.log("   assign LEDR[9] = Z;");
console.log("   assign LEDR[3:0] = y_Q;");
console.log("");
console.log("endmodule");


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



