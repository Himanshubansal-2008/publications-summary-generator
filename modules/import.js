const fs = require("fs");
const XLSX = require("xlsx");
const bibtexParse = require("bibtex-parse-js");
const chalk = require("chalk");

// ========================================
// IMPORT FACULTY FROM EXCEL
// ========================================

async function importFacultyFromExcel({
  faculty,
  askQuestion,
  saveFacultyData,
}) {
  console.log(
    chalk.cyan("\n========================================")
  );

  console.log(
    chalk.bold.cyan(
      "        Import Faculty from Excel"
    )
  );

  console.log(
    chalk.cyan("========================================")
  );

  console.log(
    chalk.yellow(
      "\nTip: Drag the Excel file into Terminal to get its path."
    )
  );

  const filePath = await askQuestion(
    chalk.yellow("Enter Excel file path: ")
  );

  // Check if file exists

  if (!fs.existsSync(filePath)) {
    console.log(
      chalk.red("\nFile not found.")
    );
    return;
  }

  try {
    // Read Excel file

    const workbook = XLSX.readFile(filePath);

    // Get first sheet

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert Excel sheet to JavaScript array

    const data = XLSX.utils.sheet_to_json(worksheet);

    if (data.length === 0) {
      console.log(
        chalk.yellow("\nExcel file is empty.")
      );
      return;
    }

    let importedCount = 0;

    data.forEach((row) => {
      // Expected column:
      // Name

      if (!row.Name) {
        return;
      }

      // Generate new faculty ID

      let newId = 1;

      if (faculty.length > 0) {
        newId =
          faculty[faculty.length - 1].id + 1;
      }

      const newFaculty = {
        id: newId,
        name: String(row.Name).trim(),
        department: row.Department
          ? String(row.Department).trim()
          : "",
        designation: row.Designation
          ? String(row.Designation).trim()
          : "",
        email: row.Email
          ? String(row.Email).trim()
          : "",
      };

      faculty.push(newFaculty);

      importedCount++;
    });

    // Save imported faculty

    saveFacultyData();

    console.log(
      chalk.green(
        `\n✓ ${importedCount} faculty member(s) imported successfully.`
      )
    );
  } catch (error) {
    console.log(
      chalk.red(
        "\nError while importing Excel file."
      )
    );

    console.log(error.message);
  }
}

// ========================================
// IMPORT PUBLICATIONS FROM BIBTEX
// ========================================

async function importBibTeX({
  faculty,
  publications,
  askQuestion,
  savePublicationData,
}) {
  console.log(
    chalk.cyan("\n========================================")
  );

  console.log(
    chalk.bold.cyan(
      "        Import Publications from BibTeX"
    )
  );

  console.log(
    chalk.cyan("========================================")
  );

  console.log(
    chalk.yellow(
      "\nTip: Drag the BibTeX file into Terminal to get its path."
    )
  );

  const filePath = await askQuestion(
    chalk.yellow("Enter BibTeX file path: ")
  );

  // Check if file exists

  if (!fs.existsSync(filePath)) {
    console.log(
      chalk.red("\nFile not found.")
    );
    return;
  }

  try {
    // Read BibTeX file

    const bibtexData = fs.readFileSync(
      filePath,
      "utf-8"
    );

    if (!bibtexData.trim()) {
      console.log(
        chalk.yellow("\nBibTeX file is empty.")
      );
      return;
    }

    // Parse BibTeX

    const entries = bibtexParse.toJSON(
      bibtexData
    );

    if (entries.length === 0) {
      console.log(
        chalk.yellow(
          "\nNo publications found in BibTeX file."
        )
      );

      return;
    }

    let importedCount = 0;

    entries.forEach((entry) => {
      const tags = entry.entryTags || {};

      // Get publication type

      let type = "Conference";

      if (
        entry.entryType &&
        entry.entryType.toLowerCase() === "article"
      ) {
        type = "Journal";
      }

      // Get publication title

      const title =
        tags.title || "Unknown Title";

      // Get year

      const year = Number(tags.year);

      // Get venue

      const venue =
        tags.journal ||
        tags.booktitle ||
        "Unknown Venue";

      // Get DOI

      const doi =
        tags.doi || "N/A";

      // Get authors

      let authors = [];

      if (tags.author) {
        authors = tags.author
          .split(" and ")
          .map((author) => author.trim());
      }

      // Generate new publication ID

      let newId = 1;

      if (publications.length > 0) {
        newId =
          publications[
            publications.length - 1
          ].id + 1;
      }

      // Find all faculty members from authors

      const facultyIds = [];

      for (const author of authors) {
        const matchedFaculty =
          faculty.find(
            (member) =>
              member.name.toLowerCase() ===
              author.toLowerCase()
          );

        if (matchedFaculty) {
          facultyIds.push(
            matchedFaculty.id
          );
        }
      }

      // Create publication

      const newPublication = {
        id: newId,
        title: title,
        facultyIds: facultyIds,
        type: type,
        year: year,
        venue: venue,
        doi: doi,
        authors: authors,
      };

      publications.push(
        newPublication
      );

      importedCount++;
    });

    // Save imported publications

    savePublicationData();

    console.log(
      chalk.green(
        `\n✓ ${importedCount} publication(s) imported successfully.`
      )
    );
  } catch (error) {
    console.log(
      chalk.red(
        "\nError while importing BibTeX file."
      )
    );

    console.log(error.message);
  }
}

// ========================================
// IMPORT MENU
// ========================================

async function importMenu({
  faculty,
  publications,
  askQuestion,
  pressEnterToContinue,
  saveFacultyData,
  savePublicationData,
}) {
  while (true) {
    console.log(
      chalk.cyan(
        "\n========================================"
      )
    );

    console.log(
      chalk.bold.cyan(
        "             Import Data"
      )
    );

    console.log(
      chalk.cyan(
        "========================================"
      )
    );

    console.log(
      chalk.green(
        "1. Import Faculty from Excel"
      )
    );

    console.log(
      chalk.green(
        "2. Import Publications from BibTeX"
      )
    );

    console.log(
      chalk.red(
        "3. Back to Main Menu"
      )
    );

    console.log(
      chalk.cyan(
        "========================================"
      )
    );

    const choice =
      await askQuestion(
        chalk.yellow(
          "Enter your choice: "
        )
      );

    switch (choice) {
      case "1":
        await importFacultyFromExcel({
          faculty,
          askQuestion,
          saveFacultyData,
        });

        await pressEnterToContinue();

        break;

      case "2":
        await importBibTeX({
          faculty,
          publications,
          askQuestion,
          savePublicationData,
        });

        await pressEnterToContinue();

        break;

      case "3":
        return;

      default:
        console.log(
          chalk.red(
            "\nInvalid choice."
          )
        );
    }
  }
}

module.exports = importMenu;