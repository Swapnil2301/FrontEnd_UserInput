const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from "public" directory

// Endpoint to handle registration data
app.post('/register', (req, res) => {
    const userData = req.body;

    const dataFilePath = path.join(__dirname, 'users.json');
    fs.readFile(dataFilePath, (err, data) => {
        if (err && err.code !== 'ENOENT') {
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }

        let users = [];
        if (data) {
            users = JSON.parse(data);
        }

        // Add new user data
        users.push(userData);

        fs.writeFile(dataFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Internal Server Error' });
            }

            res.json({ success: true });
        });
    });
});

// Endpoint to get all users data
app.get('/users', (req, res) => {
    const dataFilePath = path.join(__dirname, 'users.json');
    fs.readFile(dataFilePath, (err, data) => {
        if (err && err.code !== 'ENOENT') {
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }

        let users = [];
        if (data) {
            users = JSON.parse(data);
        }

        res.json(users);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
