const fs = require('fs');

// Settings
const pathPrefix = "output/result/"

// Global varibles
const timer = {};

function startTimer(name) {
    timer[name] = new Date().getTime();
}

function stopTimer(name) {

    if (!timer[name]) {
        console.log("Sorry that timer has not been started yet.");
        return false;
    }

    let stopTime = new Date().getTime() - timer[name];
    delete timer[name];
    writeToFile(name, stopTime);

}

function writeToFile(name, time) {

    if (!fs.existsSync(`${pathPrefix}${name}.json`)) {
        fs.writeFileSync(`${pathPrefix}${name}.json`, JSON.stringify([]), (error) => {
            if (error) throw error;
            console.log("Output file did not exists, created.")
        })
    }

    const outputArray = JSON.parse(fs.readFileSync(`${pathPrefix}${name}.json`));
    outputArray.push(parseInt(time));
    console.log(time);
    fs.writeFileSync(`${pathPrefix}${name}.json`, JSON.stringify(outputArray, null, 2));

}

module.exports = {startTimer, stopTimer};