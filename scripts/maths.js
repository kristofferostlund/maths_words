function analyzeWords(words) {
  var arr = words.split(' ');
  var wordCount = getCount(arr);
  document.getElementById('textOuput').textContent = getTopTen(wordCount);
}

function getTopTen(wordList) {
  var arr = []
    , init = -1;
  if (wordList.length < 10) { init = 0; }
  else { init = wordList.length - 11; }

  j = 1;
  for (var i = init; i < wordList.length; i++) {
    var key = Object.keys(wordList[i])[0]
      , str = j + ". "
            + '[' + wordList[i][key] + '] '
            + key;
    j++;
    arr.push(str);
  }

  return arr.join('\n');
}

function getCount(words) {
  var counter = {};
  for (word of words) {
    if (word in counter) { counter[word]++; }
    else { counter[word] = 1; }
  }

  var str = ''
    , arr = [];

  for (var key in counter) {
    if (counter.hasOwnProperty(key)) {
      var obj = {};
      obj[key] = counter[key];
      arr.push(obj);
    }
  }

  arr.sort(-1);

  return arr;
}

function OnInput (event) {
    analyzeWords(event.target.value);
}
function OnPropChanged (event) {
    if (event.propertyName.toLowerCase () == "value") {
        analyzeWords(event.srcElement.value);
    }
}
