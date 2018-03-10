// Functions in the module take an object and stipe out keys that we would not want
// returned to the front end. For example, in a user object we would not want to leak out
// their password.

// These functions should be used right before data is sent to the user so the backend can take advantage of
// having access to all data associated with the object. A common pattern is to call one of these functions when
// setting the value of keys in a res.json call

export const transformUserForOutput = (user) => {
    const {
        password,
        isInactive,
        ...userProps
    } = user;

    return {
        ...userProps
    };
}
