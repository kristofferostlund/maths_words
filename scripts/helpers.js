
function getSortedByWordLength(words) {
  var arr = [];
  
  words.forEach(function(word) { arr.push(word.length); }, this);
  
  arr.sort(sortNumber);

  return arr;
}

function sortByValue(a,b) {
  if (Number(firstValueOf(a)) < Number(firstValueOf(b))) { return -1; }
  if (Number(firstValueOf(a)) > Number(firstValueOf(b))) { return 1; }
  return 0;
}
function sortByKey(a,b) {
  if (Number(firstKeyOf(a)) < Number(firstKeyOf(b))) { return -1; }
  if (Number(firstKeyOf(a)) > Number(firstKeyOf(b))) { return 1; }
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
