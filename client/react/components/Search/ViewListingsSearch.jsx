import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Form, Button, Icon, Divider, Label, Tab, Message} from 'semantic-ui-react';
import { Input, LabelInputField } from 'react-semantic-redux-form';
import { isPrice } from '../../../../common/validation'
import WrappedPlacesAutoComplete from './WrappedPlacesAutoComplete';
import WrappedCheckBox from './WrappedCheckBox';
import './styles.css';

const validate = (values) => {
    let errors = {};
    const {
        minPrice,
        maxPrice
    } = values;

    if (minPrice && !isPrice(minPrice)) {
        errors = {
            minPrice: 'Please enter a valid price',
            ...errors
        };
    }

    if (maxPrice && !isPrice(maxPrice)) {
        errors = {
            maxPrice: 'Please enter a valid price',
            ...errors
        };
    }

    if (minPrice && maxPrice && parseFloat(minPrice) > parseFloat(maxPrice)) {
        errors = {
            minPrice: 'Please make sure Min Price is less than Max Price',
            ...errors
        };
    }

    return errors;
}

const renderForm = (locationProps, submitSearch, errorMessage) => (
    <Form onSubmit={submitSearch} error={!!errorMessage}>
        <Message
            error
            header='Error'
            content={errorMessage}
        />
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
                    component={LabelInputField}
                    placeholder="Minimum price..."
                />
                - 
                 <Field
                    name='maxPrice'
                    component={LabelInputField}
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
            <Label size='large' content='Furnished' icon='bar' /> 
            {["Yes", "No"].map((text)=>(
                <div key={'furnished' + text}>
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
            <Label size='large' content='Type(s)' icon='home' /> 
                {['Apartment', 'Condominium', 'House', 'Town House', 'Other'].map((item)=>(
                    <div key={'type' + item}>
                        <Field
                            name={'type'}
                            component={WrappedCheckBox}
                            label={item}
                        />
                    </div> 
                ))}
        </div>

        <Divider />

        <div>
            <Label size='large' content='Utilities' icon='lightbulb' /> 
            {["Yes", "No"].map((text)=>(
                <div key={'bathroom' + text}>
                    <Field
                        name={'utilities'}
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
            <Label size='large' content='Parking' icon='car' /> 
            {["Yes", "No"].map((text)=>(
                <div key={'parking' + text}>
                    <Field
                        name={'parking'}
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
            <Label size='large' content='Internet' icon='wifi' /> 
            {["Yes", "No"].map((text)=>(
                <div key={'internet' + text}>
                    <Field
                        name={'internet'}
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
            <Label size='large' content='Laundry' icon='shopping basket' /> 
            {["Yes", "No"].map((text)=>(
                <div key={'laundry' + text}>
                    <Field
                        name={'laundry'}
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
            <Label size='large' content='Air Conditioned' icon='snowflake outline' /> 
            {["Yes", "No"].map((text)=>(
                <div key={'ac' + text}>
                    <Field
                        name={'ac'}
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
                    { menuItem: 'Refine Results', render: () => <Tab.Pane attached={false}>{renderForm(locationProps, submitSearch, errorMessage)}</Tab.Pane>}
                ]}
            />
        </div>
    )
}

export default reduxForm({
    form: 'viewListingsSearch',
    validate
})(ViewListingsSearch);