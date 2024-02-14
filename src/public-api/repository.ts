import { Person } from "../model/Person";

export interface Repository {
  addPerson(person: Person): boolean;
  removePerson(person: Person): boolean;
  
  getPersonByEmail(email: string): Person | undefined;
}
