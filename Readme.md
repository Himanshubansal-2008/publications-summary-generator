# Publications Summary Generator

A beginner-friendly Node.js terminal application for managing faculty publication records and generating publication summaries for faculty profile building.

## Overview

The Publications Summary Generator helps manage faculty and publication information through a simple command-line application.

### Features

- Faculty management
- Publication management
- Multiple faculty members per publication
- Search and filtering
- Year-wise publication summaries
- Custom duration summaries
- Excel import
- BibTeX import
- Excel export
- Word export
- JSON-based data storage

## Multiple Faculty Support

A publication can be associated with multiple faculty members using `facultyIds`.

Example:

```json
{
  "id": 1,
  "title": "Research Paper",
  "facultyIds": [1, 3, 5],
  "type": "Journal",
  "year": 2024,
  "venue": "International Journal",
  "doi": "10.xxxx/example",
  "authors": [
    "Dr. Rajesh Kumar",
    "Dr. Priya Sharma",
    "Dr. Amit Verma"
  ]
}
```

This allows the same publication to appear in the records, searches, summaries, and exports of all associated faculty members.

## Faculty Management

The application allows you to:

- View faculty members
- Add faculty members
- Update faculty information

Faculty records contain:

- Faculty ID
- Name
- Department
- Designation
- Email

## Publication Management

The application allows you to:

- View publications
- Add publications
- Associate publications with one or more faculty members
- Store publication title, type, year, venue, DOI, and authors

Supported publication types:

- Journal
- Conference

## Search and Filtering

Publications can be searched or filtered by:

- Faculty
- Title
- Year
- Year range
- Publication type

## Publication Summary

The application generates:

- Faculty-wise publication summaries
- Year-wise publication summaries
- Custom duration summaries

These summaries can be used for faculty profiles and academic reporting.

## Import

The application supports importing faculty and publication data.

### Excel Import

Faculty can be imported from an Excel file.

Expected columns:

| Column | Required |
|---|---|
| Name | Yes |
| Department | No |
| Designation | No |
| Email | No |

Example:

| Name | Department | Designation | Email |
|---|---|---|---|
| Dr. Rajesh Kumar | Computer Science | Professor | rajesh@example.com |
| Dr. Priya Sharma | Computer Science | Associate Professor | priya@example.com |

### How to Import Excel

1. Start the application.
2. Select `6. Import`.
3. Select `1. Import Faculty from Excel`.
4. Open Finder and locate your Excel file.
5. Drag the Excel file into the Terminal to insert its path.
6. Press Enter.

The imported records are saved to `faculty.json`.

### BibTeX Import

Publication records can be imported from a `.bib` file.

Example:

```bibtex
@article{Kumar2024AI,
  author = {Rajesh Kumar and Priya Sharma},
  title = {Artificial Intelligence Approaches for Smart Education},
  journal = {International Journal of Educational Technology},
  year = {2024},
  doi = {10.1234/example.2024.001}
}
```

### How to Import BibTeX

1. Start the application.
2. Select `6. Import`.
3. Select `2. Import Publications from BibTeX`.
4. Open Finder and locate the `.bib` file.
5. Drag the file into the Terminal to insert its path.
6. Press Enter.

The application extracts authors, title, year, publication type, venue, and DOI. Matching faculty members are associated with the publication.

## Export

The application supports Excel and Word report generation.

### Excel Export

Excel reports contain publication information such as:

- Publication ID
- Title
- Faculty
- Type
- Year
- Venue
- DOI
- Authors

### Word Export

Word reports can be generated for faculty publication records and used for academic reporting and faculty profiles.

Generated reports are stored in the `reports/` folder.

## Data Storage

The current version uses JSON files instead of a database.

```text
faculty.json
publications.json
```

`faculty.json` stores faculty records.

`publications.json` stores publication records.

Publication records use `facultyIds` so that one publication can belong to multiple faculty members.

## Project Structure

```text
publications-summary-generator/
│
├── app.js
├── faculty.json
├── publications.json
├── package.json
├── package-lock.json
├── README.md
│
├── modules/
│   ├── faculty.js
│   ├── publications.js
│   ├── search.js
│   ├── summary.js
│   ├── export.js
│   └── import.js
│
└── reports/
```

### Modules

- `app.js` — Main application and menu
- `faculty.js` — Faculty management
- `publications.js` — Publication management
- `search.js` — Search and filtering
- `summary.js` — Publication summaries
- `export.js` — Excel and Word exports
- `import.js` — Excel and BibTeX imports

## Technologies Used

- Node.js
- JavaScript
- JSON
- `fs`
- `readline`
- `xlsx`
- `bibtex-parse-js`
- `docx`

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Himanshubansal-2008/publications-summary-generator.git
```

### 2. Open the project

```bash
cd publications-summary-generator
```

### 3. Install dependencies

```bash
npm install
```

### 4. Run the application

```bash
node app.js
```

## Main Menu

After starting the application:

```text
========================================
   Publications Summary Generator
========================================
1. Faculty Management
2. Publication Management
3. Search / Filter
4. Publication Summary
5. Export
6. Import
7. Exit
========================================
```

Enter the number of the required option.

## Example Workflow

```text
Start Application
       ↓
Add / Import Faculty
       ↓
Add / Import Publications
       ↓
Search / Filter
       ↓
Generate Summary
       ↓
Export Report
       ↓
Excel / Word
```

## Using the Project on Another Computer

Anyone can clone and run the project with:

```bash
git clone https://github.com/Himanshubansal-2008/publications-summary-generator.git
cd publications-summary-generator
npm install
node app.js
```

No database setup is required for the current version because the application uses the included JSON files.

For importing new data, the user can provide their own Excel or BibTeX file path when prompted. On macOS, the file can be dragged from Finder into Terminal to enter its full path automatically.

## Backup

The main data is stored in:

```text
faculty.json
publications.json
```
