// ========================================
// SEARCH / FILTER
// ========================================

const chalk = require("chalk");

// ========================================
// DISPLAY SEARCH RESULTS
// ========================================

function displayPublicationResults({
  results,
  faculty,
}) {
  console.log(
    chalk.cyan("\n========================================")
  );

  console.log(
    chalk.bold.cyan("          Search Results")
  );

  console.log(
    chalk.cyan("========================================")
  );

  if (results.length === 0) {
    console.log(
      chalk.yellow("No publications found.")
    );
  } else {
    results.forEach((publication, index) => {
      const facultyMembers = faculty.filter(
        (member) =>
          publication.facultyIds.includes(member.id)
      );

      console.log(
        chalk.bold(
          `${index + 1}. ${publication.title}`
        )
      );

      console.log(
        `   Faculty: ${
          facultyMembers.length > 0
            ? facultyMembers
                .map((member) => member.name)
                .join(", ")
            : "Unknown"
        }`
      );

      console.log(
        `   Year: ${publication.year}`
      );

      console.log(
        `   Type: ${publication.type}`
      );

      console.log(
        `   Venue: ${publication.venue}`
      );

      console.log(
        chalk.cyan(
          "----------------------------------------"
        )
      );
    });
  }
}

// ========================================
// SEARCH BY FACULTY
// ========================================

async function searchByFaculty({
  faculty,
  publications,
  askQuestion,
  pressEnterToContinue,
}) {
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

  const facultyId = Number(
    await askQuestion(
      chalk.yellow("\nEnter faculty ID: ")
    )
  );

  const results = publications.filter(
    (publication) =>
      publication.facultyIds.includes(facultyId)
  );

  displayPublicationResults({
    results,
    faculty,
  });

  await pressEnterToContinue();
}

// ========================================
// FILTER BY YEAR
// ========================================

async function filterByYear({
  faculty,
  publications,
  askQuestion,
  pressEnterToContinue,
}) {
  const year = Number(
    await askQuestion(
      chalk.yellow("Enter year: ")
    )
  );

  if (isNaN(year)) {
    console.log(
      chalk.red(
        "\nPlease enter a valid year."
      )
    );

    await pressEnterToContinue();
    return;
  }

  const results = publications.filter(
    (publication) =>
      publication.year === year
  );

  displayPublicationResults({
    results,
    faculty,
  });

  await pressEnterToContinue();
}

// ========================================
// FILTER BY YEAR RANGE
// ========================================

async function filterByYearRange({
  faculty,
  publications,
  askQuestion,
  pressEnterToContinue,
}) {
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
    isNaN(startYear) ||
    isNaN(endYear)
  ) {
    console.log(
      chalk.red(
        "\nPlease enter valid years."
      )
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

  const results = publications.filter(
    (publication) =>
      publication.year >= startYear &&
      publication.year <= endYear
  );

  displayPublicationResults({
    results,
    faculty,
  });

  await pressEnterToContinue();
}

// ========================================
// FILTER BY PUBLICATION TYPE
// ========================================

async function filterByType({
  faculty,
  publications,
  askQuestion,
  pressEnterToContinue,
}) {
  const type = await askQuestion(
    chalk.yellow(
      "Enter type (Journal / Conference): "
    )
  );

  const results = publications.filter(
    (publication) =>
      publication.type.toLowerCase() ===
      type.toLowerCase()
  );

  displayPublicationResults({
    results,
    faculty,
  });

  await pressEnterToContinue();
}

// ========================================
// SEARCH BY PUBLICATION TITLE
// ========================================

async function searchByTitle({
  faculty,
  publications,
  askQuestion,
  pressEnterToContinue,
}) {
  const title = await askQuestion(
    chalk.yellow(
      "Enter title to search: "
    )
  );

  const results = publications.filter(
    (publication) =>
      publication.title
        .toLowerCase()
        .includes(title.toLowerCase())
  );

  displayPublicationResults({
    results,
    faculty,
  });

  await pressEnterToContinue();
}

// ========================================
// SEARCH / FILTER MENU
// ========================================

async function searchFilterMenu({
  faculty,
  publications,
  askQuestion,
  pressEnterToContinue,
  showPublications,
}) {
  while (true) {
    console.log(
      chalk.cyan(
        "\n========================================"
      )
    );

    console.log(
      chalk.bold.cyan(
        "          Search / Filter"
      )
    );

    console.log(
      chalk.cyan(
        "========================================"
      )
    );

    console.log(
      chalk.green("1. Search by Faculty")
    );

    console.log(
      chalk.green("2. Filter by Year")
    );

    console.log(
      chalk.green("3. Filter by Year Range")
    );

    console.log(
      chalk.green(
        "4. Filter by Publication Type"
      )
    );

    console.log(
      chalk.green(
        "5. Search by Publication Title"
      )
    );

    console.log(
      chalk.green(
        "6. Show All Publications"
      )
    );

    console.log(
      chalk.red(
        "7. Back to Main Menu"
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
        await searchByFaculty({
          faculty,
          publications,
          askQuestion,
          pressEnterToContinue,
        });
        break;

      case "2":
        await filterByYear({
          faculty,
          publications,
          askQuestion,
          pressEnterToContinue,
        });
        break;

      case "3":
        await filterByYearRange({
          faculty,
          publications,
          askQuestion,
          pressEnterToContinue,
        });
        break;

      case "4":
        await filterByType({
          faculty,
          publications,
          askQuestion,
          pressEnterToContinue,
        });
        break;

      case "5":
        await searchByTitle({
          faculty,
          publications,
          askQuestion,
          pressEnterToContinue,
        });
        break;

      case "6":
        await showPublications({
          publications,
          pressEnterToContinue,
        });
        break;

      case "7":
        return;

      default:
        console.log(
          chalk.red("\nInvalid choice.")
        );
    }
  }
}

module.exports = searchFilterMenu;