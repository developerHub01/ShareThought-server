import config from "../../config";
import { AuthUtils } from "../auth/auth.utils";

const moderatorRequestTokenGenerator = async (
  payload: Record<string, string>,
) => {
  return AuthUtils.createToken(
    payload,
    config.JWT_MODERATOR_REQUEST_SECRET,
    config.JWT_MODERATOR_REQUEST_EXPIRES_IN,
  );
};

export const ModeratorUtils = {
  moderatorRequestTokenGenerator,
};
