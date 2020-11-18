exports.getPerson = async (req, res, next) => {
  try {
    res.json({success: true}).status(201);
  } catch (err) {
    next(err);
  }
}