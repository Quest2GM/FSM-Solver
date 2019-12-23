
let states = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
let binStates = ['0000','0001','0010','0011','0100','0101','0110','0111','1000'];
let Z = [1, 1, 1, 0, 0, 0, 0, 1, 1];
let w0 = ['I', 'B', 'C', 'I', 'D', 'I', 'E', 'H', 'A'];
let w1 = ['C', 'I', 'G', 'C', 'E', 'C', 'F', 'A', 'C'];
let newState = [];

function minFSM () {
    let minStates = [...states];
    let minBinStates = [...binStates];
    let minW0 = [...w0];
    let minW1 = [...w1];
    let minZ = [...Z];
    let eqState = [...newState];

    for (let i = 0; i < newState.length; i++) {
        if (newState[i].length !== 1)
            eqState.push(newState[i]);
    }

    let c = 0;
    while (c !== minStates.length) {
        for (let i = 0; i < eqState.length; i++) {
            if (eqState[i].includes(minStates[c]) && minStates[c] !== eqState[i][eqState.length-1]) {
                minStates = minStates.slice(0, c).concat(newState.slice(c + 1, minStates.length));
                minBinStates = minBinStates.slice(0, c).concat(minBinStates.slice(c + 1, minBinStates.length));
                minW0 = minW0.slice(0, c).concat(minW0.slice(c + 1, minW0.length));
                minW1 = minW1.slice(0, c).concat(minW1.slice(c + 1, minW1.length));
                minZ = minZ.slice(0, c).concat(minZ.slice(c + 1, minZ.length));
                c--;
                break;
            }
        }
        c++;
    }


       
    return [minStates, minBinStates, minW0, minW1, minZ];
}