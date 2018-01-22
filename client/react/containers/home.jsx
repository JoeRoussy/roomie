import React from 'react';
import { Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { makeUppercase, makeLowercase } from '../../redux/actions/sampleActions';

@connect((store)=>({
    projectName: store.sampleReducer.name,
    owners: store.sampleReducer.owners
}))
class Home extends React.Component {
    constructor(){
        super();
        this.clickNormalButton = this.clickNormalButton.bind(this);
        this.clickSemanticButton = this.clickSemanticButton.bind(this);
        this.getProjectName = this.getProjectName.bind(this);
        this.getOwners = this.getOwners.bind(this);
    }
    clickNormalButton(){
        this.props.dispatch(makeLowercase());
    }
    clickSemanticButton(){
        this.props.dispatch(makeUppercase());
    }
    getProjectName(){
        return this.props.projectName;
    }
    getOwners(){
        return this.props.owners;
    }
    /* Create rendering routes here? */
    render(){
        const names = this.getOwners().map((owner, i)=>{
            return <li key={i}> {owner} </li>
        });

        return (
            <div>
                Hello World!
                <ul> {names} </ul>
                <button onClick={this.clickNormalButton}>Normal Button</button>
                <Button onClick={this.clickSemanticButton}>Semantic Button</Button>
            </div>
        )
    }
}

export default Home;
