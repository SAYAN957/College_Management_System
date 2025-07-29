# College-Erp Documentation

## Overview

College-Erp is designed to streamline college administration processes by providing a centralized platform for managing students, faculty, departments, and other essential functions. The system is built using a modern web architecture, with a React frontend and a Node.js backend.

## Architecture

The application follows a three-tier architecture:

1.  **Presentation Tier (Frontend):** The React frontend handles user interactions, displays data, and communicates with the backend API.
2.  **Application Tier (Backend):** The Node.js backend processes requests from the frontend, interacts with the database, and enforces business logic.
3.  **Data Tier (Database):** The database stores all persistent data, including student records, faculty information, department details, and more.

## Key Components

### Frontend (client/)

*   **Components:** Reusable UI elements that make up the application's user interface.
*   **Redux:** A state management library used to manage the application's data flow.
*   **API:** Functions for making requests to the backend API.

### Backend (server/)

*   **Models:** Data models that define the structure of the data stored in the database.
*   **Controllers:** Functions that handle incoming requests and interact with the models.
*   **Routes:** Definitions of the API endpoints and the corresponding controller functions.
*   **Middleware:** Functions that handle authentication, authorization, and other request processing tasks.

## Data Models

The application uses the following data models:

*   **Student:** Represents a student in the college.
*   **Faculty:** Represents a faculty member in the college.
*   **Department:** Represents a department in the college.
*   **Subject:** Represents a subject offered by the college.
*   **Notice:** Represents a notice published by the college.
*   **Attendance:** Represents student attendance records.
*   **Marks:** Represents student marks in various subjects.
*   **Test:** Represents tests conducted by faculty.

