const config = {

};

const roommateSurveyReducer = (state = config, actions) => {
    const {
        type,
        payload
    } = actions;

	switch(type){
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
