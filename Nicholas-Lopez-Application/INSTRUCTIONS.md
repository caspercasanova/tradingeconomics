# Trading Economics Developer Exercise

This project was completed as part of the Trading Economics developer application process.

## Original Requirements

- [x] Create a free account at **developer.tradingeconomics.com**.
- [x] Fork the Trading Economics GitHub repository and clone it locally.
- [x] Review the available API endpoints at **docs.tradingeconomics.com**.
- [x] Explore the search endpoint, for example:

  ```
  https://brains.tradingeconomics.com/v2/search/wb,fred,comtrade?q=nigeria&pp=50&p=0&_=1557934352427&stance=2
  ```

  Modify the `q` query parameter to search for different countries or terms.

- [x] Build a small application using one or more Trading Economics endpoints. Example ideas included:
  - Compare two countries or indicators.
  - Plot charts for a selected country/indicator.
  - Display search results in a table.
  - Create any other useful visualization.

- [x] Publish the completed project to your GitHub fork.
- [x] Submit the GitHub repository to `careers@tradingeconomics.com`.

---

## About This Project

This application allows you to:

-  Select a country from an interactive globe
-  Fetch Trading Economics search results for that country
-  Visualize the returned data with a chart
-  Browse the underlying search results in a table
-  Cache responses locally to reduce unnecessary requests

---

## Running the Project

CD into directory:

```bash
cd Nicholas-Lopez-Application
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Then open:

```
http://localhost:3000
```