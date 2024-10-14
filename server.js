import express from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors());

// Array to hold all generated pH values (server-side)
const phHistory = [];

// Function to simulate a random pH value
function generateRandomPH() {
    return (Math.random() * 6 + 4).toFixed(2); // Random value between 4.0 and 10.0
}

// Automatically generate a new pH value every 10 seconds
setInterval(() => {
    const phValue = generateRandomPH();
    const timestamp = new Date().toLocaleString();

    // Only add the new pH value to history if it's different from the last one
    if (phHistory.length === 0 || phHistory[phHistory.length - 1].value !== phValue) {
        phHistory.push({ value: phValue, time: timestamp });
        console.log(`New pH value recorded: ${phValue} at ${timestamp}`);
    }
}, 10000); // 10 seconds = 10000 milliseconds

// Root route
app.get("/", (req, res) => {
    res.send("Welcome to the pH Value API! Use /api/ph-value to get the current pH value.");
});

// Endpoint to get the current pH value
app.get("/api/ph-value", (req, res) => {
    const latestPhValue = phHistory[phHistory.length - 1];
    if (latestPhValue) {
        res.json({ ph_value: latestPhValue.value });
    } else {
        res.json({ ph_value: "No data available" });
    }
});

// Endpoint to get the entire history of pH values
app.get("/api/ph-history", (req, res) => {
    res.json(phHistory);
});

app.listen(PORT, () => {
    console.log(`Express server running at http://localhost:${PORT}/`);
});