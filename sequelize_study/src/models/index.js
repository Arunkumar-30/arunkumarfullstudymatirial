import Auth from "./auth.model.js";
import UserDetails from "./userDetails.model.js";

Auth.hasOne(UserDetails, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  hooks: true,
});
UserDetails.belongsTo(Auth, { foreignKey: "userId" });

export { Auth, UserDetails };
