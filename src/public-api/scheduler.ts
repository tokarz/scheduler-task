import { Meeting } from "../model/Meeting";
import { Person } from "../model/Person";

export interface Scheduler {
  setUpMeeting(organiser: Person, people: Person[], date: Date): boolean;
  cancelMeeting(date: Date): boolean;

  addPeople(date: Date, people: Person[]): boolean;
  removePeople(date: Date, people: Person[]): boolean;

  showSchedule(people: Person): Meeting[];
  showScheduleForDate(date: Date): Meeting[];

  showAvailableMeetingSlots(
    people: Person[],
    dateFrom: Date,
    daysInAdvance: number
  ): { [date: string]: string[] };
}
