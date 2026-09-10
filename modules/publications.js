// ========================================
// PUBLICATION MANAGEMENT
// ========================================

const chalk = require("chalk");

// ========================================
// SHOW PUBLICATIONS
// ========================================

async function showPublications({
  publications,
  pressEnterToContinue,
}) {
  console.log(
    chalk.cyan("\n========================================")
  );

  console.log(
    chalk.bold.cyan("             Publications")
  );

  console.log(
    chalk.cyan("========================================")
  );

  if (publications.length === 0) {
    console.log(
      chalk.yellow("No publications found.")
    );
  } else {
    publications.forEach((publication) => {
      console.log(`ID: ${publication.id}`);
      console.log(`Title: ${publication.title}`);
      console.log(
        `Faculty IDs: ${publication.facultyIds.join(", ")}`
      );
      console.log(`Type: ${publication.type}`);
      console.log(`Year: ${publication.year}`);
      console.log(`Venue: ${publication.venue}`);
      console.log(`DOI: ${publication.doi}`);
      console.log(
        `Authors: ${publication.authors.join(", ")}`
      );

      console.log(
        chalk.cyan("----------------------------------------")
      );
    });
  }

  await pressEnterToContinue();
}

// ========================================
// ADD PUBLICATION
// ========================================

async function addPublication({
  publications,
  faculty,
  askQuestion,
  pressEnterToContinue,
  savePublicationData,
}) {
  console.log(
    chalk.cyan("\n========================================")
  );

  console.log(
    chalk.bold.cyan("           Add Publication")
  );

  console.log(
    chalk.cyan("========================================")
  );

  const title = await askQuestion(
    chalk.yellow("Enter title: ")
  );

  // Show available faculty

  console.log(
    chalk.bold.cyan("\nAvailable Faculty:")
  );

  faculty.forEach((member) => {
    console.log(
      chalk.green(
        `${member.id}. ${member.name}`
      )
    );
  });

  const facultyInput = await askQuestion(
    chalk.yellow(
      "Enter faculty IDs separated by commas: "
    )
  );

  // Convert faculty IDs into an array

  const facultyIds = facultyInput
    .split(",")
    .map((id) => Number(id.trim()));

  // Check if all faculty exist

  const facultyExists = facultyIds.every(
    (facultyId) =>
      faculty.some(
        (member) => member.id === facultyId
      )
  );

  if (!facultyExists) {
    console.log(
      chalk.red(
        "\nOne or more faculty members not found."
      )
    );

    await pressEnterToContinue();
    return;
  }

  const type = await askQuestion(
    chalk.yellow(
      "Enter type (Journal / Conference): "
    )
  );

  const year = Number(
    await askQuestion(
      chalk.yellow("Enter year: ")
    )
  );

  const venue = await askQuestion(
    chalk.yellow("Enter venue: ")
  );

  const doi = await askQuestion(
    chalk.yellow("Enter DOI: ")
  );

  const authorsInput = await askQuestion(
    chalk.yellow(
      "Enter authors (separated by commas): "
    )
  );

  // Generate new publication ID

  let newId = 1;

  if (publications.length > 0) {
    newId =
      publications[
        publications.length - 1
      ].id + 1;
  }

  // Convert authors into an array

  const authors = authorsInput
    .split(",")
    .map((author) => author.trim());

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

  publications.push(newPublication);

  // Save changes to JSON file

  savePublicationData();

  console.log(
    chalk.green(
      "\nPublication added successfully!"
    )
  );

  console.log(
    chalk.green(
      `Generated Publication ID: ${newId}`
    )
  );

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
    console.log(
      chalk.cyan(
        "\n========================================"
      )
    );

    console.log(
      chalk.bold.cyan(
        "        Publication Management"
      )
    );

    console.log(
      chalk.cyan(
        "========================================"
      )
    );

    console.log(
      chalk.green("1. Show Publications")
    );

    console.log(
      chalk.green("2. Add Publication")
    );

    console.log(
      chalk.red("3. Back to Main Menu")
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
        console.log(
          chalk.red("\nInvalid choice.")
        );
    }
  }
}

module.exports = {
  publicationManagement,
  showPublications,
};

// showPublications is separately exported because it is used in search/filter