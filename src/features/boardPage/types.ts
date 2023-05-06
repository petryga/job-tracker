export interface Card {
  _id: string;
  text: string;
  subtext: string;
  color: string;
  isFavorite: boolean;
}

export interface List {
  _id: string;
  cards: Card[];
  title: string;
}

export interface BoardApi {
  _id: string;
  lists: List[];
  title: string;
  isJobSearchBoard: boolean;
}

export interface CardState {
  list: string;
  text: string;
  _id: string;
  color: string;
  isFavorite: boolean;
  subtext: string;
}

export interface ListState {
  _id: string;
  title: string;
  cards: string[];
}
