import React, { useState } from 'react';

const Notes = ({ val, setter }) => {
    const handleChange = (e) => {
        setter(e.target.value);
    };
    return (
        <div className="note-box">
           <textarea
               id="comment"
               name="comment"
               value={val}
               onChange={handleChange}
               placeholder="Write a comment here..."
               rows="3"
               cols="40"
               required
           ></textarea>
        </div>
    );
};

export default Notes;
