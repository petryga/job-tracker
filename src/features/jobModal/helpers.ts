import isEqual from "lodash/isEqual";
import { withCommas } from "utils/stringUtils";
import { Dispatch } from "react";
import { Job } from "./types";

export enum Fields {
  companyName = "companyName",
  position = "position",
  location = "location",
  salary = "salary",
  extras = "extras",
  link = "link",
  notes = "notes",
  description = "description",
}

export enum ContactFields {
  name = "contactName",
  email = "contactEmail",
  phone = "contactPhone",
  notes = "contactNotes",
  companyName = "companyName",
}

export const CONTACTS_FIELDS = [
  {
    name: ContactFields.name,
    label: "Name",
  },
  {
    name: ContactFields.email,
    label: "Email",
  },
  {
    name: ContactFields.phone,
    label: "Phone",
  },

  {
    name: ContactFields.notes,
    label: "Notes",
    type: "textarea",
  },
];

export const JOB_DETAILS_FIELDS = [
  {
    name: Fields.companyName,
    label: "Company Name",
    required: true,
  },
  {
    name: Fields.position,
    label: "Position",
  },
  {
    name: Fields.location,
    label: "Location",
  },
  {
    name: Fields.salary,
    label: "Base Salary",
    icon: "$",
  },
  {
    name: Fields.extras,
    label: "Extras",
  },
  {
    name: Fields.link,
    label: "Link",
    placeholder: "https://",
  },
  {
    name: Fields.notes,
    label: "Notes",
    type: "textarea",
  },
];

export const CONTACTS_FIELDS_INITIAL_VALUES = {
  id: "",
  jobID: "",
  [ContactFields.name]: "",
  [ContactFields.email]: "",
  [ContactFields.phone]: "",
  [ContactFields.notes]: "",
  [ContactFields.companyName]: "",
};

export const INITIAL_VALUES: Job = {
  id: "",
  [Fields.companyName]: "",
  [Fields.position]: "",
  [Fields.location]: "",
  [Fields.salary]: "",
  [Fields.extras]: "",
  [Fields.link]: "",
  [Fields.notes]: "",
  [Fields.description]: "",
  isFavorite: false,
  contacts: [CONTACTS_FIELDS_INITIAL_VALUES],
};

const wideFields = [Fields.link, Fields.extras];
const MARGIN = "10px";
const WIDTH = "44%";

export const getStyle = (isTextArea: boolean, name: Fields) => {
  if (wideFields.includes(name)) {
    return { width: "90%", marginTop: MARGIN };
  }

  if (isTextArea) {
    return { width: "90%", marginTop: "13px" };
  }

  if (name === Fields.location) {
    return { width: WIDTH, marginTop: MARGIN, marginRight: MARGIN };
  }

  if (name === Fields.companyName) {
    return { width: WIDTH, marginRight: MARGIN };
  }

  if (name === Fields.salary) {
    return { width: WIDTH, marginTop: MARGIN };
  }

  return { width: WIDTH };
};

export const getWidth = ({ length }: { length: number }) => {
  if (length === 1) {
    return "49%";
  }

  return "95%";
};

export const getIsButtonDisabled = (formData: Job, job?: Job) => {
  return !formData.companyName || isEqual(formData, job);
};

export const handleFormatSalary = (
  name: string,
  formData: typeof INITIAL_VALUES,
  setFormData: Dispatch<Job>
) => {
  if (name === Fields.salary && formData.salary) {
    const salary = withCommas(formData.salary);
    setFormData({ salary } as Pick<Job, keyof Job>);
  }
};
