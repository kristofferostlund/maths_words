// ---- D3 stuff ----

var width = 420
  , height = 400;

var margin = { top: 20, right: 20, bottom: 20, left: 50 };

var svg = d3.select(".svg-container")
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
  .interpolate(interpolateLinear);

function interpolateLinear(points) {
  return points.join("L");
}

function getYMax(dataset) {
  if (dataset == null || dataset.length < 1) { return 0; }
  var max = -1;
  for (item of dataset) {
    if (item.y > max) { max = item.y; }
  }
  return max;
}

function getXMax(dataset) {
  if (dataset == null || dataset.length < 1) { return 0; }
  var max = -1;
  for (item of dataset) {
    if (item.x > max) { max = item.x; }
  }
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
  for (item of dataset) {
    arr.push({ 'x': Number(firstKeyOf(item)), 'y': Number(firstValueOf(item)) });
  }
  return arr;
}

// ---- Render stuff ----

function render(dataset){

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
  if (svg.selectAll(".y.axis")[0].length < 1 ) {
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
  } else {
    svg.selectAll(".y.axis").transition().duration(500).call(yAxis);
  }

  if (svg.selectAll(".x.axis")[0].length < 1 ) {
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height - margin.top - margin.bottom) + ")")
        .call(xAxis);
  } else {
    svg.selectAll(".x.axis").transition().duration(500).call(xAxis);
  }

  dataset = [ dataset ];

  // generate line paths
  var lines = svg.selectAll(".line").data(dataset).attr("class", "line");

  // transition from previous paths to new paths
  lines.transition().duration(500)
    .attr("d", line);

  // enter any new data
  lines.enter()
    .append("path")
    .attr("class", "line")
    .attr("d", line);

  // exit
  lines.exit()
    .remove();

  dataset = dataset[0];

  var circles = svg.selectAll('circle').data(dataset);

  circles.transition().duration(500)
      .attr('cx', function (d) { return xScale(d.x); })
      .attr('cy', function (d) { return yScale(d.y); });

  circles.enter().append('circle')
    .attr('r', 5)
    .attr('cx', function (d) { return xScale(d.x); })
    .attr('cy', function (d) { return yScale(d.y); });

  circles.exit()
    .remove();

}

// The "mean" is the "average" you're used to,
// where you add up all the numbers and then divide by the number of numbers.
// The "median" is the "middle" value in the list of numbers. To find the median,
// your numbers have to be listed in numerical order,
// so you may have to rewrite your list first.
// The "mode" is the value that occurs most often.
// If no number is repeated, then there is no mode for the list.

/*
** Text from 50 Shades of Grey, page 195.
*/
var mainText = "“Anastasia,” he warns, and I want to roll my eyes but quickly stop myself.  I stand facing the bed.  Sitting beside me, he gently pulls my sweatpants down again.  Up and down like whores’ drawers my subconscious remarks bitterly.  In my head, I tell her where to go.  Christian squirts baby oil into his hand and then rubs my behind with careful tenderness – from makeup remover to smoothing balm for a spanked ass, who would have thought it was such a versatile liquid. “I like my hands on you,” he murmurs, and I have to agree, me too. "

document.getElementById('textInput').value = mainText;
analyzeWords(mainText);

var wordList = []
  , frequencyTable = []
  , modeWordLength = -1
  , medianWordLength = -1
  , meanWordLength = -1;

  function OnInput (event) {
      analyzeWords(event.target.value);
  }
  function OnPropChanged (event) {
      if (event.propertyName.toLowerCase () == "value") {
          analyzeWords(event.srcElement.value);
      }
  }

function analyzeWords(str) {
  wordList = createWordList(str);

  // Question 1(a)
  frequencyTable = createFrequencyTable(wordList);
  drawFrequencyTable(document.getElementById('frequencyTable'), frequencyTable);

  // Question 1(b)
  meanWordLength = getMean(wordList);
  document.getElementById('mean').textContent = meanWordLength;

  medianWordLength = getMedian(wordList);
  document.getElementById('median').textContent = medianWordLength;

  modeWordLength = getMode(frequencyTable);
  document.getElementById('mode').textContent = modeWordLength;


  render(frequencyTable);
}

function createWordList(words) {
  words = words.replace(/[^a-zA-Z0-9 ]/g, " ");

  return words.match(/\S+/g);
}

function createFrequencyTable(wordList) {
  var obj = {}
    , arr = [];

  if (wordList == null || wordList == undefined) { return []; }

  for (word of wordList) {
    if (word.length in obj) { obj[word.length]++; }
    else { obj[word.length] = 1; }
  }

  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      var o = {};
      o[key] = obj[key];
      arr.push(o);
    }
  }

  arr.sort(sortObject);
  arr.reverse();

  return arr;
}

function drawFrequencyTable(tbody, tableData) {

  while (tbody.hasChildNodes()) {
      tbody.removeChild(tbody.lastChild);
  }

  for (row of tableData) {
    var tr = tbody.insertRow()
      , td1 = tr.insertCell()
      , td2 = tr.insertCell();

    td1.appendChild(document.createTextNode(firstKeyOf(row)));
    td2.appendChild(document.createTextNode(firstValueOf(row)));

    tbody.appendChild(tr);
  }

  return tbody;
}

function getMean(wordList) {
  var sum = 0;
  if (wordList == null || wordList.length < 1)  { return -1; }
  for (word of wordList) { sum += word.length; }
  return roundD(sum / wordList.length, 3);
}

function getMedian(wordList) {
  if (wordList == null ||  wordList.length < 1) { return -1; }
  if (wordList.length == 1) { return wordList[0].length; }

  var arr = [];
  for (word of wordList) { arr.push(word.length); }
  arr.sort(sortNumber);

  var index = Math.round((arr.length - 1)/2);
  if (arr.length % 1 == 1) { return arr[index] }
  else { return (arr[index] + arr[index - 1]) / 2; }
}

function getMode(frequencyTable) {
  if (frequencyTable == null || frequencyTable.length < 1) { return -1; }
  return firstKeyOf(frequencyTable[0]);
}

// ---- Helper methods ----

function sortObject(a,b) {
  if (firstValueOf(a) < firstValueOf(b)) { return -1; }
  if (firstValueOf(a) > firstValueOf(b)) { return 1; }
  return 0;
}

function sortNumber(a,b) {
  return a - b;
}

function firstValueOf(obj) {
  for (key in obj) {
    return obj[key];
  }
}

function firstKeyOf(obj) {
  for (key in obj) {
    return key;
  }
}

function roundD(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}
