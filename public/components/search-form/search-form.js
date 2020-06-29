
class SearchForm extends HTMLElement {
  constructor() {
    super();
  }

  handleSubmit(event) {
    event.preventDefault()

    const formData = new FormData(event.target)
    const jsonData = Array.from(formData.entries())
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})

    fetch(event.target.action, {
      method: event.target.method,
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(jsonData)
    })
    .then((response) => response.json())
    .then((data) => {
      const resultEvent = new CustomEvent('searchresults', { bubbles: true, detail: data })
      this.dispatchEvent(resultEvent)
    })
  }

  connectedCallback() {
    this.innerHTML = `
      <form method="post" action="search">
        <label>
          General Search
          <input name="generalQuery" />
          <button>Search</button>
        </label>
        <details>
          <summary>
            Advanced Search
          </summary>
          <label>
            From
            <input name="fromDate" type="date" />
            <input name="fromTime" type="time" />
          </label>
          <label>
            To
            <input name="toDate" type="date" />
            <input name="toTime" type="time" />
          </label>
          <button>Search</button>
        </details>
      </form>
    `
    
    this.form = this.querySelector('form')

    this.form.addEventListener('submit', this.handleSubmit)
  }

  attributeChangeCallback() { }

  disconnectedCallback() { }
}

customElements.define('search-form', SearchForm);