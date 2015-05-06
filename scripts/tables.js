function drawCumulativeFrequencyTable(tbody, tableData, cTableData) {

  while (tbody.hasChildNodes()) {
      tbody.removeChild(tbody.lastChild);
  }

  for (var i = 0; i < tableData.length; i++) {
    var tr = tbody.insertRow()
      , td1 = tr.insertCell()
      , td2 = tr.insertCell()
      , td3 = tr.insertCell();

    td1.appendChild(document.createTextNode(firstKeyOf(cTableData[i])));
    td2.appendChild(document.createTextNode(firstValueOf(tableData[i])));
    td3.appendChild(document.createTextNode(firstValueOf(cTableData[i])));

    tbody.appendChild(tr);
  }

  return tbody;
}

function drawFrequencyTable(tbody, tableData) {

  while (tbody.hasChildNodes()) {
      tbody.removeChild(tbody.lastChild);
  }
  
  tableData.forEach(function(row) {
    var tr = tbody.insertRow()
      , td1 = tr.insertCell()
      , td2 = tr.insertCell();

    td1.appendChild(document.createTextNode(firstKeyOf(row)));
    td2.appendChild(document.createTextNode(firstValueOf(row)));

    tbody.appendChild(tr);
  }, this);

  return tbody;
}
