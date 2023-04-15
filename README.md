# Backdrop Assessment

### Description ###

#### Quick summary:
An app to demonstrate my understanding of System design in a [real world scenario](./instructions.md).

#### What's a good reason why the pure Levenshtein Distance algorithm might be a more effective solution than the broader Damerau–Levenshtein Distance algorithm in this specific scenario?

From the answer given in [this page](https://stats.stackexchange.com/questions/467000/levenshtein-distance-vs-damerau-levenstein-vs-optimal-string-alignment-distance), and I quote, 
```
For two strings, a and b, Levenshtein Distance is the minimal number of insertions, deletions, and symbol substitutions required to transform a into b, while Damerau-Levenstein is like the Levenstein Distance, but you can also use transpositions (swapping of adjacent symbols).
```
Since it'll be a rare occurrence for users to swap alphabets,(like Mosse, instead of, Moses) in their account names, removing the transposition checks will optimize the overall computational time of the request.

### How to Setup? ###

To run this application, you'll need 
- [Git](https://git-scm.com)  
- [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. 

* Clone the repository using this command(in your Command Line)
```bash
git clone https://github.com/Comurule/backdrop_challenge.git
```

* Go into the repository
```bash
cd backdrop_challenge
```

* Configure the environment variables using the keys in the __.env.sample__ file and provide the necessary details. ( You can also change the default values of the system configurations in `src/config/constants.ts`).

* start up the application with

(For Production)
```bash
npm install --omit=dev && npm run build && npm start
```
(For Development)
```bash
npm install && npm run dev
```

* Check the port on the specified port on the env or 8000.

* For __tests__, you can run the test scripts with
```bash
npm run test
```

NB: Ensure to pass in the `savedBankDetails` and `unSavedBankDetails`, in `src/config/test.variables.ts`, with the correct values for a the tests to run successfully.

### Assumptions

- In-App Database

The application implemented an in-app database. This implies that the database will be refreshed whenever the application is refreshed.

- User Entity

It is also assumed that the User entity has been designed and implemented with all necessary and supporting features. As such, no user feature is exposed for this app. A user will be seeded on starting the application, with `user_id = 1`, however, more users can be added, using the `saveUser` function in `src/.dataset/dao.ts` file, by looping it to create more users in `src/index.ts` file.

- Protected features

It is assumed that `addBankAccount mutation` should be protected so a header has to be passed for the system to know the `user_id` to add the account details to. This can be done by passing a header `{user_id: 1}` with the payload while accessing this feature. 


### GraphQL APIs ###

- __addBankAccount Mutation__

#### Query Payload
```js
mutation addBankAccount(
  $account_number: String!, 
  $bank_code: String!, 
  $account_name: String!
) {
  addBankAccount(input: {
    user_account_number: $account_number, 
    user_bank_code: $bank_code, 
    user_account_name: $account_name
  }) {
    user_account_number
    user_bank_code
    user_account_name
  }
}

```

#### Variables
```json
{
  "account_number": "",
  "bank_code": "",
  "account_name": ""
}
```


- __getBankAccountName Query__

#### Query Payload
```js
query getBankAccountName(
    $account_number: String!, 
    $bank_code: String!
    ) {
  getBankAccountName(
      account_number: $account_number, 
      bank_code: $bank_code
    ) 
}

```

#### Variables
```json
{
  "account_number": "",
  "bank_code": ""
}
```

### Author
Chibuike Umechukwu