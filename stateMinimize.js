/* Performs state minimization on the Finite State Machine */

// Test Case # 1
// let states = ['A', 'B', 'C', 'D', 'E'];
// let newState = [[],[]];
// let Z = [0,0,0,0,1];
// let w0 = ['A', 'C', 'D', 'A', 'C'];
// let w1 = ['B', 'B', 'B', 'E', 'B'];

// Test Case #2
// let states = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
// let newState = [[], []];
// let Z = [1, 1, 0, 1, 0, 0, 0];
// let w0 = ['B', 'D', 'F', 'B', 'F', 'E', 'F'];
// let w1 = ['C', 'F', 'E', 'G', 'C', 'D', 'G'];

// Test Case #3
let states = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
let newState = [[], []];
let Z = [1, 1, 1, 0, 0, 0, 0, 1, 1];
let w0 = ['I', 'B', 'C', 'I', 'D', 'I', 'E', 'H', 'A'];
let w1 = ['C', 'I', 'G', 'C', 'E', 'C', 'F', 'A', 'C'];

function main() {
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

main();
console.log(newState);
