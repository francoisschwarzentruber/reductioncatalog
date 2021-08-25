# reductioncatalog

Redutioncatalog is a catalog of reductions between many decision problems (SAT, 3SAT, CLIQUE, etc.). The graphical interface is in the spirit of dictionnary.


# How to add a new problem to the catalog?

A problem is a PROBLEM.js file, where PROBLEM is the name of the problem. This file contains:
- a function PROBLEM_getInstance() that returns a string that represents a typical instance of PROBLEM.
- a function PROBLEM_drawInstance(elementDescription, instanceCode) that fills the div container whose description is elementDescription (for instance #myDiv) with a graphical representation of the instance.
- Then the file contains functions of the form PROBLEM_to_XXX(instance) where XXX could be any other problem. This function implements a reduction from PROBLEM to XXX.

