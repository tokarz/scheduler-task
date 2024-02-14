import { beforeEach, test, expect } from "@jest/globals";
import { PeopleRepository } from "./people-repository";
import { Repository } from "../api/repository";

let sut: Repository;

beforeEach(() => {
  sut = new PeopleRepository();
});

test("Should allow only one user to be created", () => {
  const uniquePersonEmail = "some-email@email.com";

  expect(sut.addPerson({ email: uniquePersonEmail, name: "Mike" })).toBe(true);
  expect(sut.getPersonByEmail(uniquePersonEmail)?.name).toBe("Mike");
  expect(
    sut.addPerson({ email: "some-email@email.com", name: "Some-OtherMike" })
  ).toBe(false);
  expect(sut.getPersonByEmail(uniquePersonEmail)?.name).toBe("Mike");
});

describe("removePerson - test", () => {
  test("Should allow to delete a user by email", () => {
    const uniquePersonEmail = "some-email@email.com";
    const mike = { email: uniquePersonEmail, name: "Mike" };

    expect(sut.addPerson(mike)).toBe(true);
    expect(sut.getPersonByEmail(mike.email)?.name).toBe("Mike");

    expect(sut.removePerson(mike)).toBe(true);

    expect(sut.getPersonByEmail(mike.email)).toBeUndefined();
  });
});
