exports.generateCV = (req, res) => {
  const { name, skills, experience } = req.body;

  if (!name) {
    return res.status(400).json({
      message: "Name is required",
    });
  }

  // MOCK CV response
  const cv = {
    name,
    skills: skills || [],
    experience: experience || [],
    summary: `${name} is a software developer.`,
  };

  return res.json({
    success: true,
    cv,
  });
};
