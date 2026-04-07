/**
 * Route middleware that validates a URL path parameter is a positive integer.
 *
 * Usage:
 *   router.get('/:id',        validateId(),            handler);
 *   router.get('/:listingId', validateId('listingId'), handler);
 *
 * Rejects with 400 before the controller runs if the value is not a
 * whole positive integer (e.g. "abc", "0", "-1", "2.5" are all invalid).
 */
function validateId(paramName = 'id') {
  return (req, res, next) => {
    const raw = req.params[paramName];
    const id  = Number(raw);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: `Invalid ${paramName}: must be a positive integer`,
      });
    }

    next();
  };
}

module.exports = validateId;
