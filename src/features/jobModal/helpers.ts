import isEqual from "lodash/isEqual";
import { withCommas } from "utils/stringUtils";
import { Dispatch } from "react";
import type { Job } from "./types";

export enum Fields {
  companyName = "companyName",
  position = "position",
  location = "location",
  salary = "salary",
  remoteOnsite = "remoteOnsite",
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
  position = "position",
}

export const CONTACTS_FIELDS = [
  {
    name: ContactFields.name,
    label: "Name",
    required: true,
  },
  {
    name: ContactFields.position,
    label: "Position",
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
    name: Fields.remoteOnsite,
    label: "Remote / On-site",
    options: [
      { value: "Remote", label: "Remote" },
      { value: "On-site", label: "On-site" },
      { value: "Hybrid", label: "Hybrid" },
    ],
  },
  {
    name: Fields.salary,
    label: "Salary",
    icon: "$",
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
  _id: "",
  jobID: "",
  [ContactFields.name]: "",
  [ContactFields.position]: "",
  [ContactFields.email]: "",
  [ContactFields.phone]: "",
  [ContactFields.notes]: "",
  [ContactFields.companyName]: "",
};

export const INITIAL_VALUES: Job = {
  [Fields.companyName]: "",
  [Fields.position]: "",
  [Fields.location]: "",
  [Fields.salary]: "",
  [Fields.remoteOnsite]: "",
  [Fields.link]: "",
  [Fields.notes]: "",
  [Fields.description]: "",
  isFavorite: false,
  contacts: [CONTACTS_FIELDS_INITIAL_VALUES],
};

const wideFields = [Fields.link, Fields.salary];
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

  if (name === Fields.remoteOnsite) {
    return { width: WIDTH, marginTop: MARGIN };
  }

  return { width: WIDTH };
};

export const getWidth = ({ length }: { length: number }) => {
  if (length === 1) {
    return "50%";
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

export const openLink = (link: string) => {
  if (!link.includes("http")) {
    link = `https://${link}`;
  }

  window.open(link, "_blank", "noopener noreferrer");
};
