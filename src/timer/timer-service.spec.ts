import { Timer } from "../api/timer";
import { ScheduleTimer } from "./timer-service";

let sut: Timer;

beforeEach(() => {
  sut = new ScheduleTimer();
});

test("it should divide date to date and time object", () => {
  const dateObject = new Date("2011-11-11 13:00:00");
  const utcTime = dateObject.getUTCHours();

  expect(sut.getDateAndTime(dateObject)).toEqual({
    date: "2011-11-11",
    time: `${utcTime}`,
    valid: true,
  });
});

test("it should divide date to date and time object - time from 00 - 09:00", () => {
  const dateObject = new Date("2011-11-12 09:00:00");
  const utcTime = dateObject.getUTCHours();

  expect(sut.getDateAndTime(dateObject)).toEqual({
    date: "2011-11-12",
    time: utcTime > 9 ? `${utcTime}` : `0${utcTime}`,
    valid: true,
  });
});

test("it should display an invalid date indicator", () => {
  const dateObject = new Date("2011-22-22 13:00:00");

  expect(sut.getDateAndTime(dateObject)).toEqual({
    date: "",
    time: "",
    valid: false,
  });
});
