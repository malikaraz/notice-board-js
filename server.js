const express = require('express');
const fs = require('fs');
const csvParser = require('csv-parser');
const { createObjectCsvWriter } = require('csv-writer');
const { log } = require('console');

const app = express();
const PORT = 3000;
const csvFilePath = 'notices.csv';

// Create CSV file if it doesn't exist
if (!fs.existsSync(csvFilePath)) {
    fs.writeFileSync(csvFilePath, '');
}

// Read notices from CSV file
const readNotices = () => {
    return new Promise((resolve, reject) => {
        const notices = [];
        fs.createReadStream(csvFilePath)
            .pipe(csvParser())
            .on('data', (data) => {
                notices.push(data);
            })
            .on('end', () => {
                resolve(notices);
            })
            .on('error', (err) => {
                reject(err);
            });
    });
};

// Write notices to CSV file
const writeNotices = (notices) => {
    const csvWriter = createObjectCsvWriter({
        path: csvFilePath,
        header: [
            { id: 'id', title: 'ID' },
            { id: 'title', title: 'Title' },
            { id: 'content', title: 'Content' }
        ]
    });

    return csvWriter.writeRecords(notices);
};

// Middleware to parse JSON requests
app.use(express.json());

// Get all notices
app.get('/notices', async (req, res) => {
    try {
        const notices = await readNotices();
        res.json(notices);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new notice
app.post('/notices', async (req, res) => {
    try {
        log(req.body);
        log(req.body.title);
        log(req.body.content);

        const notices = await readNotices();
        const newNotice = {
            id: Date.now().toString(),
            title: req.body.title,
            content: req.body.content
        };
        notices.push(newNotice);
        await writeNotices(notices);
        res.status(201).json(newNotice);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update an existing notice
app.put('/notices/:id', async (req, res) => {
    try {
        const notices = await readNotices();
        const noticeIndex = notices.findIndex(notice => notice.id === req.params.id);
        if (noticeIndex === -1) {
            return res.status(404).json({ message: 'Notice not found' });
        }
        notices[noticeIndex] = {
            id: req.params.id,
            title: req.body.title,
            content: req.body.content
        };
        await writeNotices(notices);
        res.json(notices[noticeIndex]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete a notice
app.delete('/notices/:id', async (req, res) => {
    try {
        const notices = await readNotices();
        const filteredNotices = notices.filter(notice => notice.id !== req.params.id);
        await writeNotices(filteredNotices);
        res.json({ message: 'Notice deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
