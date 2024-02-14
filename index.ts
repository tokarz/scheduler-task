import { MeetingScheduler } from "./src/scheduler/scheduling-service";
import { ScheduleTimer } from "./src/timer/timer-service";

const scheduler = new MeetingScheduler(new ScheduleTimer());

const users = [];

const members = [];

const dates = [];

for (let i = 0; i < 1000; i++) {
  members.push({
    email: `Member-${i}@mail.com`,
    name: `Member-${i}`,
  });
}

for (let i = 0; i < 100; i++) {
  users.push({
    email: `User-${i}@mail.com`,
    name: `User-${i}`,
  });
}

for (let i = 0; i < 10; i++) {
  dates.push(new Date(2011, i % 8, i % 28, i % 9, i % 59, 0, 0));
}

for (let i = 0; i < 100; i++) {
  scheduler.setUpMeeting(
    users[i],
    members,
    dates[i % 10]
  );
}

console.log(`******************SCHEDULER 1.0*****************************`);
dates.forEach((date) => {
  console.table(scheduler.showScheduleForDate(date));
});
