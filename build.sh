#!/bin/bash

output=$1
if [[ "$output" == "" ]]; then
 output="$(dirname $0)/web"
else
 output=$(realpath $output)
fi

build() {
 local dist="$1"
 [ -d $dist ] || mkdir -p $dist
 echo "browserify $(pwd)/src/js/main.js"
 browserify -d -e src/js/main.js -t babelify -o "$dist/js/app.js" -v

 #echo "myth $(pwd)/app/src/css/app.css"
 #myth src/css/app.css "web/css/app.css"

 #echo "copy echo $(pwd)/web"
 #cp -urv app/web/* "app/data/"

}

build $output
