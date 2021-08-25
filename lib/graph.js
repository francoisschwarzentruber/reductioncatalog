let graphDOTnotation = "";


function graphBegin() {
	graphDOTnotation = "graph G \n             {  node [padding=0, margin=0, shape=oval style=filled]    \n";
	//%node [shape=circle, fillcolor=lightblue2, style=filled]
}

function graphEnd() {
	graphDOTnotation += "\n}";
}


function graphAddNode(nodeName) {
	graphDOTnotation += '"' + nodeName + '";\n';
}


function graphAddEdge(node1, node2, label) {
	let labelDOT;
	if (label == undefined)
		labelDOT = "";
	else
		labelDOT = ' [label = "' + label + '"]';

	graphDOTnotation += '"' + node1 + '" -- "' + node2 + '"' + labelDOT + '\n';

}

function graph_show(elementDescription) {
	try {
		let svg_div = jQuery(elementDescription);
		svg_div.html("");

		let svg = Viz(graphDOTnotation, "svg");
		svg_div.html(svg);
	}
	catch (err) {
		svg_div.html("ERROR");
	}

}