const express = require('express');
const path = require('path');
const multer = require('multer');
const XLSX = require('xlsx');
const app = express();
const cors = require('cors');

app.use(cors());
const storage = multer.memoryStorage(); // Using memory storage to store file temporarily
const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    // Read the uploaded file from memory
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });

    // Get the name of the first worksheet
    const firstSheetName = workbook.SheetNames[0];

    // Get the worksheet
    const worksheet = workbook.Sheets[firstSheetName];

    // Convert worksheet to JSON
    const data = XLSX.utils.sheet_to_json(worksheet);

    // Send the JSON data back to the client
    res.json(data);
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
