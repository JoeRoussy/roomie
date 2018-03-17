import React from 'react';
import { Card, Image, Icon } from 'semantic-ui-react'
import Dropzone from 'react-dropzone';

import './styles.css';

const RenderDropzone = ({
    input,
    meta: {
        touched,
        error
    },
    name,
    onImageDrop,
    onImageRemove,
    ...dropZoneProps
}) => {
  const files = input.value;
  return (
    <div>
        <Dropzone
            name={name}
            onDrop={( filesToUpload, e ) => {
                onImageDrop(filesToUpload);
            }}
            style={{'width' : '30%', 'height' : '20%', 'border' : '3px solid green'}}
            {...dropZoneProps}
        >
            <div>Upload images by dragging and dropping, or click to select files to upload.</div>
        </Dropzone>
        {
          touched &&
          error &&
          <span className="error">{error}</span>
        }
        {
                files && Array.isArray(files) && (
                <ul>
                    {
                        files.map((file, i) =>
                            <Card key={i}>
                            <Image src={`${file.preview}`} />
                            <Card.Content>
                              <Card.Header>
                                {file.name}
                              </Card.Header>
                            </Card.Content>
                            <Card.Content extra>
                              <a onClick={onImageRemove(i)}>
                                <Icon name='remove' color='red'/>
                                Click to remove the image
                              </a>
                            </Card.Content>
                          </Card>
                        )
                    }
                </ul>
            )
        }
    </div>
  );
}

export default RenderDropzone
