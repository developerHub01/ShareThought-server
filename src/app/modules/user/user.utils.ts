type TGenerateAvatarURL = (
  gender: "male" | "female",
  userName: string,
) => string;

const generateAvatarURL: TGenerateAvatarURL = (gender, userName) => {
  const genderValue = gender === "male" ? "boy" : "girl";
  return `https://avatar.iran.liara.run/public/${genderValue}?username=${userName}`;
};

export const UserUtils = {
  generateAvatarURL,
};
