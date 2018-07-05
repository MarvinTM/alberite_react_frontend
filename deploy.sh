npm run build
zip -r build.zip build
scp build.zip ubuntu@villacautela.com:/tmp/
rm build.zip

