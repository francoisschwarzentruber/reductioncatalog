

//****************************** INDEPENDENT SET *****************************************




function drawInstanceGraph(elementDescription, instanceCode) {
     let instance = eval("(" + instanceCode + ")");
     graphBegin();

     for (let node of instance.vertices)
          graphAddNode(node);

     for (let edge of instance.edges)
          graphAddEdge(edge[0], edge[1]);

     graphEnd();

     graph_show(elementDescription);

}




function independentset_getInstance() {
     return "({vertices:[1,2,3,4], edges:[[1,4],[3,4]], numberofvertices: 3})";

}



function graphEdgeContains(G, u, v) {
     for (let edge of G.edges)
          if ((edge[0] == u) && (edge[1] == v))
               return true;

     for (let edge of G.edges)
          if ((edge[0] == v) && (edge[1] == u))
               return true;

     return false;
}

function graphEdgesComplement(G) {
     let Gnew = ({ vertices: G.vertices, edges: [] });

     for (let u of G.vertices)
          for (let v of G.vertices)
               if (u != v) {
                    if (!graphEdgeContains(G, u, v)) {
                         if (!graphEdgeContains(Gnew, u, v))
                              Gnew.edges.push([u, v]);

                    }

               }

     return Gnew;

}

function independentset_to_clique(instanceCode) {
     let instance = eval("(" + instanceCode + ")");
     instanceN = graphEdgesComplement(instance);
     instanceN.numberofvertices = instance.numberofvertices;
     return "(" + JSON.stringify(instanceN) + ")";
}


let independentset_drawInstance = drawInstanceGraph;
