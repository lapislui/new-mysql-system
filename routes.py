from flask import Blueprint, render_template, request, Response
from db import get_db
from utils import export_csv

routes = Blueprint("routes", __name__)


@routes.route("/")
def dashboard():

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SHOW TABLES")
    tables = [t[0] for t in cursor.fetchall()]

    cursor.close()
    conn.close()

    return render_template("dashboard.html", tables=tables)


@routes.route("/table/<name>")
def table_view(name):

    page = int(request.args.get("page", 1))
    limit = 50
    offset = (page-1)*limit

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(f"SELECT * FROM {name} LIMIT {limit} OFFSET {offset}")
    rows = cursor.fetchall()
    columns = [d[0] for d in cursor.description]

    cursor.close()
    conn.close()

    return render_template(
        "table_view.html",
        table=name,
        rows=rows,
        columns=columns,
        page=page
    )


@routes.route("/structure/<name>")
def structure(name):

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(f"DESC {name}")
    rows = cursor.fetchall()
    columns = [d[0] for d in cursor.description]

    cursor.close()
    conn.close()

    return render_template(
        "structure_view.html",
        table=name,
        rows=rows,
        columns=columns
    )


@routes.route("/sql", methods=["GET","POST"])
def sql_console():

    result = None
    columns = None

    if request.method == "POST":

        query = request.form["query"]

        conn = get_db()
        cursor = conn.cursor()

        cursor.execute(query)

        try:
            result = cursor.fetchall()
            columns = [d[0] for d in cursor.description]
        except:
            conn.commit()

        cursor.close()
        conn.close()

    return render_template(
        "sql_console.html",
        result=result,
        columns=columns
    )


@routes.route("/export/<name>")
def export(name):

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(f"SELECT * FROM {name}")
    rows = cursor.fetchall()
    columns = [d[0] for d in cursor.description]

    cursor.close()
    conn.close()

    csv_data = export_csv(columns, rows)

    return Response(
        csv_data,
        mimetype="text/csv",
        headers={"Content-disposition":f"attachment; filename={name}.csv"}
    )
    
@routes.route("/tables")
def tables_overview():

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT 
        table_name,
        table_rows,
        ROUND((data_length + index_length)/1024/1024,2) AS size_mb
        FROM information_schema.tables
        WHERE table_schema = DATABASE()
    """)

    tables = cursor.fetchall()

    cursor.close()
    conn.close()

    return render_template("tables_overview.html", tables=tables)

@routes.route("/table_data/<name>")
def table_data(name):

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(f"SELECT * FROM {name} LIMIT 50")
    rows = cursor.fetchall()
    columns = [d[0] for d in cursor.description]

    cursor.execute(f"DESC {name}")
    structure = cursor.fetchall()
    structure_columns = [d[0] for d in cursor.description]

    cursor.close()
    conn.close()

    return {
        "columns": columns,
        "rows": rows,
        "structure": structure,
        "structure_columns": structure_columns
    }
    
