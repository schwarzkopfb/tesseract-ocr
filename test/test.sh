# check against Node's major version
if [[ `node -v | cut -d. -f1 | cut -c 2-` -gt 11 ]] 
then
    # include .mjs files if ESM is supported
    glob='test/*.*js';
else
    glob='test/*.js';
fi

tap "$glob" --100 "$@";