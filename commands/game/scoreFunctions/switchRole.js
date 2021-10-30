
module.exports = {

	async switchRole(user, oldRole, newRole) {

    try {

      await user.roles.remove(oldRole);
      await user.roles.add(newRole);
      return true;

    } catch (e) {
      console.log(e);
      return false;
    }

	},
};
