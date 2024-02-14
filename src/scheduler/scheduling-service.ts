import { Scheduler } from "../public-api/scheduler";
import { Timer } from "../api/timer";
import { Meeting, TimeSlot } from "../model/Meeting";
import { Person } from "../model/Person";

export class MeetingScheduler implements Scheduler {
  private arrangedMeetings: { [date: string]: Meeting[] } = {};
  private usersMeetings: { [email: string]: Date[] } = {};

  constructor(private readonly timer: Timer) {}

  public setUpMeeting(
    organiser: Person,
    invitedMembers: Person[],
    meetingDate: Date
  ): boolean {
    const { date, time, valid } = this.timer.getDateAndTime(meetingDate);

    if (valid) {
      const slotsForDate = this.arrangedMeetings[date];

      const newMeeting = {
        date: date,
        startTime: time,
        organiser: organiser,
        members: invitedMembers,
      };

      if (this.noMeetingsForDateFound(slotsForDate)) {
        this.arrangedMeetings[date] = [];

        this.setUpAMeeting(organiser, date, meetingDate, newMeeting);

        return true;
      } else {
        const meetingSlotIsTaken = slotsForDate.find(
          (timeSlot: TimeSlot) =>
            timeSlot.date === date && timeSlot.startTime === time
        );

        if (meetingSlotIsTaken) {
          return false;
        } else {
          this.setUpAMeeting(organiser, date, meetingDate, newMeeting);

          return true;
        }
      }
    }

    return false;
  }

  cancelMeeting(meetingDate: Date): boolean {
    const { date, time } = this.timer.getDateAndTime(meetingDate);

    const cancelledMeetings =
      this.arrangedMeetings[date]?.filter(
        (meeting: Meeting) => meeting.startTime === time
      ) || [];

    cancelledMeetings.forEach((meeting) => {
      const allMembers = [...meeting.members, meeting.organiser];
      allMembers.forEach((member) => {
        delete this.usersMeetings[member.email];
      });
    });

    return !!cancelledMeetings.length;
  }

  addPeople(meetingDate: Date, people: Person[]): boolean {
    const { date, time } = this.timer.getDateAndTime(meetingDate);
    const meetingToEdit = {
      ...this.arrangedMeetings[date]?.find(
        (meeting) => meeting.startTime === time
      ),
    };
    if (meetingToEdit) {
      if (meetingToEdit.members?.length) {
        meetingToEdit.members = [...meetingToEdit.members, ...people];
      } else {
        meetingToEdit.members = people;
      }

      people.forEach((person) => {
        if (!this.usersMeetings[person.email]) {
          this.usersMeetings[person.email] = [];
        }

        this.usersMeetings[person.email] = [
          ...this.usersMeetings[person.email],
          meetingDate,
        ];
      });
    } else {
      return false;
    }

    return true;
  }

  removePeople(meetingDate: Date, people: Person[]): boolean {
    const { date, time } = this.timer.getDateAndTime(meetingDate);
    const meetingToEdit = {
      ...this.arrangedMeetings[date]?.find(
        (meeting) => meeting.startTime === time
      ),
    };
    if (meetingToEdit) {
      meetingToEdit.members = meetingToEdit.members?.filter(
        (person) => !people.includes(person)
      );

      people.forEach((person) => {
        if (this.usersMeetings[person.email]) {
          this.usersMeetings[person.email] = this.usersMeetings[
            person.email
          ].filter((date) => date === meetingDate);
        }
      });
    } else {
      return false;
    }

    return true;
  }

  public showSchedule(people: Person): Meeting[] {
    const allMeetings: Meeting[] = [];
    this.usersMeetings[people.email]?.forEach((meetingDate) => {
      const { date } = this.timer.getDateAndTime(meetingDate);
      allMeetings.push(...this.arrangedMeetings[date]);
    });

    return allMeetings;
  }

  public showScheduleForDate(meetingDate: Date): Meeting[] {
    const { date } = this.timer.getDateAndTime(meetingDate);

    return this.arrangedMeetings[date];
  }

  public showAvailableMeetingSlots(
    people: Person[],
    dateFrom = new Date(Date.now()),
    daysInAdvance = 1
  ): { [date: string]: string[] } {
    const result: { [date: string]: string[] } = {};

    for (let i = 0; i < daysInAdvance; i++) {
      const today = new Date(dateFrom);

      const originDate = this.timer.getDateAndTime(today).date;
      today.setDate(new Date(originDate).getDate() + i);

      const { date, time } = this.timer.getDateAndTime(today);

      const startTime = i === 0 ? +time : 0;
      result[date] = [];

      const meetingStartTimes = (this.arrangedMeetings[date] || [])
        .filter(
          (meeting) =>
            people
              .map((person) => person.email)
              .includes(meeting.organiser.email) ||
            !!people
              .map((person) => person.email)
              .filter((p) =>
                meeting.members.map((member) => member.email).includes(p)
              ).length
        )
        .map((meeting) => meeting.startTime);

      for (let i = startTime; i < 24; i++) {
        const paddedTime = i > 9 ? `${i}` : `0${i}`;
        if (!meetingStartTimes.includes(paddedTime)) {
          result[date].push(paddedTime);
        }
      }
    }

    return result;
  }

  private setUpAMeeting(
    organiser: Person,
    day: string,
    meetingDate: Date,
    newMeeting: Meeting
  ) {
    if (!organiser?.email) {
      return false;
    }
    this.arrangedMeetings[day].push(newMeeting);

    if (!this.usersMeetings[organiser?.email]) {
      this.usersMeetings[organiser?.email] = [];
    }

    this.usersMeetings[organiser.email].push(meetingDate);

    newMeeting.members.forEach((invitedMember) => {
      if (!this.usersMeetings[invitedMember.email]) {
        this.usersMeetings[invitedMember.email] = [];
      }
      this.usersMeetings[invitedMember.email].push(meetingDate);
    });
  }

  private noMeetingsForDateFound(slotsForDate: Meeting[]) {
    return !slotsForDate?.length;
  }
}
