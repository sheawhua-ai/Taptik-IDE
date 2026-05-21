import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Find ALL occurrences
let pIndex = content.indexOf('PIPELINE (矩阵资产管道');
console.log("First Pipeline at:", pIndex);
if (pIndex !== -1) {
    let secondPIndex = content.indexOf('PIPELINE (矩阵资产管道', pIndex + 10);
    console.log("Second Pipeline at:", secondPIndex);
    if(secondPIndex !== -1) {
        let firstDataIndex = content.indexOf('DATA (数据中心)', secondPIndex);
        console.log("First Data at:", firstDataIndex);
        
        let before = content.substring(0, secondPIndex);
        // let's cut right before the comment of second pipeline
        let cutStart = content.lastIndexOf('{/*', secondPIndex);
        let beforeClean = content.substring(0, cutStart);
        
        let targetDataStart = content.lastIndexOf('{/*', firstDataIndex);
        let after = content.substring(targetDataStart);
        
        let newContent = beforeClean + '\n        ' + after;
        fs.writeFileSync('src/App.tsx', newContent);
        console.log("Fixed duplication");
    }
}
