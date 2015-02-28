#!/bin/bash

echo "" > image-preloader-list.js
for a in $(find ./images/design -name *.png); do
    echo "this.loader.addImage(\"$a\", \"$a\");" >> image-preloader-list.js
done
