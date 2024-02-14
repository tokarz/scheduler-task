# Project Name

Example API for a Scheduler App

# Usage

Tested on node version 14.18.0!
Run "npm install" after cloning the repository

Run all tests with simple "jest" call or "npm run test" 
Run all tests with simple "jest --coverage" to see coverage report 
Run example console app with "npm run start"


# API

## Create Users with an unique email
repository-service is an API to ensure that user is handled with proper check of email-uniqueness.
It holds state, but finally it should persist data in a database.
Api allows us to create a person, remove one and get person by email.


## Schedule a meeting
Scheduler-service exposes a wider than required API to show possibilities of different scheduling aproaches.
Meeting can be setUp, cancelled, people can be added to it and removed from it. Also it can display different forms of schedule 
(per person or per date). I wrote it having a Calendar App in Mind where I can show calnedar of a person or of a whole team for a day, and days to come

# Comments

## I have taken such things into consideration and decided to simplify them

1. I've decided to use a JS "Date" format for time. In normal project I would use a moment.js library to handle times. That is also, why scheduler has a dependency to "Timer". I made it so the timer is testable, I would assume an imported library or momentjs for such calculations in production code
2. I've used a stack-overflow representation of date to time extraction since an algorithm has already beed written multiple times
3. I've decided to use a BDD syntax for jest UT's for simplification and ease of configuration
4. I've ignored UTC/non UTC and assumed we use UTC always
5. I assumed a public api would be visible outside the module (I assumed an npm module atructure)
6. I've assumed a state storing will happen in service to fit to task's minimal requirements. Normally I would use external storage system like localStorage/Database or ngrx store
7. I assumed an organiser of a meeting should be a special case and every meeting needs to have a clear person who created a meeting. I made it solely for API purpouse, because I would find it useful in a calendar app using this service for scheduling
8. I've created a 2 representations of storage structure for scheduler to minimize the search cost. I'm aware that it has a bigger spacial requirements but I took this strategy to keep a model simple. Normally I would inject a store and keep a data structure in ng rx store and use effects to filter out duplicates
9. Code coverage for each class is kept above 80/90 treshold
10. Thank you:)

