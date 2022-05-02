const fs = require('fs');
const readline = require('readline');

async function extractData() {
    // Settings
    const dataStartRow = 805;
    const startIndex = 0;
    const numOfObject = 50000000;
    const objectPerFile = 500000;

    const fileStream = fs.createReadStream('rows.json');
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let startTime = new Date().getTime();
    let currentRow = 0;
    let iteration = 0;
    let fileData = [];

    for await (const line of rl) {
        //Check if the row number is higher than 805. The data starts at 805 in the original json file.
        if (currentRow > dataStartRow + startIndex) {
            // Remove the first two character of the row.
            let jsonArray = JSON.parse(line.substr(2));

            fileData.push({
                sid: jsonArray[0],
                _id: jsonArray[1],
                created_at: jsonArray[3],
                updated_at: jsonArray[5],
                cdc_case_earliest_dt: jsonArray[8],
                cdc_report_date: jsonArray[9],
                pos_spec_dt: jsonArray[10],
                onset_dt: jsonArray[11],
                current_status: jsonArray[12],
                sex: jsonArray[13],
                age_group: jsonArray[14],
                race_ethnicity_combined: jsonArray[15],
                hosp_yn: jsonArray[16],
                icu_yn: jsonArray[17],
                death_yn: jsonArray[18],
                medcond_yn: jsonArray[19]
            });
            iteration = iteration + 1;
            if (fileData.length === objectPerFile) {
                fs.writeFileSync(`output/data${iteration/objectPerFile}.json`, JSON.stringify(fileData, null, 2));
                fileData = [];
            }
            console.log(`${iteration} / ${numOfObject}`)
        }
        currentRow = currentRow + 1;
        if (iteration === numOfObject) {
            console.log(`Parsing complete! Execute time: ${new Date().getTime() - startTime}ms`)
            return 0;
        }
    }
}

extractData();