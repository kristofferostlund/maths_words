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
var mainText = "“Anastasia,” he warns, and I want to roll my eyes but quickly stop myself.  I stand facing the bed.  Sitting beside me, he gently pulls my sweatpants down again.  Up and down like whores’ drawers my subconscious remarks bitterly.  In my head, I tell her where to go.  Christian squirts baby oil into his hand and then rubs my behind with careful tenderness – from makeup remover to smoothing balm for a spanked ass, who would have thought it was such a versatile liquid. “I like my hands on you,” he murmurs, and I have to agree, me too. ";

document.getElementById('textInput').value = mainText;
analyzeWords(mainText);

var wordList = []
  , frequencyTable = []
  , cumulativeFrequencyTable = []
  , modeWordLength = -1
  , medianWordLength = -1
  , meanWordLength = -1
  , thirdQuartile = []
  , secondQuartile = []
  , firstQuartile = [];

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

  // Question 1(d)
  cumulativeFrequencyTable = getCumulativeFrequencyTable(frequencyTable);
  drawCumulativeFrequencyTable(document.getElementById('cumulativeFrequencyTable'), frequencyTable, cumulativeFrequencyTable);

  // Question 1(e)
  firstQuartile = getFirstQuartile(wordList, cumulativeFrequencyTable);
  secondQuartile = getSecondQuartile(wordList, cumulativeFrequencyTable);
  thirdQuartile = getThirdQuartile(wordList, cumulativeFrequencyTable);
  
  var quartiles = [ firstQuartile, secondQuartile, thirdQuartile ];
  

  render(frequencyTable, 1);
  render(cumulativeFrequencyTable, 2, quartiles);

}

function createWordList(words) {
  words = words.replace(/['-]/g, "");
  words = words.replace(/[^a-öA-Ö0-9 ]/g, " ");

  return words.match(/\S+/g);
}

function createFrequencyTable(wordList) {
  var obj = {}
    , arr = [];

  if (wordList == null || wordList == undefined) { return []; }

  wordList.forEach(function(word) {
    if (word.length in obj) { obj[word.length]++; }
    else { obj[word.length] = 1; }
  }, this);
  
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      var o = {};
      o[key] = obj[key];
      arr.push(o);
    }
  }

  arr.sort(sortByValue);
  arr.reverse();

  return arr;
}

function getMean(wordList) {
  var sum = 0;
  if (wordList == null || wordList.length < 1)  { return -1; }
  wordList.forEach(function(word) { sum += word.length; }, this);
  return roundD(sum / wordList.length, 3);
}

function getMedian(wordList) {
  if (wordList == null ||  wordList.length < 1) { return -1; }
  if (wordList.length == 1) { return wordList[0].length; }

  var arr = getSortedByWordLength(wordList);

  var index = Math.round((arr.length - 1)/2);
  if (arr.length % 1 == 1) { return arr[index] }
  else { return (arr[index] + arr[index - 1]) / 2; }
}

function getMode(frequencyTable) {
  if (frequencyTable == null || frequencyTable.length < 1) { return -1; }
  return firstKeyOf(frequencyTable[0]);
}

function getCumulativeFrequencyTable(data) {
  data.sort(sortByKey);
  var arr = [];

  for (var i = 0; i < data.length; i++) {
    if (i == 0) { arr.push(data[i]); }
    else {
      var key = firstKeyOf(data[i])
        , value = firstValueOf(data[i]) + firstValueOf(arr[i - 1])
        , o = {};
        o[key] = value;
      arr.push(o);
    }
  }

  return arr;
}

function getThirdQuartile(words, cTable) {
  if (words == null || words.length < 1) { return []; }

  var arr = getQuartileCoordinates(cTable, words.length / 4 * 3);

  return arr;
}

function getSecondQuartile(words, cTable) {
  if (words == null || words.length < 1) { return []; }
  words = getSortedByWordLength(words);
  var arr = getQuartileCoordinates(cTable, words.length / 2);
  return arr;
}

function getFirstQuartile(words, cTable) {
  if (words == null || words.length < 1) { return []; }
  words = getSortedByWordLength(words);
  var arr = getQuartileCoordinates(cTable, words.length / 4);
  return arr;
}

function getQuartileCoordinates(cTable, y) {
  var arr = [];
  arr.push({ 'x': 0, 'y': y});

  var p1 = {}
    , p2 = {};

  for (var i = 0; i < cTable.length; i++) {
    if (i == 0) { continue; }
    
    if (firstValueOf(cTable[i - 1]) <= y && y <= firstValueOf(cTable[i])) {
      p1 = { 'x': firstKeyOf(cTable[i - 1]),
             'y': firstValueOf(cTable[i - 1])};
      p2 = { 'x': firstKeyOf(cTable[i]),
             'y': firstValueOf(cTable[i])};
      break;
    }
  }

  var k = (p2.y - p1.y) / (p2.x - p1.x);
  var m = p1.y - (k*p1.x);
  var x = (y - m) / k;

  arr.push({ 'x': x, 'y': y });
  arr.push({ 'x': x, 'y': 0 });

  return arr;
}
