---
title: "Serverless tip #7 — Create mini APIs with Cloud Functions and Express routing"
date: 2019-12-17T16:04:34+01:00
tags:
- serverless
- google-cloud
- cloud-functions
- node-js
- express
- tips
---

Requirements:

-   an existing Google Cloud Platform account and project
-   Cloud Functions should be enabled for that project

Compared to the previous tip when using Exress' request path attribute, we can take advantage of Express routing.

So to support the following paths:

```
https://us-central1-myproject.cloudfunctions.net/api/customers
https://us-central1-myproject.cloudfunctions.net/api/customers/32
https://us-central1-myproject.cloudfunctions.net/api/customers/32/address
```

We can have our functions require Express by adding Express in `package.json`:

```json
{
  "name": "mini-api-router",
  "version": "0.0.1",
  "dependencies": {
    "express": "^4.17.1"
  }
}
```

Then we can require that dependency in our new functions script:

```javascript
// we use express explicitly
const express = require('express');
const app = express();

// some customer data retrieved from Firestore or elsewhere
const customers = {
  "32": { name: 'Alice', address: '21 Jump Street' },
  "33": { name: 'Bob', address: '1 Main Street' }
};

// this time we can define the path easily
app.get('/', (req, res) => 
        res.send('Hello World!'));
app.get('/customers', (req, res) => 
        res.status(200).json(customers).end());
// we can also specify path variables like :id 
// that we can retrieve via the request params object
app.get('/customers/:id', (req, res) => 
        res.status(200).json(customers[req.params.id]).end());
app.get('/customers/:id/address', (req, res) => 
        res.status(200).json({address: customers[req.params.id].address}).end());

// we need to export the app object for Cloud Functions to expose it
exports.api = app;
```

More information:

-   [Express framework](https://expressjs.com/)
-   Express [routing](http://expressjs.com/en/guide/routing.html#routing)