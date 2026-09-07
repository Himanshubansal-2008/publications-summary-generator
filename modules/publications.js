// ========================================
// PUBLICATION MANAGEMENT
// ========================================

// SHOW PUBLICATIONS

async function showPublications({
  publications,
  pressEnterToContinue,
}) {
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

async function addPublication({
  publications,
  faculty,
  askQuestion,
  pressEnterToContinue,
  savePublicationData,
}) {
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
    authors: authors,
  };

  publications.push(newPublication);

  // Save changes to JSON file

  savePublicationData();

  console.log("\nPublication added successfully!");
  console.log(`Generated Publication ID: ${newId}`);

  await pressEnterToContinue();
}

// ========================================
// PUBLICATION MANAGEMENT MENU
// ========================================

async function publicationManagement({
  publications,
  faculty,
  askQuestion,
  pressEnterToContinue,
  savePublicationData,
}) {
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
        await showPublications({
          publications,
          pressEnterToContinue,
        });
        break;

      case "2":
        await addPublication({
          publications,
          faculty,
          askQuestion,
          pressEnterToContinue,
          savePublicationData,
        });
        break;

      case "3":
        return;

      default:
        console.log("\nInvalid choice.");
    }
  }
}

module.exports = publicationManagement;