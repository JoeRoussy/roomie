import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';

const WrappedDatePicker = ({
    dateChange,
    selectedDate
}) => (
    <DatePicker
        selected={selectedDate}
        onChange={dateChange}
    />
)

export default WrappedDatePicker;
