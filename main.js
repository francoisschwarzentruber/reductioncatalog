let compose = function (f, g) {
  return function (x) {
    return f(g(x));
  };
};


var problems = ["3COLORING", "3SAT", "SAT", "picross", "INDEPENDENTSET", "CLIQUE"];


function problem_register(problemname) { problems.push(problemname); }


$(document).ready(function () {
  for (let problem of problems) {
    $('#problem1').append($('<option>', {
      value: problem,
      text: problem
    }));
  }
  problem1choose();
});



function getInstance1() { return $("#instance1").val(); }
function getInstance2() { return $("#instance2").val(); }




/**
 * switch problems if it is possible
 */
function switchProblems() {
  var problem1 = $("#problem1").val();
  var problem2 = $("#problem2").val();

  //it is possible to switch if the reduction function "pb1_to_pb2" is defined
  if (evalwhetherdefined(getProblemNormalizedName(problem2) + "_to_" + getProblemNormalizedName(problem1))) {
    $("#problem1").val(problem2);
    problem1instanceupdate();
    problems2listupdate();

    $("#problem2").val(problem1);

    update();
  }
}

function getProblem1() { return getProblemNormalizedName($("#problem1").val()); }
function getProblem2() { return getProblemNormalizedName($("#problem2").val()); }


function getProblemNormalizedName(name) {
  name = name.replace(/3/g, "three");
  name = name.toLowerCase();
  return name;
}



function evalwhetherdefined(expression) { return eval("typeof " + expression) != "undefined"; }



/**
 * list all the problems 2 for which there is a defined reduction pb1_to_pb2
 */
function problems2listupdate() {
  var name1 = getProblem1();
  $('#problem2').empty();
  for (var i in problems) {
    if (evalwhetherdefined(name1 + "_to_" + getProblemNormalizedName(problems[i]))) {
      $('#problem2').append($('<option>', {
        value: problems[i],
        text: problems[i]
      }));
    }
  }
}



function problem1instanceupdate() {
  var name1 = getProblem1();
  $("#instance1").val(eval(name1 + "_getInstance()"));
}

function problem1choose() {
  var name1 = getProblem1();
  problem1instanceupdate();
  problems2listupdate();
  update();
}


function update() {
  if (evalwhetherdefined(getProblem1() + "_drawInstance"))
    eval(getProblem1() + "_drawInstance('#instance1div', (getInstance1()))");
  else
    $("#instance1div").html("");

  var reductionName = getProblem1() + "_to_" + getProblem2();
  $("#instance2").val(eval(reductionName + "(getInstance1())"));

  if (evalwhetherdefined(getProblem2() + "_drawInstance"))
    eval(getProblem2() + "_drawInstance('#instance2div', (getInstance2()))");
  else
    $("#instance2div").html("");

}
