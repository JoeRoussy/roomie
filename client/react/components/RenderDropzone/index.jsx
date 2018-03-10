import React from 'react';
import Dropzone from 'react-dropzone';

import './styles.css';

const RenderDropzone = (field) => {
  const files = field.input.value;
  return (
    <div>
        <Dropzone
            name={field.name}
            onDrop={( filesToUpload, e ) => field.input.onChange(filesToUpload)}
            style={{'width' : '30%', 'height' : '20%', 'border' : '3px solid green'}}
        >
            <div>Upload images by dragging and dropping, or click to select files to upload.</div>
        </Dropzone>
        {
          field.meta.touched &&
          field.meta.error &&
          <span className="error">{field.meta.error}</span>
        }
        {
            files && Array.isArray(files) && (
                <ul>
                    { files.map((file, i) => <li key={i}>{file.name}</li>) }
                </ul>
            )
        }
    </div>
  );
}

export default RenderDropzone
