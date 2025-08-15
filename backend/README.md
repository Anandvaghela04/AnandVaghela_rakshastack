# PG Backend API

A comprehensive backend API for PG (Paying Guest) accommodation listings with user authentication, search, and filtering capabilities.

## 🚀 Features

- **User Authentication**: Register, login, and JWT-based authentication
- **PG Listings**: CRUD operations for PG accommodations
- **Search & Filter**: Advanced search with location, price, gender filters
- **User Roles**: User and Owner roles with different permissions
- **Image Upload**: Support for multiple image uploads
- **Dashboard**: Owner dashboard with statistics
- **Security**: Password hashing, input validation, rate limiting

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `config.env` and update the values:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/pg_backend
   JWT_SECRET=your_jwt_secret_key_here_change_in_production
   NODE_ENV=development
   ```

4. **Create uploads directory**
   ```bash
   mkdir uploads
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890",
  "role": "user"
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

#### Become Owner
```http
POST /auth/become-owner
Authorization: Bearer <token>
```

### PG Listings Endpoints

#### Get All PG Listings
```http
GET /pg?page=1&limit=10&city=Ahmedabad&gender=boys&minPrice=3000&maxPrice=8000
```

#### Get Single PG Listing
```http
GET /pg/:id
```

#### Create PG Listing (Owner Only)
```http
POST /pg
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Comfort PG",
  "description": "A comfortable PG with all amenities",
  "location": {
    "address": "123 Main Street",
    "city": "Ahmedabad",
    "state": "Gujarat",
    "pincode": "380001"
  },
  "price": {
    "monthly": 5000,
    "deposit": 10000
  },
  "amenities": ["WiFi", "AC", "Food", "Laundry"],
  "gender": "boys",
  "contactInfo": {
    "phone": "1234567890",
    "email": "contact@comfortpg.com"
  }
}
```

#### Update PG Listing (Owner Only)
```http
PUT /pg/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated PG Name",
  "price": {
    "monthly": 6000
  }
}
```

#### Delete PG Listing (Owner Only)
```http
DELETE /pg/:id
Authorization: Bearer <token>
```

#### Get My PG Listings (Owner Only)
```http
GET /pg/owner/my-listings?page=1&limit=10
Authorization: Bearer <token>
```

#### Search PG Listings
```http
GET /pg/search?q=comfort&location=Ahmedabad&gender=boys&minPrice=3000&maxPrice=8000
```

#### Get Cities
```http
GET /pg/cities
```

### User Management Endpoints

#### Update Profile
```http
PUT /user/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "phone": "9876543210",
  "profileImage": "https://example.com/image.jpg"
}
```

#### Change Password
```http
PUT /user/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

#### Get Dashboard
```http
GET /user/dashboard
Authorization: Bearer <token>
```

#### Get Owner Dashboard
```http
GET /user/owner-dashboard
Authorization: Bearer <token>
```

#### Delete Account
```http
DELETE /user/account
Authorization: Bearer <token>
Content-Type: application/json

{
  "password": "currentpassword"
}
```

## 🔍 Query Parameters

### PG Listings Filtering
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `city`: Filter by city
- `state`: Filter by state
- `gender`: Filter by gender (boys/girls/unisex)
- `minPrice`: Minimum price
- `maxPrice`: Maximum price
- `amenities`: Comma-separated amenities
- `search`: Text search
- `sortBy`: Sort field (createdAt, price.monthly, name)
- `sortOrder`: Sort order (asc/desc)

### Search Parameters
- `q`: Search query
- `location`: Location search
- `gender`: Gender filter
- `minPrice`: Minimum price
- `maxPrice`: Maximum price

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Please enter a valid email address"
    }
  ]
}
```

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  phone: String,
  role: String (user/owner/admin),
  profileImage: String,
  isVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### PG Listing Model
```javascript
{
  name: String (required),
  description: String (required),
  location: {
    address: String (required),
    city: String (required),
    state: String (required),
    pincode: String (required),
    coordinates: { latitude: Number, longitude: Number }
  },
  price: {
    monthly: Number (required),
    deposit: Number
  },
  amenities: [String],
  gender: String (boys/girls/unisex),
  roomTypes: [{
    type: String,
    available: Number,
    price: Number
  }],
  images: [{
    url: String,
    caption: String,
    isPrimary: Boolean
  }],
  owner: ObjectId (ref: User),
  contactInfo: {
    phone: String,
    email: String
  },
  rules: [String],
  isAvailable: Boolean,
  isVerified: Boolean,
  rating: {
    average: Number,
    count: Number
  }
}
```

## 🛡️ Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Express-validator for request validation
- **Rate Limiting**: Express-rate-limit for API protection
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing configuration

## 🚀 Deployment

1. **Set environment variables for production**
2. **Use a production MongoDB instance**
3. **Set up proper logging**
4. **Configure reverse proxy (nginx)**
5. **Use PM2 for process management**

## 📝 License

MIT License

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📞 Support

For support, email support@example.com or create an issue in the repository. 