import React from 'react';
// This component provides a input of type file. It passes any props down to the input element
// (so we can set the accept attribute for example). This is designed to be included as a component
// in redux form Field component. It will handle the change event so the appropriate field in the
// values of the associated form is set as the value of the input changes.

import { Label, Icon } from 'semantic-ui-react';

import './styles.css';

const FileInput = ({
    input: {
        value: fileInputValue,
        onChange,
        onBlur,
        ...inputProps
    },
    meta: omitMeta,
    iconName,
    ...props
}) => {
    // This will be populated using the ref callback of the file input field
    let fileInput = null;

    // When we click the visible element, trigger a click event on the file input (assuming it was correctly set)
    const onVisibleElementClicked = () => {
        if (fileInput) {
            fileInput.click();
        } else {
            throw new Error('Could not get a reference to visible element in FileInput component');
        }
    }

    // This is the actual ref callback that assigns the file input to our variable for it
    const fileInputRefCallback = (element) => {
        fileInput = element;
    };

    // This abstracts handling input events (passed in as a prop by the Field component) by providing the files as the value
    const adaptFileEventToValue = delegate => e => delegate(e.target.files)

    return (
        <div className='field fileInputWrapper'>
            <label>{props.label}</label>
            <div className="fileInputVisibleElementWrapper" onClick={onVisibleElementClicked}>
                <input className='fileInputVisibleElement' type='text' readOnly value={fileInputValue ? fileInputValue[0].name : 'Choose a file'} />
                <Label className='fileInputVisibleElementLabel' horizontal><Icon name={iconName || 'file text outline'}/></Label>
            </div>
            <input
                ref={fileInputRefCallback}
                onChange={adaptFileEventToValue(onChange)}
                onBlur={adaptFileEventToValue(onBlur)}
                type="file"
                {...inputProps}
                {...props}
            />
        </div>
    );
}


export default FileInput;
