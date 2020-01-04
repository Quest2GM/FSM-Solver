# A Finite State Machine Solver for EngSci Students
This project began on December 9, 2019. The goal of this program is to solve any binary Finite State Machine (FSM) by determining the logic for the states, its Verilog code and by performing state minimization.

## How it works?
The program uses the Quinn-McCluskey Algorithm to derive the boolean expressions. This algorithm is that it uses the idea of K-maps (finding adjacent 1s), but executes it in a more algorithmic and programmable way. The Verilog code was taken from Lab 6, Part 2 in the course, ECE259, and modified to suit the inputted FSM. Finally, state minimization is performed iteratively using the method learned in class.

## Possible Improvements
1. Although more than 10 states are possible with the program, I decided to limit it to this number to avoid having to deal with spam and double character state names.
2. The Verilog is specific to Altera (the ones we use at U of T). The case statements are generic.
3. Limited to two next possible W-states only: 0 and 1. More next W-states are possible to implement with this program, however, this is the most we are expected to know in Eng Sci.
4. Using recursion to do state minimization, instead of doing it iteratively.

## Future Additions to the Project
1. Improve on the website design and the GUI using more CSS. 
2. Output the circuit corresponding the FSM.

I plan to have this completed by the end of May 2020.

## Acknowledgements
Thanks to Zahi Haddad for helping me gain an intuitive understanding of the Quinn-McCluskey Algorithm. Another thanks to Kajanan Chinniah for the wonderful suggestions and for helping me break the program. A final thanks to Professor Anderson for the amazing class notes, for which the success of this project was highly dependent on.