---
title: "Feedback and actions for the new Groovy website"
date: 2014-07-13T00:00:00.000+02:00
tags: [groovy]

similar:
  - "posts/2014/07/08/a-new-groovy-website-in-beta.md"
  - "posts/2014/07/15/groovy-weekly-30.md"
  - "posts/2014/07/08/groovy-weekly-29.md"
---

In this post, I'll sum up the feedback we've gathered through the mailing-lists, Twitter, Google+, blog comments, Github issues, regarding the release of the beta of the [new Groovy website](http://beta.groovy-lang.org/).

Overall, so far, the feedback has been very positive, and people are very excited about the fresher and more modern look of the website, as well as happy to find relevant information more easily in a couple of clicks.

But like anything, there are various aspects we can improve! Some ideas exposed below were already elements we already had on our roadmap, or on the back-burner as nice-to-have’s, but it’s worth sharing them here and comment on them.  

Also worth noting that in less than 12 hours after the announcement of the beta of the new website, we received several contributions on Github for fixing some typos or broken sentences, as well as some new content like a new book in the learn section.

## Responsive design

Although some elements of the design are responsive (with CSS media queries), various aspects of the site are clearly not responsive and don’t degrade well and display nicely on mobile devices like phones and tablets.

For example, the menu doesn’t shrink down into a menu widget like is pretty common nowadays, and it’s probably the reason why the width of text content containers also doesn’t shrink accordingly, letting the text become very small and unreadable on smaller screens.

## Concrete feedback mentioned:

*   scrolling lagging on mobile safari 
*   from the US the site appeared slow (our hoster is in Germany)
*   text too small on mobile devices
*   not fully responsive
    
Help needed from frontend-savy persons to help us:

*   improve the responsiveness of the screen for mobile devices
*   optimize the size so it loads and renders faster

Actions:

*   we can cache the fonts coming from Google Fonts and serve them from the website
*   decrease the size of pictures
*   use sprites for the logos (“they use Groovy”)
    
## Content improvements

Here are some suggestions for content that users would like to see.

### Getting started guide

We’re missing a “getting started guide” that would take users through the steps to download and install Groovy, and then showing them the basics of the language.

We could perhaps integrate a guide like the [getting started guide](http://gr8labs.org/getting-groovy/) from MrHaki.

Additionally, it would be nice if the samples in such a guide could be edited live, or played with by the readers. See next section on this topic.

Actions:

*   write a getting started guide distinct from the reference documentation for a fast-track learning approach

Possible improvements:

*   The website could also provide some introductions to the 6 key areas listed, that we could link directly from the front page:
    *   “flat learning curve” — mention how it’s familiar to Groovy developers
    *   “smooth Java integration” — mention how you can mix Groovy and Java together
    *   “vibrant and rich ecosystem” — perhaps just link to the “ecosystem” section
    *   “powerful feature” — perhaps lead to the “getting started guide” that would give a quick intro to those powerful features
    *   “domain-specific languages” — perhaps a link to the DSL user guide from the reference documentation or a simpler getting started page on the topic
    *   “scripting & test glue” — show some samples of how to use Groovy for command-line scripting / automation, and samples of readable tests (likely Spock)
    
### Interactive code samples

We received several related comments regarding the fact we’re missing code samples (apart from inside the documentation of course):

*   show code samples from the front page to show readers what Groovy looks like 
*   some kind of built-in terminal or shell where we could play with Groovy code in a sandbox in the browser
*   being able to run the code samples we display

Actions:

*   add code sample on the front page
*   add a built-in shell
    
## Missing blog

Currently, we don’t yet have a news or blog section in the website, as we haven’t yet decided how we would integrate that in the website. It’s important to be able to announce new releases, interesting articles, etc, to our community, beyond the mailing-lists or the social networks through which we usually communicate.

Actions:

*   decide what technical approach to take to offer news and posts in the website
*   implement / integrate the desired blogging approach
    
Possible future improvements:

*   also integrate the Groovy Weekly news as blog posts
    

## User groups

The Groovy user groups are clearly an important part of the success of Groovy and its community. The website currently doesn’t have a user group section as initially planned.

Actions:

*   add a new section in the community about user groups (2014-07-10)


Possible future improvements:

*   show an interactive map of the location of the various groups    
*   let user groups contribute calendar events that could be displayed in the events page

## Sponsors not listed

In the old website, we had some places where we could mention our sponsors, but the new website currently doesn’t mention them.

Existing sponsors of the project:

*   Pivotal — hire several Groovy core team members  
    The Pivotal logo is already present in the design, in the footer of the page.
*   JetBrains — provide us with free TeamCity and IntelliJ IDEA Ultimate licenses, and cover the cost of our server (hosting the CI server, the website, and the documentation)
*   JFrog — provide the Bintray and Artifactory OSS infrastructure for deploying our releases and snapshots
    
Actions:

*   see how we can integrate our sponsors, in the footer or in a dedicated section (2014-07-13)
    
## Videos

Interesting videos related to the Groovy project have been recorded at conferences like GR8Conf, Greach, SpringOne2GX and other Java-related conferences. Such videos could also be a key asset in the learning experience of Groovy users.

Actions:

*   add a video section in the learning area of the website
    
## Other ecosystem projects

The “ecosystem” page currently lists just a handful of well-known Groovy ecosystem projects. Other module / projects authors would be interested in appearing in that section as well. But the problem (in the old website for instance) is that often several small projects are not really alive anymore, and it gives a bad feeling about the state of the community overall.
  
Actions:

*   see how we can get additional / lesser-known projects up in the community section, perhaps with another page for contributed projects

Possible improvements:

*   see if we can integrate with an API like Ohloh’s which provide an indicator of project “health”, which could allow us to automatically list / remove projects which are not deemed healthy or need some more love
    
There are various indicators that we can take into account for evaluating the liveliness of a project:

*   its Ohloh health status mentioned above
*   the date of the latest commits
*   the date of the latest release
*   recent successful Travis / Jenkins / other CI build status
    
## Translations

Several persons mentioned their desire to have the documentation translated in other languages, and some even proposed their help.

On the technical side, we haven’t put anything in place neither for the website nor for the documentation to be able to provide translated website and documentation.

On the human side, I know it’s already difficult to even just finish the documentation, that I’m a bit doubtful that we will ever get to a point where all the documentation is also translated, and in “sync” with the English base documentation. Some efforts have been made historically on the Groovy website or Grails documentation, but none ever got to completion.

Possible future actions:

*   investigate how we can provide the technical infrastructure for authoring translations and publish them
    
## Usability

Apart from the important responsiveness aspect we’ve outlined already, there are other areas where we can improve the usability of the website.

## Subdomain usage

Currently, the website is in beta mode under the “beta” subdomain, and the documentation is also available through that subdomain as well as under “docs”.

Actions:

*   once the website exits the beta status, we’ll be able to have dedicated “www” and “docs” subdomains to clearly demarcate website and documentation (which is important for search, see below)

## Search

The search is powered by Google Custom Search and is even faceted so that users can search only mailing-list posts, JIRA issues, documentation, etc.

The faceted aspect can be improved a bit when we properly separate and finalize the subdomains, with “www” for the website and “docs” for the reference documentation.

Beside that, the main gripe is the fact that when a user clicks on a search result, the browser moves to that result page, but when the user tracks back to the previous page, the results are gone, showing blank search field and results — ie. the search results are lost.

Actions:

*   use target \_blank to open a new tab in the browser for the search results (2014-07-13)
    
## UI inconsistencies

The website and the reference documentation share a similar look’n feel, with the same fonts and colors, but there are still differences like the color of the links, the font size, the spacing between elements, etc.

Action:

*   futher work to homogenized both the website and the reference documentation

## Miscellaneous

Other feedback we’ve received and other ideas but not listed in the previous sections:  

*   The “definition” of what Groovy is might perhaps be a bit too long or complicated, as Groovy is by nature a “multi-faceted” language with different flavors (static / dynamic / optional typing, and OO / imperative / functional language)  
*   In the “they use Groovy” section
*   EADS is now actually the Airbus Group, so the logo could be changed (2014-07-10)
*   Best Buy are heavy users of Groovy and their logo could be added (2014-07-10)
*   Suggestion to use a different domain name, with .io, without dashes, etc.  
*   Add a sitemap.xml file to help with search engine indexing