/* eslint-disable no-new */
import Autocomplete from './Autocomplete';
import usStates from './us-states';
import './main.css';


// US States
const data = usStates.map(state => ({
  text: state.name,
  value: state.abbreviation,
}));
new Autocomplete(document.getElementById('state'), {
  data,
  onSelect: (stateCode) => {
    console.log('selected state:', stateCode);
  },
});


// Github Users
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
new Autocomplete(document.getElementById('gh-user'), {
  getHttpResourceData: getGithubUsers,
  onSelect: (ghUserId) => {
    console.log('selected github user id:', ghUserId);
  },
});


// Public APIs List
const getAPIList = (query,numOfResults) => {
  return fetch(`https://api.publicapis.org/entries?title=${query}`)
  .then(response => {
    return response.json()
  })
  .then(res => {
    let entries = res.entries
    .map(entry => ({
      text: entry.API,
      value: entry.Description
    }))
    return entries
  })
}
new Autocomplete(document.getElementById('public-api'), {
  getHttpResourceData: getAPIList,
  onSelect: (apiDescription) => {
    console.log('selected public API description:', apiDescription);
  }
})
