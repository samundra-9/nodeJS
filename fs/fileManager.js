// fileManager.js

// Import necessary modules
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// readline creates an interface to read user input from terminal
const rl = readline.createInterface({
  input: process.stdin,    // Read from keyboard
  output: process.stdout   // Write to screen
});

// Class = blueprint for creating objects with similar properties/methods
class FileManager {
  constructor() {
    // process.cwd() = Current Working Directory (where you ran node)
    this.currentDir = process.cwd();
    console.log('Starting in folder:', this.currentDir);
  }

  // Method to list all files in current directory
  listFiles() {
    console.log('\n=== Files in Current Folder ===');
    
    // fs.readdirSync() returns array of file/folder names
    const files = fs.readdirSync(this.currentDir);
    
    files.forEach(file => {
      // Get file stats (is it a file or folder?)
      const filePath = path.join(this.currentDir, file);
      const stats = fs.statSync(filePath);
      
      // Choose emoji based on file type
      const type = stats.isDirectory() ? '📁' : '📄';
      console.log(`${type} ${file}`);
    });
  }

  // Method to create a new file
  createFile(filename) {
    try {
      // path.join() creates full path to file
      const filePath = path.join(this.currentDir, filename);
      
      // fs.writeFileSync() creates file with empty content
      fs.writeFileSync(filePath, '');
      console.log(`✅ File "${filename}" created successfully!`);
    } catch (error) {
      console.log('❌ Error creating file:', error.message);
    }
  }

  // Method to delete a file
  deleteFile(filename) {
    try {
      const filePath = path.join(this.currentDir, filename);
      
      // Check if file exists first
      if (!fs.existsSync(filePath)) {
        console.log('❌ File not found!');
        return;
      }
      
      fs.unlinkSync(filePath); // unlink = delete file
      console.log(`✅ File "${filename}" deleted successfully!`);
    } catch (error) {
      console.log('❌ Error deleting file:', error.message);
    }
  }
}

// Create an instance of our FileManager class
const fileManager = new FileManager();

// Function to show menu options
function showMenu() {
  console.log('\n=== File Manager ===');
  console.log('1. List files in current folder');
  console.log('2. Create a new file');
  console.log('3. Delete a file');
  console.log('4. Exit');
}

// Main function that runs the application
function startApp() {
  showMenu();
  
  // rl.question() waits for user input
  // (choice) => { } = callback function that runs when user types something
  rl.question('Choose an option (1-4): ', (choice) => {
    
    // switch = cleaner way to handle multiple if/else conditions
    switch(choice) {
      case '1':
        fileManager.listFiles();
        startApp(); // Show menu again
        break;
        
      case '2':
        rl.question('Enter filename to create: ', (filename) => {
          fileManager.createFile(filename);
          startApp(); // Show menu again
        });
        break;
        
      case '3':
        rl.question('Enter filename to delete: ', (filename) => {
          fileManager.deleteFile(filename);
          startApp(); // Show menu again
        });
        break;
        
      case '4':
        console.log('👋 Goodbye!');
        rl.close(); // Close the readline interface
        break;
        
      default:
        console.log('❌ Invalid option! Please choose 1-4');
        startApp(); // Show menu again
    }
  });
}

// Start the application
console.log('🚀 Starting File Manager...');
startApp();