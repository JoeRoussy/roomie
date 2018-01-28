import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Form, Input, Button, Icon, Divider, Checkbox, Label } from 'semantic-ui-react';
import './styles.css';

const ViewListingsSearch = ({
    submitSearch,
}) => {
    //TODO: Add tabs -> Tab 1 search,, Tab 2 map view
    return (
        <div >
            <Form onSubmit={submitSearch}>
                 <div>
                    <Label size='large' content='Location' icon='marker' />
                    <Field
                        name='location'
                        component={Input}
                        placeholder="Enter a destination..."
                    />
                </div>

                <Divider />
                
                <div>
                    <Label size='large' content='Tags' icon='tags' /> 
                    <Field
                        name='keywords'
                        component={Input}
                     placeholder="Keywords, tags, etc..."
                    />
                </div>

                <Divider />

                <div>
                    <Label size='large' content='Price Range' icon='dollar' /> 
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

                <Divider />

                <div>
                    <Label size='large' content='Bedroom(s)' icon='bed' /> 
                    <Field
                        name='bedrooms'
                        component={() => {
                            return [1,2,3,4,'5+'].map((num)=>{
                                return (
                                    <div key={'bedroom'+num}> 
                                        <Checkbox label={num} />
                                    </div>
                                )
                            });
                        }}
                    />
                </div>

                <Divider />

                <div>
                    <Label size='large' content='Bathroom(s)' icon='bath' /> 
                    <Field
                        name='bathrooms'
                        component={() => {
                            return [1,2,'3+'].map((num)=>{
                                return (
                                    <div key={'bathroom'+num}> 
                                        <Checkbox label={num} />
                                    </div>
                                )
                            });
                        }}
                    />
                </div>

                <Divider />

                <div>
                    <Label size='large' content='Furnished' icon='shopping basket' /> 
                    <Field
                        name='furnished'
                        component={() => {
                            return ['Yes', 'No'].map((text)=>{
                                return (
                                    <div key={'bathroom'+text}> 
                                        <Checkbox label={text} />
                                    </div>
                                )
                            });
                        }}
                    />
                </div>

                <Divider />

                <div>
                    <Button onClick={submitSearch} content="Submit" />
                </div>
            </Form>
        </div>
    )
}

export default reduxForm({
    form: 'viewListingsSearch'
})(ViewListingsSearch);