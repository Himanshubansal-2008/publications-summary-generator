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

// YEAR-WISE SUMMARY

async function generateYearWiseSummary({
  faculty,
  publications,
  askQuestion,
  pressEnterToContinue,
}) {
  console.log("\n========================================");
  console.log("       Year-wise Publication Summary");
  console.log("========================================");

  showAvailableFaculty(faculty);

  const facultyId = Number(
    await askQuestion("\nEnter Faculty ID: ")
  );

  const facultyMember = getFacultyById(
    faculty,
    facultyId
  );

  if (!facultyMember) {
    console.log("\nFaculty not found.");
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

async function generateCustomRangeSummary({
  faculty,
  publications,
  askQuestion,
  pressEnterToContinue,
}) {
  console.log("\n========================================");
  console.log("       Custom Publication Summary");
  console.log("========================================");

  showAvailableFaculty(faculty);

  const facultyId = Number(
    await askQuestion("\nEnter Faculty ID: ")
  );

  const facultyMember = getFacultyById(
    faculty,
    facultyId
  );

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
    getFacultyPublications(
      publications,
      facultyId
    );

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

async function generateFacultySummary({
  faculty,
  publications,
  askQuestion,
  pressEnterToContinue,
}) {
  console.log("\n========================================");
  console.log("        Faculty Publication Summary");
  console.log("========================================");

  showAvailableFaculty(faculty);

  const facultyId = Number(
    await askQuestion("\nEnter Faculty ID: ")
  );

  const facultyMember = getFacultyById(
    faculty,
    facultyId
  );

  if (!facultyMember) {
    console.log("\nFaculty not found.");
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
// PUBLICATION SUMMARY MENU
// ========================================

async function summaryMenu({
  faculty,
  publications,
  askQuestion,
  pressEnterToContinue,
}) {
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
        console.log("\nInvalid choice.");
    }
  }
}

module.exports = summaryMenu;