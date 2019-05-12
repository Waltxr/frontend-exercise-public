# Solution Docs

<!-- Include documentation, additional setup instructions, notes etc. here -->
## Installation

1. Run `npm install`
2. Run `npm start` (runs `webpack-dev-server`)
3. Open `http://localhost:8080` on your browser.

## Autocomplete Component Notes

###### Creating instance of component takes in two arguments:
1. The div which the component will append the list of data
2. An options object, containing either a data array (for static data) or a getHttpResourceData function that you will need to write to retrieve data from the http data source of your choosing.

###### getHttpResourceData function
This function is needs to be written to fetch data from your http resource, and provided to the component. For this exercise with github, this is the fetch function used:

```
const getGithubUsers = (query,numOfResults) => {
  return fetch(`https://api.github.com/search/users?q=${query}&per_page=${numOfResults}`)
  .then(response => {
    return response.json()
  })
  .then(res => {
    let users = res.items
    .map(user => ({
      text: user.login,
      value: user.id
    }))
    return users
  })
}
```

and here how the instance of the component was created for github:

```
new Autocomplete(document.getElementById('gh-user'), {
  getHttpResourceData: getGithubUsers,
  onSelect: (ghUserId) => {
    console.log('selected github user id:', ghUserId);
  },
})
```

## Met Requirements
- The Component can have multiple instances on the same page. There are currently three functioning Autocomplete components on the page in my solution.

- The "States" example using a static data array continues to work.

- The component is designed to accept any HTTP endpoint. This is demonstrated by the addition of an Autocomplete component on this page that uses a list of Public APIs as a data resource: https://api.publicapis.org/entries. This works by writing the fetch function in index.js and passing it as an argument when creating an instance of Autocomplete.

- Component works correctly in Chrome.

- I chose not to use jQuery or Lodash. Everything is vanilla js.

- I made slight modifications to the existing code. In the init() function there is a conditional which determines if the component is using a static data array or an http data source. Then it calls a different function depending on the condition. getResults, onQueryChange, updateDropdown and createResultsEl all remain the same, and are used when pulling data from an http resource.
