const fs = require("fs");
const readline = require("readline");

// Read JSON files

const facultyData = fs.readFileSync("faculty.json", "utf-8");
const publicationData = fs.readFileSync("publications.json", "utf-8");

// Convert JSON text into JavaScript arrays
const faculty = JSON.parse(facultyData);
const publications = JSON.parse(publicationData);

// Create terminal interface

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function for user input

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Press Enter to continue

async function pressEnterToContinue() {
  await askQuestion("\nPress Enter to continue...");
}

// Save Faculty data

function saveFacultyData() {
  fs.writeFileSync(
    "faculty.json",
    JSON.stringify(faculty, null, 2)
  );
}

// Save Publication data

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

async function facultyManagement() {
  while (true) {
    console.log("\n========================================");
    console.log("          Faculty Management");
    console.log("========================================");
    console.log("1. Show Faculty");
    console.log("2. Add Faculty");
    console.log("3. Back to Main Menu");
    console.log("========================================");

    const choice = await askQuestion("Enter your choice: ");

    switch (choice.trim()) {
      case "1":
        await showFaculty();
        break;

      case "2":
        await addFaculty();
        break;

      case "3":
        return;

      default:
        console.log("\nInvalid choice.");
    }
  }
}

// PUBLICATION MANAGEMENT

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

async function addPublication() {
  console.log("\n========================================");
  console.log("           Add Publication");
  console.log("========================================");

  const title = await askQuestion("Enter title: ");
  const facultyId = await askQuestion("Enter faculty ID: ");
  const type = await askQuestion("Enter type (Journal / Conference): ");
  const year = await askQuestion("Enter year: ");
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

  // Convert author string into an array
  const authors = authorsInput
    .split(",")
    .map((author) => author.trim());

  const newPublication = {
    id: newId,
    title: title,
    facultyId: Number(facultyId),
    type: type,
    year: Number(year),
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

    switch (choice.trim()) {
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

// MAIN MENU

async function mainMenu() {
  while (true) {
    console.log("\n========================================");
    console.log("   Publications Summary Generator");
    console.log("========================================");
    console.log("1. Faculty Management");
    console.log("2. Publication Management");
    console.log("3. Exit");
    console.log("========================================");

    const choice = await askQuestion("Enter your choice: ");

    switch (choice.trim()) {
      case "1":
        await facultyManagement();
        break;

      case "2":
        await publicationManagement();
        break;

      case "3":
        console.log("\nThank you for using Publications Summary Generator.");
        rl.close();
        return;

      default:
        console.log("\nInvalid choice. Please try again.");
    }
  }
}

// Start application

mainMenu();