import React from 'react';
import TimePicker from 'rc-time-picker';
import moment from 'moment';

import 'rc-time-picker/assets/index.css';

const format = 'h:mm a';

const WrappedTimePicker = ({
    time,
    timeChange
}) => (
    <TimePicker
        showSecond={false}
        defaultValue={time}
        onChange={timeChange}
        format={format}
        use12Hours
        inputReadOnly
    />
)

export default WrappedTimePicker;
