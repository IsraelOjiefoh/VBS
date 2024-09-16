# Virtual Banking Simulation

Virtual Banking Simulation is a comprehensive virtual banking app built with Node.js, Express, and deployed on Render. This app simulates basic banking operations, starting with user registration.

## Features

- **User Registration:** Collects first name, last name, date of birth, and a 4-digit PIN.
- **Validation:** Ensures all fields are correctly filled and the PIN is exactly 4 digits.
- **Flash Messages:** Displays error and success notifications.

## Tech Stack

- **Backend:** Node.js, Express
- **Templating Engine:** EJS
- **Middleware:** body-parser, express-session, connect-flash
- **Frontend:** HTML5, CSS

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/IsraelOjiefoh/VBS.git
   cd VBA
2. install dependencies
3.    ```bash
       npm install

4. Start the server
    ```bash
     npm start

5. Open your browser and navigate to `http://localhost:3000`.

## File Structure

```
.
├── controller.js
├── public
│   └── style.css
├── views
│   ├── index.ejs
│   ├── register.ejs
│   └── success.ejs
├── .gitignore
├── app.js
├── package.json
└── README.md
```

## Usage

- **Homepage:** Navigate to the homepage to start the registration process.
- **Register:** Fill out the registration form with your details.
- **Success:** Upon successful registration, view the success page with your submitted details.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for review.

## License

This project is licensed under the MIT License.

---

Built with ❤️ using Node.js and Express. Deployed on Render.
```
