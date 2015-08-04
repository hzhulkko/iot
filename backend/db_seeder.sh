#!/bin/bash

for i in {1..10}
do
	curl --data "water_level=`jot -r 1 70 100`&light=`jot -r 1 300 3000`&temperature=`jot -r 1 10 30`&main_unit_id=`jot -r 1 1 5`&humidity=`jot -r 1 30 40`&height=`jot -r 1 5 15`" http://localhost:5000/measurement/
done
