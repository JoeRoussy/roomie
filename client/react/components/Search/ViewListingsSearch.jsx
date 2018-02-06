import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Form, Input, Button, Icon, Divider, Label, Tab, Radio} from 'semantic-ui-react';

import WrappedPlacesAutoComplete from './WrappedPlacesAutoComplete';
import WrappedCheckBox from './WrappedCheckBox';
import './styles.css';


const validate = (values) => {
    let errors = {};

    const {
        minPrice,
        maxPrice
    } = values;

    if (typeof minPrice !== 'number') {
        errors = {
            minPrice: 'Please enter your a number',
            ...errors
        };
    }

    if (typeof maxPrice !== 'number') {
        errors = {
            maxPrice: 'Please enter your a number',
            ...errors
        };
    }

    if (minPrice > maxPrice) {
        errors = {
            minPrice: 'Please make sure Min Price is less than Max Price',
            ...errors
        };
    }

    return errors;
}

const renderForm = (locationProps, submitSearch, errorMessage) => (
    <Form onSubmit={submitSearch} error={!!errorMessage}>
        <div>
            <div>
                <Label size='large' content='Location' icon='marker' />
                <Field
                    name='location'
                    inputProps={locationProps}
                    component={WrappedPlacesAutoComplete}
                    placeholder="Enter a destination..."
                />
            </div>
        </div>
        <Divider />
        
        <div>
            <Label size='large' content='Tags' icon='tags' /> 
            <div>
                <Field
                    name='keywords'
                    component={Input}
                    placeholder="Keywords, tags, etc..."
                />
            </div>
        </div>

        <Divider />

        <div>
            <Label size='large' content='Price Range' icon='dollar' /> 
            <div>
                <Field
                    name='minPrice'
                    component={Input}
                    placeholder="Minimum price..."
                />
                - 
                 <Field
                    name='maxPrice'
                    component={Input}
                    placeholder="Maximum price..."
                />
            </div>
        </div>

        <Divider />

        <div>
            <Label size='large' content='Bedroom(s)' icon='bed' /> 
                {[1,2,3,4,'5+'].map((num)=>(
                        <div key={'bedroom' + num}>
                            <Field
                                name={'bedrooms'}
                                component={WrappedCheckBox}
                                label={num}
                            />
                        </div> 
                    ))}
        </div>

        <Divider />

        <div>
            <Label size='large' content='Bathroom(s)' icon='bath' /> 
                {[1,2,'3+'].map((num)=>(
                    <div key={'bathroom' + num}>
                        <Field
                            name={'bathrooms'}
                            component={WrappedCheckBox}
                            label={num}
                        />
                    </div> 
                ))}
        </div>

        <Divider />

        <div>
            <Label size='large' content='Furnished' icon='shopping basket' /> 
            {["Yes", "No"].map((text)=>(
                <div key={'bathroom' + text}>
                    <Field
                        name={'furnished'}
                        component='input'
                        type='radio'
                        value={text}
                    />
                    {' ' + text}
                </div> 
            ))}
        </div>

        <Divider />

        <div>
            <Button type='submit' content="Submit" />
        </div>
    </Form>
)

const renderMap = () => ("Hey")

const ViewListingsSearch = ({
    locationProps,
    submitSearch,
    errorMessage
}) => {
    return (
        <div >
            <Tab 
                menu={{pointing: true}} 
                panes={[
                    { menuItem: 'Refine Results', render: () => <Tab.Pane attached={false}>{renderForm(locationProps, submitSearch, errorMessage)}</Tab.Pane>},
                    { menuItem: 'View Map', render: () => <Tab.Pane attached={false}>{renderMap()}</Tab.Pane>}
                ]}
            />
        </div>
    )
}

export default reduxForm({
    form: 'viewListingsSearch',
    validate
})(ViewListingsSearch);