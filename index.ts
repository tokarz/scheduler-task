import { Person } from "./src/model/Person";
import { PeopleRepository } from "./src/repository/people-repository";
import { MeetingScheduler } from "./src/scheduler/scheduling-service";
import { ScheduleTimer } from "./src/timer/timer-service";

const repository = new PeopleRepository();
const scheduler = new MeetingScheduler(new ScheduleTimer());

const users: Person[] = [];

const members: Person[] = [];

const dates: Date[] = [];

for (let i = 0; i < 1000; i++) {
  const person: Person = {
    email: `Member-${i}@mail.com`,
    name: `Member-${i}`,
  };

  repository.addPerson(person);
  members.push(person);
}

for (let i = 0; i < 100; i++) {
  const user: Person = {
    email: `User-${i}@mail.com`,
    name: `User-${i}`,
  };

  repository.addPerson(user);
  users.push(user);
}

for (let i = 0; i < 10; i++) {
  dates.push(new Date(2011, i % 8, i % 28, i % 9, i % 59, 0, 0));
}

for (let i = 0; i < 100; i++) {
  scheduler.setUpMeeting(users[i], members, dates[i % 10]);
}

console.log(`******************SCHEDULER 1.0*****************************`);
dates.forEach((date) => {
  console.table(scheduler.showScheduleForDate(date));
});
