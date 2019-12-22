# A Finite State Machine Solver for EngSci Students
This project began on December 9, 2019. The goal of this program is to solve any binary Finite State Machine (FSM) by outputting the logic for the states, the corresponding circuit and the Verilog code. This program also performs state minimization.

## Notes and Possible Improvements
1. Although more than 26 states are possible with the program, I decided to limit it to this number to avoid having to deal with spam and double character state names.
2. The Verilog is specific to Altera (the ones we use at U of T). The case statements are generic.
3. Limited to two next possible W-states only: 0 and 1. More next W-states are possible to implement with this program, however, this is the hardest we are expected to know how to do in Eng Sci.

Project Working Status: In Progress (as of December 21, 2019)