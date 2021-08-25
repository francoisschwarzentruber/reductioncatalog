

//****************************** 3SAT *****************************************

function threesat_getInstance() {
  return "(p or q or (not s))\n(p or (not q) or s)";

}

function threesat_to_sat(instance) {
  return instance;
}




function addEdge(G, v1, v2) {
  for (let edge of G.edges) {
    if ((edge[0] == v1) && (edge[1] == v2))
      return;

    if ((edge[0] == v2) && (edge[1] == v1))
      return;
  }

  G.edges.push([v1, v2]);
}

function addNode(G, v) {
  G.vertices.push(v);
}



function traiterLitteral(G, v) {
  let l = v;
  if (typeof v == "object") {
    l = v[1];
  }

  let notl = "(not " + l + ")";
  addEdge(G, "R", l);
  addEdge(G, "R", notl);
  addEdge(G, l, notl);
}

function threesat_to_threecoloring(instance) {
  G = { vertices: [], edges: [] };

  addEdge(G, "R", "T");
  addEdge(G, "R", "F");
  addEdge(G, "T", "F");

  let formulaSets = instance.split("\n");

  for (let formulaString of formulaSets) {
    let formula = scheme.parser(formulaString);
    let alpha = formula[0];
    let beta = formula[2];
    let delta;
    if (formula.length > 3) {
      delta = formula[4];
      traiterLitteral(G, delta);
    }
    else
      delta = "F";

    traiterLitteral(G, alpha);
    traiterLitteral(G, beta);


    alpha = scheme.prettyprint(alpha);
    beta = scheme.prettyprint(beta);
    delta = scheme.prettyprint(delta);

    let clause = formulaString;
    addEdge(G, "T", "t" + clause);
    addEdge(G, "T", "z" + clause);
    addEdge(G, "t" + clause, delta);
    addEdge(G, "z" + clause, "a" + clause);
    addEdge(G, "x" + clause, "a" + clause);
    addEdge(G, "y" + clause, "a" + clause);
    addEdge(G, "x" + clause, "y" + clause);
    addEdge(G, "x" + clause, alpha);
    addEdge(G, "y" + clause, beta);

  }




  return "(" + JSON.stringify(G) + ")";


}




function threesat_to_independentset(instance) {
  G = { vertices: [], edges: [] };

  let formulaSets = instance.split("\n");
  let ic = 0;
  let propositions = new Array();

  for (let formulaString of formulaSets) {
    let clause = scheme.parser(formulaString);

    for (let i = 0; i < clause.length; i += 2) {
      addNode(G, scheme.prettyprint(clause[i]) + ic);

      let p = "";
      if (typeof clause[i] == "object")
        p = (clause[i][1]);
      else
        p = (clause[i]);

      if (propositions.indexOf(p) < 0) {
        propositions.push(p);
      }
    }


    for (let i = 0; i < clause.length; i += 2)
      for (let j = i + 2; j < clause.length; j += 2)
        if (scheme.prettyprint(clause[i]) != scheme.prettyprint(clause[j])) {
          addEdge(G, scheme.prettyprint(clause[i]) + ic, scheme.prettyprint(clause[j]) + ic);
        }

    ic++;

  }




  for (let p of propositions) {
    let notp = "(not " + p + ")";

    for (let icc1 = 0; icc1 < ic; icc1++)
      for (let icc2 = icc1 + 1; icc2 < ic; icc2++) {

        if (G.vertices.indexOf(notp + icc1) >= 0 && G.vertices.indexOf(p + icc2) >= 0)
          addEdge(G, notp + icc1, p + icc2);

        if (G.vertices.indexOf(p + icc1) >= 0 && G.vertices.indexOf(notp + icc2) >= 0)
          addEdge(G, p + icc1, notp + icc2);
      }

  }



  G.numberofvertices = formulaSets.length; //number of clauses


  return "(" + JSON.stringify(G) + ")";


}




let threesat_to_clique = compose(independentset_to_clique, threesat_to_independentset);
