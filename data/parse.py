#!/usr/bin/env python
# coding: utf-8
import csv
import json

def load_csv(filename):
    f = open(filename)
    csv_data = [row for row in csv.reader(f)]
    return csv_data

def load_json(filename):
    f = open(filename)
    json_data = json.loads(f.read())
    return json_data

def csv2dict(csv_data):
    labels = csv_data[0]

    data = []
    for row in csv_data[1:]:
        d = dict(zip(labels, row))
        data.append(d);

    return data

def output_as_json(filename, dict_data):
    json_data = json.dumps(data, ensure_ascii=False, indent=2)
    f = open(filename, 'w')
    f.write(json_data)


if __name__ == '__main__':
    filename = "mapnavoskdat_shisetsuall.csv"
    csv_data = load_csv(filename);
    data = csv2dict(csv_data)
    output_as_json("mapnavoskdat_shisetsuall.json", data)


    filename = "mapnavoskdat_icon.csv"
    csv_data = load_csv(filename);
    data = csv2dict(csv_data)
    output_as_json("mapnavoskdat_icon.json", data)


