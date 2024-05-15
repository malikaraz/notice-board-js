const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// In-memory storage for notices (replace with database in production)
let notices = [];

// Get all notices
app.get('/notices', (req, res) => {
    res.json(notices);
});

// Get notice by id
app.get('/notices/:id', (req, res) => {
    const notice = notices.find(notice => notice.id === req.params.id);
    if (!notice) {
        return res.status(404).json({ message: 'Notice not found' });
    }
    res.json(notice);
});

// Create a new notice
app.post('/notices', (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
    }
    const newNotice = { id: uuidv4(), title, content };
    notices.push(newNotice);
    res.status(201).json(newNotice);
});

// Update a notice
app.put('/notices/:id', (req, res) => {
    const { title, content } = req.body;
    const noticeIndex = notices.findIndex(notice => notice.id === req.params.id);
    if (noticeIndex === -1) {
        return res.status(404).json({ message: 'Notice not found' });
    }
    notices[noticeIndex] = { ...notices[noticeIndex], title, content };
    res.json(notices[noticeIndex]);
});

// Delete a notice
app.delete('/notices/:id', (req, res) => {
    notices = notices.filter(notice => notice.id !== req.params.id);
    res.json({ message: 'Notice deleted' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
