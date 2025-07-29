# 🎓 College-Erp: A Comprehensive College Management System

A full-stack web application designed to streamline and automate college administration, faculty operations, and student engagement. College-Erp serves as a centralized platform to manage student records, faculty information, course materials, attendance, assessments, and more — with a secure and responsive interface for Admins, Faculty, and Students.

---

## 🚀 Tech Stack

### 🖥️ Frontend

- **React** – UI development
- **Redux** – Global state management
- **React Router** – Client-side routing
- **Material UI (MUI)** – Pre-built, accessible components
- **Tailwind CSS + Tailwind Scrollbar** – Custom styling and modern layout
- **Axios** – API request handler
- **Moment.js** – Date formatting
- **jwt-decode** – Token decoding
- **react-file-base64**, **react-loader-spinner**, **react-spinners** – File input & loaders

### ⚙️ Backend

- **Node.js** – JavaScript runtime
- **Express.js** – Web framework
- **MongoDB + Mongoose** – NoSQL database with schema-based modeling
- **bcryptjs** – Password hashing
- **jsonwebtoken** – Secure authentication via JWT
- **dotenv** – Environment variable management
- **cors**, **nodemon** – Middleware & auto-restart dev utility

---

## 📦 Project Setup

### 🔧 Frontend

```bash
cd client
npm install
npm start
Visit the app on http://localhost:3000

🛠️ Backend
bash
cd server
npm install
Create a .env file in the server/ directory with the following:
CONNECTION_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/your-db
Then start the server:

bash
npm start
Server runs on http://localhost:5001

## 🧩 Key Features

### 👑 Admin Dashboard

* Manage Admins, Departments, Faculty, Students, and Subjects
* Create and manage Notices
* Assign subjects to faculty
* Update Profile and Password

### 👨‍🏫 Faculty Dashboard

* Create Tests
* Mark Attendance
* Upload Marks
* View & Edit Profile

### 👨‍🎓 Student Dashboard

* View Attendance, Subjects, and Test Results
* Update Profile and Password

### 🔐 Security

* **Authentication:** JWT-based login for all roles
* **Authorization:** Role-based access control

### 📱 Responsive Design

* Fully responsive interface built with Tailwind CSS and MUI

---

## 🔌 API Endpoints

### 👑 Admin Routes

```
POST    /api/admin/login
POST    /api/admin/register
POST    /api/admin/addFaculty
POST    /api/admin/addStudent
POST    /api/admin/addSubject
POST    /api/admin/createNotice
GET     /api/admin/getFaculty
GET     /api/admin/getStudent
GET     /api/admin/getSubject
PUT     /api/admin/updateProfile/:id
PUT     /api/admin/updatePassword/:id
DELETE  /api/admin/deleteAdmin/:id
DELETE  /api/admin/deleteFaculty/:id
DELETE  /api/admin/deleteStudent/:id
DELETE  /api/admin/deleteSubject/:id
```

### 👨‍🏫 Faculty Routes

```
POST    /api/faculty/login
POST    /api/faculty/register
POST    /api/faculty/createTest
POST    /api/faculty/markAttendance
POST    /api/faculty/uploadMarks
PUT     /api/faculty/updateProfile/:id
PUT     /api/faculty/updatePassword/:id
```

### 👨‍🎓 Student Routes

```
POST    /api/student/login
POST    /api/student/register
GET     /api/student/attendance
GET     /api/student/subjects
GET     /api/student/testResults
PUT     /api/student/updateProfile/:id
PUT     /api/student/updatePassword/:id
```

---

## 🧠 Data Models

* **Admin** – System administrator
* **Faculty** – Professors and teaching staff
* **Student** – Enrolled users
* **Subject** – Course-related information
* **Department** – Academic departments
* **Notice** – Admin-generated announcements
* **Attendance** – Student attendance records
* **Marks** – Uploaded test marks
* **Test** – Exams or assessments
* **FacultySubject** – Subject assignments for faculty

---

## 🤝 Contributing

Want to contribute? You're welcome!

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

---

## 🌐 Live Demo (Optional)

Add your deployed link here if hosted:

```
https://your-live-site-url.com
```

---

## ✨ Acknowledgements

Thanks to the open-source tools and libraries that made this project possible.

---

```


