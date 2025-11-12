---
title: "Serverless tip #6 — Create a mini web API with Cloud Functions"
date: 2019-12-17T16:01:33+01:00
tags:
- serverless
- google-cloud
- cloud-functions
- nodejs
- tips

similar:
  - "posts/2019/12/17/serverless-tip-7-create-mini-apis-with-cloud-functions-and-express-routing.md"
---

Requirements:

-   an existing Google Cloud Platform account and project
-   Cloud Functions should be enabled for that project

We often use individual HTTP [Cloud Functions](https://cloud.google.com/functions/) as a single endpoint, and we pass data to the functions with either query parameters, or via a POST body payload. Although it's a good practice to keep the scope of a function small, however, you can easily write mini Web APIs for a given function, with different paths for different needs, like with usual Web frameworks.

So instead of having just a single endpoint with:

```
https://us-central1-myproject.cloudfunctions.net/myfunction
```

You can have sub-paths below the name of your function:

```
https://us-central1-myproject.cloudfunctions.net/myapi/customers
https://us-central1-myproject.cloudfunctions.net/myapi/customers/32
https://us-central1-myproject.cloudfunctions.net/myapi/customers/32/address
```

Let's have a look at the Node functions runtime, and how you can implement this approach. The key trick here is to use the request path: req.path, which will give you the `/customers/32` part of the fully qualified URL.

```javascript
// some customer data retrieved from Firestore or elsewhere
const customers = {
  "32": { name: 'Alice', address: '21 Jump Street' },
  "33": { name: 'Bob', address: '1 Main Street' }
};
exports.myapi = (req, res) => {
  if (req.path.startsWith('/customers')) {
    const pathElements = req.path.split('/') // split along the slashes
      .filter(e => e)                        // remove the empty strings in the array
      .splice(1);                            // remove the first "customers" element
    // path: /customers
    if (pathElements.length == 0) { 
      // return all customers
      res.status(200).json(customers).end();
    }
    // path: /customers/32
    else if (pathElements.length == 1) {
      res.status(200).json(customers[pathElements[0]]).end();
    }
    // path: /customers/33/address
    else if (pathElements.length == 2 && pathElements[1] == "address") {
      res.status(200).json({address: customers[pathElements[0]].address}).end();
    }
  }
  res.status(404).send('Unknown path').end();
};
```

In the Node.JS runtime, Cloud Functions uses the Express framework under the hood. We have access to the request object, which has lots of useful attributes, including the path.

In this simplistic example, we are using this path attribute directly, but it's also possible to use more advanced routing capabilities, as we shall see in a forthcoming tip.

More information

-   [Express framework](https://expressjs.com/)
-   Node's request [path](https://expressjs.com/en/api.html#req.path)