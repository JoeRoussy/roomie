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
