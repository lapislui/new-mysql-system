from flask import Blueprint, request, jsonify
from db import get_db

crud = Blueprint("crud", __name__)

# UPDATE CELL
@crud.route("/update_cell", methods=["POST"])
def update_cell():

    table = request.json["table"]
    column = request.json["column"]
    value = request.json["value"]
    row_id = request.json["id"]

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        f"UPDATE {table} SET {column}=%s WHERE id=%s",
        (value, row_id)
    )

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"status":"ok"})


# DELETE ROW
@crud.route("/delete_row", methods=["POST"])
def delete_row():

    table = request.json["table"]
    row_id = request.json["id"]

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(f"DELETE FROM {table} WHERE id=%s", (row_id,))
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"status":"deleted"})


# INSERT ROW
@crud.route("/insert_row", methods=["POST"])
def insert_row():

    table = request.json["table"]
    data = request.json["data"]

    columns = ",".join(data.keys())
    values = list(data.values())
    placeholders = ",".join(["%s"]*len(values))

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        f"INSERT INTO {table} ({columns}) VALUES ({placeholders})",
        values
    )

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"status":"inserted"})