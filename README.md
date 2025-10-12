# **Project Management Dashboard (Vue 3 & Kanban)**

This project is a single-page application designed for basic project and task management, utilizing a dual view: a feature-rich data grid for project listings and a flexible Kanban board for task tracking.

## **🚀 Technologies Used**

The application is built using modern front-end technologies and tooling:

- **Frontend Framework:** **Vue 3** (with Composition API and \<script setup\>)
- **Language:** **TypeScript**
- **State Management:** **Pinia**
- **Routing:** **Vue Router**
- **Data Grid:** **AG Grid Vue 3** (Used for the main project listing table)
- **Drag & Drop:** **VueDraggable** (Used for task movement on the Kanban board)
- **Notifications:** **vue3-toastify**
- **Styling:** SCSS
- **Mock API:** **JSON Server** (Used for local data persistence and serving mock API endpoints)

## **🛠️ Setup and Running the Project**

Follow these steps to get the environment running locally.

### **Prerequisites**

You need **Node.js** (which includes npm/npx) installed on your system.

### **1\. Clone the repository**

`git clone \<repository-url\>`  
`cd \<project-directory\>`

### **2\. Install Dependencies**

Install all necessary node modules for the front-end application and the mock server:

`npm install`

### **3\. Start the Development Environment**

For local development with hot reloading, you must run the API and the dev server in separate terminals.

**Terminal 1 (Mock API Server):**

`npm run serve:api`

**Terminal 2 (Frontend Dev Server):**

`npm run dev`

The development application is typically accessible at http://localhost:5173/.

### **4\. Running the Production Preview**

To test the final compiled build, use the combined preview command. This requires running a build step first.

**Step A: Build the project**

`npm run build`

**Step B: Run the Combined Preview**  
This command simultaneously starts the Mock API server (serve:api) and serves the production build (serve:app), making it ready for final testing.

`npm run preview`

## **📝 Developer Notes & Design Decisions**

This section outlines key implementation decisions and constraints of the current version:

### **1\. Data Grid Functionality**

The main project listing page utilizes **AG Grid** to provide enhanced table features that go beyond a standard HTML table:

- **Resizable Columns:** All columns can be manually resized by the user.
- **Sorting:** Advanced sorting is available on every column by clicking the header.
- **Filtering:** Additional built-in filtering tools are available for each column, on top of the global quick search bar.

### **2\. Task Deadline Constraint**

Due to the decision to keep the project light and avoid external dependencies for complex UI elements, the task creation modal does not include a calendar component.

- **Default Deadline:** All new tasks are created with a fixed deadline set to **one week** from the creation date.

### **3\. Basic Kanban Implementation**

The Kanban board functionality is designed to be foundational, primarily focusing on drag-and-drop movement and status updates between the three columns (To Do, In Progress, Done). The implementation was based on established references to ensure basic Kanban principles are met.
