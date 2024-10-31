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

const moderatorRequestTokenGenerator = async ({
  payload
}: {
  payload: Record<string, string>,
}) => {
  return AuthUtils.createToken(
    payload,
    config.JWT_MODERATOR_REQUEST_SECRET,
    config.JWT_MODERATOR_REQUEST_EXPIRES_IN,
  );
};

const makeEveryKeyFalse = ({ payload }: { payload: IPermissionType }) => {
  Object.keys(payload).forEach((data) => {
    if (typeof payload[data] === "object" && payload[data] !== null) {
      return makeEveryKeyFalse({ payload: payload[data] });
    } else {
      payload[data] = false;
    }
  });

  return payload;
};

const recursivePermissionAdjust = ({
  mainPermissions,
  payloadPermissions,
  warningMap,
}: {
  mainPermissions: IPermissionType,
  payloadPermissions: IPermissionType,
  warningMap: IPermissionType,
}) => {
  Object.keys(mainPermissions).forEach((permission: string) => {
    if (
      typeof mainPermissions[permission] === "object" &&
      mainPermissions[permission] !== null
    ) {
      warningMap[permission] = {};

      if (!payloadPermissions[permission])
        payloadPermissions[permission] = makeEveryKeyFalse({
          payload: mainPermissions[permission],
        });

      return recursivePermissionAdjust({
        mainPermissions: mainPermissions[permission] as IPermissionType,
        payloadPermissions: payloadPermissions[permission] as IPermissionType,
        warningMap: warningMap[permission] as IPermissionType,
      });
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

const recursiveWarningMapAdjuster = ({
  warningMap,
  warningCount = 0,
}: {
  warningMap: IPermissionType,
  warningCount?: number,
}) => {
  Object.keys(warningMap).forEach((warningKey) => {
    if (
      typeof warningMap[warningKey] === "object" &&
      warningMap[warningKey] !== null
    ) {
      if (Object.keys(warningMap[warningKey]).length) {
        const result = recursiveWarningMapAdjuster({
          warningMap: warningMap[warningKey],
          warningCount,
        });
        warningCount = result.warningCount;
      } else delete warningMap[warningKey];
    } else if (warningMap[warningKey]) warningCount++;
  });

  return { warningMap, warningCount };
};

const comparePermissionAndAdjust = ({
  payloadPermissions,
  mainPermissions = defaultPermissions,
}: {
  payloadPermissions: IModeratorPermissions,
  mainPermissions: IModeratorPermissions,
}) => {
  const result = recursivePermissionAdjust({
    mainPermissions: mainPermissions as IPermissionType,
    payloadPermissions: payloadPermissions as IPermissionType,
    warningMap: {},
  });

  const { warningMap } = result;
  payloadPermissions = result.payloadPermissions;

  const warnings = recursiveWarningMapAdjuster({ warningMap });

  return { payloadPermissions, warnings };
};

export const ModeratorUtils = {
  moderatorRequestTokenGenerator,
  makeEveryKeyFalse,
  recursivePermissionAdjust,
  recursiveWarningMapAdjuster,
  comparePermissionAndAdjust,
};
