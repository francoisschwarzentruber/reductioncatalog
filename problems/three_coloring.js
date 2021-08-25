

//****************************** 3COL *****************************************

function threecoloring_getInstance() {
    return "({vertices: [1, 2, 3],\n" +
        "edges:  [[1, 2], [1, 3], [2, 3]]})";

}


function threecoloring_drawInstance(elementDescription, instanceCode) {
    let instance = eval("(" + instanceCode + ")");
    graphBegin();
    for (let edge of instance.edges) {
        graphAddEdge(edge[0], edge[1]);
    }
    graphEnd();

    graph_show(elementDescription);

}



let colors = ["red", "blue", "yellow"];


function createPropositionVertexInColor(v, c) {
    return "(" + v + " in " + c + ")";
}


function threecoloring_to_sat(instance) {
    let G = eval(instance);
    let phi = "";

    for (let v of G.vertices) {
        phi += "(" + createPropositionVertexInColor(v, colors[0]) + " or " + createPropositionVertexInColor(v, colors[1]) + " or " + createPropositionVertexInColor(v, colors[2]) + ")\n";
    }

    for (let v of G.vertices)
        for (let c1 of colors)
            for (let c2 of colors)
                if (c1 != c2) {
                    phi += "((not " + createPropositionVertexInColor(v, c1) + ") or (not " + createPropositionVertexInColor(v, c2) + "))\n";
                }

    for (let c of colors)
        for (let e of G.edges) {
            phi += "((not " + createPropositionVertexInColor(e[0], c) + ") or (not " + createPropositionVertexInColor(e[1], c) + "))\n";


        }

    return phi;
}



function threecoloring_to_threesat(instance) {
    return sat_to_threesat(threecoloring_to_sat(instance));
}