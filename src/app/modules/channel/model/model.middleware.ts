import channelSchema from "./model.schema";

channelSchema.pre("save", function (next) {
  this.channelAvatar = `https://avatar.iran.liara.run/username?username=${this.channelName?.split(" ")?.join("_")}`;
  return next();
});
