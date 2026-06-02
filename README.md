# LostFound — Hospitality & Community Lost & Found Portal

A full-stack web application designed for hotels, campuses, organizations, and public spaces to efficiently manage lost and found items. The platform enables users to report lost items, staff members to log found items, and administrators to oversee the entire recovery process through a secure role-based system.

---

## 🚀 Features

### 📦 Item Management
- Report lost items with detailed descriptions.
- Log found items along with images.
- Track item status throughout the recovery lifecycle.
- Search and filter items based on status.

### 🔐 Authentication & Authorization
- JWT-based authentication.
- Secure login and registration.
- Role-Based Access Control (RBAC).

### 👥 User Roles

#### Customer
- Report lost items.
- View publicly available reports.

#### Staff
- Log found items.
- Upload item images.
- Update item status.

#### Admin
- Manage users.
- Monitor system activities.
- Full access to all portal functionalities.

### 📸 Image Upload Support
- Multipart image upload functionality.
- Secure local file storage.
- Image preview support.

### 📊 Dashboard
- Real-time item tracking.
- Status-wise categorization.
- Quick actions for staff and administrators.

---

## 🛠️ Tech Stack

### Backend
- Java 17
- Spring Boot 3
- Spring Security
- Spring Data JPA
- JWT Authentication

### Frontend
- React.js
- Vite
- Axios
- Context API

### Database
- MySQL 8

### File Storage
- Local Multipart Storage

---

## 🔒 Role-Based Access Matrix

| Feature | Customer | Staff | Admin |
|----------|----------|--------|--------|
| View Dashboard | ✅ | ✅ | ✅ |
| Report Lost Item | ✅ | ✅ | ✅ |
| Report Found Item | ❌ | ✅ | ✅ |
| Upload Images | ❌ | ✅ | ✅ |
| Update Item Status | ❌ | ✅ | ✅ |
| Manage Users | ❌ | ❌ | ✅ |

---

## 📂 Project Structure

### Backend

```text
backend/
├── config/
├── security/
├── model/
├── repository/
├── service/
└── controller/
```

### Frontend

```text
frontend/
├── api/
├── context/
├── components/
├── pages/
├── App.jsx
└── index.css
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/lostfound.git
cd lostfound
```

### 2. Backend Configuration

Update your database configuration in:

```text
src/main/resources/application.properties
```

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/lostfound_db?createDatabaseIfNotExist=true
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update

spring.servlet.multipart.max-file-size=5MB
spring.servlet.multipart.max-request-size=5MB
file.upload-dir=uploads/
```

### 3. Recommended Database Indexes

```sql
CREATE INDEX idx_item_status ON items(status);
CREATE INDEX idx_reported_by ON items(reported_by_user_id);
```

### 4. Run Backend

```bash
./mvnw clean spring-boot:run
```

Backend will be available at:

```text
http://localhost:8080
```

### 5. Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at:

```text
http://localhost:5173
```

---

## 📄 REST API Overview

### Authentication APIs

#### Register User

```http
POST /api/auth/register
```

#### Login User

```http
POST /api/auth/login
```

Returns JWT token and role information.

---

### Item APIs

#### Get All Items

```http
GET /api/items
```

#### Filter Items by Status

```http
GET /api/items?status=FOUND
```

#### Create New Item

```http
POST /api/items
```

Supports multipart form data for image uploads.

#### Update Item Status

```http
PUT /api/items/{id}/status
```

Accessible only by STAFF and ADMIN roles.

---

## 🔐 Security Features

- JWT Authentication
- Password Encryption
- Role-Based Access Control
- Protected API Endpoints
- Secure Multipart File Uploads
- Spring Security Integration

---

## 🎯 Future Enhancements

- AI-powered item matching.
- Email and SMS notifications.
- QR Code-based item tracking.
- Cloud storage integration (AWS S3).
- Mobile application support.
- Analytics and reporting dashboard.
- Audit logs and activity monitoring.

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository.
2. Create your feature branch.
3. Commit your changes.
4. Push to the branch.
5. Open a Pull Request.

---

## 📜 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Vinit Singh**  
Computer Science & Engineering  
Yeshwantrao Chavan College of Engineering

If you found this project useful, consider giving it a ⭐ on GitHub.
