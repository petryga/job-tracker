import { AnyAction, Dispatch } from "redux";

export interface Contact {
  _id?: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  contactNotes: string;
  companyName: string;
}

export interface Job {
  companyName: string;
  position: string;
  location: string;
  salary: string;
  extras: string;
  link: string;
  description: string;
  notes: string;
  isFavorite: boolean;
  contacts: Contact[];
}

export interface TitleProps {
  cardTitle: string;
  dispatch: Dispatch<AnyAction>;
  liked: boolean;
  setLiked: React.Dispatch<React.SetStateAction<boolean>>;
  isFavorite: boolean;
}

export interface ContactsTabProps {
  formData: Job;
  setFormData: React.Dispatch<Job>;
}

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
