
//****************************** SAT *****************************************

function sat_getInstance() {
	return "(t or p or q or (not s))\n(p or (not q))";

}



function sat_to_threesat(instance) {
	let newformulaSets = new Array();
	let formulaSets = instance.split("\n");
	let compteurProposition = 2;

	for (let formulaString of formulaSets) {
		let formula = scheme.parser(formulaString);

		if (formula.length <= 5)
			newformulaSets.push(formulaString);
		else {
			let currentClause = [];
			for (let i = 0; i < formula.length; i += 2) {
				if (currentClause.length == 0)
					currentClause.push(formula[i]);
				else {
					currentClause.push("or");
					currentClause.push(formula[i]);
				}

				if (currentClause.length == 3 && (i < formula.length - 1)) {
					let newProposition = "_" + compteurProposition;
					currentClause.push("or");
					currentClause.push(newProposition);
					newformulaSets.push(scheme.prettyprint(currentClause));
					currentClause = [];
					currentClause.push(["not", newProposition]);
					compteurProposition++;
				}

			}

			newformulaSets.push(scheme.prettyprint(currentClause));
		}
	}

	return newformulaSets.join("\n");
}


