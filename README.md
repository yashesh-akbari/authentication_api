```markdown
# 🚀 Auth API - User Authentication System

Welcome to the **Auth API**, a simple and secure RESTful backend built with **Express.js**, **MongoDB**, and **Mongoose**. This API handles user registration with input validation, password hashing, and supports CRUD operations.

---

## 📌 Features

- 🔒 User Registration with:
  - First and last name validation
  - Phone and email validation (rejects temporary emails)
  - Strong password requirements
- 🔐 Password hashing using `bcrypt`
- 🧾 CRUD support: Create, Read, Update, Delete users
- 🌐 MongoDB Atlas integration
- 🔄 Cross-Origin Resource Sharing (CORS) enabled

---

## 🔧 Installation & Setup

1. **Clone the repository:**

```bash
git clone https://github.com/your-username/auth-api.git
cd auth-api/backend
````

2. **Install dependencies:**

```bash
npm install
```

3. **Add environment variables in `.env`:**

```env
MONGO_URI=your_mongodb_atlas_connection_string
PORT=5000
```

4. **Run the server:**

```bash
npm run dev
```

> Make sure MongoDB Atlas access is correctly configured with whitelisted IP and valid credentials.

---

## 📮 API Endpoints

| Method   | Endpoint            | Description              |
| -------- | ------------------- | ------------------------ |
| `GET`    | `/api/register`     | Get all registered users |
| `POST`   | `/api/register`     | Register a new user      |
| `PUT`    | `/api/register/:id` | Update user by ID        |
| `DELETE` | `/api/register/:id` | Delete user by ID        |

---

## 🧪 Testing the API

You can test these endpoints using:

* [Postman](https://www.postman.com/)
* [Thunder Client](https://www.thunderclient.com/)
* `curl` or any REST client

Example POST body for `/api/register`:

```json
{
  "fname": "John",
  "lname": "Doe",
  "email": "john.doe@example.com",
  "phone": "1234567890",
  "password": "Strong@123"
}
```

---

## 👨‍💻 Author

* **Yashesh Akbari**
* 🗓️ 2025
* 💬 Feel free to contribute or raise issues

---

## 📜 License

This project is licensed under the MIT License.

---

**💪 Happy building!**

```
