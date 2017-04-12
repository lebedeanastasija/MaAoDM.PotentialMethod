var trainingPoints = [{x: -6, y: 1 }, {x: 1, y: -1} , {x: -2, y: -4}, {x: 2, y: 2}],
	functions = [(x, y) => 0],
	separatingFunction = null;
	

var svgContainer,
	axisLength = 450,
	maxAxisValue = 10,
	startPoint = {
		x: 50,
		y: 500
	},
	scale = 1;

var colors = [
	"red", 
 	"brown",
 	"blue", 
 	"purple", 
 	"yellow", 
 	"orange", 
 	"gray", 
 	"green", 
 	"crimson", 
 	"lavender"	
 	];

function onLoad (){

	svgContainer = d3.select("div")
	.append("svg")                   
	.attr("width", 500)
	.attr("height", 550);

	scale = getScale();
	drawCoordinateAxes(axisLength, {x0: 70, y0: 500}, scale);		
	drawPoints(trainingPoints, colors[0], 4);

	var functionIsFound = false;
	var i = 0;
	var p = 1;

	while( (!functionIsFound) && (i < trainingPoints.length - 1)) {
		var potential = particularPointPotential(trainingPoints[i].x, trainingPoints[i].y);
		var total = totalPotential(potential, p);
		var resultInPoint = total(trainingPoints[i + 1].x, trainingPoints[i + 1].y);
		if(i < 2) {
			if(resultInPoint > 0) {
				console.log("Founded");
				functionIsFound = true;
				separatingFunction = total;
			} else {
				console.log("Correction");
				p = 1;
				functions.push(total);
			}
		} else {
			if(resultInPoint <= 0) {
				console.log("Founded");
				functionIsFound = true;
				separatingFunction = total;
			} else {
				console.log("Correction");
				p = -1;
				functions.push(total);
			}
		}	
	}

	console.log(separatingFunction);

	/*var arr = calcSeparatingFunctionResults( (x) => - 1/4);
	drawPoints(arr, colors[2], 1, true);*/

	var testPoints = generatePoints(1000, {min: -1*maxAxisValue, max: maxAxisValue});
	console.log(testPoints);
	testSeparatingFunction(testPoints);
	//drawSeparatingFunction(testPoints);
}

function testSeparatingFunction(points) {
	points.forEach(point => {
		if(separatingFunction(point.x, point.y) > 0) {
			drawPoint(point, colors[3], 2);
		} else {
			drawPoint(point, colors[4], 2);
		}
	});
}

/*drawSeparatingFunction(testPoints) {
	testPoints.fo
}*/

function generateNumbers(count, range) {
	var numbers = []
	for(var i = 0; i < count; i++) {		
		numbers.push(randomInRange(range.min, range.max));		
	}
	return numbers;
}

function generatePoints(count, range) {
	var points = []
	for(var i = 0; i < count; i++) {
		var x = randomInRange(range.min, range.max);
		var	y = randomInRange(range.min, range.max);	
		points.push({x: x, y: y});		
	}
	return points;
}

function getSeparatingFunction () {

}

function particularPointPotential(x0, y0) {
	return (x, y) => 1 + 4*x0*x + 4*y0*y + 16*x0*y0*x*y;
}

function totalPotential(particularPotential, p) {
	return (x, y) => {
		var prevTotal = functions[functions.length - 1];
		var prevTotalResult = prevTotal(x, y);
		return prevTotalResult + p*particularPotential(x, y);
	}
}



function calcSeparatingFunctionResults( sepFunc) {
	var results = [];
	var functionValue;
	for (var i = -axisLength; i < axisLength; i++){
		functionValue = sepFunc(i/scale);		
		results.push({x: i/scale, y: functionValue});		
	};

	return results;
}

function formatFloat(src,digits) {
	var powered, tmp, result	
	var powered = Math.pow(10,digits);	
	var tmp = src*powered;		
	tmp = Math.round(tmp);
	var result = tmp/powered;
	return result;
}


function pointSort(points) {
	return points.sort(pointCompare);
}

function pointCompare(a, b) {
	return a.y - b.y;
}

function getScale(){
	return axisLength/maxAxisValue;
}

function drawCoordinateAxes(axisLength, startPoint, yAxisScale) {
	var xScale = d3.scaleLinear().domain([-1*axisLength/scale, axisLength/scale]).range([0, axisLength]);
    var yScale = d3.scaleLinear().domain([-1*axisLength/scale, axisLength/scale]).range([axisLength, 0]);
 	var xAxis = d3.axisBottom().scale(xScale);
 	var yAxis = d3.axisLeft().scale(yScale);

	
	var yAxisGroup = svgContainer
	.append("g")								 
	.attr('class', 'axis')
	.attr('transform', 'translate(' + (startPoint.x0 + axisLength/2) + ',50)')
 	.call(yAxis);

	var xAxisGroup = svgContainer
	.append("g")
	.attr('class', 'axis')
	.attr('transform', 'translate(' + startPoint.x0 + ',' + (startPoint.y0 - axisLength/2) + ')')
	.call(xAxis);
}

function drawPoints(functionResults, color, width, connect) {
	if(!connect) {
		functionResults.forEach((point) =>  {	
			//if (startPoint.y - (point.y * scale) < startPoint.y){
				drawPoint(point, color, width);				
			//}			
		});
	} else {
		for(var i = 1; i < functionResults.length; i++) {
			drawPoint(functionResults[i], color, width);
			drawLine(functionResults[i-1], functionResults[i], color, width);
		}
	}		
}

function drawPoint(point, color, size) {
	svgContainer.append("circle")
	.attr("cx", point.x * (scale/2) + startPoint.x + axisLength/2 + 20)
	.attr("cy", startPoint.y - (point.y * (scale/2)) - axisLength/2 ) 
	.attr("r", size || 1)
	.style("fill", color);
}

function drawLine(point1, point2, color, width) {	
	svgContainer.append("line")
    .attr("x1", point1.x * (scale/2) + startPoint.x + axisLength/2 + 20)
    .attr("y1", startPoint.y - (point1.y * (scale/2)) - axisLength/2)
    .attr("x2", point2.x * (scale/2) + startPoint.x + axisLength/2 + 20)
    .attr("y2", startPoint.y - (point2.y * (scale/2)) - axisLength/2)
    .attr("stroke-width", width)
    .attr("stroke", color);
}

function randomInRange(min, max) {
  	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**********************************************/

function pointsAreEqual(point1, point2) {
	var result = true;
	for(var i = 0; i < 2; i++){
		if(point1[i] !== point2[i]) {
			result = false;
		}
	}

	return result;
}