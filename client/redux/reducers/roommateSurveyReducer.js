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

        case 'ROOMMATE_SURVEY_FORM_SUBMITTED': {
            state = {
                ...state,
                isFormProcessing: true,
                errorMessage: null
            };

            break;
        }

        case 'ROOMMATE_SURVEY_FORM_FULFILLED': {
            const {
                data: {
                    recommendedRoommates
                } = {}
            } = payload;

            state = {
                ...state,
                isFormProcessing: false,
                recommendedRoommates
            };

            break;
        }

        case 'ROOMMATE_SURVEY_FORM_REJECTED': {
            // NOTE: There is only one error key so return the same error message for all errors
            state = {
                ...state,
                isFormProcessing: false,
                errorMessage: 'There was an error saving your survey results, please try again later'
            };

            break;
        }
	}

	return state;
}


export default roommateSurveyReducer;
