const fs = require("fs");
const readline = require("readline");

// Read JSON files
const facultyData = fs.readFileSync("faculty.json", "utf-8");
const publicationData = fs.readFileSync("publications.json", "utf-8");

// Convert JSON text into JavaScript arrays
const faculty = JSON.parse(facultyData);
const publications = JSON.parse(publicationData);

// Create terminal input/output interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Display main menu
function showMenu() {
  console.log("\n========================================");
  console.log("   Publications Summary Generator");
  console.log("========================================");
  console.log("1. Show Faculty");
  console.log("2. Show Publications");
  console.log("3. Exit");
  console.log("========================================");

  rl.question("Enter your choice: ", handleChoice);
}

// Show faculty members
function showFaculty() {
  console.log("\n========================================");
  console.log("           Faculty Members");
  console.log("========================================");

  faculty.forEach((member, index) => {
    console.log(`${index + 1}. ${member.name}`);
    console.log(`   Department: ${member.department}`);
    console.log(`   Email: ${member.email}`);
    console.log("----------------------------------------");
  });
}

// Show publications
function showPublications() {
  console.log("\n========================================");
  console.log("              Publications");
  console.log("========================================");

  publications.forEach((publication, index) => {
    console.log(`${index + 1}. ${publication.title}`);
    console.log(`   Year: ${publication.year}`);
    console.log(`   Type: ${publication.type}`);
    console.log(`   Venue: ${publication.venue}`);
    console.log(`   DOI: ${publication.doi}`);
    console.log(`   Authors: ${publication.authors.join(", ")}`);
    console.log("----------------------------------------");
  });
}

// Wait for user to press Enter
function pressEnterToContinue() {
  rl.question("\nPress Enter to continue...", () => {
    showMenu();
  });
}

// Handle menu choice
function handleChoice(choice) {
  switch (choice.trim()) {
    case "1":
      showFaculty();
      pressEnterToContinue();
      break;

    case "2":
      showPublications();
      pressEnterToContinue();
      break;

    case "3":
      console.log("\nThank you for using Publications Summary Generator.");
      rl.close();
      break;

    default:
      console.log("\nInvalid choice. Please try again.");
      showMenu();
  }
}

// Start application
showMenu();