# 🔐 MERN Authentication System with Email Verification & Password Reset (OTP Based)

This project demonstrates a **complete Authentication System** that includes **Email Verification** and a **Password Reset** feature using a secure **6-digit OTP** sent directly to the user's email address.

---

## 🚀 Overview

We’ll build both the **backend** and **frontend** of a modern MERN (MongoDB, Express, React, Node.js) authentication system.

The **backend** handles user registration, email verification, login, and password reset using JWT and Nodemailer.  
The **frontend** provides a clean UI for Login, Registration, and Password Reset using React and Tailwind CSS.

---

## 🏗️ Tech Stack

### **Frontend**
- React.js  
- Tailwind CSS  
- Axios  
- React Router DOM  
- React Toastify  

### **Backend**
- Node.js  
- Express.js  
- MongoDB with Mongoose  
- JSON Web Token (JWT)  
- Nodemailer (for sending OTP emails)  
- dotenv (for environment configuration)  
- bcrypt (for password hashing)  
- cors  

---

## ⚙️ Key Features

| Feature | Description |
|----------|-------------|
| 📨 Email Verification | Sends a 6-digit OTP to the user’s email during registration. |
| 🔑 Secure Login | JWT-based authentication for user sessions. |
| 🔒 Password Reset | Reset password using a 6-digit OTP sent to email. |
| 🧩 Protected Routes | Middleware-secured routes using JWT. |
| 🎨 Clean UI | Built with React + Tailwind CSS and responsive on all devices. |

---

## 📁 Folder Structure

project-root/
│
├── Authentication/ # Frontend (React + Tailwind)
│ ├── src/
│ ├── public/
│ ├── package.json
│ └── ...
│
├── server/ # Backend (Express + MongoDB)
│ ├── routes/
│ ├── models/
│ ├── controllers/
│ ├── server.js
│ ├── .env
│ └── ...
│
├── .gitignore
└── README.md
