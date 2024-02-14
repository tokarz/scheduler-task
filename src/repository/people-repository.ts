import { Person } from "../model/Person";
import { Repository } from "../api/repository";

export class PeopleRepository implements Repository {
  private readonly persons: { [personEmail: string]: Person } = {};

  public addPerson(person: Person): boolean {
    let result = true;
    if (this.personAlreadyExists(person.email)) {
      result = false;
    } else {
      this.persons[person.email] = person;
    }

    return result;
  }
  public removePerson(person: Person): boolean {
    const { email } = person;

    if (this.personAlreadyExists(email)) {
      delete this.persons[email];
      return true;
    }
    return false;
  }

  public getPersonByEmail(email?: string): Person | undefined {
    return this.persons[email || ""];
  }

  private personAlreadyExists(personEmail: string): boolean {
    return !!Object.keys(this.persons).find(
      (storedPersonEmail: string) => storedPersonEmail === personEmail
    );
  }
}
