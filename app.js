const fs = require("fs");
const readline = require("readline");

// READ JSON FILES

const facultyData = fs.readFileSync("faculty.json", "utf-8");
const publicationData = fs.readFileSync("publications.json", "utf-8");

// Convert JSON text into JavaScript arrays

const faculty = JSON.parse(facultyData);
const publications = JSON.parse(publicationData);

// CREATE TERMINAL INTERFACE

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// HELPER FUNCTION FOR USER INPUT

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

// PRESS ENTER TO CONTINUE

async function pressEnterToContinue() {
  await askQuestion("\nPress Enter to continue...");
}

// SAVE FACULTY DATA

function saveFacultyData() {
  fs.writeFileSync(
    "faculty.json",
    JSON.stringify(faculty, null, 2)
  );
}

// SAVE PUBLICATION DATA

function savePublicationData() {
  fs.writeFileSync(
    "publications.json",
    JSON.stringify(publications, null, 2)
  );
}

// FACULTY MANAGEMENT

async function showFaculty() {
  console.log("\n========================================");
  console.log("           Faculty Members");
  console.log("========================================");

  if (faculty.length === 0) {
    console.log("No faculty members found.");
  } else {
    faculty.forEach((member) => {
      console.log(`ID: ${member.id}`);
      console.log(`Name: ${member.name}`);
      console.log(`Department: ${member.department}`);
      console.log(`Designation: ${member.designation}`);
      console.log(`Email: ${member.email}`);
      console.log("----------------------------------------");
    });
  }

  await pressEnterToContinue();
}


// ADD FACULTY

async function addFaculty() {
  console.log("\n========================================");
  console.log("             Add Faculty");
  console.log("========================================");

  const name = await askQuestion("Enter name: ");
  const department = await askQuestion("Enter department: ");
  const designation = await askQuestion("Enter designation: ");
  const email = await askQuestion("Enter email: ");

  // Generate new ID

  let newId = 1;

  if (faculty.length > 0) {
    newId = faculty[faculty.length - 1].id + 1;
  }

  const newFaculty = {
    id: newId,
    name: name,
    department: department,
    designation: designation,
    email: email
  };

  faculty.push(newFaculty);

  // Save changes to JSON file

  saveFacultyData();

  console.log("\nFaculty added successfully!");
  console.log(`Generated Faculty ID: ${newId}`);

  await pressEnterToContinue();
}


// UPDATE FACULTY

async function updateFaculty() {
  console.log("\n========================================");
  console.log("            Update Faculty");
  console.log("========================================");

  // Show available faculty IDs

  console.log("\nAvailable Faculty:");

  faculty.forEach((member) => {
    console.log(`${member.id}. ${member.name}`);
  });

  const facultyId = Number(
    await askQuestion("\nEnter faculty ID to update: ")
  );

  // Find faculty using ID

  const facultyMember = faculty.find(
    (member) => member.id === facultyId
  );

  // Check if faculty exists

  if (!facultyMember) {
    console.log("\nFaculty not found.");
    await pressEnterToContinue();
    return;
  }

  // Display current details

  console.log("\nCurrent Faculty Details");
  console.log("----------------------------------------");
  console.log(`Name: ${facultyMember.name}`);
  console.log(`Department: ${facultyMember.department}`);
  console.log(`Designation: ${facultyMember.designation}`);
  console.log(`Email: ${facultyMember.email}`);

  // Get updated information

  const name = await askQuestion("\nEnter new name: ");
  const department = await askQuestion("Enter new department: ");
  const designation = await askQuestion("Enter new designation: ");
  const email = await askQuestion("Enter new email: ");

  // Update faculty object

  facultyMember.name = name;
  facultyMember.department = department;
  facultyMember.designation = designation;
  facultyMember.email = email;

  // Save updated data

  saveFacultyData();

  console.log("\nFaculty updated successfully!");

  await pressEnterToContinue();
}


// FACULTY MANAGEMENT MENU

async function facultyManagement() {
  while (true) {
    console.log("\n========================================");
    console.log("          Faculty Management");
    console.log("========================================");
    console.log("1. Show Faculty");
    console.log("2. Add Faculty");
    console.log("3. Update Faculty");
    console.log("4. Back to Main Menu");
    console.log("========================================");

    const choice = await askQuestion("Enter your choice: ");

    switch (choice) {
      case "1":
        await showFaculty();
        break;

      case "2":
        await addFaculty();
        break;

      case "3":
        await updateFaculty();
        break;

      case "4":
        return;

      default:
        console.log("\nInvalid choice.");
    }
  }
}


// PUBLICATION MANAGEMENT

// SHOW PUBLICATIONS

async function showPublications() {
  console.log("\n========================================");
  console.log("             Publications");
  console.log("========================================");

  if (publications.length === 0) {
    console.log("No publications found.");
  } else {
    publications.forEach((publication) => {
      console.log(`ID: ${publication.id}`);
      console.log(`Title: ${publication.title}`);
      console.log(`Faculty ID: ${publication.facultyId}`);
      console.log(`Type: ${publication.type}`);
      console.log(`Year: ${publication.year}`);
      console.log(`Venue: ${publication.venue}`);
      console.log(`DOI: ${publication.doi}`);
      console.log(`Authors: ${publication.authors.join(", ")}`);
      console.log("----------------------------------------");
    });
  }

  await pressEnterToContinue();
}


// ADD PUBLICATION

async function addPublication() {
  console.log("\n========================================");
  console.log("           Add Publication");
  console.log("========================================");

  const title = await askQuestion("Enter title: ");

  // Show available faculty

  console.log("\nAvailable Faculty:");

  faculty.forEach((member) => {
    console.log(`${member.id}. ${member.name}`);
  });

  const facultyId = Number(
    await askQuestion("Enter faculty ID: ")
  );

  // Check if faculty exists

  const facultyExists = faculty.some(
    (member) => member.id === facultyId
  );

  if (!facultyExists) {
    console.log("\nFaculty not found.");
    await pressEnterToContinue();
    return;
  }

  const type = await askQuestion(
    "Enter type (Journal / Conference): "
  );

  const year = Number(
    await askQuestion("Enter year: ")
  );

  const venue = await askQuestion("Enter venue: ");
  const doi = await askQuestion("Enter DOI: ");
  const authorsInput = await askQuestion(
    "Enter authors (separated by commas): "
  );

  // Generate new publication ID

  let newId = 1;

  if (publications.length > 0) {
    newId = publications[publications.length - 1].id + 1;
  }

  // Convert authors into an array

  const authors = authorsInput
    .split(",")
    .map((author) => author.trim());

  const newPublication = {
    id: newId,
    title: title,
    facultyId: facultyId,
    type: type,
    year: year,
    venue: venue,
    doi: doi,
    authors: authors
  };

  publications.push(newPublication);

  // Save changes to JSON file

  savePublicationData();

  console.log("\nPublication added successfully!");
  console.log(`Generated Publication ID: ${newId}`);

  await pressEnterToContinue();
}

async function publicationManagement() {
  while (true) {
    console.log("\n========================================");
    console.log("        Publication Management");
    console.log("========================================");
    console.log("1. Show Publications");
    console.log("2. Add Publication");
    console.log("3. Back to Main Menu");
    console.log("========================================");

    const choice = await askQuestion("Enter your choice: ");

    switch (choice) {
      case "1":
        await showPublications();
        break;

      case "2":
        await addPublication();
        break;

      case "3":
        return;

      default:
        console.log("\nInvalid choice.");
    }
  }
}

// SEARCH / FILTER

// DISPLAY SEARCH RESULTS

function displayPublicationResults(results) {
  console.log("\n========================================");
  console.log("          Search Results");
  console.log("========================================");

  if (results.length === 0) {
    console.log("No publications found.");
  } else {
    results.forEach((publication, index) => {

      const facultyMember = faculty.find(
        (member) => member.id === publication.facultyId
      );

      console.log(`${index + 1}. ${publication.title}`);

      console.log(
        `   Faculty: ${
          facultyMember ? facultyMember.name : "Unknown"
        }`
      );

      console.log(`   Year: ${publication.year}`);
      console.log(`   Type: ${publication.type}`);
      console.log(`   Venue: ${publication.venue}`);

      console.log("----------------------------------------");
    });
  }
}

// SEARCH BY FACULTY

async function searchByFaculty() {

  console.log("\nAvailable Faculty:");

  faculty.forEach((member) => {
    console.log(`${member.id}. ${member.name}`);
  });

  const facultyId = Number(
    await askQuestion("\nEnter faculty ID: ")
  );

  const results = publications.filter(
    (publication) => publication.facultyId === facultyId
  );

  displayPublicationResults(results);

  await pressEnterToContinue();
}


// FILTER BY YEAR

async function filterByYear() {

  const year = Number(
    await askQuestion("Enter year: ")
  );

  if (isNaN(year)) {
    console.log("\nPlease enter a valid year.");
    await pressEnterToContinue();
    return;
  }

  const results = publications.filter(
    (publication) => publication.year === year
  );

  displayPublicationResults(results);

  await pressEnterToContinue();
}


// FILTER BY YEAR RANGE

async function filterByYearRange() {

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

  const results = publications.filter(
    (publication) =>
      publication.year >= startYear &&
      publication.year <= endYear
  );

  displayPublicationResults(results);

  await pressEnterToContinue();
}


// FILTER BY PUBLICATION TYPE

async function filterByType() {

  const type = await askQuestion(
    "Enter type (Journal / Conference): "
  );

  const results = publications.filter(
    (publication) =>
      publication.type.toLowerCase() ===
      type.toLowerCase()
  );

  displayPublicationResults(results);

  await pressEnterToContinue();
}


// SEARCH BY PUBLICATION TITLE

async function searchByTitle() {

  const title = await askQuestion(
    "Enter title to search: "
  );

  const results = publications.filter(
    (publication) =>
      publication.title
        .toLowerCase()
        .includes(title.toLowerCase())
  );

  displayPublicationResults(results);

  await pressEnterToContinue();
}


// SEARCH / FILTER MENU

async function searchFilterMenu() {

  while (true) {

    console.log("\n========================================");
    console.log("          Search / Filter");
    console.log("========================================");
    console.log("1. Search by Faculty");
    console.log("2. Filter by Year");
    console.log("3. Filter by Year Range");
    console.log("4. Filter by Publication Type");
    console.log("5. Search by Publication Title");
    console.log("6. Show All Publications");
    console.log("7. Back to Main Menu");
    console.log("========================================");

    const choice = await askQuestion(
      "Enter your choice: "
    );

    switch (choice) {

      case "1":
        await searchByFaculty();
        break;

      case "2":
        await filterByYear();
        break;

      case "3":
        await filterByYearRange();
        break;

      case "4":
        await filterByType();
        break;

      case "5":
        await searchByTitle();
        break;

      case "6":
        await showPublications();
        break;

      case "7":
        return;

      default:
        console.log("\nInvalid choice.");
    }
  }
}


// PUBLICATION SUMMARY

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
    )
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
    )
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


// PUBLICATION SUMMARY MENU

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


// MAIN MENU

async function mainMenu() {

  while (true) {

    console.log("\n========================================");
    console.log("   Publications Summary Generator");
    console.log("========================================");
    console.log("1. Faculty Management");
    console.log("2. Publication Management");
    console.log("3. Search / Filter");
    console.log("4. Publication Summary");
    console.log("5. Exit");
    console.log("========================================");

    const choice = await askQuestion(
      "Enter your choice: "
    );

    switch (choice) {

      case "1":
        await facultyManagement();
        break;

      case "2":
        await publicationManagement();
        break;

      case "3":
        await searchFilterMenu();
        break;

      case "4":
        await summaryMenu();
        break;

      case "5":
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

// START APPLICATION

mainMenu();