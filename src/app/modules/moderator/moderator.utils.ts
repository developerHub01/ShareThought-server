import config from "../../config";
import { AuthUtils } from "../auth/auth.utils";
import { IModeratorPermissions } from "./moderator.interface";

const defaultPermissions = {
  moderator: {
    add: false,
    canRemove: false,
    update: false,
  },
  post: {
    create: false,
    update: false,
    delete: false,
    hide: false,
    show: false,
    pin: false,
    unpin: false,
  },
  communityPost: {
    create: false,
    update: false,
    delete: false,
    hide: false,
    show: false,
  },
  comment: {
    create: false,
    update: false,
    delete: false,
    hide: false,
    show: false,
    pin: false,
    unpin: false,
  },
  channel: {},
};

// Define a recursive permission type using an interface
interface IPermissionType {
  [key: string]: boolean | IPermissionType;
}

const moderatorRequestTokenGenerator = async (
  payload: Record<string, string>,
) => {
  return AuthUtils.createToken(
    payload,
    config.JWT_MODERATOR_REQUEST_SECRET,
    config.JWT_MODERATOR_REQUEST_EXPIRES_IN,
  );
};

const makeEveryKeyFalse = (payload: IPermissionType) => {
  Object.keys(payload).forEach((data) => {
    if (typeof payload[data] === "object" && payload[data] !== null) {
      return makeEveryKeyFalse(payload[data]);
    } else {
      payload[data] = false;
    }
  });

  return payload;
};

const recursivePermissionAdjust = (
  mainPermissions: IPermissionType,
  payloadPermissions: IPermissionType,
  warningMap: IPermissionType,
) => {
  Object.keys(mainPermissions).forEach((permission: string) => {
    if (
      typeof mainPermissions[permission] === "object" &&
      mainPermissions[permission] !== null
    ) {
      warningMap[permission] = {};

      if (!payloadPermissions[permission])
        payloadPermissions[permission] = makeEveryKeyFalse(
          mainPermissions[permission],
        );

      return recursivePermissionAdjust(
        mainPermissions[permission] as IPermissionType,
        payloadPermissions[permission] as IPermissionType,
        warningMap[permission] as IPermissionType,
      );
    } else {
      if (!(permission in payloadPermissions))
        payloadPermissions[permission] = false;

      if (payloadPermissions[permission]) {
        if (mainPermissions[permission] !== payloadPermissions[permission])
          warningMap[permission] = true;

        payloadPermissions[permission] = mainPermissions[permission];
      }
    }
  });

  return { payloadPermissions, warningMap };
};

const recursiveWarningMapAdjuster = (
  warningMap: IPermissionType,
  warningCount = 0,
) => {
  Object.keys(warningMap).forEach((warningKey) => {
    if (
      typeof warningMap[warningKey] === "object" &&
      warningMap[warningKey] !== null
    ) {
      if (Object.keys(warningMap[warningKey]).length) {
        const result = recursiveWarningMapAdjuster(
          warningMap[warningKey],
          warningCount,
        );
        warningCount = result.warningCount;
      } else delete warningMap[warningKey];
    } else if (warningMap[warningKey]) warningCount++;
  });

  return { warningMap, warningCount };
};

const comparePermissionAndAdjust = (
  payloadPermissions: IModeratorPermissions,
  mainPermissions: IModeratorPermissions = defaultPermissions,
) => {
  const result = recursivePermissionAdjust(
    mainPermissions as IPermissionType,
    payloadPermissions as IPermissionType,
    {},
  );

  const { warningMap } = result;
  payloadPermissions = result.payloadPermissions;

  const warnings = recursiveWarningMapAdjuster(warningMap);

  return { payloadPermissions, warnings };
};

export const ModeratorUtils = {
  moderatorRequestTokenGenerator,
  makeEveryKeyFalse,
  recursivePermissionAdjust,
  recursiveWarningMapAdjuster,
  comparePermissionAndAdjust,
};
