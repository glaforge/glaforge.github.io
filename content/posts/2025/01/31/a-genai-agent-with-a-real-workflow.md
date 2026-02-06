---
title: "A Generative AI Agent with a real declarative workflow"
date: 2025-01-31T13:06:26+01:00
tags:
  - generative-ai
  - ai-agents
  - large-language-models
  - gemini
  - machine-learning
  - workflows
image: /img/short-ai-stories/robot-workflow.png

similar:
  - "posts/2025/01/27/an-ai-agent-to-generate-short-scifi-stories.md"
  - "posts/2021/02/13/orchestrating-the-pic-a-daily-serverless-app-with-workflows.md"
  - "posts/2020/11/18/orchestrating-microservices-with-cloud-workflows.md"
---

In my [previous article]({{< ref "/posts/2025/01/27/an-ai-agent-to-generate-short-scifi-stories" >}}), I detailed how to build an AI-powered short story generation **agent** using Java, [LangChain4j](https://docs.langchain4j.dev/), Gemini, and Imagen 3, deployed on Cloud Run jobs.

This approach involved writing **explicit** Java code to orchestrate the entire workflow, defining each step programmatically. This follow-up article explores an alternative, **declarative** approach using [Google Cloud Workflows](https://cloud.google.com/workflows).

I've [written extensively on Workflows]({{< ref "/tags/workflows" >}}) in the past, so for those AI agents that exhibit a very explicit plan and orchestration, I believe Workflows is also a great approach for such declarative AI agents.

## From imperative to declarative: defining the workflow

The Java-based agent employed an imperative style, where the code explicitly defined the sequence of operations. Each step, from story conception to image selection, was a method call within the `ExplicitStoryGeneratorAgent` class (you can check the [code of this class](https://github.com/glaforge/short-genai-stories/blob/main/fictionStoryAgent/src/main/java/storygen/ExplicitStoryGeneratorAgent.java)). This provided fine-grained control and allowed for parallelization.

[Cloud Workflows](https://cloud.google.com/workflows) offers a declarative approach. Instead of writing code, you define the workflow in a YAML file. This file specifies the steps, their inputs and outputs, and the order in which they should be executed. You can also easily create loops (sequential or parallel), and you can implement _human in the loop_ callbacks if needed. The workflow engine then interprets this definition and executes the steps accordingly.

> YAML can be a fair bit more cumbersome to write, compared to using a programming language, but non-developers could get a workflow definition rolling, without having to fire an IDE to code. But for a Java developer, it's certainly simpler to write code, with the help of their favorite programming environment.

In this article, I've created a simplified variant: I removed the _LLM-as-judge_ step that picked the best images. And I've created pictures for the whole story, not for each chapter. So it's not exactly the same agent workflow as in the preivous article. But I don't want you to drown in too much YAML!

The workflow:

- creates the story with **Gemini 2**,
- creates a prompt (for the whole story, not for each chapter),
- generates images with **Imagen 3**,
- saves the result in [Cloud Firestore](https://cloud.google.com/firestore)

Let's have a look at the full YAML definition, and read the comments explaining what each step does:

```yaml
main:
  params: [input]
  steps:

    # Let's define the Gemini and Image models we want to use:
    - setup:
      assign:
        - GEMINI_MODEL: ${"projects/" + sys.get_env("GOOGLE_CLOUD_PROJECT_ID") +
            "/locations/us-central1/publishers/google/models/gemini-2.0-flash-exp"}
        - IMAGEN_MODEL: ${"projects/" + sys.get_env("GOOGLE_CLOUD_PROJECT_ID") +
            "/locations/us-central1/publishers/google/models/imagen-3.0-generate-002"}

    # We call Gemini to generate the story
    - generate_story:
      call: googleapis.aiplatform.v1.projects.locations.endpoints.generateContent
      args:
        model: ${GEMINI_MODEL}
        region: 'us-central1'
        body:
          contents:
            role: user
            parts:  # Let's write a sci-fi story!
              - text: "Write a short science-fiction story"
          generationConfig:
            temperature: 2.0
            responseMimeType: application/json
            # Use a JSON schema to define the format of the output
            responseSchema:
              type: OBJECT
              properties:
                title:
                  type: STRING
                  description: The title of the short story
                content:
                  type: STRING
                  description: The body of the story
              required: ['title', 'content']
          # You can define system instructions
          systemInstruction:
            parts:
              - text: >
                  You are a creative fiction author,
                  and your role is to write stories.
                  You write a story as requested by the user.

                  A story always has a title,
                  and is made of 5 long chapters.
                  Each chapter has a title, is split into paragraphs,
                  and is at least 20 sentences long.
      result: short_story

     # Assign the story, title, content into some variables
    - get_story:
      assign:
        - story_output: ${json.decode(short_story.candidates[0].content.parts[0].text)}
        - title: ${story_output.title}
        - content: ${story_output.content}

    # Let's call Gemini again, but for creating a prompt for Imagen
    - generate_image_prompt:
      call: googleapis.aiplatform.v1.projects.locations.endpoints.generateContent
      args:
        model: ${GEMINI_MODEL}
        region: 'us-central1'
        body:
          contents:
            role: user
            parts:
              - text: ${content}
          systemInstruction:
            parts:
                - text: |
                  You are an expert artist who masters crafting great
                  prompts for image generation models, to illustrate
                  short stories.
                  When given a short story, reply with a concise
                  prompt that could be used to create an illustration
                  with the Imagen 3 model.
                  Don't use any flags like those used with MidJourney.
                  Just answer with the short concise text prompt.

                  Your answer MUST start with "A cartoon of ",
                  as we want to use cartoon or comics illustrations.
                  The user gives you the following image prompt
                  for the chapter to illustrate:
      result: image_prompt

    # Retrieve the prompt from Gemini's output
    - assign_prompt:
      assign:
        - prompt: ${image_prompt.candidates[0].content.parts[0].text}

    # Time to generate the images
    - image_generation:
      call: googleapis.aiplatform.v1.projects.locations.endpoints.predict
      args:
        endpoint: ${IMAGEN_MODEL}
        region: us-central1
        body:
          instances:
            - prompt: ${prompt}
          parameters: # Store images in Google Cloud Storage
            storageUri: 'gs://short-scifi-stories-generated-images'
      result: images

    # Utility step to create the picture data for Firestore
    - prepare_images_uri_list:
      steps:
        - create_empty_list:
          assign:
            - uris: []
            - uris_for_firestore: []
        - loop_over_images:
          for:
            value: img_object
            in: ${images.predictions}
            steps:
              - append_uri:
                assign:
                  - uris: ${list.concat(uris, img_object.gcsUri)}
                  - stringUriMap:
                      stringValue: ${img_object.gcsUri}
                  - uris_for_firestore: ${list.concat(uris_for_firestore, stringUriMap)}

    # Let's prepare the final output to return
    # as the result of the workflow execution
    - prepare_result:
      assign:
        - final_result:
          title: ${title}
          content: ${content}
          prompt: ${prompt}
          images: ${uris}
          createdAt: ${sys.now()}

    # Finally, let's save the story in Firestore
    - save_to_firestore:
      call: googleapis.firestore.v1.projects.databases.documents.createDocument
      args:
        collectionId: short-story
        parent: ${"projects/" + sys.get_env("GOOGLE_CLOUD_PROJECT_ID") + "/databases/(default)/documents"}
        query:
          documentId: ${uuid.generate()}
        body:
          fields:
            title:
              stringValue: ${final_result.title}
            content:
              stringValue: ${final_result.content}
            prompt:
              stringValue: ${final_result.prompt}
            images:
              arrayValue:
                values: ${uris_for_firestore}
            createdAt:
              timestampValue: ${time.format(final_result.createdAt,"GMT")}

    # Return the data
    - return_output:
      return: ${final_result}
```

This YAML file defines the entire story generation process. It calls the Gemini and Imagen APIs, extracts the necessary information from the responses, and saves the final result to Firestore. No Java code is required to manage the flow of execution.

## Key differences and trade-offs

Let's zoom in on the pros and cons of both approaches.

### Imperative / programming approach:

- **Pros**:
  - Fine-grained control over the workflow.
  - Explicit parallelization for performance optimization.
  - Familiar programming and debugging tools.
  - Cloud Run jobs is fully managed and scaled by Google Cloud.
  - Job execution can be scheduled by Cloud Scheduler.
- **Cons**:
  - You need to be familiar with a programming language & environment.
  - It can potentially be challenging to maintain as the workflow evolves.
  - The approach used required being familiar with running & scheduling containers as jobs.

### Declarative / workflow based approach:

- **Pros**:
  - Pretty easy-to-understand workflow definitions.
  - Workflows offers a visualisation of the steps (also during execution).
  - Parallelization can be defined explicitly (with the `parallel` keyword on iterations or step branches).
  - Simplified maintenance and updates. Just need to update the YAML in the console.
  - Workflows is scalable and reliable out of the box without extra effort.
  - Workflow execution can be scheduled by Cloud Scheduler.
- **Cons**:
  - YAML authoring can be painful, if you're not familiar with the APIs you call.
  - Parallelization is declarative but might be limited depending on the workflow definition and Google Cloud Workflows capabilities. You would have more control with a programming language.
  - There's no emulator to run workflows locally, so you might have to create copies and work on these, to not affect the production workflow.
  - Debugging relies on workflow execution logs, which might be less intuitive than traditional debugging.

## Choosing the right approach

It depends! :sweat_smile:

Of course, the choice between these approaches depends on the specific project requirements. If fine-grained control and explicit parallelization are critical, the imperative programming approach might be preferable.

However, for simpler workflows where ease of development and maintainability are critical, Cloud Workflows offers an interesting alternative. You can easily make a tweak to the workflow directly from the Google Cloud console if needed.

In the case of this story generation agent, the declarative approach sounds like a good fit, but the YAML authoring can be a bit painful at times, as you have to look up the various payload schemas for the APIs to invoke, to be able to make the service calls. But that's definitely a plus as well, in the sense that pretty much all the products and services offered on Google Cloud Platform can easily be called via REST endpoints, and Workflows excels at that.

## Conclusion

Explicit declarative planning helps AI agents stay focused, and ensures a high level of predictability.
My experience with agents which plan their own actions has been mixed, as sometimes the LLM hallucinates function calls, or calls functions with bogus parameters.
In the previous [previous article]({{< ref "/posts/2025/01/27/an-ai-agent-to-generate-short-scifi-stories" >}}), I used an imperative programming approach, but in this article today, I developed a simplified equivalent with a declarative workflow definition.

[Google Cloud Workflows](https://cloud.google.com/workflows) offers a powerful and convenient way to build and manage declarative AI agents — and obviously any other kind of process that needs to call APIs. By defining the workflow declaratively, you can focus on the logic of your agent rather than the details of execution. While it might not be suitable for every use case, it's definitely a valuable tool to consider when building AI-powered applications on Google Cloud!
