const chalk = require("chalk");

// ========================================
// PUBLICATION SUMMARY
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
      Array.isArray(publication.facultyIds) &&
      publication.facultyIds.includes(facultyId)
  );
}

// GET VALID PUBLICATION YEAR

function getValidYear(publication) {
  const year = Number(publication.year);

  if (Number.isInteger(year) && year > 0) {
    return year;
  }

  return null;
}

// SHOW AVAILABLE FACULTY

function showAvailableFaculty(faculty) {
  console.log(
    chalk.bold.cyan("\nAvailable Faculty:")
  );

  faculty.forEach((member) => {
    console.log(
      chalk.green(`${member.id}. ${member.name}`)
    );
  });
}

// ========================================
// YEAR-WISE SUMMARY
// ========================================

async function generateYearWiseSummary({
  faculty,
  publications,
  askQuestion,
  pressEnterToContinue,
}) {
  console.log(
    chalk.cyan("\n========================================")
  );

  console.log(
    chalk.bold.cyan(
      "       Year-wise Publication Summary"
    )
  );

  console.log(
    chalk.cyan("========================================")
  );

  showAvailableFaculty(faculty);

  const facultyId = Number(
    await askQuestion(
      chalk.yellow("\nEnter Faculty ID: ")
    )
  );

  const facultyMember = getFacultyById(
    faculty,
    facultyId
  );

  if (!facultyMember) {
    console.log(
      chalk.red("\nFaculty not found.")
    );

    await pressEnterToContinue();
    return;
  }

  const facultyPublications =
    getFacultyPublications(
      publications,
      facultyId
    );

  if (facultyPublications.length === 0) {
    console.log(
      chalk.yellow(
        `\nNo publications found for ${facultyMember.name}.`
      )
    );

    await pressEnterToContinue();
    return;
  }

  // Get unique valid years

  const years = [
    ...new Set(
      facultyPublications
        .map((publication) =>
          getValidYear(publication)
        )
        .filter((year) => year !== null)
    ),
  ];

  // Sort years

  years.sort((a, b) => a - b);

  console.log(
    `\nFaculty: ${facultyMember.name}`
  );

  console.log(
    chalk.bold(
      "\nYear       Journal    Conference    Total"
    )
  );

  console.log(
    chalk.cyan(
      "--------------------------------------------"
    )
  );

  let totalJournal = 0;
  let totalConference = 0;

  years.forEach((year) => {
    const yearPublications =
      facultyPublications.filter(
        (publication) =>
          getValidYear(publication) === year
      );

    const journalCount =
      yearPublications.filter(
        (publication) =>
          publication.type &&
          publication.type.toLowerCase() === "journal"
      ).length;

    const conferenceCount =
      yearPublications.filter(
        (publication) =>
          publication.type &&
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
    chalk.cyan(
      "--------------------------------------------"
    )
  );

  console.log(
    chalk.bold(
      `Total       ${totalJournal}          ${totalConference}          ${
        totalJournal + totalConference
      }`
    )
  );

  await pressEnterToContinue();
}

// ========================================
// CUSTOM YEAR RANGE SUMMARY
// ========================================

async function generateCustomRangeSummary({
  faculty,
  publications,
  askQuestion,
  pressEnterToContinue,
}) {
  console.log(
    chalk.cyan("\n========================================")
  );

  console.log(
    chalk.bold.cyan(
      "       Custom Publication Summary"
    )
  );

  console.log(
    chalk.cyan("========================================")
  );

  showAvailableFaculty(faculty);

  const facultyId = Number(
    await askQuestion(
      chalk.yellow("\nEnter Faculty ID: ")
    )
  );

  const facultyMember = getFacultyById(
    faculty,
    facultyId
  );

  if (!facultyMember) {
    console.log(
      chalk.red("\nFaculty not found.")
    );

    await pressEnterToContinue();
    return;
  }

  const startYear = Number(
    await askQuestion(
      chalk.yellow("Enter start year: ")
    )
  );

  const endYear = Number(
    await askQuestion(
      chalk.yellow("Enter end year: ")
    )
  );

  if (
    !Number.isInteger(startYear) ||
    !Number.isInteger(endYear) ||
    startYear <= 0 ||
    endYear <= 0
  ) {
    console.log(
      chalk.red("\nPlease enter valid years.")
    );

    await pressEnterToContinue();
    return;
  }

  if (startYear > endYear) {
    console.log(
      chalk.red(
        "\nStart year cannot be greater than end year."
      )
    );

    await pressEnterToContinue();
    return;
  }

  const facultyPublications =
    getFacultyPublications(
      publications,
      facultyId
    );

  const results =
    facultyPublications.filter((publication) => {
      const year = getValidYear(publication);

      return (
        year !== null &&
        year >= startYear &&
        year <= endYear
      );
    });

  let journalCount = 0;
  let conferenceCount = 0;

  results.forEach((publication) => {
    if (
      publication.type &&
      publication.type.toLowerCase() === "journal"
    ) {
      journalCount++;
    }

    if (
      publication.type &&
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

  console.log(
    chalk.cyan(
      "\n----------------------------------------"
    )
  );

  console.log(
    "Journal Publications    :",
    journalCount
  );

  console.log(
    "Conference Publications :",
    conferenceCount
  );

  console.log(
    chalk.bold(
      "Total Publications      :"
    ),
    results.length
  );

  console.log(
    chalk.cyan(
      "----------------------------------------"
    )
  );

  if (results.length === 0) {
    console.log(
      chalk.yellow(
        "\nNo publications found in this period."
      )
    );
  }

  await pressEnterToContinue();
}

// ========================================
// FACULTY PUBLICATION SUMMARY
// ========================================

async function generateFacultySummary({
  faculty,
  publications,
  askQuestion,
  pressEnterToContinue,
}) {
  console.log(
    chalk.cyan("\n========================================")
  );

  console.log(
    chalk.bold.cyan(
      "        Faculty Publication Summary"
    )
  );

  console.log(
    chalk.cyan("========================================")
  );

  showAvailableFaculty(faculty);

  const facultyId = Number(
    await askQuestion(
      chalk.yellow("\nEnter Faculty ID: ")
    )
  );

  const facultyMember = getFacultyById(
    faculty,
    facultyId
  );

  if (!facultyMember) {
    console.log(
      chalk.red("\nFaculty not found.")
    );

    await pressEnterToContinue();
    return;
  }

  const facultyPublications =
    getFacultyPublications(
      publications,
      facultyId
    );

  if (facultyPublications.length === 0) {
    console.log(
      chalk.yellow(
        `\nNo publications found for ${facultyMember.name}.`
      )
    );

    await pressEnterToContinue();
    return;
  }

  const journalCount =
    facultyPublications.filter(
      (publication) =>
        publication.type &&
        publication.type.toLowerCase() === "journal"
    ).length;

  const conferenceCount =
    facultyPublications.filter(
      (publication) =>
        publication.type &&
        publication.type.toLowerCase() === "conference"
    ).length;

  console.log(
    `\nFaculty: ${facultyMember.name}`
  );

  console.log(
    chalk.cyan(
      "\n----------------------------------------"
    )
  );

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

  console.log(
    chalk.cyan(
      "----------------------------------------"
    )
  );

  console.log(
    chalk.bold("\nPublications by Year")
  );

  console.log(
    chalk.cyan("--------------------")
  );

  const years = [
    ...new Set(
      facultyPublications
        .map((publication) =>
          getValidYear(publication)
        )
        .filter((year) => year !== null)
    ),
  ];

  years.sort((a, b) => a - b);

  years.forEach((year) => {
    const count =
      facultyPublications.filter(
        (publication) =>
          getValidYear(publication) === year
      ).length;

    console.log(`${year} : ${count}`);
  });

  await pressEnterToContinue();
}

// ========================================
// PUBLICATION SUMMARY MENU
// ========================================

async function summaryMenu({
  faculty,
  publications,
  askQuestion,
  pressEnterToContinue,
}) {
  while (true) {
    console.log(
      chalk.cyan(
        "\n========================================"
      )
    );

    console.log(
      chalk.bold.cyan(
        "        Publication Summary"
      )
    );

    console.log(
      chalk.cyan(
        "========================================"
      )
    );

    console.log(
      chalk.green("1. Year-wise Summary")
    );

    console.log(
      chalk.green(
        "2. Custom Year Range Summary"
      )
    );

    console.log(
      chalk.green(
        "3. Faculty Publication Summary"
      )
    );

    console.log(
      chalk.red(
        "4. Back to Main Menu"
      )
    );

    console.log(
      chalk.cyan(
        "========================================"
      )
    );

    const choice = await askQuestion(
      chalk.yellow(
        "Enter your choice: "
      )
    );

    switch (choice) {
      case "1":
        await generateYearWiseSummary({
          faculty,
          publications,
          askQuestion,
          pressEnterToContinue,
        });
        break;

      case "2":
        await generateCustomRangeSummary({
          faculty,
          publications,
          askQuestion,
          pressEnterToContinue,
        });
        break;

      case "3":
        await generateFacultySummary({
          faculty,
          publications,
          askQuestion,
          pressEnterToContinue,
        });
        break;

      case "4":
        return;

      default:
        console.log(
          chalk.red("\nInvalid choice.")
        );
    }
  }
}

module.exports = summaryMenu;