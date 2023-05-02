import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DatePickerComponent = ({ val, setter, onDateSelected }) => {
    const handleChange = (date) => {
        setter(date);
      if (onDateSelected) {
        onDateSelected(date);
      }
    };
    return (
        <DatePicker
            selected={val}
            onChange={handleChange}
            dateFormat="MM/dd/yyyy"
        />
    );

};
export default DatePickerComponent;
