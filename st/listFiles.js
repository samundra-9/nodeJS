const fs = require("fs");
const path = require("path");

// Directory you want to scan (change if needed)
const directoryPath = path.join(__dirname);

// Output log file
const logFile = path.join(__dirname, "files.log");

// Function to log all files in a directory
function logFiles() {
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }

    // Join all filenames with newline
    const fileList = files.join("\n");

    // Write/overwrite the log file
    fs.writeFile(logFile, fileList, (err) => {
      if (err) {
        console.error("Error writing log file:", err);
      } else {
        console.log(`Logged ${files.length} files to ${logFile}`);
      }
    });
  });
}

// Run immediately
logFiles();
