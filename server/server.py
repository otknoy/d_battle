#!/usr/bin/env python
# coding: utf-8
from bottle import route, request, run
import json

osaka_data = json.load(open("data/data.json"))

def filter_by_region(lat1, lng1, lat2, lng2, data):
    filtered = []
    for d in data:
        if  lat1 < d[u'lat'] < lat2 and lng1 < d[u'lng'] < lng2:
            filtered.append(d)
    return filtered


@route('/get_place', method='GET')
def get_place():
    '''
    http://localhost:8888/get_place?lat1=34.6&lat2=34.65&lng1=135.4&lng2=135.45
    '''
    lat1 = request.query.lat1
    lng1 = request.query.lng1
    lat2 = request.query.lat2
    lng2 = request.query.lng2

    # filter by region
    data = osaka_data[:100]
    return json.dumps(data, ensure_ascii=False)


run(host='localhost', port=8888, debug=True, reloader=True)
    




