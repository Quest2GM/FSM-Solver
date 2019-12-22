/* Produces the Verilog for the Finite State Machine */

let typeBin = 2; // 0 = binary, 1 = one-hot, 2 = modified one-hot

let states = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
let w0 = ['B', 'C', 'D', 'E', 'E', 'B', 'B', 'B', 'B'];
let w1 = ['F', 'F', 'F', 'F', 'F', 'G', 'H', 'I', 'I'];
let Z = [0, 0, 0, 0, 1, 0, 0, 0, 1];
let initialState = "A";
let numV = 0;
let binStates = [];

// Finds the max power of the elements
// Pads and finds binary translation of each element in the state list (binary translation is based on typeBin)
if (typeBin === 0) {
	while (states.length - 1 >= Math.pow(2, numV))
		numV++;
	for (let i = 0; i < states.length; i++)
		binStates.push(padZeros(i.toString(2)));
} else if (typeBin === 1) {
	numV = states.length;
	let currBin = "1";
	for (let i = 0; i < states.length; i++) {
		binStates.push(padZeros(currBin.toString(2)));
		currBin = currBin << 1;
	}
} else {
	numV = states.length;
	let currBin = "0";
	let powDec;
	binStates.push(padZeros(currBin.toString(2)));
	for (let i = 1; i < states.length; i++) {
		powDec = Math.pow(2, i) + 1;
		binStates.push(padZeros(Number(powDec).toString(2)));
	}
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
console.log("   always @ (posedge clock)");
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
