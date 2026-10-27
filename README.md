# Turkish Patch Platform

A web platform for discovering, reviewing, and managing Turkish language patches for PC games. Built with Node.js, Express, and MongoDB, the project provides a centralized database for storing and sharing patch information.

## Features

- **Patch Listing:** Browse game descriptions, translators, versions, and supported platforms.
- **Admin Panel:** Add, edit, and delete patches through a dedicated management interface.
- **MongoDB Integration:** Store patch data persistently in a centralized database.
- **Patch Details:** Display translator information, translation progress, download links, and images.
- **Comment System:** Allow users to share feedback on individual patches.
- **Rating System:** Let users rate available patches.
- **Download Tracking:** Record the number of downloads for each patch.
- **REST API:** Provide communication between the frontend and backend.

## Tech Stack

- HTML5
- CSS3
- JavaScript
- Node.js
- Express.js
- MongoDB
- Mongoose
- dotenv
- Nodemon

## Installation

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Git (optional)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd turkce-yama-platform
```

Alternatively, download the repository as a ZIP file from GitHub and extract it.

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy `.env.example` to a new file named `.env`.

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Configure the environment variables in your `.env` file:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/turkce_yama
ADMIN_USER=admin
ADMIN_PASSWORD=your_strong_unique_password
```

- `PORT`: The port used by the Express server.
- `MONGO_URI`: Your MongoDB connection string.
- `ADMIN_USER`: The administrator username.
- `ADMIN_PASSWORD`: The administrator password.

If you use a local MongoDB instance, ensure the MongoDB service is running. If you use MongoDB Atlas, replace the connection string with your Atlas URI.

**Security:** Use a strong, unique administrator password. Never commit your `.env` file or expose your credentials publicly.

### 4. Start the Server

Development mode:

```bash
npm run dev
```

Production-style startup:

```bash
npm start
```

Once the server starts and connects to MongoDB, open:

**http://localhost:5000**

Do not open `index.html` directly in your browser. The application requires the Node.js server to handle API requests.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/test` | Check API connectivity |
| `GET` | `/api/translations` | Retrieve all patches |
| `GET` | `/api/translations/:id` | Retrieve a specific patch |
| `POST` | `/api/translations` | Create a new patch |
| `PUT` | `/api/translations/:id` | Update an existing patch |
| `DELETE` | `/api/translations/:id` | Delete a patch |
| `POST` | `/api/translations/:id/comments` | Add a comment |
| `POST` | `/api/translations/:id/rate` | Submit a patch rating |
| `POST` | `/api/translations/:id/download` | Increment the download count |

Administrative operations are subject to server-side authorization checks.

## Project Structure

```text
turkce-yama-platform/
├── middleware/
│   └── adminAuth.js
├── models/
│   └── Translation.js
├── routes/
│   ├── admin.js
│   └── translations.js
├── public/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── app.js
│   │   ├── admin.js
│   │   ├── data.js
│   │   └── bg-lines.js
│   ├── admin.html
│   └── index.html
├── .env.example
├── .gitignore
├── package.json
└── server.js
```

### Key Files

- `server.js` — Initializes the Express server and connects to MongoDB.
- `models/Translation.js` — Defines the Mongoose schema for patch data.
- `routes/translations.js` — Handles patch-related API endpoints.
- `routes/admin.js` — Manages administrative routes.
- `middleware/adminAuth.js` — Handles administrator authorization.
- `public/` — Contains frontend pages, stylesheets, and JavaScript files.

## Deployment

To deploy the platform, you need a hosting provider that supports Node.js and an accessible MongoDB database.

A possible deployment setup:

- **Hosting:** [Render](https://render.com/) or another Node.js hosting provider.
- **Database:** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
- **Version Control:** [GitHub](https://github.com/).

Configure the required environment variables in your hosting provider's dashboard. Before deployment, verify the administrator authentication system, protect sensitive credentials, and ensure that production settings are configured securely.

## Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a new branch for your changes.
3. Implement and test your changes.
4. Submit a pull request.

## License

No license has been specified yet. Until a license is added to the repository, reuse and redistribution permissions are not explicitly granted.
