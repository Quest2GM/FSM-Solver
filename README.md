# A Finite State Machine Solver for EngSci Students
This project began on December 9, 2019. The goal of this program is to solve any binary Finite State Machine (FSM) by outputting the logic for the states, the corresponding circuit and the Verilog code. This program also performs state minimization.

## Notes and Possible Improvements
1. Although more than 26 states are possible with the program, I decided to limit it to this number to avoid having to deal with spam and double character state names.
2. The Verilog is specific to Altera (the ones we use at U of T). The case statements are generic.
3. Limited to two next possible W-states only: 0 and 1. More next W-states are possible to implement with this program, however, this is the most we are expected to know in Eng Sci.
4. Give the option of doing NAND and NOR gate implementations for outputting the circuit. This is certainly doable, however, will require a little bit more thought.
5. Using recursion for state minimization.

Project Working Status: In Progress (as of December 21, 2019)