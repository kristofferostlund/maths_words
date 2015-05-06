/// <reference path="../typings/d3/d3.d.ts"/>
// ---- D3 stuff ----

var width = 420
  , height = 400;

var margin = { top: 20, right: 20, bottom: 20, left: 50 };

var svg = {};

svg[1] = d3.select(".svg-container-1")
  .append("svg")
  .attr("height", height)
  .attr("width", width)
      .append("g")
        .attr("transform","translate(" + margin.left + "," + margin.right + ")");

svg[2] = d3.select(".svg-container-2")
    .append("svg")
      .attr("height", height)
      .attr("width", width)
      .append("g")
        .attr("transform","translate(" + margin.left + "," + margin.right + ")");

var xScale = d3.scale.linear()
      .range([0, width - margin.left - margin.right]);

var yScale = d3.scale.linear()
      .range([height - margin.top - margin.bottom, 0]);

var line = d3.svg.line()
  .x(function (d) { return xScale(d.x); })
  .y(function (d) { return yScale(d.y); })
  .interpolate('linear');

function getYMax(dataset) {
  if (dataset == null || dataset.length < 1) { return 0; }
  var max = -1;
 
  dataset.forEach(function(item) {
    if (item.y > max) { max = item.y; }
  }, this);
  
  return max;
}

function getXMax(dataset) {
  if (dataset == null || dataset.length < 1) { return 0; }
  var max = -1;
  
  dataset.forEach(function(item) {
    if (item.x > max) { max = item.x; }
  }, this);
  
  return max;
}

function orderX(a,b) {
  if (a.x < b.x) { return -1; }
  if (a.x > b.x) { return 1; }
  return 0;
}

function getXYArray(dataset) {
  if (dataset == null || dataset.length < 1) { return []; }
  var arr = [];
  
  dataset.forEach(function(item) {
    arr.push({ 'x': Number(firstKeyOf(item)), 'y': Number(firstValueOf(item)) });
  }, this);
  
  return arr;
}

// ---- Render stuff ----

function render(dataset, num, quartiles){

  dataset = getXYArray(dataset);
  dataset.sort(orderX);

  var yMin = 0
    , yMax = getYMax(dataset)
    , xMin = 0
    , xMax = getXMax(dataset);

  // set domain for axes
  yScale.domain([yMin, yMax]);
  xScale.domain([xMin, xMax]);

  // create axis scales
  var yAxis = d3.svg.axis()
      .scale(yScale).orient('left');
  var xAxis = d3.svg.axis()
      .scale(xScale).orient('bottom');

  // if no axis exists, create them, otherwise update them
  if (svg[num].selectAll(".y.axis")[0].length < 1 ) {
    svg[num].append("g")
        .attr("class", "y axis")
        .call(yAxis);
  } else {
    svg[num].selectAll(".y.axis").transition().duration(500).call(yAxis);
  }

  if (svg[num].selectAll(".x.axis")[0].length < 1 ) {
    svg[num].append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height - margin.top - margin.bottom) + ")")
        .call(xAxis);
  } else {
    svg[num].selectAll(".x.axis").transition().duration(500).call(xAxis);
  }

  dataset = [ dataset ];

  var lines = svg[num].selectAll(".line").data(dataset).attr("class", "line");

  lines.transition().duration(500)
    .attr("d", line);

  lines.enter()
    .append("path")
    .attr("class", "line")
    .attr("d", line);

  lines.exit()
    .remove();
    
    
  if (quartiles != null || quartiles != undefined)
  {    
    var qLines = svg[num].selectAll(".qline").data(quartiles).attr("class", "qline");

    qLines.transition().duration(500)
      .attr("d", line);
  
    qLines.enter()
      .append("path")
      .attr("class", "qline")
      .attr("d", line);
  
    qLines.exit()
      .remove();
  }

  dataset = dataset[0];

  var circles = svg[num].selectAll('circle').data(dataset);

  circles.transition().duration(500)
      .attr('cx', function (d) { return xScale(d.x); })
      .attr('cy', function (d) { return yScale(d.y); });

  circles.enter().append('circle')
    .attr('r', 5)
    .attr('class', 'dot1')
    .attr('cx', function (d) { return xScale(d.x); })
    .attr('cy', function (d) { return yScale(d.y); });

  circles.exit()
    .remove();
}