import { Person } from "./Person";

export interface TimeSlot {
  date: string;
  startTime: string;
}

export interface Meeting extends TimeSlot {
  organiser: Person;
  members: Person[];
}
