// =============================
// LOAD TABLE DATA (LAZY)
// =============================

async function loadTable(name){

let container = document.getElementById("table_"+name)

if(!container.classList.contains("loaded")){

let res = await fetch("/table_data/"+name)

let data = await res.json()

renderTable(name,data)

container.classList.add("loaded")

}

container.classList.toggle("hidden")

}


// =============================
// RENDER TABLE
// =============================

function renderTable(name,data){

renderDataTable(name,data)

renderStructureTable(name,data)

}


// =============================
// DATA TABLE
// =============================

function renderDataTable(name,data){

let table = document.getElementById("data_table_"+name)

let html = "<thead><tr>"

data.columns.forEach(col=>{
html += "<th>"+col+"</th>"
})

html += "</tr></thead><tbody>"

data.rows.forEach(row=>{

html += "<tr>"

row.forEach(cell=>{
html += "<td>"+cell+"</td>"
})

html += "</tr>"

})

html += "</tbody>"

table.innerHTML = html

}


// =============================
// STRUCTURE TABLE
// =============================

function renderStructureTable(name,data){

let table = document.getElementById("structure_table_"+name)

let html = "<thead><tr>"

data.structure_columns.forEach(col=>{
html += "<th>"+col+"</th>"
})

html += "</tr></thead><tbody>"

data.structure.forEach(row=>{

html += "<tr>"

row.forEach(cell=>{
html += "<td>"+cell+"</td>"
})

html += "</tr>"

})

html += "</tbody>"

table.innerHTML = html

}


// =============================
// FLIP CARD
// =============================

function flipCard(name){

let card = document.getElementById("flip_"+name)

card.classList.toggle("flipped")

}


// =============================
// SEARCH TABLE
// =============================

function searchTable(input,name){

let filter = input.value.toLowerCase()

let rows = document.querySelectorAll(
"#data_table_"+name+" tbody tr"
)

rows.forEach(row=>{

let text = row.innerText.toLowerCase()

row.style.display =
text.includes(filter) ? "" : "none"

})

}


// =============================
// SORT TABLE
// =============================

function sortTable(tableId,columnIndex){

let table = document.getElementById(tableId)

let rows = Array.from(table.rows).slice(1)

let asc = table.classList.toggle("asc")

rows.sort((a,b)=>{

let A = a.cells[columnIndex].innerText
let B = b.cells[columnIndex].innerText

return asc
? A.localeCompare(B,undefined,{numeric:true})
: B.localeCompare(A,undefined,{numeric:true})

})

rows.forEach(r=>table.appendChild(r))

}


// =============================
// EXPORT CSV
// =============================

function exportCSV(tableId){

let table = document.getElementById(tableId)

let csv = []

for(let row of table.rows){

let cols = []

for(let cell of row.cells){
cols.push(cell.innerText)
}

csv.push(cols.join(","))

}

downloadFile(csv.join("\n"),"table.csv")

}


function downloadFile(content,fileName){

let blob = new Blob([content])

let a = document.createElement("a")

a.href = URL.createObjectURL(blob)

a.download = fileName

a.click()

}


// =============================
// SIMPLE SQL RUNNER
// =============================

async function runSQL(){

let query = document.getElementById("sql_query").value

let res = await fetch("/run_sql",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({query:query})

})

let data = await res.json()

console.log(data)

alert("Query executed")

}