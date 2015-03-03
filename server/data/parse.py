#!/usr/bin/env python
# coding: utf-8
import csv
import json

def load_csv(filename):
    f = open(filename)
    csv_data = [row for row in csv.reader(f)]
    return csv_data

def csv2dict(csv_data):
    labels = csv_data[0]

    data = []
    for row in csv_data[1:]:
        d = dict(zip(labels, row))
        data.append(d);

    return data

def load_icon_number(filename):
    data = load_csv(filename)
    id2type = {}
    for k, v in data[1:]:
        id2type[k] = v
    return id2type

def load_osaka_data():
    data = csv2dict(load_csv("mapnavoskdat_shisetsuall.csv"))
    id2place = load_icon_number("mapnavoskdat_icon.csv")

    places = []
    for d in data:
        place = {
            'id': int(d['施設ID']),
            'lat': float(d['Y']),
            'lng': float(d['X']),
            'name': d['施設名'],
            'type': id2place[d['アイコン番号']]
        }
        places.append(place)
    return places


def output_as_json(filename, dict_data):
    json_data = json.dumps(data, ensure_ascii=False, indent=2)
    f = open(filename, 'w')
    f.write(json_data)


if __name__ == '__main__':
    data = load_osaka_data()
    # for d in data[:10]:
    #     for k, v in d.items():
    #         print k, v

    output_as_json("data.json", data)
