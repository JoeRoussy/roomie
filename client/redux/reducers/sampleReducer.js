const config = {
    name: 'Roomie',
    owners: ['Brandon Baksh', 'Alex Lee Chan', 'Jugal Patel', 'Joe Roussy']
};

const sampleReducer = (state = config, actions) => {
	switch(actions.type){
		case "MAKE_UPPERCASE": {
			state = {...state, owners: state.owners.map((x)=>{ return x.toUpperCase() })}
			break;
		}
		case "MAKE_LOWERCASE": {
			state = {...state, owners: state.owners.map((x)=>{ return x.toLowerCase() })}
			break;
		}
	}
	return state;
}


export default sampleReducer;
