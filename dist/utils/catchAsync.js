// Returns a new anonymous function
const catchAsync = (fn) => {
    return (req, res, next) => fn(req, res, next).catch((err) => next(err));
};
export default catchAsync;
