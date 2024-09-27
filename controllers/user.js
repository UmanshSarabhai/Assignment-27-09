let members = [];

// Helper function to find a member by email
const findMemberByEmail = (email) => {
  return members.find((member) => member.email === email);
};

// Get user membership information
module.exports.getUserMembershipInfo = async (req, res, next) => {
  try {
    const { email } = req.query;

    // Validate email
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const member = findMemberByEmail(email);
    if (!member) {
      return res.status(404).json({ message: "Member not found." });
    }
    res.json({ member });
  } catch (e) {
    console.error(e + " : " + req + " : " + "User");
    next(e);
  }
};

// Register a new user
module.exports.registerUser = async (req, res) => {
  const { name, email, startDate } = req.body;

  // Validate input fields
  if (!name || !email || !startDate) {
    return res
      .status(400)
      .json({ message: "Please provide name, email, and start date." });
  }

  if (findMemberByEmail(email)) {
    return res
      .status(400)
      .json({ message: "A member with this email already exists." });
  }

  const newMember = {
    name,
    email,
    startDate,
    active: true,
  };

  members.push(newMember);
  res.status(201).json({
    message: "Membership registered successfully!",
    member: newMember,
  });
};

// View all active memberships
module.exports.viewActiveMemberships = async (req, res) => {
  const activeMembers = members.filter((member) => member.active);
  res.json({ members: activeMembers });
};

// Terminate a membership
module.exports.terminateMembership = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  const member = findMemberByEmail(email);
  if (!member) {
    return res.status(404).json({ message: "Member not found." });
  }

  member.active = false;
  res.json({ message: "Membership canceled successfully!" });
};

// Modify membership start date
module.exports.modifyMembershipStartDate = async (req, res) => {
  const { email, newStartDate } = req.body;

  if (!email || !newStartDate) {
    return res
      .status(400)
      .json({ message: "Email and new start date are required." });
  }

  const member = findMemberByEmail(email);
  if (!member) {
    return res.status(404).json({ message: "Member not found." });
  }

  member.startDate = newStartDate;
  res.json({ message: "Membership start date updated successfully!", member });
};
