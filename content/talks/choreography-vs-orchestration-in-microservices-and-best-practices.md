---
title: "Choreography vs Orchestration in Microservices and Best Practices"
date: 2022-10-20T21:56:33+01:00
type: "talk"
layout: "talk"
tags:
- google-cloud
- workflows
- microservices
- orchestration
- choreography
- best-practices
- patterns
---

We went from a single monolith to a set of microservices that are small, lightweight, and easy to implement. Microservices enable reusability, make it easier to change and scale apps on demand but they also introduce new problems. How do microservices interact with each other toward a common goal? How do you figure out what went wrong when a business process composed of several microservices fails? Should there be a central orchestrator controlling all interactions between services or should each service work independently, in a loosely coupled way, and only interact through shared events? In this talk, we’ll explore the Choreography vs Orchestration question and see demos of some of the tools that can help. And we'll explore some best practices and patterns to apply when adopting an orchestration approach.

{{< speakerdeck 328a826a55f447f7907db099c0aa03ab >}}