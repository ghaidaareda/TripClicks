# TripClics "Tour Reservation System"

Efficiently manage and explore exciting tours with our comprehensive Tour Reservation System.

---

## **Project Overview**

This project is a backend system for managing tour reservations. It is built using **Node.js**, **Express**, and **MongoDB**. It supports CRUD operations for tours, filtering options, and server-side rendered views using **Pug**.

---

## **Features**

- **Create Tours**: Add new tours with details like name, price, duration, and description.
- **Update Tours**: Modify existing tour information.
- **Delete Tours**: Remove tours from the system.
- **Filter Tours**: Search tours based on parameters like price, duration, and location.
- **Create user - update user data - delete user**
- **create review - update reviews- show all reviews on a trip - delete review**
- All with their autherizations and authentications

---

## **Technologies Used**

### Backend:

- **Node.js**: For building the server-side application.
- **Express.js**: For routing and middleware.

### Database:

- **MongoDB**: For storing tour data.
- **Mongoose**: For database modeling and interaction.

### Frontend:

- **Pug**: For server-side rendering of views.

### Development Tools:

- **Nodemon**: For automatic server restarts during development.
- **Postman**: For API testing.
- **GitHub**: For version control and collaboration.

---

## **Setup and Installation**

1. Clone the repository:
   ```bash
   git clone https://github.com/ghaidaareda/TripClicks
   ```
2. Navigate to the project directory:
   ```bash
   cd TripClicks folder
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Configure environment variables:

   - Create a `.env` file in the root directory and add the following:
     ```plaintext
     NODE_ENV=development
     USERNAME=your-username
     DATABASE=mongodb+srv://<USERNAME>:<PASSWORD>@cluster0.mongodb.net/your-database-name?retryWrites=true&w=majority
     DATABASE_PASSWORD=your-database-password
     JWT_SECRET=your-jwt-secret
     JWT_EXPIRE_IN=90d
     JWT_COOKIE_EXPIRE_IN=90
     EMAIL_USERNAME=your-email-username
     EMAIL_PASSWORD=your-email-password
     EMAIL_HOST=smtp.mailtrap.io
     EMAIL_PORT=25
     ```
   - **Important**: Do not upload the `.env` file to GitHub. Add it to `.gitignore` to ensure it is excluded from version control.

5. Start the server:
   ```bash
   npm start
   ```
6. Open your browser and visit:
   ```
   http://localhost:3000
   ```

---

## **Project Setup Instructions**

### Initialize the Project:

- Install dependencies:
  ```bash
  npm install express mongoose body-parser cors
  npm install --save-dev nodemon
  ```

### Set Up the Server:

- Create an Express app in `server.js` to handle CRUD operations.

### Connect to MongoDB:

- Use Mongoose to connect to a MongoDB database (local or cloud).

### Build the Tour Model:

- Define a schema for tours (e.g., name, price, location, description).

### Develop Routes:

- **POST**: Add a new tour.
- **GET**: Retrieve all tours or filter based on criteria.
- **PUT**: Update a tour by ID.
- **DELETE**: Remove a tour by ID.

### Test with Postman:

- Test all routes to ensure they function as expected.

## **Development Report**

### Successes:

- Fully functional CRUD operations.
- Filter and search capabilities.
- Integration of server-side rendering with Pug.

### Challenges:

- Debugging MongoDB connection errors.
- Designing a scalable schema for tour data.

### Areas for Improvement:

- Implementing user authentication.
- Adding pagination and sorting for tours.

---

## **Future Enhancements**

- **Advanced Filters**: Include more detailed search and filter options.
- **Cloud Deployment**: Host the application on platforms like Heroku or AWS.
- **Frontend Framework**: Build a dedicated client-side front end using React or Angular.

---

## **Resources**

- **GitHub Repository**: [GitHub Link](https://github.com/ghaidaareda/TripClicks)
- **API Documentation**: [Documentation Link](https://documenter.getpostman.com/view/40649590/2sAYJ9AJJs)

---

## **Contact**

For questions or collaboration:

- [ghaidaa alsahafy](https://github.com/ghaidaareda) -Email : (dodo.sa7afy@gmail.com)
- [Jailan Elsherbiny](https://github.com/jailan-sh) -Email : (jilan.elsherbiny@gmail.com)
