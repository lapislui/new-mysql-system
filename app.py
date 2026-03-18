from flask import Flask
from routes import routes
from db import get_db

app = Flask(__name__)

app.register_blueprint(routes)


@app.context_processor
def inject_tables():

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SHOW TABLES")
    tables = [t[0] for t in cursor.fetchall()]

    cursor.close()
    conn.close()

    return dict(tables=tables)


if __name__ == "__main__":
    app.run(debug=True, port=3000)