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
// DAY 5 - EXCEL EXPORT
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

// EXPORT PUBLICATION SUMMARY TO EXCEL

function exportToExcel(facultyId) {
  const selectedFaculty =
    getFacultyById(facultyId);

  if (!selectedFaculty) {
    console.log("\nFaculty not found.");
    return;
  }

  const facultyPublications =
    getFacultyPublications(facultyId);

  if (facultyPublications.length === 0) {
    console.log(
      `\nNo publications found for ${selectedFaculty.name}.`
    );
    return;
  }

  const summaryData = [];

  const years = [
    ...new Set(
      facultyPublications.map(
        (publication) => publication.year
      )
    ),
  ];

  years.sort((a, b) => a - b);

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
      Year: year,
      Journals: journalCount,
      Conferences: conferenceCount,
      Total: journalCount + conferenceCount,
    });
  });

  const workbook = XLSX.utils.book_new();

  const worksheet =
    XLSX.utils.json_to_sheet(summaryData);

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Publication Summary"
  );

  if (!fs.existsSync("reports")) {
    fs.mkdirSync("reports");
  }

  const fileName =
    `faculty_${facultyId}_publication_summary.xlsx`;

  const filePath =
    `reports/${fileName}`;

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
  const selectedFaculty =
    getFacultyById(facultyId);

  if (!selectedFaculty) {
    console.log("\nFaculty not found.");
    return;
  }

  const facultyPublications =
    getFacultyPublications(facultyId);

  if (facultyPublications.length === 0) {
    console.log(
      `\nNo publications found for ${selectedFaculty.name}.`
    );
    return;
  }

  const years = [
    ...new Set(
      facultyPublications.map(
        (publication) => publication.year
      )
    ),
  ];

  years.sort((a, b) => a - b);

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

  if (!fs.existsSync("reports")) {
    fs.mkdirSync("reports");
  }

  const fileName =
    `faculty_${facultyId}_publication_summary.docx`;

  const filePath =
    `reports/${fileName}`;

  const buffer =
    await Packer.toBuffer(document);

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

      case "1": {
        showAvailableFaculty();

        const facultyId = Number(
          await askQuestion("\nEnter Faculty ID: ")
        );

        exportToExcel(facultyId);

        await pressEnterToContinue();

        break;
      }

      case "2": {
        showAvailableFaculty();

        const facultyId = Number(
          await askQuestion("\nEnter Faculty ID: ")
        );

        await exportToWord(facultyId);

        await pressEnterToContinue();

        break;
      }

      case "3":
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
        await summaryMenu({
          faculty,
          publications,
          askQuestion,
          pressEnterToContinue,
        });
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