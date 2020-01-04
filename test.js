
let states = ['A', 'B', 'C', 'D'];
let binStates = ['0000', '0001', '0010', '0011', '0100', '0101', '0110', '0111', '1000'];
let Z = [1, 1, 1, 0, 0, 0, 0, 1, 1];
let w0 = ['I', 'B', 'C', 'I', 'D', 'I', 'E', 'H', 'A'];
let w1 = ['C', 'I', 'G', 'C', 'E', 'C', 'F', 'A', 'C'];
let newState = [['D', 'F'], ['C'], ['E'], ['G'], ['A', 'I'], ['B', 'H']];

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

let tabVals = [["0001", "0010", "0100", "1000"], ["0001", "0100", "0001", "0100"], ["0010", "0010", "1000", "0010"], ["0", "0", "0", "1"]];

let numV = 4;
let Asub = [[], [], [], [], []];
let AsubW0 = [[], [], [], [], []];
let AsubW1 = [[], [], [], [], []];

function findANumber() {
    // For tabVals: 0 = current state, 1 = W0, 2 = W1, 3 = Z
    let decNumW0 = "", decNumW1 = ""; decNumZ0 = ""; decNumZ = "";
    let contZ = true;

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

function findOneHot() {
    let contZ = true;

    for (let i = 0; i < numV; i++) {
        for (let j = 0; j < states.length; j++) {
            if (Number(tabVals[1][j].charAt(i)) === 1) {
                AsubW0[i].push(j);
            }
            if (Number(tabVals[2][j].charAt(i)) === 1) {
                AsubW1[i].push(j);
            }
            if (Number(tabVals[3][j]) === 1 && contZ) {
                AsubW0[AsubW0.length - 1].push(j);
                AsubW1[AsubW1.length - 1].push(j);
            }
        }
        contZ = false;
    }

    let expr = "";
    let loc;
    let typeBin = 1;

    // Expressions for Y
    for (let i = 0; i < AsubW0.length - 1; i++) {
        expr = "Y" + (numV - i - 1) + " = ";

        if (AsubW0[i].length === 0 && AsubW1[i].length === 0) {
            expr += "0";
        } else {
            for (let j = 0; j < AsubW0[i].length; j++) {
                if (AsubW1[i].includes(AsubW0[i][j])) {
                    if (typeBin === 2 && AsubW0[i][j] === 0)
                        expr += "(y" + (AsubW0[i][j]) + ")' + ";
                    else
                        expr += "(y" + (AsubW0[i][j]) + ") + ";
                    loc = AsubW1[i].findIndex(function (value) {
                        if (value === AsubW0[i][j])
                            return true;
                    });
                    AsubW1[i] = AsubW1[i].slice(0, loc).concat(AsubW1[i].slice(loc + 1, AsubW1[i].length));
                }
                else {
                    if (typeBin === 2 && AsubW0[i][j] === 0)
                        expr += "(y" + (AsubW0[i][j]) + ")'w' + ";
                    else
                        expr += "(y" + (AsubW0[i][j]) + ")w' + ";
                }
            }

            for (let j = 0; j < AsubW1[i].length; j++) {
                if (typeBin === 2 && AsubW1[i][j] === 0)
                    expr += "(y" + (AsubW1[i][j]) + ")'w + ";
                else
                    expr += "(y" + (AsubW1[i][j]) + ")w + ";
            }
        }

        if (expr.charAt(expr.length - 1) === " ")
            expr = expr.substring(0, expr.length - 3);

        console.log(expr);
    }

    // Expressions for Z
    expr = "Z = ";
    if (AsubW0[AsubW0.length - 1].length === 0) {
        expr += "0";
    } else {
        for (let i = 0; i < AsubW0[AsubW0.length - 1].length; i++) {
            expr += "(y" + (AsubW0[AsubW0.length - 1][i]) + ") + ";
        }
    }

    if (expr.charAt(expr.length - 1) === " ")
        expr = expr.substring(0, expr.length - 3);
    console.log(expr);

    return;
}

function breakExpr(B) {
    let bUse = [];
    let bSplit = B.split("+");
    let numORS = bSplit.length - 1;
    let numDFF = numV;

    let cAND = 0; let litNum = 0;
    let litNumArr = [];
    for (let i = 0; i < numORS + 1; i++) {
        if (bSplit[i] !== '') {
            cAND++;
            for (let j = 0; j < bSplit[i].length; j++) {
                if (bSplit[i].charAt(j) === '(' || bSplit[i].charAt(j) === ')')
                    litNum += 0.5;
            }
            litNumArr.push(litNum);
            litNum = 0;
        }
    }

    bUse.push(cAND);
    bUse.push(numORS);
    bUse.push(numDFF);
    bUse = bUse.concat(...litNumArr);

    let lits = [];
    for (let i = 0; i < numV; i++) {
        lits.push("(y" + i + ")");
        lits.push("(y" + i + ")'");
    }

    return [bUse, lits];
}

breakExpr("(y0)'(y1) + (y2)(y3)(y4) + (y5)");