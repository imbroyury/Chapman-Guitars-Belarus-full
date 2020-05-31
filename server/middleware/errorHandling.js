export const wrapAsync = (asyncHandler) => (req, res, next) => asyncHandler(req, res, next).catch(next);

export const errorHandlingMiddleware = (e, req, res, next) => { // eslint-disable-line no-unused-vars
  console.log('**********************\n\n\n\n\n error from middleware \n\n\n\n\n***********************');
  console.log(e); // TODO: log it
  res.status(500).send(e);
};
