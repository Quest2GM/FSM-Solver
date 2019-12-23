
let states = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
let binStates = ['0000','0001','0010','0011','0100','0101','0110','0111','1000'];
let Z = [1, 1, 1, 0, 0, 0, 0, 1, 1];
let w0 = ['I', 'B', 'C', 'I', 'D', 'I', 'E', 'H', 'A'];
let w1 = ['C', 'I', 'G', 'C', 'E', 'C', 'F', 'A', 'C'];
let newState = [['D','F'], ['C'], ['E'], ['G'], ['A','I'], ['B','H']];

function minFSM () {
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
                eqStateM.push(newState[i][newState[i].length-1]);
                eqStateC.push(newState[i][j]);
            }
        }
    }
    
    minStates = eqStateChange(states, minStates, eqStateC, eqStateM);
    minW0 = eqStateChange(w0, minW0, eqStateC, eqStateM);
    minW1 = eqStateChange(w1, minW1, eqStateC, eqStateM);
    
    let mS = [], mW0 = [], mW1 = [], mZ = [];
    for (let i = minStates.length-1; i >= 0; i--) {
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

function eqStateChange (L, R, C, M) {
    for (let i = 0; i < L.length; i++) {
        if (C.includes(L[i])) {
            let idx = C.findIndex( function (val) { 
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

minFSM();