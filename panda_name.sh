#!/usr/bin/env bash

files_with_pandaname=("microservice-app/html/index.js" "microservice-app/widget_1/public/index.html" "microservice-app/widget_2/public/index.html" "microservice-app/widget_3/public/index.html" "widget/public/index.html")

for file in "${files_with_pandaname[@]}"; do 
  sed -i s:INSERT_PANDA_NAME:$panda_name:g ~/workdir/NGINX-Workshop/$file; 
done;