#!/usr/bin/env bash

if [[ $# -eq 0 ]] ; then
    echo 'ERROR: Specify your panda name and try again, eg. '
    echo "$(pwd)/panda_name.sh cool-panda"
    exit 0
fi

if [[ $1 != *panda ]] ; then
    echo "Check your panda name and try again"
    echo "It must end with panda eg. "
    echo "$(pwd)/panda_name.sh cool-panda"
    exit 0
fi

if [[ $1 != *-* ]] ; then
   echo "ERROR: Check your panda name and try again"
   echo "It must contain a dash eg. "
   echo "$(pwd)/panda_name.sh cool-panda"
   exit 0
fi

if [[ $1 =~ [[:upper:]] ]]; then
   echo "ERROR: Check your panda name and try again"
   echo "It must contain only lower-case letters eg. "
   echo "$(pwd)/panda_name.sh cool-panda"
   exit 0
fi

files_with_pandaname=("microservice-app/nginx.conf" "microservice-app/html/script.js" "widget/public/index.html")

# for file in "${files_with_pandaname[@]}"; do 
#   sed -i s:INSERT_PANDA_NAME:$1:g ~/workdir/NGINX-Workshop/$file; 
# done;

for file in "${files_with_pandaname[@]}"; do 
  cat ~/playground/NGINX-Workshop/templates/$file | sed s:INSERT_PANDA_NAME:$1:g > ~/playground/NGINX-Workshop/$file;
done;

echo "Added: $1"