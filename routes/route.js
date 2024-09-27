const user = require("../controllers/user"); // Import the user controller, which contains the logic for managing user-related actions

module.exports = (app) => {
  // API for registering a new gym membership
  // Expects user details (name, email, start date) in the request body
  // Responds with membership details including user info and start date
  app.post("/registerMember", user.registerUser);

  // API for retrieving a user's gym membership details
  // Expects the user's email as a query parameter
  // Responds with membership details if found
  app.get("/getUserMembership", user.getUserMembershipInfo);

  // API for retrieving a list of all active gym members
  // Responds with basic information (name, email) of all members who have an active membership
  app.get("/activeMemberships", user.viewActiveMemberships);

  // API for canceling a user's gym membership
  // Expects the user's email in the request query
  // Terminates the membership if found
  app.patch("/cancelMembership", user.terminateMembership);

  // API for modifying the start date of a user's gym membership
  // Expects the user's email and new start date in the request body
  // Updates the membership start date if the user is found
  app.patch("/modifyStartDate", user.modifyMembershipStartDate);
};
