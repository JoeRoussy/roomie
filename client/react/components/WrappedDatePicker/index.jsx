import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';
import './styles.css'

const WrappedDatePicker = ({
    dateChange,
    selectedDate,
    className,
    label
}) => (
    <div className={`wrappedDatePicker${className ? ` ${className}` : ''}`}>
        {label ? (<p className='label'>{label}</p>) : ''}
        <DatePicker
            selected={selectedDate}
            onChange={dateChange}
        />
    </div>
)

export default WrappedDatePicker;
