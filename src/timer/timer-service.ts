import { Timer } from "../api/timer";

export class ScheduleTimer implements Timer {
  public getDateAndTime(date: Date): {
    date: string;
    time: string;
    valid: boolean;
  } {
    if (date.toString() === "Invalid Date") {
      return {
        valid: false,
        time: "",
        date: "",
      };
    }
    
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hour = String(date.getUTCHours()).padStart(2, "0");

    return {
      date: `${year}-${month}-${day}`,
      time: hour,
      valid: true,
    };
  }
}
