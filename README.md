
# Stayhub

StayHub is a hotel booking web application designed to provide a seamless experience for users looking to find and reserve accommodations. The platform offers a range of features that enhance the booking process, from searching for hotels to managing bookings and receiving personalized recommendations.

## Description

StayHub is built using modern web technologies to ensure a smooth and reliable user experience. The application features a user-friendly interface with advanced search capabilities and robust backend functionality. Key features include:

- **User Authentication**: Secure login and registration to manage user accounts and bookings.
- **Hotel Management**: An intuitive interface for hotel owners and administrators to add and manage hotel listings.
- **Advanced Search with Autocomplete**: A dynamic search bar that suggests locations as users type, making it easier to find hotels.
- **Recommendation Engine**: Personalized hotel suggestions based on user search history and past bookings.
- **Type Safety and Efficient Data Fetching**: Utilizes TypeScript and React Query for robust data handling and improved performance.
- **End-to-End Testing**: Comprehensive testing with Playwright to ensure the application’s functionality and performance.

The application is designed with scalability and user satisfaction in mind, integrating various technologies to deliver a reliable and engaging hotel booking experience.

## Features

- **User Authentication**
- **Hotel Management**
- **Advanced Search with Autocomplete**
- **Recommendation Engine**
- **Type Safety with TypeScript**
- **Efficient Data Fetching with React Query**
- **End-to-End Testing with Playwright**


## Tech Stack

- **Frontend**: React, Tailwind CSS, TypeScript, React Query, React hook form
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Security**: Helmet, Express Validator, JWT, bcrypt
- **Image Handling**: Multer, Cloudinary
- **Testing**: Playwright

## Installation

To set up this project locally, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/kausanubhav/stayhub.git
   ```

2. **Navigate to project directory**:
   ```bash
   cd stayhub
   ```

3. **Install dependencies**:

    *For frontend*:
```bash
cd frontend
npm Install
```
 *For backend*:
```bash
cd backend 
npm Install
```
4. **Set up environment variables**:
Create a .env file in the server directory and add the required environment variables such as database URI and JWT secret.








## Usage/Examples

1. **Register or Log In**:
 Create a new account or log in to access personalized features.

2. **Browse and Manage Hotels**:
 View and manage hotel listings.

3. **Search for Hotels**:
 Use the search bar to find hotels by location. Autocomplete    suggestions will help refine your search.

4. **Get Recommendations**: Receive hotel suggestions based on your search history and past bookings.
## Run Locally


**Start the development server**:


   *For frontend*:
  ```bash 
  npm run dev
  ```

  *For backend*:
  ```bash
  npm run dev
  ```









## Running Tests

**Setting up environment variables**:

Create a new .env file in the server directory and add the required environment variables such as database URI and JWT secret.

Add the script below in the package.json of your backend 
`"e2e": "cross-env DOTENV_CONFIG_PATH=.env.e2e nodemon"`

**Testing with Playwright**:
1. **Navigate to the e2e-tests Directory**
 Run the following command:
```bash
cd e2e-tests
```
2. **Install Dependencies**

```bash
npm install
```

3. **Run tests**

Navigate to the backend directory and start the e2e server


```bash
cd ../backend
npm run e2e
```
Click on the testing icon(install the playwright extension as well)



