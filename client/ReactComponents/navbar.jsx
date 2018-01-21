import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Container, Menu, Icon } from 'semantic-ui-react';

@connect((store)=>{
	return {
		//activeRoute: store.routeReducer.route?
		//user: ???
	}
})
class NavBar extends Component{
  constructor(){
    super();
    this.state = {signedIn: false}
    this.clickChatButton = this.clickChatButton.bind(this);
    this.clickGroupsButton = this.clickGroupsButton.bind(this);
    this.clickHomeButton = this.clickHomeButton.bind(this);
    this.clickSearchButton = this.clickSearchButton.bind(this);
    this.clickSignInButton = this.clickSignInButton.bind(this);
		this.clickUserProfileButton = this.clickUserProfileButton.bind(this);
  }
  clickChatButton(){
    console.log("Chat");
  }
  clickGroupsButton(){
    console.log("Groups");
  }
  clickHomeButton(){
    console.log("Home");
  }
  clickSearchButton(){
    console.log("Search");
  }
	clickUserProfileButton(){
		console.log("User Profile");
	}
  clickSignInButton(){
    this.setState({signedIn: !this.state.signedIn});
  }
  renderSigninBlock(){
    if(this.state.signedIn){
			//user is signed in, render the sign in button and user profile button
      return(
        <Menu.Menu position='right'>
          <Menu.Item onClick={this.clickUserProfileButton}>
						<Icon name= 'user'/> User Name
					</Menu.Item>
          <Menu.Item onClick={this.clickSignInButton}>
            <Icon name='sign out'/>Sign Out
          </Menu.Item>
        </Menu.Menu>
      );
    }else{
			//user is not signed in, render sign in button
      return(
        <Menu.Menu position='right'>
          <Menu.Item onClick={this.clickSignInButton}>
            <Icon name='sign in'/>Sign In
          </Menu.Item>
        </Menu.Menu>
      );
    }
  }
  render(){

    return(
      <Menu fixed='top' inverted>
        <Container>
					//left side
          <Menu.Item header onClick={this.clickHomeButton}>Roomie</Menu.Item>
          <Menu.Item onClick={this.clickSearchButton}>Search </Menu.Item>
          <Menu.Item onClick={this.clickChatButton}><Icon name='chat'/> Chat</Menu.Item>
          <Menu.Item onClick={this.clickGroupsButton}><Icon name='group'/> Groups</Menu.Item>
					//right side
          {this.renderSigninBlock()}
        </Container>
      </Menu>
    );
  }
}
export default NavBar;
