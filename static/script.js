document.addEventListener("DOMContentLoaded", function () {

    /* -------------------------------
       Highlight active sidebar link
    --------------------------------*/

    const links = document.querySelectorAll(".sidebar a");
    const current = window.location.pathname;

    links.forEach(link => {

        if (link.getAttribute("href") === current) {
            link.style.background = "#2563eb";
        }

    });


    /* -------------------------------
       Confirm SQL execution
    --------------------------------*/

    const sqlForm = document.querySelector("form");

    if (sqlForm) {

        sqlForm.addEventListener("submit", function (e) {

            const query = document.querySelector("textarea").value
                .toLowerCase();

            if (
                query.includes("delete") ||
                query.includes("drop") ||
                query.includes("truncate")
            ) {

                const ok = confirm(
                    "⚠ Dangerous query detected.\n\nAre you sure?"
                );

                if (!ok) {
                    e.preventDefault();
                }

            }

        });

    }


    /* -------------------------------
       Table column sorting
    --------------------------------*/

    const tables = document.querySelectorAll("table");

    tables.forEach(table => {

        const headers = table.querySelectorAll("th");

        headers.forEach((header, index) => {

            header.style.cursor = "pointer";

            header.addEventListener("click", () => {

                const rows = Array.from(
                    table.querySelectorAll("tr:nth-child(n+2)")
                );

                rows.sort((a, b) => {

                    const A = a.children[index].innerText;
                    const B = b.children[index].innerText;

                    return A.localeCompare(B, undefined, {numeric:true});
                });

                rows.forEach(r => table.appendChild(r));

            });

        });

    });

});

function toggle(name){

let data = document.getElementById("data_"+name)
let structure = document.getElementById("structure_"+name)

data.classList.toggle("hidden")
structure.classList.toggle("hidden")

}