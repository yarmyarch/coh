#!/bin/sh

echo "build begin"

echo "loading jsList..."

echo "compiling js files..."

sfile = "jsList.json"
tfile = "project.json"
mfile = "asset/coh.js"

RESFILES=`cat {sfile} | awk /\\\.js/`
echo > ${mfile}.merge
for data in ${RESFILES}
do 
    cat $data >> ${mfile}.merge
    echo -n >> ${mfile}.merge
done
echo "${mfile} merge finished!"
"$JAVA_HOME/bin/java" -jar ./tool/yuicompressor.jar "${mfile}.merge" --charset utf-8 -o "${mfile}.compress"
mv "${mfile}.compress" "${mfile}"

echo "${mfile} compress finished!"

echo "rewriting project.json..."

vNum = awk -F '=|"' '/jsLi(st)/ {print $5+1}' ${tfile}
sed "s/jsList.*?v=[0-9]\+/jsList\" : [${mfile}?v=${vNum}]/" ${tfile} > ${tfile}.tmp
mv "${tfile}.tmp" "${tfile}"

echo "build success!"