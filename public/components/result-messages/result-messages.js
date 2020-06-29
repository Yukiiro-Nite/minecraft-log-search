
class ResultMessages extends HTMLElement {
  constructor() {
    super();
  }

  handleSearchResults(event) {
    console.log('search result event: ', event)
  }

  connectedCallback() {
    this.innerHTML = `
      <ul class="results">
      </ul>
    `
    
    this.messageList = this.querySelector('ul')
    this.searchForms = Array.from(document.querySelectorAll('search-form'))

    this.searchForms.forEach((form) => {
      form.addEventListener('searchresults', this.handleSearchResults)
    })
  }

  attributeChangeCallback() { }

  disconnectedCallback() { }
}

customElements.define('result-messages', ResultMessages);