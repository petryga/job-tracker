import { INITIAL_VALUES } from "features/jobModal/helpers";

export const getPlaceholder = (list: boolean, isJobSearchBoard: boolean) => {
  if (list) {
    return "Enter list title";
  }

  if (isJobSearchBoard) {
    return "Enter company name";
  }

  return "Enter a title for this card";
};

export const getNewJobData = (companyName: string, id: string) => {
  return {
    ...INITIAL_VALUES,
    companyName,
    id,
  };
};
