# Ashesi Hub Express

**Ashesi Hub Express** is a backend service developed using **Express.js**. It serves as the core API for the **Ashesi Hub** project management platform, facilitating functionalities such as project tracking, volunteer coordination, and user management.

## 📁 Project Structure

The repository is organized as follows:

- `controllers/` – Handles the logic for various endpoints.
- `routes/` – Defines the API routes and associates them with controller functions.
- `repositories/` – Manages data access and interactions with the database.
- `views/` – Contains Handlebars templates for server-side rendering.
- `public/` – Serves static assets like CSS and images.
- `rules/` – Contains validation rules and middleware.
- `bin/` – Includes scripts for starting the application.
- `app.js` – The main application file that initializes the Express app.
- `Dockerfile` – Configuration for containerizing the application.
- `package.json` – Lists project dependencies and scripts.

## 🚀 Features

- **User Management**: Register and authenticate users securely.
- **Project Tracking**: Create, update, and monitor projects and their progress.
- **Server-Side Rendering**: Utilizes Handlebars for dynamic HTML generation.
- **API Endpoints**: Provides RESTful APIs for frontend integration.

## 🛠️ Technologies Used

- **Node.js** – JavaScript runtime environment
- **Express.js** – Web framework for Node.js
- **Handlebars** – Templating engine for server-side rendering
- **Docker** – Containerization platform
- **CSS** – Styling for frontend components
- **ElasticSearch** - For full text search and aggregations

   ```

   The server should now be running at `http://localhost:3000`.

## 🐳 Docker Deployment

To run the application using Docker:

1. **Build the Docker image**:

   ```bash
   docker build -t ashesi-hub-express .
   ```

2. **Run the Docker container**:

   ```bash
   docker run -p 3000:3000 ashesi-hub-express
   ```

## 📬 Contact

For questions, suggestions, or collaboration inquiries, please contact:  
**Delanyo Aborchie** – [GitHub Profile](https://github.com/Delanyo32)

---
