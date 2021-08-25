/*this an interpreter of the language Scheme in Javascript called JavaSc...heme!*/
/*how to use it !
scheme.eval("(+ 1 2)"); //returns 3
scheme.eval("(define (f x) (+ x 1))"); //returns "f defined"
scheme.eval("(f 4)"); // returns 5
scheme.eval("'((f g) h)"); //returns the array [["f", "g"], "h"]
*/

let newtemppropCounter = 0;


//because under Chrome it is not defined
String.prototype.startsWith = function (prefix) {
	return this.indexOf(prefix) === 0;
}


function trim(s) {
	s = s.replace(/(^\s*)|(\s*$)/gi, "");
	s = s.replace(/[ ]{2,}/gi, " ");
	s = s.replace(/\n /, "\n");
	return s;
}

function functionEqual(x, y) {
	if (x instanceof Array) {
		if (!(y instanceof Array)) {
			return false;
		}

		if (y.length != x.length)
			return false;

		for (let i = 0; i < x.length; i++) {
			if (!functionEqual(x[i], y[i]))
				return false;
		}

		return true;
	}
	else {
		return x == y;

	}


}


/*replace each occurrence of v in L by expr
listReplace(["a", "b"], "a", "miaou")*/
function listReplace(L, v, expr) {
	if (L == v)
		return expr;
	else if (L instanceof Array) {
		let T = new Array(L.length);

		for (let i in L) {
			T[i] = listReplace(L[i], v, expr);
		}
		return T;

	}
	else
		return L;

}




function unifyConstructVal(objectToBeMatched, pattern, val) {

	if (pattern instanceof Array) {

		if (pattern[0] === "quote") {

			if (pattern[1] === objectToBeMatched)

				return true;

			else

				return false;

		}

		else {

			if (objectToBeMatched instanceof Array) {

				if (objectToBeMatched.length != pattern.length)

					return false;



				for (let i = 0; i < objectToBeMatched.length; i++) {

					if (!unifyConstructVal(objectToBeMatched[i], pattern[i], val))

						return false;



				}

				return true;



			}

			else

				return false;



		}









	}

	else {

		val.formal.push(pattern);

		val.actual.push(objectToBeMatched);

		return val;



	}

}





/*unify(["not", "p"], [["quote", "not"], "phi"])

  unify(["miaou", "p"], [["quote", "not"], "phi"])

  unify(["non", "p", "e"], [["quote", "not"], "phi"])

  unify("e", [["quote", "not"], "phi"])

  unify("e",  "phi")

  unify(["p", "and", "q"],  ["phi", ["quote", "and"], "psi"])

*/

function unify(objectToBeMatched, pattern) {

	let val = { formal: [], actual: [] };

	if (unifyConstructVal(objectToBeMatched, pattern, val))

		return val;

	else

		return undefined;



}




/** @export */
let scheme = (function () {



	function debugmessage(message) {

		//console.log(message);

	}







	function debugerrormessage(message) {

		console.log(message);


	}





	function find(o, x) {

		if (o.hasOwnProperty(x))

			return o;

		else {

			debugerrormessage("impossible to find " + x + " in the environment");

			return {};

		}

	}



	function Env(args) {

		let env = {};

		outer = args.outer || {}

		for (let i in outer)

			env[i] = outer[i];

		if (args.formal.length === args.actual.length) {

			for (let i = 0; i < args.formal.length; i++)

				env[args.formal[i]] = args.actual[i];

		}



		return env;

	}



	/*add standard functions in the environment*/

	function add_global(env) {





		let primitives = ["sin", "cos", "tan", "asin", "acos", "atan", "exp", "log", "floor", "min", "max", "sqrt", "abs"];



		for (let i = 0; i < primitives.length; i++) {

			env[primitives[i]] = Math[primitives[i]];

		}



		env["#f"] = false;

		env["#t"] = true;

		env["+"] = function (x, y) { return x + y; }

		env["-"] = function (x, y) { return x - y; }

		env["*"] = function (x, y) { return x * y; }

		env["/"] = function (x, y) { return x / y; }

		env[">"] = function (x, y) { return x > y; }

		env["<"] = function (x, y) { return x < y; }

		env[">="] = function (x, y) { return x >= y; }

		env["<="] = function (x, y) { return x <= y; }

		env["="] = function (x, y) { return x === y; }

		env["car"] = function (x) { return x[0] }

		env["caar"] = function (x) { return x[0][0] }

		env["cadr"] = function (x) { return x[1] }

		env["caddr"] = function (x) { return x[2] }

		env["cdr"] = function (x) { return x.slice(1) }

		env["cddr"] = function (x) { return x.slice(1).slice(1) }

		env['list'] = function () { return Array.prototype.slice.call(arguments); };

		env["eq?"] = function (x, y) { return x === y; }

		env["equal?"] = functionEqual;

		env["cons"] = function (x, y) { return [x].concat(y); }

		env["append"] = //function (x, y)  

			// { try {return x.concat(y);} catch(err) {debugerrormessage("error in append. Object was: " +  x + " Argument was: " + y);} };

			function () {

				try {

					let result = arguments[arguments.length - 1];

					for (let i = arguments.length - 2; i >= 0; i--)

						result = arguments[i].concat(result);

					return result;

				}

				catch (err) {
					debugerrormessage("error in append. Arguments were: " + arguments);



				}

			}

		env["not"] = function (x) { return !x; }

		env["and"] = function (x, y) { return (x && y); }

		env["or"] = function (x, y) { return (x || y); }

		env["length"] = function (x) { return x.length; }

		env["list?"] = function (x) { return (x instanceof Array); }

		env["null?"] = function (x) { return (!x || x.length == 0); }

		env["symbol?"] = function (x) { return (typeof (x) == "string"); }

		env["string-append"] = function (x, y) { return x + y; }

		env["number->string"] = function (x) { return x; }

		env["number->symbol"] = function (x) { return "_" + x; }

		env["newtempprop"] = function () { newtemppropCounter++; return "_" + newtemppropCounter; }
		env["symbol-uppercase?"] = function (x) {
			if (!(typeof (x) == "string"))

				return false;

			else return (x == x.toUpperCase());
		}

		env["map"] = function (functionForEachElement, listForMap) { return listForMap.map(function (x) { return functionForEachElement.apply(null, [x]); }); }

		env["filter"] = function (functionForEachElement, listToFilter) { return listToFilter.filter(function (x) { return functionForEachElement.apply(null, [x]); }); }

		env["list-consecutive-integers-get"] = function (a, b) {
			let T = new Array(b - a + 1);

			for (let i = 0; i <= b - a; i++) {
				T[i] = a + i;
			}
			return T;
		}


		env["singleton?"] = function (x) {
			if (x instanceof Array)
				return (x.length == 1);
			else
				return false;
		}

		env["list-replace"] = listReplace;


		return env;

	}







	function quasiquoteReplaceUnquoteExpressions(schemeExpression, env) {

		if (schemeExpression instanceof Array) {

			if (schemeExpression.length === 0)

				return schemeExpression;

			else {

				if (schemeExpression[0] === 'unquote') {

					return evalte(schemeExpression[1], env);

				}

				else {

					let result = new Array(schemeExpression.length);



					for (let i in schemeExpression) {

						result[i] = quasiquoteReplaceUnquoteExpressions(schemeExpression[i], env);





					}



					return result;





				}



			}



		}

		else

			return schemeExpression;



	}







	/*evaluation of the s-expression x in the environment env*/

	function evalte(x, env) {

		env = env || global_env;

		if (x === undefined)

			debugerrormessage("internal error in evalte(x, env): x is undefined");

		else if (typeof x == "string")

			return find(env, x)[x];

		else if (typeof x == 'number')

			return x;

		else if (x[0] == 'quote')

			return x[1];

		else if (x[0] == 'quasiquote')

			return quasiquoteReplaceUnquoteExpressions(x[1], env);



		else if (x[0] == 'if') {

			let test = x[1];

			let conseq = x[2];

			let alt = x[3];

			if (evalte(test, env))

				return evalte(conseq, env);

			else

				return evalte(alt, env);

		}

		else if (x[0] === 'set!') {

			find(env, x[1])[x[1]] = evalte(x[2], env);

			return "value of " + x[0] + " set"

		}

		else if (x[0] === 'define') {

			let letiableDefined;

			if (x[1] instanceof Array) //constructions as "(define (f x y) ....)

			{

				letiableDefined = x[1][0];

				let lets = x[1].slice(1);

				let exp = x[2];

				env[letiableDefined] = function () {

					return evalte(exp, Env({ formal: lets, actual: arguments, outer: env }));

				};

			}

			else  //constructions as "(define x ....)

			{

				letiableDefined = x[1];

				env[x[1]] = evalte(x[2], env);

			}

			debugmessage(letiableDefined + " defined");

			return letiableDefined + " defined"

		}

		else if ((x[0] === 'lambda') || (x[0] === 'λ')) {

			let lets = x[1];

			let exp = x[2];

			return function () {

				return evalte(exp, Env({ formal: lets, actual: arguments, outer: env }));

			};

		}

		else if (x[0] === 'let') {

			let extractlets = function (tab) {

				let V = new Array();

				for (let i in tab) {

					V.push(tab[i][0]);

				}



				return V;

			}

			let lets = extractlets(x[1]);



			let extractargs = function (tab) {

				let A = new Array();

				for (let i in tab) {

					A.push(evalte(tab[i][1], env));

				}



				return A;

			}



			let args = extractargs(x[1]);

			let exp = x[2];



			return evalte(exp, Env({ formal: lets, actual: args, outer: env }));



		}

		else if (x[0] === 'let*') {

			let newenv = {};



			for (let i in env)

				newenv[i] = env[i];



			let tab = x[1];





			for (let i in tab) {

				newenv[tab[i][0]] = evalte(tab[i][1], newenv);

			}



			let exp = x[2];



			return evalte(exp, newenv);



		}

		else if (x[0] === 'match') {

			let objectToBeMatched = evalte(x[1], env);



			for (i = 2; i < x.length; i++) {

				let val = unify(objectToBeMatched, x[i][0]);





				if (val != undefined) {

					val.outer = env;

					return evalte(x[i][1], Env(val));

				}

			}





			debugerrormessage("match unsuccessful");

		}

		else if (x[0] === 'begin') {

			let val;

			for (let i = 1; i < x.length; i++)

				val = evalte(x[i], env);

			return val;

		}

		else {

			let exps = new Array(x.length);

			debugmessage("miaou: ");

			for (i = 0; i < x.length; i++) {

				exps[i] = evalte(x[i], env);

				debugmessage("arg" + i + " = " + exps[i]);

			}

			let proc = exps.shift();



			//now, proc is the function to be executed

			//and exps are the arguments



			let result;

			if (proc === undefined) {

				debugerrormessage("function '" + x[0] + "'undefined in [" + x + "]");// of length " + x.length);

				result = 0;

			}

			else if (typeof proc != "function") {

				debugerrormessage(x[0] + " is not a function");

				result = 0;

			}

			else {

				result = proc.apply(null, exps);

			}

			debugmessage("result = " + result);

			return result;

		}









	}

	///////////////////////////////

	global_env = add_global(Env({ formal: [], actual: [] }));







	/*parse the string s and returns the internal representation of s*/

	function parser(s) {
		debugerrormessage("begin parser: " + s);
		let tokens = tokenize(s);
		debugerrormessage("good");
		return read_from(tokens);

	}



	/*lexical analyzer*/

	function tokenize(s) {



		tab = s.split("\n");

		tab = tab.filter(function (line) { return !trim(line).startsWith(";"); });

		s = tab.join("\n");



		result = trim(s.replace(/'/g, "' ")

			.replace(/`/g, "` ")

			.replace(/,/g, ", ")

			.replace(/\(/g, " ( ")

			.replace(/\)/g, " ) "))

			.replace(/\s+/g, " ")

			.split(" ");



		return result;



	}



	/*syntactic analyzer*/

	function read_from(tokens) {

		if (tokens.length == 0) {

			debugerrormessage("Unexpected EOF while reading");

			return undefined;



		}





		let token = tokens.shift();

		if ("'" == token) {

			let L = [];

			L.push('quote');

			L.push(read_from(tokens));

			return L;

		}

		if ("`" == token) {

			let L = [];

			L.push('quasiquote');

			L.push(read_from(tokens));

			return L;

		}

		if ("," == token) {

			let L = [];

			L.push('unquote');

			L.push(read_from(tokens));

			return L;

		}

		if ("(" == token) {

			let L = [];

			while ((tokens[0] != ")") && (tokens.length > 0)) {

				L.push(read_from(tokens));

			}

			if (tokens.length == 0)

				debugerrormessage("Unexpected EOF while reading");

			else

				tokens.shift();

			return L;

		}

		else if (")" == token)

			debugerrormessage(") unexpected");

		else

			return atom(token);

	}



	function atom(token) {

		if (!(isNaN(token)))

			return Number(token);



		else

			return token;



	}







	/*transform the internal representation of an s-express o in a string*/

	function prettyprint(o) {

		if (o instanceof Array) {

			return "(" + o.map(prettyprint).join(" ") + ")";

		}

		else {

			return o;

		}



	}





	/*return the scheme interpreter object*/

	return {

		/*read a string as "(+ 2 3)", or an array as ['+', 1, 2] and returns the internal representation of the evaluation of it
	
	
	
	eg. scheme.eval("(+ 1 2)")
	
		scheme.eval(['+', 1, 2]);
	
	
	
		scheme.eval("(let ((x 1) (y (+ x 1))) (* y 2))") returns NaN
	
		scheme.eval("(let* ((x 1) (y (+ x 1))) (* y 2))") returns 4
	
		scheme.eval("(quasiquote (2 3 (unquote (+ 2 3))))")
	
		scheme.eval("`(2 3 ,(+ 2 3))")
	
		scheme.eval("(match '(1 2) ((a b) (+ a b)) (a a))")
	
		scheme.eval("(match 'z ((a b) (+ a b)) (a `(,a)))")
	
		scheme.eval("(filter (lambda (x) (> x 0)) '( 1 2))")
	
		scheme.eval("(map (lambda (x) (* 2 x)) '( 1 2))")
	
		scheme.eval("(map sin '(1  2 7))")
	
	*/

		"eval": function (string) {



			if ((typeof string) === "string") {

				return evalte(parser(string));

			}

			else {

				return evalte(string);

			}



		},







		"parser": function (string) {

			return parser(string);

		},



		/*read a string as "'(1 2)" and returns a string representing the evaluation of it, for instance "(1 2)"*/

		"evalprettyprint": function (string) {

			return prettyprint(evalte(parser(string)));

		},





		/*takes a scheme expression (usually an array) and transform it in a string with a lot of parenthesis*/

		"prettyprint": function (schemeExpression) {

			return prettyprint(schemeExpression);

		},





		"apply": function (functionName, argument) {

			return evalte([functionName, argument]);

		},



		/*load a scheme file on the web and evaluate it (it puts all the definition in the global environment)*/

		"loadfile": function (url) {

			let result;

			$.ajax(

				{

					mimeType: 'text/plain; charset=x-user-defined',

					type: 'GET',

					async: false,

					url: url,

					dataType: "text",

					success: function (data) {

						result = data;



						let t = tokenize(data);



						while (t.length > 0) {

							evalte(read_from(t));

						}

					}

				});

			return result;



		}

	};
})();
