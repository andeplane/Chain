#!/bin/bash
cd www
../../lime/bin/lime.py build chemistry -o compiled/chemistry.js
cd ..
phonegap run android
