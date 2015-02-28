#!/bin/bash
# Run this after 

cd ..

lime/bin/lime.py build chemistry -o chemistry/compiled/chemistry.js -p chemistry.start

cd chemistry

MANIFEST_FILE="compiled/chemistry.manifest"

echo "CACHE MANIFEST

# If you use more files you need to manually list them here.
# Don't remove next line
# Updated on: 2013-09-19 15:00:22

chemistry.js
assets/startup.jpg
assets/startup_ipad.jpg
assets/icon.png" > $MANIFEST_FILE

find ./images -name *.png >> $MANIFEST_FILE
find ./design -name *.png >> $MANIFEST_FILE

echo "
NETWORK:
*" >> $MANIFEST_FILE

sed -i.bak s/\\.\\///g $MANIFEST_FILE
