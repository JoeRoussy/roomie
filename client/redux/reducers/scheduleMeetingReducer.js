const config = {
    participants: [],
    aggregatedEvents: [],
    loading: false,
    step: 1
}

const scheduleMeetingReducer = (state = config, actions) => {
    const {
        payload: {
            data: {
                errorKey
            } = {}
        } = {}
    } = actions;

    switch(actions.type){
        case 'next':{
            state = {
                ...state,
                step: state.step + 1
            }
            break;
        }
        case 'back':{
            state = {
                ...state,
                step: state.step - 1
            }
            break;
        }
    }
    return state;
}

export default scheduleMeetingReducer;