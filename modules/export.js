// ========================================
// EXPORT PUBLICATION SUMMARY
// ========================================

const fs = require("fs");
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
// HELPER FUNCTIONS
// ========================================

// GET FACULTY BY ID

function getFacultyById(faculty, facultyId) {
  return faculty.find(
    (member) => member.id === facultyId
  );
}

// GET FACULTY PUBLICATIONS

function getFacultyPublications(
  publications,
  facultyId
) {
  return publications.filter(
    (publication) =>
      publication.facultyId === facultyId
  );
}

// SHOW AVAILABLE FACULTY

function showAvailableFaculty(faculty) {
  console.log("\nAvailable Faculty:");

  faculty.forEach((member) => {
    console.log(`${member.id}. ${member.name}`);
  });
}

// ========================================
// EXCEL EXPORT
// ========================================

function exportToExcel({
  faculty,
  publications,
  facultyId,
}) {
  const selectedFaculty =
    getFacultyById(
      faculty,
      facultyId
    );

  // Check if faculty exists

  if (!selectedFaculty) {
    console.log("\nFaculty not found.");
    return;
  }

  // Get publications of selected faculty

  const facultyPublications =
    getFacultyPublications(
      publications,
      facultyId
    );

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

  const workbook =
    XLSX.utils.book_new();

  // Convert JavaScript data into Excel worksheet

  const worksheet =
    XLSX.utils.json_to_sheet(
      summaryData
    );

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

  // Save Excel file

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
// WORD EXPORT
// ========================================

async function exportToWord({
  faculty,
  publications,
  facultyId,
}) {
  const selectedFaculty =
    getFacultyById(
      faculty,
      facultyId
    );

  // Check if faculty exists

  if (!selectedFaculty) {
    console.log("\nFaculty not found.");
    return;
  }

  // Get publications of selected faculty

  const facultyPublications =
    getFacultyPublications(
      publications,
      facultyId
    );

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
      total:
        journalCount + conferenceCount,
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
            heading:
              HeadingLevel.HEADING_1,
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
                      new Paragraph(
                        "Conferences"
                      ),
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

              ...summaryData.map(
                (data) => {
                  return new TableRow({
                    children: [
                      new TableCell({
                        children: [
                          new Paragraph(
                            String(
                              data.year
                            )
                          ),
                        ],
                      }),

                      new TableCell({
                        children: [
                          new Paragraph(
                            String(
                              data.journals
                            )
                          ),
                        ],
                      }),

                      new TableCell({
                        children: [
                          new Paragraph(
                            String(
                              data.conferences
                            )
                          ),
                        ],
                      }),

                      new TableCell({
                        children: [
                          new Paragraph(
                            String(
                              data.total
                            )
                          ),
                        ],
                      }),
                    ],
                  });
                }
              ),
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
    await Packer.toBuffer(
      document
    );

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

async function exportMenu({
  faculty,
  publications,
  askQuestion,
  pressEnterToContinue,
}) {
  while (true) {
    console.log(
      "\n========================================"
    );
    console.log(
      "        Export Publication Summary"
    );
    console.log(
      "========================================"
    );
    console.log("1. Export to Excel");
    console.log("2. Export to Word");
    console.log("3. Back to Main Menu");
    console.log(
      "========================================"
    );

    const choice =
      await askQuestion(
        "Enter your choice: "
      );

    switch (choice) {

      // EXPORT TO EXCEL

      case "1": {
        showAvailableFaculty(
          faculty
        );

        const facultyId = Number(
          await askQuestion(
            "\nEnter Faculty ID: "
          )
        );

        exportToExcel({
          faculty,
          publications,
          facultyId,
        });

        await pressEnterToContinue();

        break;
      }

      // EXPORT TO WORD

      case "2": {
        showAvailableFaculty(
          faculty
        );

        const facultyId = Number(
          await askQuestion(
            "\nEnter Faculty ID: "
          )
        );

        await exportToWord({
          faculty,
          publications,
          facultyId,
        });

        await pressEnterToContinue();

        break;
      }

      // BACK TO MAIN MENU

      case "3":
        return;

      default:
        console.log(
          "\nInvalid choice."
        );
    }
  }
}

module.exports = exportMenu;