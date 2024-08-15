function jsonApi() {
    const apiURL = `https://jsonplaceholder.typicode.com/photos`;
      fetch(apiURL)
      .then(response => response.json())
      .then(json => console.log(json))
  }
  jsonApi()