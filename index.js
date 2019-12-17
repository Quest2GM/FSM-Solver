/* This project was initiated on December 9, 2019. The purpose of this software is to solve Finite State Machines (FSMs) */

let stateTable = document.getElementById("stateTable");
let stateTableRC = 1;

function addRow() {
    let row = document.createElement("tr");
    let td1 = document.createElement("td");
    let td2 = document.createElement("td");
    let td3 = document.createElement("td");
    let td4 = document.createElement("td");
    let tb1 = document.createElement("input");
    let tb2 = document.createElement("input");
    let tb3 = document.createElement("input");
    let tb4 = document.createElement("input");

    tb1.setAttribute("type", "text");
    tb1.style.height = "15px";
    tb1.style.width = "90px";
    tb1.style.textAlign = "center";
    tb2.setAttribute("type", "text");
    tb2.style.height = "15px";
    tb2.style.width = "90px";
    tb2.style.textAlign = "center";
    tb3.setAttribute("type", "text");
    tb3.style.height = "15px";
    tb3.style.width = "90px";
    tb3.style.textAlign = "center";
    tb4.setAttribute("type", "text");
    tb4.style.height = "15px";
    tb4.style.width = "90px";
    tb4.style.textAlign = "center";

    td1.appendChild(tb1);
    td2.appendChild(tb2);
    td3.appendChild(tb3);
    td4.appendChild(tb4);
    row.appendChild(td1);
    row.appendChild(td2);
    row.appendChild(td3);
    row.appendChild(td4);
    stateTable.appendChild(row);

    stateTableRC++;

    return;
}

function delRow() {
    if (stateTableRC !== 1) {
        stateTable.removeChild(stateTable.lastChild);
        stateTableRC--;
    }
    return;
}

function extData() {
    for (let i = 2; i < stateTable.rows.length; i++) {
        for (let j = 0; j < 4; j++) {
            console.log(stateTable.rows[i].cells[j].children[0].value);
        }
    }
    return;
}