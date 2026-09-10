const fs = require("fs");
const readline = require("readline");
const chalk = require("chalk");

// ========================================
// IMPORTING MODULES
// ========================================

const facultyManagement = require("./modules/faculty");

const {
  publicationManagement,
  showPublications,
} = require("./modules/publications");

const searchFilterMenu =
  require("./modules/search");

const summaryMenu =
  require("./modules/summary");

const exportMenu =
  require("./modules/export");

const importMenu =
  require("./modules/import");

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

const faculty =
  JSON.parse(facultyData);

const publications =
  JSON.parse(publicationData);

// ========================================
// CREATE TERMINAL INTERFACE
// ========================================

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// ========================================
// PREVENT CTRL + C FROM EXITING
// ========================================

rl.on("SIGINT", () => {
  console.log(
    chalk.yellow(
      "\nCtrl+C is disabled. Please select 7. Exit from the menu."
    )
  );
});

// ========================================
// HELPER FUNCTION FOR USER INPUT
// ========================================

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(
      question,
      (answer) => {
        resolve(answer.trim());
      }
    );
  });
}

// ========================================
// PRESS ENTER TO CONTINUE
// ========================================

async function pressEnterToContinue() {
  await askQuestion(
    "\nPress Enter to continue..."
  );
}

// ========================================
// SAVING DATA
// ========================================

function saveFacultyData() {
  fs.writeFileSync(
    "faculty.json",
    JSON.stringify(
      faculty,
      null,
      2
    )
  );
}

function savePublicationData() {
  fs.writeFileSync(
    "publications.json",
    JSON.stringify(
      publications,
      null,
      2
    )
  );
}

// ========================================
// MAIN MENU
// ========================================

async function mainMenu() {
  while (true) {

    console.log(
      chalk.cyan(
        "\n========================================"
      )
    );

    console.log(
      chalk.bold.cyan(
        "   Publications Summary Generator"
      )
    );

    console.log(
      chalk.cyan(
        "========================================"
      )
    );

    console.log(
      chalk.green("1. Faculty Management")
    );

    console.log(
      chalk.green("2. Publication Management")
    );

    console.log(
      chalk.green("3. Search / Filter")
    );

    console.log(
      chalk.green("4. Publication Summary")
    );

    console.log(
      chalk.green("5. Export")
    );

    console.log(
      chalk.green("6. Import")
    );

    console.log(
      chalk.red("7. Exit")
    );

    console.log(
      chalk.cyan(
        "========================================"
      )
    );

    const choice =
      await askQuestion(
        chalk.yellow("Enter your choice: ")
      );

    switch (choice) {

      // ========================================
      // FACULTY MANAGEMENT
      // ========================================

      case "1":
        await facultyManagement({
          faculty,
          askQuestion,
          pressEnterToContinue,
          saveFacultyData,
        });
        break;

      // ========================================
      // PUBLICATION MANAGEMENT
      // ========================================

      case "2":
        await publicationManagement({
          publications,
          faculty,
          askQuestion,
          pressEnterToContinue,
          savePublicationData,
        });
        break;

      // ========================================
      // SEARCH / FILTER
      // ========================================

      case "3":
        await searchFilterMenu({
          faculty,
          publications,
          askQuestion,
          pressEnterToContinue,
          showPublications,
        });
        break;

      // ========================================
      // PUBLICATION SUMMARY
      // ========================================

      case "4":
        await summaryMenu({
          faculty,
          publications,
          askQuestion,
          pressEnterToContinue,
        });
        break;

      // ========================================
      // EXPORT
      // ========================================

      case "5":
        await exportMenu({
          faculty,
          publications,
          askQuestion,
          pressEnterToContinue,
        });
        break;

      // ========================================
      // IMPORT
      // ========================================

      case "6":
        await importMenu({
          faculty,
          publications,
          askQuestion,
          pressEnterToContinue,
          saveFacultyData,
          savePublicationData,
        });
        break;

      // ========================================
      // EXIT
      // ========================================

      case "7":
        console.log(
          chalk.green(
            "\nThank you for using Publications Summary Generator."
          )
        );

        rl.close();

        return;

      // ========================================
      // INVALID CHOICE
      // ========================================

      default:
        console.log(
          chalk.red(
            "\nInvalid choice. Please try again."
          )
        );
    }
  }
}

// ========================================
// START APPLICATION
// ========================================

mainMenu();