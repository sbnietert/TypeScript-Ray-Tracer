cd typescript
tsc @appFiles.txt --out ../javascript/app.js --target es5
tsc @workerFiles.txt --out ../javascript/worker.js --target es5