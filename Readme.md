# Publications Summary Generator for Faculty Members Profile Building

A beginner-friendly **Terminal/CLI application** for managing faculty publication records and generating publication summaries for academic profiles and submissions.

---

## Problem Statement

Faculty members often need publication records for academic profiles, institutional submissions, and accreditation purposes.

The proposed solution aims to simplify the process of managing publication records and generating summaries based on:

* Faculty member
* Publication year
* Publication type
* Custom time duration

The original problem statement also proposes collecting publication records from academic databases such as Google Scholar and DBLP, along with Excel-based input and exportable reports.

For this project, the focus is on building a simple **CLI-based application** for managing publication records and generating useful summaries.

---

## Technologies Used

* **Node.js**
* **JavaScript**
* **Terminal / CLI**
* **PostgreSQL**

---

## Main Features

### Faculty Management

* Add faculty members
* View faculty members
* Update faculty information
* Delete faculty members

### Publication Management

* Add publication records
* View publication records
* Store publication details such as title, authors, year, type, venue, and DOI

### Search & Filtering

* Search publications by faculty
* Filter publications by year
* Filter by publication type
* Search publications by title
* Filter publications within a specific duration

### Publication Summary

* Generate year-wise publication summaries
* Separate journal and conference publications
* Generate customized publication summaries for a specific duration
* Calculate total publications

### Additional Features

- Duplicate publication detection
- Data quality checking
- Research trend analysis
- Sort publications

### Export

* Export publication summaries for further use
* Additional export formats will be added based on implementation progress

---

## Database

The application uses **PostgreSQL** for storing faculty and publication records.

---

## Project Goal

The goal of this project is to build a simple CLI application that helps faculty members organize publication records and generate useful publication summaries for academic profile building and submissions.

```text
Faculty & Publications
          ↓
    Search / Filter
          ↓
   Generate Summary
          ↓
        Export
```

---

## Future Improvements

Possible future improvements include:

* Excel file input
* Integration with academic databases such as Google Scholar and DBLP
* Additional export formats
* Improved publication data handling

---

## Status

**🚧 Currently in Development**

