const config = {
    cities: []
};

const roommateSurveyReducer = (state = config, actions) => {
    const {
        type,
        payload
    } = actions;

	switch(type){
        case 'ROOMMATE_SURVEY_FETCH_CITIES_PENDING': {
            state = {
                ...state,
                isCitiesLoading: true
            };

            break;
        }

		case 'ROOMMATE_SURVEY_FETCH_CITIES_FULFILLED': {
            const {
                data: {
                    cities
                } = {}
            } = payload;

            // TODO: Use actual values for real cities
            const mappedCities = cities.map((city) => ({
                key: city.name,
                value: city.name,
                text: city.name
            }));

            // mappedCities.unshift({
            //     key: 'select',
            //     value: '',
            //     text: 'Choose ONe'
            // })

            state = {
                ...state,
                isCitiesLoading: false,
                cities: mappedCities
            };

			break;
		}

        case 'ROOMMATE_SURVEY_FETCH_CITIES_REJECTED': {
            state = {
                ...state,
                isCitiesLoading: false,
                errorMessage: 'There was an error loading cities for the dropdown. Please reload the page and try again'
            };

            break;
        }
	}

	return state;
}


export default roommateSurveyReducer;
