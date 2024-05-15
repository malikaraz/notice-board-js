import React, { useState } from 'react';

const CreateNoticeForm = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleContentChange = (e) => {
        setContent(e.target.value);
    };

    const handleSubmit = () => {
        fetch('http://localhost:3003/notices', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, content })
        })
            .then(response => {
              console.log(response);
              console.log('sended');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Notice created:', data);
                setTitle('');
                setContent('');
            })
            .catch(error => {
                console.error('Error creating notice:', error);
            });
    };

    return (
        <div>
            <h2>Create New Notice</h2>
            <label htmlFor="title">Title:</label>
            <input
                type="text"
                id="title"
                value={title}
                onChange={handleTitleChange}
            />
            <br />
            <label htmlFor="content">Content:</label>
            <textarea
                id="content"
                value={content}
                onChange={handleContentChange}
            ></textarea>
            <br />
            <button onClick={handleSubmit}>Create Notice</button>
        </div>
    );
};

export default CreateNoticeForm;
