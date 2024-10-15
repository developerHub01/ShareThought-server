const getDateFromTimePeriod = (timePeriod: string) => {
  const currentData = new Date();

  switch (timePeriod) {
    case "last7Days":
      return new Date(currentData.setDate(currentData.getDate() - 7));
    case "last28Days":
      return new Date(currentData.setDate(currentData.getDate() - 28));
    case "last90Days":
      return new Date(currentData.setDate(currentData.getDate() - 90));
    case "last365Days":
      return new Date(currentData.setDate(currentData.getDate() - 365));
    case "lifetime":
    default:
      return null;
  }
};

export const FollowerUtils = {
  getDateFromTimePeriod,
};
