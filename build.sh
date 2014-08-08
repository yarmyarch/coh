#!/bin/sh

echo "build begin"

echo "compiling js files..."

sfile="src/jsList.json"
tfile="project.json"
pfile="coh.js"
mfile="asset/coh.js"
mfileCmp="asset\/coh\.js"
vNum=`awk -F '=|"' '/jsList/ {print $5+1}' ${tfile}`

echo "making backup files for coh.js..."

cp ${mfile} "src/${pfile}.bak"

if 
    [ ! -n $vNum ]
then
    mv "/asset/${tfile}.build.bak" "${tfile}"
    vNum=`awk -F '=|"' '/jsList/ {print $5+1}' ${tfile}`
fi

RESFILES=`cat ${sfile} | awk -F '"' '/\.js/ {print $2}'`
echo > ${mfile}.merge
for data in ${RESFILES}
do 
    cat $data >> ${mfile}.merge
    echo -n >> ${mfile}.merge
done

mv "${mfile}.merge" ${mfile}

echo "${mfile} merge finished!"
"$JAVA_HOME/bin/java" -jar ./tools/yuicompressor.jar --type js --charset utf-8 -o "${mfile}.compress" "${mfile}"
mv "${mfile}.compress" "${mfile}"

echo "${mfile} compress finished!"

echo "making backup files for project.json..."

cp ${tfile} "src/${tfile}.build.bak"

echo "rewriting project.json..."

sed "s/jsList.*?v=[0-9]\+/jsList\" :[\"${mfileCmp}?v=${vNum}/" ${tfile} > ${tfile}.tmp
mv "${tfile}.tmp" "${tfile}"

echo "build success!"

# sed "s/jsList.*?v=[0-9]\+/jsList\" : [asset/coh.js?v=200]/" project.json > project.json.tmp