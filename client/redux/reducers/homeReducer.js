const config = {
    roommateSuggestions: [],
};

const homeReducer = (state = config, actions) => {
    const {
        type,
        payload
    } = actions;

    // TODO: switch on type....

    return state;
}

export default homeReducer;
