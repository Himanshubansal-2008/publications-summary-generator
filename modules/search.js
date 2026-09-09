// ========================================
// SEARCH / FILTER
// ========================================


// DISPLAY SEARCH RESULTS

function displayPublicationResults({
  results,
  faculty,
}) {
  console.log("\n========================================");
  console.log("          Search Results");
  console.log("========================================");

  if (results.length === 0) {
    console.log("No publications found.");
  } else {
    results.forEach((publication, index) => {
      const facultyMembers = faculty.filter(
        (member) => publication.facultyIds.includes(member.id)
      );

      console.log(`${index + 1}. ${publication.title}`);

      console.log(
        `   Faculty: ${
          facultyMembers.length > 0
            ? facultyMembers.map((member) => member.name).join(", ")
            : "Unknown"
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

async function searchByFaculty({
  faculty,
  publications,
  askQuestion,
  pressEnterToContinue,
}) {
  console.log("\nAvailable Faculty:");

  faculty.forEach((member) => {
    console.log(`${member.id}. ${member.name}`);
  });

  const facultyId = Number(
    await askQuestion("\nEnter faculty ID: ")
  );

  const results = publications.filter(
    (publication) => publication.facultyIds.includes(facultyId)
  );

  displayPublicationResults({
    results,
    faculty,
  });

  await pressEnterToContinue();
}


// FILTER BY YEAR

async function filterByYear({
  faculty,
  publications,
  askQuestion,
  pressEnterToContinue,
}) {
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

  displayPublicationResults({
    results,
    faculty,
  });

  await pressEnterToContinue();
}


// FILTER BY YEAR RANGE

async function filterByYearRange({
  faculty,
  publications,
  askQuestion,
  pressEnterToContinue,
}) {
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

  displayPublicationResults({
    results,
    faculty,
  });

  await pressEnterToContinue();
}


// FILTER BY PUBLICATION TYPE

async function filterByType({
  faculty,
  publications,
  askQuestion,
  pressEnterToContinue,
}) {
  const type = await askQuestion(
    "Enter type (Journal / Conference): "
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


// SEARCH BY PUBLICATION TITLE

async function searchByTitle({
  faculty,
  publications,
  askQuestion,
  pressEnterToContinue,
}) {
  const title = await askQuestion(
    "Enter title to search: "
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


// SEARCH / FILTER MENU

async function searchFilterMenu({
  faculty,
  publications,
  askQuestion,
  pressEnterToContinue,
  showPublications,
}) {
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
        console.log("\nInvalid choice.");
    }
  }
}

module.exports = searchFilterMenu;