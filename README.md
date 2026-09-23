ChatFlow 💬

A full-stack real-time chat application built with React, Node.js, Express.js, PostgreSQL, Prisma, Socket.IO, and JWT authentication.

ChatFlow supports authenticated users, private one-to-one conversations, real-time messaging, and persistent message storage in PostgreSQL.

🚀 Features

🔐 User registration and login

🔑 JWT-based authentication

🔒 Password hashing with bcrypt

👤 Authenticated user management

💬 Private one-to-one conversations

⚡ Real-time messaging with Socket.IO

🗄️ PostgreSQL database

🧩 Prisma ORM for database access

📥 Fetch previous conversation messages

🚪 Secure logout flow

📱 Responsive chat interface

🌐 REST API architecture

🛠️ Tech Stack

Frontend

React.js

JavaScript (ES6+)

CSS

Vite

Fetch API

Socket.IO Client

Backend

Node.js

Express.js

Socket.IO

JWT

bcrypt

CORS

Database

PostgreSQL

Prisma ORM

Development Tools

VS Code

Git

GitHub

npm

📁 Project Structure

ChatFlow/
│
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   └── Login.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── conversationService.js
│   │   │   ├── socket.js
│   │   │   └── userService.js
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   └── package.json
│
└── server/
    ├── config/
    │   └── prisma.js
    │
    ├── controllers/
    │   ├── authController.js
    │   ├── conversationController.js
    │   ├── messageController.js
    │   └── userController.js
    │
    ├── middleware/
    │   └── authMiddleware.js
    │
    ├── routes/
    │   ├── authRoutes.js
    │   ├── conversationRoutes.js
    │   ├── messageRoutes.js
    │   └── userRoutes.js
    │
    ├── sockets/
    │   └── chatSocket.js
    │
    ├── prisma/
    │   └── schema.prisma
    │
    ├── generated/
    │   └── prisma/
    │
    ├── server.js
    ├── package.json
    └── .env

Note: .env is intentionally deleted from the project/repository and must never be committed to GitHub. Create your own local .env file in the server directory before running the backend.

🔐 Environment Variables

The original .env file is not included in this repository.

Create:

server/.env

and add your own local configuration.

Example:

PORT=5000

DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/chatflow"

JWT_SECRET="YOUR_SECURE_JWT_SECRET"

Important

Replace YOUR_PASSWORD with your PostgreSQL password.

Replace YOUR_SECURE_JWT_SECRET with a strong secret.

Do not upload .env to GitHub.

Add .env to .gitignore.

Example .gitignore entry:

.env
node_modules/

⚙️ Installation

1. Clone the repository

git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd ChatFlow

2. Install frontend dependencies

cd client
npm install

3. Install backend dependencies

Open another terminal:

cd server
npm install

🗄️ Database Setup

ChatFlow uses PostgreSQL + Prisma.

Make sure PostgreSQL is installed and the chatflow database exists.

Then configure:

DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/chatflow"

Run Prisma generation:

npx prisma generate

Run database migrations:

npx prisma migrate dev

The generated Prisma client is stored in the project's configured custom output directory:

server/generated/prisma

▶️ Run the Application

Start the backend

From the server directory:

node server.js

Expected output:

PostgreSQL connected successfully!
ChatFlow server is running on port 5000

Backend:

http://localhost:5000

Start the frontend

From the client directory:

npm run dev

Frontend:

http://localhost:5173

🔗 API Endpoints

Authentication

Method

Endpoint

Description

Auth

POST

/api/auth/signup

Register a new user

No

POST

/api/auth/login

Login user

No

GET

/api/auth/me

Get authenticated user

Yes

Users

Method

Endpoint

Description

Auth

GET

/api/users

Get users except the logged-in user

Yes

Conversations

Method

Endpoint

Description

Auth

POST

/api/conversations

Create or get a private conversation

Yes

Messages

Method

Endpoint

Description

Auth

POST

/api/messages

Send a message through REST API

Yes

GET

/api/messages/:conversationId

Get conversation messages

Yes

⚡ Socket.IO Events

ChatFlow uses Socket.IO for real-time communication.

Client → Server

joinConversation
sendMessage

Server → Client

newMessage

Example:

socket.emit("joinConversation", conversationId);

socket.emit("sendMessage", {
    conversationId,
    senderId,
    content
});

socket.on("newMessage", (message) => {
    console.log(message);
});

🔄 Application Flow

User
 │
 ▼
React Frontend
 │
 ├── JWT Authentication
 │
 ├── REST API ──────────────► Express.js
 │                              │
 │                              ▼
 │                           Prisma ORM
 │                              │
 │                              ▼
 │                         PostgreSQL
 │
 └── Socket.IO ─────────────► Node.js Server
                               │
                               ▼
                         Real-Time Events
                               │
                               ▼
                           Chat Users

🔑 Authentication Flow

Register / Login
       │
       ▼
Express API
       │
       ▼
bcrypt password verification
       │
       ▼
JWT token generated
       │
       ▼
Token stored in browser
       │
       ▼
Protected API requests
       │
       ▼
authMiddleware verifies JWT
       │
       ▼
Authenticated user

💬 Messaging Flow

User selects another user
          │
          ▼
Create / Get Conversation
          │
          ▼
Conversation ID
          │
          ▼
Join Socket.IO Room
          │
          ▼
Send Message
          │
          ▼
Save Message in PostgreSQL
          │
          ▼
Emit "newMessage"
          │
          ▼
All users in conversation receive message

🧪 Socket.IO Test

A separate Socket.IO test file can be used to verify the real-time connection.

Run the backend first:

node server.js

Then run the socket test:

node testSocket.js

Example output:

Starting socket test...
CONNECTED!
Socket ID: <socket-id>
Test message sent!
NEW MESSAGE RECEIVED:

The test requires valid database records for the conversation and its members.

🔒 Security Notes

Passwords are hashed using bcrypt.

Protected REST endpoints require a JWT Bearer token.

.env is excluded from the repository.

Database credentials should never be hard-coded into source files.

Never commit private keys, passwords, JWT secrets, or production credentials.

For production deployment, Socket.IO authentication should also derive the authenticated user identity from a verified token instead of trusting a client-supplied senderId.

🎯 Future Enhancements

Potential improvements for ChatFlow include:

Group conversations

Typing indicators

Online/offline presence

Read receipts

Message deletion and editing

File and image sharing

Notifications

Search conversations

User profiles and avatars

Socket.IO JWT authentication

Production deployment

Mobile application

📌 Project Status

Status: Development / Capstone Project

ChatFlow currently demonstrates a working full-stack architecture with:

React
   +
Node.js / Express
   +
PostgreSQL / Prisma
   +
JWT Authentication
   +
Socket.IO

👩‍💻 Author

Mansi Maurya

BCA | Web Developer | MERN Learner

GitHub: https://github.com/mansimaurya721-ux

LinkedIn: https://www.linkedin.com/in/mansi-maurya1710-/

📄 License

This project is created for educational, portfolio, and capstone purposes.
