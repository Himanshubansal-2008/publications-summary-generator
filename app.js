const fs = require("fs");
const readline = require("readline");

// ========================================
// IMPORTING MODULES
// ========================================

const facultyManagement = require("./modules/faculty");

const {
  publicationManagement,
  showPublications,
} = require("./modules/publications");

const searchFilterMenu = require("./modules/search");

const summaryMenu = require("./modules/summary");

const exportMenu = require("./modules/export");

// ========================================
// READ JSON FILES
// ========================================

const facultyData = fs.readFileSync(
  "faculty.json",
  "utf-8"
);

const publicationData = fs.readFileSync(
  "publications.json",
  "utf-8"
);

// Convert JSON text into JavaScript arrays

const faculty = JSON.parse(facultyData);
const publications = JSON.parse(publicationData);

// ========================================
// CREATE TERMINAL INTERFACE
// ========================================

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// ========================================
// HELPER FUNCTION FOR USER INPUT
// ========================================

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

// ========================================
// PRESS ENTER TO CONTINUE
// ========================================

async function pressEnterToContinue() {
  await askQuestion("\nPress Enter to continue...");
}

// ========================================
// SAVING DATA
// ========================================

function saveFacultyData() {
  fs.writeFileSync(
    "faculty.json",
    JSON.stringify(faculty, null, 2)
  );
}

function savePublicationData() {
  fs.writeFileSync(
    "publications.json",
    JSON.stringify(publications, null, 2)
  );
}

// ========================================
// MAIN MENU
// ========================================

async function mainMenu() {
  while (true) {
    console.log("\n========================================");
    console.log("   Publications Summary Generator");
    console.log("========================================");
    console.log("1. Faculty Management");
    console.log("2. Publication Management");
    console.log("3. Search / Filter");
    console.log("4. Publication Summary");
    console.log("5. Export");
    console.log("6. Exit");
    console.log("========================================");

    const choice = await askQuestion(
      "Enter your choice: "
    );

    switch (choice) {

      // FACULTY MANAGEMENT

      case "1":
        await facultyManagement({
          faculty,
          askQuestion,
          pressEnterToContinue,
          saveFacultyData,
        });
        break;

      // PUBLICATION MANAGEMENT

      case "2":
        await publicationManagement({
          publications,
          faculty,
          askQuestion,
          pressEnterToContinue,
          savePublicationData,
        });
        break;

      // SEARCH / FILTER

      case "3":
        await searchFilterMenu({
          faculty,
          publications,
          askQuestion,
          pressEnterToContinue,
          showPublications,
        });
        break;

      // PUBLICATION SUMMARY

      case "4":
        await summaryMenu({
          faculty,
          publications,
          askQuestion,
          pressEnterToContinue,
        });
        break;

      // EXPORT

      case "5":
        await exportMenu({
          faculty,
          publications,
          askQuestion,
          pressEnterToContinue,
        });
        break;

      // EXIT

      case "6":
        console.log(
          "\nThank you for using Publications Summary Generator."
        );

        rl.close();

        return;

      default:
        console.log(
          "\nInvalid choice. Please try again."
        );
    }
  }
}

// ========================================
// START APPLICATION
// ========================================

mainMenu();