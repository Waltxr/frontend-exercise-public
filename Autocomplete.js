export default class Autocomplete {
  constructor(rootEl, options = {}) {
    this.rootEl = rootEl;
    this.options = {
      numOfResults: 10,
      data: [],
      ...options,
    };

    this.init();
  }

  /**
   * Given an array and a query, return a filtered array based on the query.
   */
  getResults(query, data) {
    if (!query) return [];

    // Filter for matching strings
    return data.filter((item) => {
      return item.text.toLowerCase().includes(query.toLowerCase());
    });
  }

  onQueryChange(query) {
    // Get data for the dropdown
    let results = this.getResults(query, this.options.data);
    results = results.slice(0, this.options.numOfResults);

    this.updateDropdown(results);
  }

  updateDropdown(results) {
    this.listEl.innerHTML = '';
    this.listEl.appendChild(this.createResultsEl(results));
  }

  createResultsEl(results) {
    const fragment = document.createDocumentFragment();
    results.forEach((result) => {
      const el = document.createElement('li');
      el.classList.add('result');
      el.textContent = result.text;
      el.setAttribute('tabindex','1')

      // Pass the value to the onSelect callback
      el.addEventListener('click', () => {
        const { onSelect } = this.options;        
        if (typeof onSelect === 'function') onSelect(result.value);
      });

      fragment.appendChild(el);
    });
    return fragment;
  }

  createQueryInput() { //create queryInput without eventListener
    const inputEl = document.createElement('input');
    inputEl.setAttribute('type', 'search');
    inputEl.setAttribute('name', 'query');
    inputEl.setAttribute('autocomplete', 'off');

    return inputEl;
  }

  createStaticQueryInputEl() { //add event listener for static data array
    const inputEl = this.createQueryInput()

    inputEl.addEventListener('input',
      event => this.onQueryChange(event.target.value));

    return inputEl;
  }

  onHttpQueryChange(query) { // get data with asynchronous fetch if there's a query
    if (!query=='') {
      this.options.getHttpResourceData(query, this.options.numOfResults)
      .then( items => {
        this.updateDropdown(items)
      })
    } else if (query=='') {
      const emptyList = []
      this.updateDropdown(emptyList)
    }
  }

  createHttpQueryInputEl() { // add eventListener for data from http resource
    const inputEl = this.createQueryInput()

    inputEl.addEventListener('input',
      event => this.onHttpQueryChange(event.target.value));

    return inputEl;
  }

  navigateList() {
    document.onkeydown = (e) => {
      let activeEl = document.activeElement

      switch (e.keyCode) {
        case 40:
          if (!activeEl.nextSibling) {
            activeEl.focus() //focus on current element if you are at end of the list.
          } else if (activeEl.name == 'query') {
            activeEl.nextSibling.firstChild.focus() //focus on first li element if you are in the input
          } else {
            activeEl.nextSibling.focus() //focus on next li element if you are in the middle of the list
          }
          break;
        case 38:
          if (activeEl.name == 'query') {
            activeEl.focus() //focus on current element if you are at end of the list.
          } else if (activeEl.previousSibling == null) {
             activeEl.parentElement.previousSibling.focus() //focus on input if no more list items
          } else if (activeEl.classList.value == 'result') {
            activeEl.previousSibling.focus() //focus on previous list item
          }
        break;
        case 13:
          activeEl.click() //trigger onSelect via enter key
        default:
      }
    }
  }

  init() {
    if (this.options.getHttpResourceData) { // if httpResource send to different creat input function
      this.inputEl = this.createHttpQueryInputEl();
      this.rootEl.appendChild(this.inputEl)
    } else {
      // Build query input
      this.inputEl = this.createStaticQueryInputEl();
      this.rootEl.appendChild(this.inputEl)
    }
    // Build results dropdown
    this.listEl = document.createElement('ul');
    this.listEl.classList.add('results');
    this.rootEl.appendChild(this.listEl);

    // Handle navigation with arrow keys
    this.navigateList()
  }
}
