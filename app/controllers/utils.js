export const sendError = ({
    res,
    status,
    message,
    errorKey
}) => res.status(status).json({
    error: true,
    message,
    errorKey
});

// Checks if ANY user is logged in
export const isAuthenticated = (req, res, next) => {
    if (!req.user) {
        return sendError({
            res,
            status: 403,
            message: 'You are not authorized to perform this action'
        });
    }

    return next();
}

// Makes sure the current user is allowed to modify the user specified in the params of the route
// TODO: Add admin users later?
export const canModifyUser = (req, res, next) => {
    const {
        id
    } = req.params;

    const {
        user: {
            _id: currentUserId
        } = {}
    } = req;

    // NOTE: Both of these ids are actually strings so no use of the equals function for ObjectIDs is needed
    if (id !== currentUserId) {
        return sendError({
            res,
            status: 403,
            message: 'You are not authorized to perform an action on this user'
        });
    }

    return next();
}