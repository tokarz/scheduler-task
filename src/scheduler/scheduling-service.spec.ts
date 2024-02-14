import { beforeEach, test, describe } from "@jest/globals";
import { MeetingScheduler } from "./scheduling-service";
import { ScheduleTimer } from "../timer/timer-service";
import { Scheduler } from "../public-api/scheduler";
import { Timer } from "../api/timer";
import { Person } from "../model/Person";

let scheduler: Scheduler;
let timerMock: Timer;

beforeEach(() => {
  timerMock = new ScheduleTimer();
  timerMock.getDateAndTime = jest.fn((date: Date) => {
    return {
      date: `${date.getUTCFullYear()}-${
        date.getUTCMonth() + 1
      }-${date.getUTCDate()}`,
      time:
        date.getUTCHours() > 9
          ? `${date.getUTCHours()}`
          : `0${date.getUTCHours()}`,
      valid: true,
    };
  });

  scheduler = new MeetingScheduler(timerMock);
});

describe("setUpMeeting Test", () => {
  test("Set up a meeting - no conflict", () => {
    const testUser: Person = { name: "John", email: "some@email.com" };
    const guestUser: Person = { email: "guest", name: "Guest" };

    expect(scheduler.showSchedule(testUser).length).toBe(0);

    expect(
      scheduler.setUpMeeting(
        testUser,
        [guestUser],
        new Date("2011-11-11T11:00:00Z")
      )
    ).toBe(true);

    expect(scheduler.showSchedule(testUser).length).toBe(1);

    const testUserMeeting = scheduler.showSchedule(testUser)[0];

    expect(testUserMeeting.date).toEqual("2011-11-11");
    expect(testUserMeeting.startTime).toEqual("11");
    expect(testUserMeeting.members[0]).toEqual(guestUser);
    expect(testUserMeeting.organiser).toEqual(testUser);
  });
  test("Set up a meeting - Adjust time to hour mark", () => {
    const testUser: Person = { name: "John", email: "some@email.com" };
    const guestUser: Person = { email: "guest", name: "Guest" };

    expect(scheduler.showSchedule(testUser).length).toBe(0);

    expect(
      scheduler.setUpMeeting(
        testUser,
        [guestUser],
        new Date("2011-11-11T11:22:00Z")
      )
    ).toBe(true);

    expect(scheduler.showSchedule(testUser).length).toBe(1);
    const scheduledUser = scheduler.showSchedule(testUser)[0];

    expect(scheduledUser.date).toEqual("2011-11-11");
    expect(scheduledUser.startTime).toEqual("11");
    expect(scheduledUser.members[0]).toEqual(guestUser);
    expect(scheduledUser.organiser).toEqual(testUser);
  });
  test("Set up a meeting - Same time - different days", () => {
    const testUser: Person = { name: "John", email: "some@email.com" };
    const guestUser: Person = { email: "guest", name: "Guest" };

    expect(scheduler.showSchedule(testUser).length).toBe(0);

    expect(
      scheduler.setUpMeeting(
        testUser,
        [guestUser],
        new Date("2011-11-11T11:22:00Z")
      )
    ).toBe(true);
    expect(
      scheduler.setUpMeeting(
        testUser,
        [guestUser],
        new Date("2011-11-12T11:22:00Z")
      )
    ).toBe(true);

    expect(scheduler.showSchedule(testUser).length).toBe(2);
    const scheduledUserDay1 = scheduler.showSchedule(testUser)[0];
    const scheduledUserDay2 = scheduler.showSchedule(testUser)[1];

    expect(scheduledUserDay1.date).toEqual("2011-11-11");
    expect(scheduledUserDay1.startTime).toEqual("11");
    expect(scheduledUserDay1.members[0]).toEqual(guestUser);
    expect(scheduledUserDay1.organiser).toEqual(testUser);

    expect(scheduledUserDay2.date).toEqual("2011-11-12");
    expect(scheduledUserDay2.startTime).toEqual("11");
    expect(scheduledUserDay2.members[0]).toEqual(guestUser);
    expect(scheduledUserDay2.organiser).toEqual(testUser);
  });
});

describe("showSchedule - tests", () => {
  test("Show schedule of one user", () => {
    const testUser: Person = { name: "John", email: "some@email.com" };
    const guestUser: Person = { email: "guest", name: "Guest" };

    expect(
      scheduler.setUpMeeting(
        testUser,
        [guestUser],
        new Date("2011-11-11T11:22:00Z")
      )
    ).toBe(true);

    expect(scheduler.showSchedule(testUser)).toEqual([
      {
        date: "2011-11-11",
        startTime: "11",
        members: [guestUser],
        organiser: testUser,
      },
    ]);

    expect(scheduler.showSchedule(guestUser)).toEqual([
      {
        date: "2011-11-11",
        startTime: "11",
        members: [guestUser],
        organiser: testUser,
      },
    ]);
  });

  test("Show schedule of onde day", () => {
    const testUser: Person = { name: "John", email: "some@email.com" };
    const guestUser: Person = { email: "guest", name: "Guest" };

    scheduler.setUpMeeting(
      testUser,
      [guestUser],
      new Date("2011-11-11T11:22:00Z")
    );
    scheduler.setUpMeeting(
      testUser,
      [guestUser],
      new Date("2011-11-11T12:22:00Z")
    );
    scheduler.setUpMeeting(
      testUser,
      [guestUser],
      new Date("2011-11-11T13:22:00Z")
    );

    expect(
      scheduler.showScheduleForDate(new Date("2011-11-11")).length
    ).toEqual(3);
  });
});

describe("cancelMeeting - test", () => {
  test("cancel for organiser and members", () => {
    const testUser: Person = { name: "John", email: "some@email.com" };
    const guestUser: Person = { email: "guest", name: "Guest" };

    expect(
      scheduler.setUpMeeting(
        testUser,
        [guestUser],
        new Date("2011-11-11T11:00:00Z")
      )
    ).toBe(true);

    expect(scheduler.showSchedule(testUser).length).toBe(1);
    expect(scheduler.showSchedule(testUser)[0]).not.toBeUndefined();
    expect(scheduler.showSchedule(guestUser)[0]).not.toBeUndefined();

    expect(scheduler.cancelMeeting(new Date("2011-11-11T11:00:00Z"))).toBe(
      true
    );
    expect(scheduler.showSchedule(testUser).length).toBe(0);
    expect(scheduler.showSchedule(testUser)[0]).toBeUndefined();
    expect(scheduler.showSchedule(guestUser)[0]).toBeUndefined();
  });

  test("cancel for wrong date should not cancel meeting - wrong time", () => {
    const testUser: Person = { name: "John", email: "some@email.com" };
    const guestUser: Person = { email: "guest", name: "Guest" };
    const guestUser2: Person = { email: "guest2", name: "Guest2" };

    expect(
      scheduler.setUpMeeting(
        testUser,
        [guestUser, guestUser2],
        new Date("2011-11-11T11:00:00Z")
      )
    ).toBe(true);

    expect(scheduler.showSchedule(testUser).length).toBe(1);
    expect(scheduler.showSchedule(testUser)[0]).not.toBeUndefined();
    expect(scheduler.showSchedule(guestUser)[0]).not.toBeUndefined();

    expect(scheduler.cancelMeeting(new Date("2011-11-11T12:00:00Z"))).toBe(
      false
    );
    expect(scheduler.showSchedule(testUser).length).toBe(1);

    expect(scheduler.showSchedule(testUser)[0]).not.toBeUndefined();
    expect(scheduler.showSchedule(guestUser)[0]).not.toBeUndefined();
    expect(scheduler.showSchedule(guestUser2)[0]).not.toBeUndefined();
  });

  test("cancel for wrong date should not cancel meeting - wrong date", () => {
    const testUser: Person = { name: "John", email: "some@email.com" };
    const guestUser: Person = { email: "guest", name: "Guest" };
    const guestUser2: Person = { email: "guest2", name: "Guest2" };

    expect(
      scheduler.setUpMeeting(
        testUser,
        [guestUser, guestUser2],
        new Date("2011-11-12T12:00:00Z")
      )
    ).toBe(true);

    expect(scheduler.showSchedule(testUser).length).toBe(1);
    expect(scheduler.showSchedule(testUser)[0]).not.toBeUndefined();
    expect(scheduler.showSchedule(guestUser)[0]).not.toBeUndefined();

    expect(scheduler.cancelMeeting(new Date("2011-11-11T12:00:00Z"))).toBe(
      false
    );
    expect(scheduler.showSchedule(testUser).length).toBe(1);

    expect(scheduler.showSchedule(testUser)[0]).not.toBeUndefined();
    expect(scheduler.showSchedule(guestUser)[0]).not.toBeUndefined();
    expect(scheduler.showSchedule(guestUser2)[0]).not.toBeUndefined();
  });
});

describe("addPeople - test", () => {
  test("add people to meeting", () => {
    const testUser: Person = { name: "John", email: "some@email.com" };
    const guestUser: Person = { email: "guest@someGuest.com", name: "Guest" };
    const guestUser2: Person = {
      email: "guest2@someGuest.com",
      name: "Guest2",
    };

    scheduler.setUpMeeting(
      testUser,
      [guestUser],
      new Date("2011-11-12T12:00:00Z")
    );

    expect(scheduler.showSchedule(testUser).length).toBe(1);
    expect(scheduler.showSchedule(guestUser).length).toBe(1);
    expect(scheduler.showSchedule(guestUser2).length).toBe(0);

    expect(
      scheduler.addPeople(new Date("2011-11-12T12:00:00Z"), [guestUser2])
    ).toBe(true);
    expect(scheduler.showSchedule(guestUser2).length).toBe(1);
  });
});

describe("removePeople - test", () => {
  test("remove people from meeting", () => {
    const testUser: Person = { name: "John", email: "some@email.com" };
    const guestUser: Person = { email: "guest@someGuest.com", name: "Guest" };
    const guestUser2: Person = {
      email: "guest2@someGuest.com",
      name: "Guest2",
    };

    scheduler.setUpMeeting(
      testUser,
      [guestUser, guestUser2],
      new Date("2011-11-12T12:00:00Z")
    );

    expect(scheduler.showSchedule(testUser).length).toBe(1);
    expect(scheduler.showSchedule(guestUser).length).toBe(1);
    expect(scheduler.showSchedule(guestUser2).length).toBe(1);

    expect(
      scheduler.removePeople(new Date("2011-11-12T12:00:00Z"), [guestUser])
    ).toBe(true);
    expect(scheduler.showSchedule(guestUser2).length).toBe(1);
    expect(scheduler.showSchedule(guestUser).length).toBe(0);
    expect(scheduler.showSchedule(testUser).length).toBe(1);
  });
});

describe("showAvailableMeetingSlots - test", () => {
  test("Get available slots for 2 people - no meetings", () => {
    const testUser: Person = { name: "John", email: "some@email.com" };
    const guest: Person = { name: "John2", email: "some2@email.com" };
    expect(
      scheduler.showAvailableMeetingSlots(
        [testUser, guest],
        new Date("2011-11-11T15:00:00Z"),
        1
      )
    ).toEqual({
      "2011-11-11": ["15", "16", "17", "18", "19", "20", "21", "22", "23"],
    });
  });

  test("Get available slots for 2 people - no overlapping meetings", () => {
    const testUser: Person = { name: "John", email: "some@email.com" };
    const guest: Person = { name: "John2", email: "some2@email.com" };
    const date = new Date("2011-11-11T15:00:00Z");

    scheduler.setUpMeeting(testUser, [], new Date("2011-11-11T17:00:00Z"));
    scheduler.setUpMeeting(guest, [], new Date("2011-11-11T18:00:00Z"));

    expect(
      scheduler.showAvailableMeetingSlots([testUser, guest], date, 1)
    ).toEqual({
      "2011-11-11": ["15", "16", "19", "20", "21", "22", "23"],
    });
  });

  test("Get available slots for 2 people - no overlapping meetings - 2 days ahead", () => {
    const testUser: Person = { name: "John", email: "some@email.com" };
    const guest: Person = { name: "John2", email: "some2@email.com" };
    const date = new Date("2011-11-11T15:00:00Z");

    scheduler.setUpMeeting(testUser, [], new Date("2011-11-11T17:00:00Z"));
    scheduler.setUpMeeting(guest, [], new Date("2011-11-11T18:00:00Z"));

    const fullDay = [...Array(24).keys()].map((key) =>
      key > 9 ? `${key}` : `0${key}`
    );

    expect(
      scheduler.showAvailableMeetingSlots([testUser, guest], date, 2)
    ).toEqual({
      "2011-11-11": ["15", "16", "19", "20", "21", "22", "23"],
      "2011-11-12": fullDay,
    });
  });

  test("Get available slots for 2 people - overlapping meetings", () => {
    const testUser: Person = { name: "John", email: "some@email.com" };
    const guest: Person = { name: "John2", email: "some-different@email.com" };
    const date = new Date("2011-11-11T15:00:00Z");

    scheduler.setUpMeeting(testUser, [guest], new Date("2011-11-11T17:00:00Z"));
    scheduler.setUpMeeting(guest, [], new Date("2011-11-11T18:00:00Z"));

    expect(
      scheduler.showAvailableMeetingSlots([testUser, guest], date, 1)
    ).toEqual({
      "2011-11-11": ["15", "16", "19", "20", "21", "22", "23"],
    });

    expect(scheduler.showAvailableMeetingSlots([testUser], date, 1)).toEqual({
      "2011-11-11": ["15", "16", "18", "19", "20", "21", "22", "23"],
    });

    expect(scheduler.showAvailableMeetingSlots([guest], date, 1)).toEqual({
      "2011-11-11": ["15", "16", "19", "20", "21", "22", "23"],
    });
  });
});
