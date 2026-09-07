// ========================================
// FACULTY MANAGEMENT
// ========================================

// SHOW FACULTY

async function showFaculty({ faculty, pressEnterToContinue }) {
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

async function addFaculty({
  faculty,
  askQuestion,
  pressEnterToContinue,
  saveFacultyData,
}) {
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
    email: email,
  };

  faculty.push(newFaculty);

  // Save changes to JSON file

  saveFacultyData();

  console.log("\nFaculty added successfully!");
  console.log(`Generated Faculty ID: ${newId}`);

  await pressEnterToContinue();
}


// UPDATE FACULTY

async function updateFaculty({
  faculty,
  askQuestion,
  pressEnterToContinue,
  saveFacultyData,
}) {
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

async function facultyManagement({
  faculty,
  askQuestion,
  pressEnterToContinue,
  saveFacultyData,
}) {
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
        console.log("\nInvalid choice.");
    }
  }
}

module.exports = facultyManagement;
