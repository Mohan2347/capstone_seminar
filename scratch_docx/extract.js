const mammoth = require("mammoth");
const fs = require("fs");
const path = require("path");

async function extractText(filePath, outputName) {
    try {
        const result = await mammoth.extractRawText({path: filePath});
        fs.writeFileSync(path.join(__dirname, outputName), result.value);
        console.log(`Successfully extracted ${outputName}`);
    } catch (err) {
        console.error(`Error extracting ${filePath}:`, err);
    }
}

async function main() {
    await extractText("C:\\Users\\HP\\Desktop\\Capstone_ResearchPaper.docx", "my_research.txt");
    await extractText("C:\\Users\\HP\\Desktop\\capstonepatent.docx", "my_patent.txt");
    await extractText("C:\\Users\\HP\\Desktop\\capstone report.docx", "my_report.txt");
    await extractText("C:\\Users\\HP\\Downloads\\ganesh_report.docx", "friend_report.txt");
}

main();
