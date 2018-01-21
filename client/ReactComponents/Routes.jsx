import React from 'react';
import { Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { makeUppercase, makeLowercase } from '../redux/actions/sampleActions';
import NavBar from './navbar.jsx';
import { Container} from 'semantic-ui-react';

import { getListings } from '../redux/actions/listingsActions';

@connect((store)=>{
	return {
		projectName: store.sampleReducer.name,
		owners: store.sampleReducer.owners,
        listings: store.listingsReducer.listings
	}
})
class Routes extends React.Component {
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
    getListings() {
        return this.props.listings;
    }
    componentWillMount() {
        this.props.dispatch(getListings());
    }
	/* Create rendering routes here? */
	render(){
		const names = this.getOwners().map((owner)=>{
			return <li> {owner} </li>
		});

        const listings = this.getListings().map((listing, i) => {
            return <li key={i}>{listing.name}</li>
        });

		return (
			<div>
				<NavBar/>
				<Container style={{ marginTop: '3em' }}>
					Hello World!
					<ul> {names} </ul>
					<button onClick={this.clickNormalButton}>Normal Button</button>
					<Button onClick={this.clickSemanticButton}>Semantic Button</Button>
					<span>Listings:</span>
					<ul>{listings}</ul>
				</Container>
			</div>
		)
	}
}

export default Routes;
