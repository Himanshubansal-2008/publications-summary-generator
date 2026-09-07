const fs = require("fs");
const readline = require("readline");
const XLSX = require("xlsx");

const {
  Document,
  Packer,
  Paragraph,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
} = require("docx");

//Importing modules
const facultyManagement = require("./modules/faculty");
const {publicationManagement, showPublications,} = require("./modules/publications");
const searchFilterMenu = require("./modules/search");

// ========================================
// READ JSON FILES
// ========================================

const facultyData = fs.readFileSync("faculty.json", "utf-8");
const publicationData = fs.readFileSync("publications.json", "utf-8");

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
// PUBLICATION SUMMARY
// ========================================

// GET FACULTY BY ID

function getFacultyById(facultyId) {
  return faculty.find(
    (member) => member.id === facultyId
  );
}

// GET FACULTY PUBLICATIONS

function getFacultyPublications(facultyId) {
  return publications.filter(
    (publication) =>
      publication.facultyId === facultyId
  );
}

// SHOW AVAILABLE FACULTY

function showAvailableFaculty() {
  console.log("\nAvailable Faculty:");

  faculty.forEach((member) => {
    console.log(`${member.id}. ${member.name}`);
  });
}

// YEAR-WISE SUMMARY

async function generateYearWiseSummary() {
  console.log("\n========================================");
  console.log("       Year-wise Publication Summary");
  console.log("========================================");

  showAvailableFaculty();

  const facultyId = Number(
    await askQuestion("\nEnter Faculty ID: ")
  );

  const facultyMember = getFacultyById(facultyId);

  if (!facultyMember) {
    console.log("\nFaculty not found.");
    await pressEnterToContinue();
    return;
  }

  const facultyPublications =
    getFacultyPublications(facultyId);

  if (facultyPublications.length === 0) {
    console.log(
      `\nNo publications found for ${facultyMember.name}.`
    );

    await pressEnterToContinue();
    return;
  }

  // Get unique years

  const years = [
    ...new Set(
      facultyPublications.map(
        (publication) => publication.year
      )
    ),
  ];

  // Sort years

  years.sort((a, b) => a - b);

  console.log(`\nFaculty: ${facultyMember.name}`);

  console.log(
    "\nYear       Journal    Conference    Total"
  );

  console.log(
    "--------------------------------------------"
  );

  let totalJournal = 0;
  let totalConference = 0;

  years.forEach((year) => {
    const yearPublications =
      facultyPublications.filter(
        (publication) =>
          publication.year === year
      );

    const journalCount =
      yearPublications.filter(
        (publication) =>
          publication.type.toLowerCase() === "journal"
      ).length;

    const conferenceCount =
      yearPublications.filter(
        (publication) =>
          publication.type.toLowerCase() === "conference"
      ).length;

    const total = yearPublications.length;

    totalJournal += journalCount;
    totalConference += conferenceCount;

    console.log(
      `${year}        ${journalCount}          ${conferenceCount}          ${total}`
    );
  });

  console.log(
    "--------------------------------------------"
  );

  console.log(
    `Total       ${totalJournal}          ${totalConference}          ${
      totalJournal + totalConference
    }`
  );

  await pressEnterToContinue();
}

// CUSTOM YEAR RANGE SUMMARY

async function generateCustomRangeSummary() {
  console.log("\n========================================");
  console.log("       Custom Publication Summary");
  console.log("========================================");

  showAvailableFaculty();

  const facultyId = Number(
    await askQuestion("\nEnter Faculty ID: ")
  );

  const facultyMember = getFacultyById(facultyId);

  if (!facultyMember) {
    console.log("\nFaculty not found.");
    await pressEnterToContinue();
    return;
  }

  const startYear = Number(
    await askQuestion("Enter start year: ")
  );

  const endYear = Number(
    await askQuestion("Enter end year: ")
  );

  if (isNaN(startYear) || isNaN(endYear)) {
    console.log("\nPlease enter valid years.");
    await pressEnterToContinue();
    return;
  }

  if (startYear > endYear) {
    console.log(
      "\nStart year cannot be greater than end year."
    );

    await pressEnterToContinue();
    return;
  }

  const facultyPublications =
    getFacultyPublications(facultyId);

  const results =
    facultyPublications.filter(
      (publication) =>
        publication.year >= startYear &&
        publication.year <= endYear
    );

  let journalCount = 0;
  let conferenceCount = 0;

  results.forEach((publication) => {
    if (
      publication.type.toLowerCase() === "journal"
    ) {
      journalCount++;
    }

    if (
      publication.type.toLowerCase() === "conference"
    ) {
      conferenceCount++;
    }
  });

  console.log(
    `\nFaculty: ${facultyMember.name}`
  );

  console.log(
    `Period: ${startYear} - ${endYear}`
  );

  console.log("\n----------------------------------------");

  console.log(
    "Journal Publications    :",
    journalCount
  );

  console.log(
    "Conference Publications :",
    conferenceCount
  );

  console.log(
    "Total Publications      :",
    results.length
  );

  console.log("----------------------------------------");

  if (results.length === 0) {
    console.log(
      "\nNo publications found in this period."
    );
  }

  await pressEnterToContinue();
}

// FACULTY PUBLICATION SUMMARY

async function generateFacultySummary() {
  console.log("\n========================================");
  console.log("        Faculty Publication Summary");
  console.log("========================================");

  showAvailableFaculty();

  const facultyId = Number(
    await askQuestion("\nEnter Faculty ID: ")
  );

  const facultyMember = getFacultyById(facultyId);

  if (!facultyMember) {
    console.log("\nFaculty not found.");
    await pressEnterToContinue();
    return;
  }

  const facultyPublications =
    getFacultyPublications(facultyId);

  if (facultyPublications.length === 0) {
    console.log(
      `\nNo publications found for ${facultyMember.name}.`
    );

    await pressEnterToContinue();
    return;
  }

  const journalCount =
    facultyPublications.filter(
      (publication) =>
        publication.type.toLowerCase() === "journal"
    ).length;

  const conferenceCount =
    facultyPublications.filter(
      (publication) =>
        publication.type.toLowerCase() === "conference"
    ).length;

  console.log(
    `\nFaculty: ${facultyMember.name}`
  );

  console.log("\n----------------------------------------");

  console.log(
    "Total Publications :",
    facultyPublications.length
  );

  console.log(
    "Journal            :",
    journalCount
  );

  console.log(
    "Conference         :",
    conferenceCount
  );

  console.log("----------------------------------------");

  console.log("\nPublications by Year");
  console.log("--------------------");

  const years = [
    ...new Set(
      facultyPublications.map(
        (publication) => publication.year
      )
    ),
  ];

  years.sort((a, b) => a - b);

  years.forEach((year) => {
    const count =
      facultyPublications.filter(
        (publication) =>
          publication.year === year
      ).length;

    console.log(`${year} : ${count}`);
  });

  await pressEnterToContinue();
}

// ========================================
// DAY 5 - EXCEL EXPORT
// ========================================

// EXPORT PUBLICATION SUMMARY TO EXCEL

function exportToExcel(facultyId) {
  const selectedFaculty = getFacultyById(facultyId);

  // Check if faculty exists

  if (!selectedFaculty) {
    console.log("\nFaculty not found.");
    return;
  }

  // Get publications of selected faculty

  const facultyPublications =
    getFacultyPublications(facultyId);

  // Check if publications exist

  if (facultyPublications.length === 0) {
    console.log(
      `\nNo publications found for ${selectedFaculty.name}.`
    );
    return;
  }

  // Store data that will go into Excel

  const summaryData = [];

  // Get unique publication years

  const years = [
    ...new Set(
      facultyPublications.map(
        (publication) => publication.year
      )
    ),
  ];

  // Sort years from oldest to newest

  years.sort((a, b) => a - b);

  // Create one row for each year

  years.forEach((year) => {
    const yearPublications =
      facultyPublications.filter(
        (publication) =>
          publication.year === year
      );

    // Count journals

    const journalCount =
      yearPublications.filter(
        (publication) =>
          publication.type.toLowerCase() === "journal"
      ).length;

    // Count conferences

    const conferenceCount =
      yearPublications.filter(
        (publication) =>
          publication.type.toLowerCase() === "conference"
      ).length;

    // Add data to summaryData

    summaryData.push({
      Year: year,
      Journals: journalCount,
      Conferences: conferenceCount,
      Total: journalCount + conferenceCount,
    });
  });

  // Create Excel workbook

  const workbook = XLSX.utils.book_new();

  // Convert JavaScript data into Excel worksheet

  const worksheet =
    XLSX.utils.json_to_sheet(summaryData);

  // Add worksheet to workbook

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Publication Summary"
  );

  // Create reports folder if it does not exist

  if (!fs.existsSync("reports")) {
    fs.mkdirSync("reports");
  }

  // Create file name

  const fileName =
    `faculty_${facultyId}_publication_summary.xlsx`;

  // Create complete file path

  const filePath =
    `reports/${fileName}`;

  // Save Excel file inside reports folder

  XLSX.writeFile(
    workbook,
    filePath
  );

  console.log(
    "\n✓ Excel file exported successfully!"
  );

  console.log(
    `Faculty: ${selectedFaculty.name}`
  );

  console.log(
    `File: ${filePath}`
  );
}

// ========================================
// DAY 5 - WORD EXPORT
// ========================================

// EXPORT PUBLICATION SUMMARY TO WORD

async function exportToWord(facultyId) {
  const selectedFaculty = getFacultyById(facultyId);

  // Check if faculty exists

  if (!selectedFaculty) {
    console.log("\nFaculty not found.");
    return;
  }

  // Get publications of selected faculty

  const facultyPublications =
    getFacultyPublications(facultyId);

  // Check if publications exist

  if (facultyPublications.length === 0) {
    console.log(
      `\nNo publications found for ${selectedFaculty.name}.`
    );
    return;
  }

  // Get unique publication years

  const years = [
    ...new Set(
      facultyPublications.map(
        (publication) => publication.year
      )
    ),
  ];

  // Sort years

  years.sort((a, b) => a - b);

  // Create summary data

  const summaryData = [];

  years.forEach((year) => {
    const yearPublications =
      facultyPublications.filter(
        (publication) =>
          publication.year === year
      );

    const journalCount =
      yearPublications.filter(
        (publication) =>
          publication.type.toLowerCase() === "journal"
      ).length;

    const conferenceCount =
      yearPublications.filter(
        (publication) =>
          publication.type.toLowerCase() === "conference"
      ).length;

    summaryData.push({
      year: year,
      journals: journalCount,
      conferences: conferenceCount,
      total: journalCount + conferenceCount,
    });
  });

  // Create Word document

  const document = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: "Publication Summary",
            heading: HeadingLevel.TITLE,
          }),

          new Paragraph({
            text: `Faculty: ${selectedFaculty.name}`,
          }),

          new Paragraph({
            text: `Department: ${selectedFaculty.department}`,
          }),

          new Paragraph({
            text: `Designation: ${selectedFaculty.designation}`,
          }),

          new Paragraph({
            text: `Email: ${selectedFaculty.email}`,
          }),

          new Paragraph({
            text: "",
          }),

          new Paragraph({
            text: "Year-wise Publication Summary",
            heading: HeadingLevel.HEADING_1,
          }),

          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },

            rows: [
              // Table Header

              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph("Year"),
                    ],
                  }),

                  new TableCell({
                    children: [
                      new Paragraph("Journals"),
                    ],
                  }),

                  new TableCell({
                    children: [
                      new Paragraph("Conferences"),
                    ],
                  }),

                  new TableCell({
                    children: [
                      new Paragraph("Total"),
                    ],
                  }),
                ],
              }),

              // Table Data

              ...summaryData.map((data) => {
                return new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph(
                          String(data.year)
                        ),
                      ],
                    }),

                    new TableCell({
                      children: [
                        new Paragraph(
                          String(data.journals)
                        ),
                      ],
                    }),

                    new TableCell({
                      children: [
                        new Paragraph(
                          String(data.conferences)
                        ),
                      ],
                    }),

                    new TableCell({
                      children: [
                        new Paragraph(
                          String(data.total)
                        ),
                      ],
                    }),
                  ],
                });
              }),
            ],
          }),
        ],
      },
    ],
  });

  // Create reports folder if it does not exist

  if (!fs.existsSync("reports")) {
    fs.mkdirSync("reports");
  }

  // Create file name

  const fileName =
    `faculty_${facultyId}_publication_summary.docx`;

  // Create complete file path

  const filePath =
    `reports/${fileName}`;

  // Convert document to Word file

  const buffer =
    await Packer.toBuffer(document);

  // Save Word file

  fs.writeFileSync(
    filePath,
    buffer
  );

  console.log(
    "\n✓ Word file exported successfully!"
  );

  console.log(
    `Faculty: ${selectedFaculty.name}`
  );

  console.log(
    `File: ${filePath}`
  );
}

// ========================================
// EXPORT MENU
// ========================================

async function exportMenu() {
  while (true) {
    console.log("\n========================================");
    console.log("        Export Publication Summary");
    console.log("========================================");
    console.log("1. Export to Excel");
    console.log("2. Export to Word");
    console.log("3. Back to Main Menu");
    console.log("========================================");

    const choice =
      await askQuestion("Enter your choice: ");

    switch (choice) {

      // EXPORT TO EXCEL

      case "1": {
        showAvailableFaculty();

        const facultyId = Number(
          await askQuestion("\nEnter Faculty ID: ")
        );

        exportToExcel(facultyId);

        await pressEnterToContinue();

        break;
      }

      // EXPORT TO WORD

      case "2": {
        showAvailableFaculty();

        const facultyId = Number(
          await askQuestion("\nEnter Faculty ID: ")
        );

        await exportToWord(facultyId);

        await pressEnterToContinue();

        break;
      }

      // BACK TO MAIN MENU

      case "3":
        return;

      default:
        console.log("\nInvalid choice.");
    }
  }
}

// ========================================
// PUBLICATION SUMMARY MENU
// ========================================

async function summaryMenu() {
  while (true) {
    console.log("\n========================================");
    console.log("        Publication Summary");
    console.log("========================================");
    console.log("1. Year-wise Summary");
    console.log("2. Custom Year Range Summary");
    console.log("3. Faculty Publication Summary");
    console.log("4. Back to Main Menu");
    console.log("========================================");

    const choice = await askQuestion(
      "Enter your choice: "
    );

    switch (choice) {

      case "1":
        await generateYearWiseSummary();
        break;

      case "2":
        await generateCustomRangeSummary();
        break;

      case "3":
        await generateFacultySummary();
        break;

      case "4":
        return;

      default:
        console.log("\nInvalid choice.");
    }
  }
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

      case "1":
        await facultyManagement({
          faculty,
          askQuestion,
          pressEnterToContinue,
          saveFacultyData,
        });
        break;

      case "2":
        await publicationManagement({
          publications,
          faculty,
          askQuestion,
          pressEnterToContinue,
          savePublicationData,
        });
        break;

      case "3":
         await searchFilterMenu({
          faculty,
          publications,
          askQuestion,
          pressEnterToContinue,
          showPublications,
        });
        break;

      case "4":
        await summaryMenu();
        break;

      case "5":
        await exportMenu();
        break;

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