const generateReactionNotificationType = (
  prefix: string,
  reactionList: Record<string, string>,
) => {
  const reactions = Object.values(reactionList);

  const reactionTypeList: Record<string, string> = {};

  reactions.forEach((reaction) => {
    reactionTypeList[`${prefix}_${reaction}`] = `${prefix}_${reaction}`;
  });
  return reactionTypeList;
};

export const NotificationUtils = {
  generateReactionNotificationType,
};
