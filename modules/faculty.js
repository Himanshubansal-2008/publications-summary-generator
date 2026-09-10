// ========================================
// FACULTY MANAGEMENT
// ========================================

const chalk = require("chalk");

// ========================================
// SHOW FACULTY
// ========================================

async function showFaculty({ faculty, pressEnterToContinue }) {
  console.log(
    chalk.cyan("\n========================================")
  );
  console.log(
    chalk.bold.cyan("           Faculty Members")
  );
  console.log(
    chalk.cyan("========================================")
  );

  if (faculty.length === 0) {
    console.log(
      chalk.yellow("No faculty members found.")
    );
  } else {
    faculty.forEach((member) => {
      console.log(`ID: ${member.id}`);
      console.log(`Name: ${member.name}`);
      console.log(`Department: ${member.department}`);
      console.log(`Designation: ${member.designation}`);
      console.log(`Email: ${member.email}`);

      console.log(
        chalk.cyan("----------------------------------------")
      );
    });
  }

  await pressEnterToContinue();
}

// ========================================
// ADD FACULTY
// ========================================

async function addFaculty({
  faculty,
  askQuestion,
  pressEnterToContinue,
  saveFacultyData,
}) {
  console.log(
    chalk.cyan("\n========================================")
  );
  console.log(
    chalk.bold.cyan("             Add Faculty")
  );
  console.log(
    chalk.cyan("========================================")
  );

  const name = await askQuestion(
    chalk.yellow("Enter name: ")
  );

  const department = await askQuestion(
    chalk.yellow("Enter department: ")
  );

  const designation = await askQuestion(
    chalk.yellow("Enter designation: ")
  );

  const email = await askQuestion(
    chalk.yellow("Enter email: ")
  );

  // Generate new ID

  let newId = 1;

  if (faculty.length > 0) {
    newId =
      faculty[faculty.length - 1].id + 1;
  }

  const newFaculty = {
    id: newId,
    name: name,
    department: department,
    designation: designation,
    email: email,
  };

  faculty.push(newFaculty);

  // Save changes to JSON file

  saveFacultyData();

  console.log(
    chalk.green(
      "\nFaculty added successfully!"
    )
  );

  console.log(
    chalk.green(
      `Generated Faculty ID: ${newId}`
    )
  );

  await pressEnterToContinue();
}

// ========================================
// UPDATE FACULTY
// ========================================

async function updateFaculty({
  faculty,
  askQuestion,
  pressEnterToContinue,
  saveFacultyData,
}) {
  console.log(
    chalk.cyan("\n========================================")
  );
  console.log(
    chalk.bold.cyan("            Update Faculty")
  );
  console.log(
    chalk.cyan("========================================")
  );

  // Show available faculty IDs

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
      chalk.yellow(
        "\nEnter faculty ID to update: "
      )
    )
  );

  // Find faculty using ID

  const facultyMember = faculty.find(
    (member) => member.id === facultyId
  );

  // Check if faculty exists

  if (!facultyMember) {
    console.log(
      chalk.red("\nFaculty not found.")
    );

    await pressEnterToContinue();
    return;
  }

  // Display current details

  console.log(
    chalk.bold.cyan(
      "\nCurrent Faculty Details"
    )
  );

  console.log(
    chalk.cyan("----------------------------------------")
  );

  console.log(`Name: ${facultyMember.name}`);
  console.log(
    `Department: ${facultyMember.department}`
  );
  console.log(
    `Designation: ${facultyMember.designation}`
  );
  console.log(
    `Email: ${facultyMember.email}`
  );

  // Get updated information

  const name = await askQuestion(
    chalk.yellow("\nEnter new name: ")
  );

  const department = await askQuestion(
    chalk.yellow("Enter new department: ")
  );

  const designation = await askQuestion(
    chalk.yellow("Enter new designation: ")
  );

  const email = await askQuestion(
    chalk.yellow("Enter new email: ")
  );

  // Update faculty object

  facultyMember.name = name;
  facultyMember.department = department;
  facultyMember.designation = designation;
  facultyMember.email = email;

  // Save updated data

  saveFacultyData();

  console.log(
    chalk.green(
      "\nFaculty updated successfully!"
    )
  );

  await pressEnterToContinue();
}

// ========================================
// FACULTY MANAGEMENT MENU
// ========================================

async function facultyManagement({
  faculty,
  askQuestion,
  pressEnterToContinue,
  saveFacultyData,
}) {
  while (true) {
    console.log(
      chalk.cyan(
        "\n========================================"
      )
    );

    console.log(
      chalk.bold.cyan(
        "          Faculty Management"
      )
    );

    console.log(
      chalk.cyan(
        "========================================"
      )
    );

    console.log(
      chalk.green("1. Show Faculty")
    );

    console.log(
      chalk.green("2. Add Faculty")
    );

    console.log(
      chalk.green("3. Update Faculty")
    );

    console.log(
      chalk.red("4. Back to Main Menu")
    );

    console.log(
      chalk.cyan(
        "========================================"
      )
    );

    const choice = await askQuestion(
      chalk.yellow("Enter your choice: ")
    );

    switch (choice) {
      case "1":
        await showFaculty({
          faculty,
          pressEnterToContinue,
        });
        break;

      case "2":
        await addFaculty({
          faculty,
          askQuestion,
          pressEnterToContinue,
          saveFacultyData,
        });
        break;

      case "3":
        await updateFaculty({
          faculty,
          askQuestion,
          pressEnterToContinue,
          saveFacultyData,
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

module.exports = facultyManagement;