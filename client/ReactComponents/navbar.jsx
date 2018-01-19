import React, {Component} from 'react';
import { Container, Divider, Dropdown, Grid, Header, Image, List, Menu, Segment, Icon } from 'semantic-ui-react';

class NavBar extends Component{
  constructor(){
    super();
    this.state = {signedIn: false}
    this.clickChatButton = this.clickChatButton.bind(this);
    this.clickGroupsButton = this.clickGroupsButton.bind(this);
    this.clickHomeButton = this.clickHomeButton.bind(this);
    this.clickSearchButton = this.clickSearchButton.bind(this);
    this.clickSignInButton = this.clickSignInButton.bind(this);
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
  clickSignInButton(){
    this.setState({signedIn: !this.state.signedIn});
  }
  render(){
    return(
      <Menu fixed='top' inverted>
        //<Container>
          <Menu.Item header onClick={this.clickHomeButton}>Roomie</Menu.Item>
          <Menu.Item onClick={this.clickSearchButton}>Search </Menu.Item>
          <Menu.Item onClick={this.clickChatButton}><Icon name='chat'/> Chat</Menu.Item>
          <Menu.Item onClick={this.clickGroupsButton}><Icon name='group'/> Groups</Menu.Item>
        //</Container>
        <Menu.Menu position='right'>
          {this.state.signedIn? <Menu.Item><Icon name= 'user'/> User Name</Menu.Item> :''}
          <Menu.Item onClick={this.clickSignInButton}>
            <Icon name={this.state.signedIn ? 'sign out' :'sign in'}/>
            {this.state.signedIn ? 'Sign Out' :'Sign In'}
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}
export default NavBar;
