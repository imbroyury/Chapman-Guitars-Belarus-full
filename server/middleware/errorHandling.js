export const ERROR_HANDLING_TYPE = {
  'ADMIN': 'ADMIN',
  'CLIENT': 'CLIENT',
};

export const wrapAsync = (asyncHandler) => (req, res, next) => asyncHandler(req, res, next).catch(next);

export const errorHandlingMiddleware =
  (type) =>
    (e, req, res, next) => { // eslint-disable-line no-unused-vars
      console.log('**********************\n\n\n\n\n error from middleware \n\n\n\n\n***********************');
      console.log(type);
      console.log(e); // TODO: log it

      if (type === ERROR_HANDLING_TYPE.ADMIN) {
        return res.status(500).send(e);
      }

      if (type === ERROR_HANDLING_TYPE.CLIENT) {
        return res.render('error', {
          ...req.pageMetadata,
          e500: true,
        });
      }

      res.status(500).send(e);
    };
