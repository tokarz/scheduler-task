export interface Timer {
  getDateAndTime(date: Date): { date: string; time: string; valid: boolean };
}
