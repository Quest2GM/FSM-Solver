/* Produces the Verilog code for the Finite State Machine */

/* Example:

module lab6part2 (SW, LEDR, KEY);
	input [9:0] SW;
	input [0:0] KEY;
	output [9:0] LEDR;
	wire W, clock, resetn, Z;
    
	assign W = SW[1];
	assign resetn = SW[0];
	assign clock = KEY[0];
		
	reg [3:0] y_Q, Y_D;
	parameter A = 4'b0000, B = 4'b0001, C = 4'b0010, D = 4'b0011, E = 4'b0100, F = 4'b0101, G = 4'b0110, H = 4'b0111, I = 4'b1000;
	
	always @ (W, y_Q)
	begin
		case (y_Q)
			A: if (~W) Y_D = B;
				else Y_D = F;
			B: if (~W) Y_D = C;
				else Y_D = F;
			C: if (~W) Y_D = D;
				else Y_D = F;
			D: if (~W) Y_D = E;
				else Y_D = F;
			E: if (~W) Y_D = E;
				else Y_D = F;
			F: if (~W) Y_D = B;
				else Y_D = G;
			G: if (~W) Y_D = B;
				else Y_D = H;
			H: if (~W) Y_D = B;
				else Y_D = I;
			I: if (~W) Y_D = B;
				else Y_D = I;
			default: Y_D = 4'bxxxx;
		endcase
	end
	
	always @ (posedge clock)
	begin
		if (resetn == 1'b0)
			y_Q <= A;
		else
			y_Q <= Y_D;
	end
	
	assign Z = (y_Q == E) | (y_Q == I);
	assign LEDR[9] = Z;
	assign LEDR[3:0] = y_Q;
	
endmodule

*/

console.log("Henlo \
and all that inhabit it \
world");