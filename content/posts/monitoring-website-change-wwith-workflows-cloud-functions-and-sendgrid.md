---
title: "Monitoring Website Changes with Workflows Cloud Functions and Sendgrid"
date: 2022-09-12T15:53:44+01:00
tags:
- google-cloud
- workflows
- serverless
- cloud-functions
- secret-manager
---

Every year in France, around mid-September, there's a special weekend where everyone can visit some famous places, usually closed the rest of the year. That's "[Journée du Patrimoine](https://journeesdupatrimoine.culture.gouv.fr/)". For example, you can visit places like the [Elysée Palace](https://www.elysee.fr/) or the [Matignon Palace](https://www.gouvernement.fr/le-patrimoine-de-l-hotel-de-matignon), if you want to see where the French president, or the French prime minister work. However, for some of those places, it's tricky to register online to book a slot, as there's always a high demand for them. Furthermore, you have to be there at the right time to register, and often, you don't even know when that day or time is! So I thought I could monitor the website of the Elysée Palace to see when the registration would open, by tracking changes on the Elysée website.

To monitor web page or website changes, there are a ton of online services available. There are often some limitations to the number of free requests, or to the frequency of the change checks. Being a developer on Google Cloud, I decided to write a simple solution that would take advantage of various Google Cloud services, namely:

-   [Workflows](https://cloud.google.com/workflows): to define the various steps of my site change workflow,
-   [Cloud Scheduler](https://cloud.google.com/scheduler): to call execute my workflow on a regular basis,
-   [Cloud Functions](https://cloud.google.com/functions): to compute a hash of the webpage, to see if the page changed,
-   [Cloud Storage](https://cloud.google.com/storage): to store the hashes,
-   [SendGrid](https://sendgrid.com/) (not a Google Cloud product): to send me an email when changes have appeared,
-   [Secret Manager](https://cloud.google.com/secret-manager): to store my SendGrid API key securely.

Let's have a look first at a function that computes the hash of a webpage. As there's no hash function in the Workflows standard library, I decided to use a function to do that job. I used the Node.js runtime, with the crypto module, which contains a sha1 implementation:

```javascript
const crypto = require('crypto');

exports.checksum = (req, res) => {
  const webpageBody = req.body.webpage;

  const shasum = crypto.createHash('sha1');
  shasum.update(webpageBody);

  const sha1 = shasum.digest('hex');

  res.status(200).send({sha1: sha1});
};
```

The function receives the web page content from the workflow. Then I create the sha1 hash with that content, and return it in hexadecimal form, in a small JSON payload.

I created a Google Cloud Storage bucket to contain my web page hashes:

![](/img/patrimoine/patrimoine-gcs.png)

Since I'm using SendGrid to notify me by email on changes, I store the API key securely in Secret Manager:

![](/img/patrimoine/patrimoine-secret.png)

Now let's zoom on our workflow, piece by piece.\
First, I define some variables, like the name of my bucket, the name of my hashes text file, and I retrieve my SendGrid API key (see this previous [article about using Secret Manager with Workflows](https://glaforge.appspot.com/article/using-the-secret-manager-connector-for-workflows-to-call-an-authenticated-service)):

```yaml
main:
    params: [input]
    steps:
    - assignment:
        assign:
            - bucket: hash_results
            - file_name: hash.txt
    - get_email_api_key:
        call: googleapis.secretmanager.v1.projects.secrets.versions.accessString
        args:
            secret_id: SENDGRID_API_KEY
        result: EMAIL_API_KEY
```

Then I read the content of the previous hash in GCS (you can also check this article on how to [read and write JSON data to a file in a bucket from a workflow](https://glaforge.appspot.com/article/reading-in-and-writing-a-json-file-to-a-storage-bucket-from-a-workflow)):

```yaml
    - read_hash_from_gcs:
        call: http.get
        args:
            url: ${"https://storage.googleapis.com/download/storage/v1/b/" + bucket + "/o/" + file_name}
            auth:
                type: OAuth2
            query:
                alt: media
        result: hash_from_gcs
```

It's time to make a simple HTTP GET call to the website. Currently, the URL is hard-coded, but we could parameterize the workflow to get that URL from the workflow execution input parameters instead.

```yaml
    - retrieve_web_page:
        call: http.get
        args:
           url: https://evenements.elysee.fr/
        result: web_page
```

Once I retrieved the content of the URL (the result of that request is stored in the web_page variable), I can compute my hash, by calling my cloud function:

```yaml
    - compute_hash:
        call: http.post
        args:
            url: https://europe-west1-patrimoine-check.cloudfunctions.net/checksum
            body:
                webpage: ${web_page.body}
        result: hash_result
```

That's where we introduce some branching in the workflow. If the web page hasn't changed we finish early, but if it has changed, then we're going to store the new hash in GCS:

```yaml
    - assign_hashes:
        assign:
            - old_hash: ${hash_from_gcs.body.sha1}
            - new_hash: ${hash_result.body.sha1}
            - hash_msg: ${"Old hash = " + old_hash + " / New hash = " + new_hash}
    - conditionalSwitch:
        switch:
        - condition: ${new_hash != old_hash}
          next: write_hash_to_gcs
        next: returnOutput
    - write_hash_to_gcs:
        call: http.post
        args:
            url: ${"https://storage.googleapis.com/upload/storage/v1/b/" + bucket + "/o"}
            auth:
                type: OAuth2
            query:
                name: ${file_name}
            body:
                sha1: ${hash_result.body.sha1}
```

I log the fact the website has changed, and I'm calling the SendGrid API (like in this article on using SendGrid for sending emails from Workflows):

```yaml
    - site_changed_log:
        call: sys.log
        args:
            text: Website has changed
    - notify_by_email:
        call: http.post
        args:
            url: https://api.sendgrid.com/v3/mail/send
            headers:
                Content-Type: "application/json"
                Authorization: ${"Bearer " + EMAIL_API_KEY}
            body:
                personalizations:
                    - to:
                        - email: me@gmail.com
                from:
                    email: you@gmail.com
                subject: "Elysée, page mise à jour"
                content:
                    - type: text/plain
                      value: "La page de l'Élysée a été mise à jour"
    - log_hashes:
        call: sys.log
        args:
            text: ${hash_msg}
    - returnOutput:
            return: ${hash_msg}
```

The workflows need to be invoked at a regular interval of time. Workflows can be configured to be invoked on a schedule via Cloud Scheduler (again, check this article on scheduling workflow executions). I configured my workflow to be triggered every minute, with the * * * * * cron pattern.\
![](/img/patrimoine/patrimoine-schedule.png)

And voila! I have my little workflow being invoked every minute to check if a web page has changed, and send me an email if so!

To be honest with you, the workflow worked perfectly... but the true story is that I wasn't monitoring the right URL, I should have monitored the front page instead. Furthermore, the page I was monitoring included some dynamic JavaScript code, but the HTML fetched wasn't really changing. I missed the registration window, and all the slots filled super rapidly before I even had the time to register my family for a visit! Shame on me, better check my URL next time, or create webpage screenshots with a headless Chrome running in Cloud Run or in Cloud Functions! Or, of course, use online services that have solved those problems with their years of experience! Hopefully, next year, I won't miss the registration! But it was fun to glue together all those useful services from Google Cloud, to solve a concrete problem.