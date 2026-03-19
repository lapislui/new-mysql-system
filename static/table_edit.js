document.addEventListener("dblclick", function(e){

if(e.target.tagName==="TD"){

let td=e.target
let oldValue=td.innerText

let input=document.createElement("input")
input.value=oldValue

td.innerHTML=""
td.appendChild(input)

input.focus()

input.onblur=function(){

let newValue=this.value
let column=td.dataset.column
let id=td.parentElement.dataset.id
let table=td.closest("table").dataset.table

fetch("/update_cell",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
table:table,
column:column,
value:newValue,
id:id
})
})

td.innerText=newValue

}

}

})