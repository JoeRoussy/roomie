import React from 'react';

class Routes extends React.Component {
	openAlert(){
		//We can use our node backend here to perform functionality
		alert();
	}
	/* Create rendering routes here? */
	render(){
		return (
			<html>
				<head>
					<title> Roomie </title>
					<link rel='stylesheet' href='/style.css' />
				</head>
				<body>
					<div>
						Hello World!!
						<button onClick={this.openAlert}> Click me</button>
					</div>
					<script src='/bundle.js' />
				</body>
			</html>
		)
	}
}

export default Routes;