# Project Name

Example API for a Scheduler App

# Usage

Tested on node version 14.18.0!
Run "npm install" after cloning the repository

Run all tests with simple "jest" call or "npm run test"
Run example console app with "npm run start"

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


## Usage
