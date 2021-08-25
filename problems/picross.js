
//****************************** picross *****************************************

function picross_getInstance()
{
    return "({clusterH: [[3, 6], [1, 4], [1, 1, 3], [2], [3, 3], [1, 4], [2, 5], [2, 5], [1, 1], [3]],\n" +
"clusterV:  [[2, 3], [1, 2], [1, 1, 1, 1], [1, 2], [1, 1, 1, 1], [1, 2], [2, 3], [3, 4], [8], [9]]})";

}



function xitj(i, t, j)
{
   return "(xgauche du cluster numero " + t + " ligne " + i + " vaut " + j + ")";
  //return "(xitj " + i + " " + t + " " + j + ")";
}



function yjti(j, t, i)
{
    return "(yhaut du cluster numero " + t + " colonne " + j + " vaut " + i + ")";
   // return "(yjti " + j + " " + t + " " + i + ")";
}

function peint(i, j)
{
    return "(case " + i + " " + j + " noire)";
}


/*disjonctionCluster(3, [1, 4], 5, function(x, t) {return "(cluster " + t + " à pos + " + x + ")";})*/
function disjonctionCluster(x, clusters, n, functionForMakingAtoms, minBounds, maxBounds)
{
    var atoms = new Array();
    
    for(var t in clusters)
    {
	var posmin = Math.max(minBounds(t), x - clusters[t]+1);
	var posmax = Math.min(x, maxBounds(t));
	
	
	for(var xx = posmin; xx<=posmax; xx++)
	{
	    atoms.push(functionForMakingAtoms(xx, t));
	  
	}
      
    }
    
    if(atoms.length == 0)
	return "bottom";
    else if(atoms.length == 1)
    {
	return atoms[0];
    }
    else
    {
	var s = "(";
      
	for(var i in atoms)
	{
	  s += atoms[i];
	  
	  if(i < atoms.length - 1)
	  {

	    s += " or "; 
	  }
	}
		
	s += ")";
	
	return s;
      
    }

   
}





function createBigOrDisjunction(variable, boundmin, boundmax, subformula)
{
    if(boundmin == boundmax)
    {
	var regex = new RegExp(" " + variable + "\\)", 'g');
	subformula = subformula.replace(regex, " " + boundmin + ")");
	return subformula;
    }
    else
    {
       return "(bigor " + variable + " (" + boundmin + " .. " + boundmax + ") " + subformula + ")";
      
    }
}



function picrossToSAT(clusterH, clusterV)
{
	var formulas = new Array();
	var nbcolonnes = clusterV.length;
	var nblignes = clusterH.length;

	var getPosMinClusterH = function(i, t)
	    {
		var s = 0;
		for(var t2 = 0; t2 < t; t2++)
		{
		  s += clusterH[i][t2] + 1;
		}
		
		return s;
	      
	    }
	    
	var getPosMinClusterV = function(i, t)
	    {
		var s = 0;
		for(var t2 = 0; t2 < t; t2++)
		{
		  s += clusterV[i][t2] + 1;
		}
		
		return s;
	      
	    }

	var getPosMaxClusterH = function(i, t)
	    {
		var s = nbcolonnes;
		for(var t2 = clusterH[i].length-1; t2 > t; t2--)
		{
		  s -= (clusterH[i][t2] + 1);
		}
		
		s -= clusterH[i][t];
		return s;
	      
	    }
	    
	var getPosMaxClusterV = function(i, t)
	    {
		var s = nbcolonnes;
		for(var t2 = clusterV[i].length-1; t2 > t; t2--)
		{
		  s -= (clusterV[i][t2] + 1);
		}
		
		s -= clusterV[i][t];
		return s;
	      
	    }
	    
	    
	
	/*each horizontal cluster has a position j*/
	for(var i in clusterH)
	{
		for(var t in clusterH[i])
		{
		      formulas.push(createBigOrDisjunction("j", getPosMinClusterH(i, t), getPosMaxClusterH(i, t), xitj(i, t, "j")));
		}
	}
	
	/*.. and this position is unique*/
	for(var i in clusterH)
	{
		for(var t in clusterH[i])
		  for(j = getPosMinClusterH(i, t); j <= getPosMaxClusterH(i, t); j++)
		    for(j2 = getPosMinClusterH(i, t); j2 <= getPosMaxClusterH(i, t); j2++)
		      if(j != j2)
		      {
			    formulas.push("(" + xitj(i, t, j) + " imply (not " + xitj(i, t, j2) + "))");
		      }
	}
	
	
	
       /*each vertical cluster has a position i*/
	for(var j in clusterV)
	{
		for(var t in clusterV[j])
		{
		      formulas.push(createBigOrDisjunction("i", getPosMinClusterV(j, t), getPosMaxClusterV(j, t), yjti(j, t, "i") ));
		}
	}
	
	/*.. and this position is unique*/
	for(var j in clusterV)
	{
		for(var t in clusterV[j])
		  for(var i = getPosMinClusterV(j, t); i <= getPosMaxClusterV(j, t); i++)
		    for(i2 = getPosMinClusterV(j, t); i2 <= getPosMaxClusterV(j, t); i2++)
		      if(i != i2)
		      {
			    formulas.push("(" + yjti(j, t, i) + " imply (not " + yjti(j, t, i2) + "))");
		      }
	}
	
	
	/*the next horizontal cluster is on the right*/
	for(var i in clusterH)
	{
	  for(var t in clusterH[i])
	   if(t < clusterH[i].length - 1)
	   {
	      for (var j = getPosMinClusterH(i, t); j <= getPosMaxClusterH(i, t); j++)
	      {

		    var t = parseInt(t);
		    var j = parseInt(j);
		    var posmin = j + clusterH[i][t]+1;
		    var posmax = getPosMaxClusterH(i, t+1);
		    
		    formulas.push("(" + xitj(i, t, j) + " imply (bigor j2 (" + posmin + " .. " + posmax + ") " + xitj(i, t+1, "j2") + "))");
		  
		}
	   
	 }
	  
	}
	
	/*the next vertical cluster is on the bottom*/
	for(var j in clusterV)
	{
	  for(var t in clusterV[j])
	   if(t < clusterV[j].length - 1)
	   {
	      for (var i = getPosMinClusterV(j, t); i<=getPosMaxClusterV(j, t); i++)
	      {
	   
		  var t = parseInt(t);
		  var i = parseInt(i);
		  var posmin = i + clusterV[j][t]+1;
		  var posmax = getPosMaxClusterV(j, t+1);
		  
		  formulas.push("(" + yjti(j, t, i) + " imply (bigor i2 (" + posmin + " .. " + posmax + ") " + yjti(j, t+1, "i2") + "))");
	     
	      }
	   
	 }
	  
	}
	
	

	
	/*a horizontal cluster makes black cells*/
	for(var i in clusterH)
	{
	  for(var t in clusterH[i])
	   {
	    for (var j = getPosMinClusterH(i, t); j<= getPosMaxClusterH(i, t); j++)
	    {

	      var j = parseInt(j);
	      var t = parseInt(t);
	      var posmax = (j+clusterH[i][t]-1);
	      
	      formulas.push("(" + xitj(i, t, j) + " imply (bigand j2 (" + j + " .. " + posmax + ") " + peint(i, "j2") + "))");
	     
	   }
	   
	 }
	}
	
	
	/*a vertical cluster makes black cells*/
	for(var j in clusterV)
	{
	   for(var t in clusterV[j])
	   {
	    for (var i = getPosMinClusterV(j, t); i<= getPosMaxClusterV(j, t); i++)
	    {

	      var i = parseInt(i);
	      var t = parseInt(t);
	      var posmax = (i+clusterV[j][t]-1);
	      
	      formulas.push("(" + yjti(j, t, i) + " imply (bigand i2 (" + i + " .. " + posmax + ") " + peint("i2", j) + "))");
	     
	   }
	   
	 }
	}
	
	
	
	/*a black cell belongs to a horizontal cluster and a vertical cluster*/
	for(var i in clusterV)
	{
	    for(var j in clusterH)
	    {
		formulas.push("(" + peint(i, j) + " imply " + disjonctionCluster(j, clusterH[i], nbcolonnes, 
		                          function(j2, t) {return xitj(i, t, j2);},
					  function(t) {return getPosMinClusterH(i, t);},
					  function(t) {return getPosMaxClusterH(i, t);}					 
										) + ")");
	        formulas.push("(" + peint(i, j) + " imply " + disjonctionCluster(i, clusterV[j], nbcolonnes, 
		         function(i2, t) {return yjti(j, t, i2);},
			 function(t) {return getPosMinClusterV(j, t);},
			 function(t) {return getPosMaxClusterV(j, t);}	
								) + ")");
	      
	      
	    }
	  
	  
	  
	}
	
	
	
	
	
	
	
	
	
	
// 	var formula = "((not bottom) and ";
// 	
// 	
// 	
// 	for(var i in formulas)
// 	{
// 	    formula += formulas[i];
// 	    if(i < formulas.length - 1)
// 	    {
// 		formula += " and \n";
// 	    }
// 	  
// 	}
// 
// 	
// 	formula += ")";
// 	return formula;


	var formula = "(not bottom)\n";

	for(var i in formulas)
	{
	    formula += formulas[i];
	    if(i < formulas.length - 1)
	    {
		formula += " \n";
	    }
	  
	}
	return formula;

}




function picross_to_sat(instance)
{
    var obj = eval(instance);

    var clusterH = obj.clusterH;
    var clusterV = obj.clusterV;
    
    return picrossToSAT(clusterH, clusterV);
    
}