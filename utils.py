import csv
from io import StringIO

def export_csv(columns, rows):

    output = StringIO()
    writer = csv.writer(output)

    writer.writerow(columns)

    for r in rows:
        writer.writerow(r)

    return output.getvalue()