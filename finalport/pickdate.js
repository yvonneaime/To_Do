import React, { useState } from 'react';
import DatePicker from 'react-datepicker';

const DatePickerComponent = ({ onDateSelected }) => {
    const [startDate, setStartDate] = useState(new Date());
  
    const handleChange = (date) => {
      setStartDate(date);
  
      if (onDateSelected) {
        onDateSelected(date);
      }
    };
  
    return (
      <DatePicker
        selected={startDate}
        onChange={handleChange}
        dateFormat="yyyy/MM/dd"
      />
    );
  };
  
  export default DatePickerComponent;