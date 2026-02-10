const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;
const DB_FILE = 'bookings.json';

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Serve static files (HTML, CSS, JS)

// --- Helper Functions ---
function getBookings() {
    try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading DB:", err);
        return [];
    }
}

function saveBookings(bookings) {
    fs.writeFileSync(DB_FILE, JSON.stringify(bookings, null, 2));
}

// --- API Endpoints ---

// Get all bookings (Admin)
app.get('/api/bookings', (req, res) => {
    res.json(getBookings());
});

// Create new booking (Customer)
app.post('/api/bookings', (req, res) => {
    const bookings = getBookings();
    const newBooking = req.body;

    // Ensure ID and timestamp
    newBooking.id = Date.now();
    newBooking.timestamp = new Date().toISOString();
    newBooking.status = 'Pending';

    bookings.push(newBooking);
    saveBookings(bookings);

    res.status(201).json(newBooking);
});

// Update booking status (Admin)
app.put('/api/bookings/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { status } = req.body;

    const bookings = getBookings();
    const index = bookings.findIndex(b => b.id === id);

    if (index !== -1) {
        bookings[index].status = status;
        saveBookings(bookings);
        res.json(bookings[index]);
    } else {
        res.status(404).json({ error: "Booking not found" });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser (and connect other devices on the same WiFi!)`);
});
