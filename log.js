const fs = require('fs')
const { Console } = require('console');
function exportLog(path, logData) {
    fs.appendFile(path, logData, (err) => {
        if (err){
            console.log("The file has not been saved!");
        }
        });  
}

module.exports = {exportLog}