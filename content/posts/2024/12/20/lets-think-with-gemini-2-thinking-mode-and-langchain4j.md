---
title: "Let's think with Gemini Flash 2.O's experimental thinking mode and LangChain4j"
date: 2024-12-20T16:14:21+01:00
image: /img/gemini/robot-thinking.png
tags:
  - java
  - large-language-models
  - machine-learning
  - langchain4j
  - generative-ai
---

Yesterday, Google released yet another cool Gemini model update, with **Gemini 2.0 Flash [thinking mode](https://ai.google.dev/gemini-api/docs/thinking-mode)**.
Integrating natively and transparently some [chain of thought](https://www.promptingguide.ai/techniques/cot) techniques,
the model is able to take some more thinking time, and automatically decomposes a complex task into smaller steps, and explores various paths in its thinking process.
Thanks to this approach, Gemini 2.0 Flash is able to solve more complex problems than Gemini 1.5 Pro or the recent Gemini 2.0 Flash experiment.

**And of course, you can already use Gemini 2.0 Flash Thinking with [LangChain4j](https://docs.langchain4j.dev/)!**

So let's _delve_ into some examples together!

## Solving a riddle

I found some [riddles online](https://parade.com/947956/parade/riddles/) and thought I would try one with both the new Gemini 2.0 Flash model,
and the new thinking flavor as well, in order to contrast their way of working, and the outcome.

```java
var model = GoogleAiGeminiChatModel.builder()
        .apiKey(System.getenv("GOOGLE_AI_GEMINI_API_KEY"))
        .modelName("gemini-2.0-flash-exp")
        .build();

String response = model.generate("""
        The day before yesterday I was 21, and next year I will be 24.
        When is my birthday?
        """);
```

Gemini replies with:

```
This is a classic riddle! Here's how to solve it:

* **"The day before yesterday I was 21"** means yesterday you were 22.
* **"Next year I will be 24"** means you are currently 23.
* If you were 22 yesterday and 23 today, your birthday must be **today**.

Therefore, your birthday is **today**.
```

The answer is good, it's today, but it doesn't really tell exactly which date is the birthday.

Now let's update the model name to use the new thinking mode:

```java
var model = GoogleAiGeminiChatModel.builder()
        .apiKey(System.getenv("GOOGLE_AI_GEMINI_API_KEY"))
        .modelName("gemini-2.0-flash-thinking-exp-1219")
        .build();

String response = model.generate("""
        The day before yesterday I was 21, and next year I will be 24.
        When is my birthday?
        """);
```

Gemini advanced thinking process shows up:

```
Here's a thinking process to solve this riddle:

1. **Analyze the core statements:**
    * "The day before yesterday I was 21."
    * "Next year I will be 24."

2. **Break down the time references:**
Identify the different points in time being referenced.
    * "The day before yesterday" refers to a past date.
    * "Yesterday" refers to the day after "the day before yesterday".
    * "Today" is the present day.
    * "Tomorrow" is the day after today.
    * "Next year" refers to the year after the current year.

3. **Assign ages to the time references:**  Based on the statements,
assign ages to the person at these different time points.
    * The day before yesterday: 21 years old.
    * Yesterday: Since the person's age changes by one each birthday,
     yesterday they were either still 21 or had just turned 22.
    * Today: Continuing the progression, today they are either 22
      or 23.
    * Next year: 24 years old.

4. **Focus on the age jump:**  The key is the jump in age from
"today" to "next year." To go from being 22 or 23 today to being 24
next year *definitively* means their birthday must fall *between*
now and next year.

5. **Work backward from "next year":** If they will be 24 next year,
they must turn 24 sometime within that year. This means they are
currently 23 *or* they are still 23 and about to turn 24 soon.

6. **Work forward from "the day before yesterday":**
If they were 21 the day before yesterday, then yesterday they
turned 22. This means today they are 22.

7. **Reconcile the information:** We have two possibilities for the
current age: 22 (from the first statement) and potentially 23
(considering the jump to 24 next year). The only way both statements
can be true is if the birthday is *very* soon.

8. **Consider the implications of the age progression:**
    * If today they are 22, and next year they will be 24,
      the birthday must be *before* the end of the current year.
    * Since they were 21 the day before yesterday, they must have
      turned 22 *yesterday*.

9. **Determine the date:**  If they turned 22 yesterday,
and the statement refers to "next year I will be 24," this can only
happen if today is the *last day* of the year, and their birthday
is *today*.

10. **Verify the solution:** Let's check if this works:
    * If today is December 31st:
        * The day before yesterday (December 29th) they were 21.
        * Yesterday (December 30th) they turned 22.
        * Today (December 31st) they are 22.
        * Next year (after December 31st),
          they will turn 23 and then 24. This works!

11. **Formalize the answer:** The birthday is on December 31st.

This is a classic riddle that plays on how we perceive time.
Here's how to solve it:

* **"The day before yesterday I was 21"**:
  This means yesterday you were 22.
* **"Next year I will be 24"**: This means you are currently 23.

For both of these statements to be true,
today must be **January 1st**.

Let's break it down:

* **January 1st:** You are 23.
* **December 31st (yesterday):** You were 22.
* **December 30th (the day before yesterday):** You were 21.
* **Sometime later this year (your birthday):** You will turn 24.

Therefore, your birthday is on **December 31st**.
```

Now, thanks to this advanced reasoning approach, it's able to tell me the exact date of the birthday.

I've also tried the model's reasoning capabilities on coding problems (puzzles like Advent of Code ones),
and it's really doing a great job at solving most of them!

## Multimodal reasoning

Remember that Gemini is a **multimodal** model?
That means it can accept other _modalities_ like images, in addition to text.

So let's have a look at another example, with a word game from the
[Reader's digest](https://www.rd.com/article/visual-brain-teasers-and-puzzles/).
Only one of the rows is an anagram of a five-letter English word...

![](/img/gemini/word-puzzle.jpg)

This time, it's a word game, but the information is inside an image.
So we need to pass both the image, and the problem statement.

```java
var model = GoogleAiGeminiChatModel.builder()
        .apiKey(System.getenv("GOOGLE_AI_GEMINI_API_KEY"))
        .modelName("gemini-2.0-flash-thinking-exp-1219")
        .build();

Response<AiMessage> response = model.generate(UserMessage.from(
        ImageContent.from(
            new String(Base64.getEncoder().encode(readBytes(FILE_URI))),
            "image/png"),
        TextContent.from("""
            Only one of the rows in the picture is an anagram of a
            five-letter English word. Do you know which one it is?
            """)
));
```

If I ask that puzzle to Gemini 2.0 Flash (by changing the model name used above), it'll tell me (quickly) that:

```
Certainly!
The anagram in the image is **O L C R E**,
which unscrambled is **COLOR**.
```

Gemini 2.0 Flash is at the very top of the LLM [leaderboard](https://lmarena.ai/?leaderboard)
but it gets the answer wrong. Notice that `COLOR` is not an anagram of `OLCRE` at all.

Now let's see what the _thinking_ model says:

```
The user wants me to find the row that is an anagram of a five-letter
English word. I need to go through each row and see if I can
rearrange the letters to form a valid five-letter word.

Row 1: L E G T N - Could be GENTL but need 5 letters. Could be GLENT,
but is not a common word.
Row 2: O L C R E - Could be CLORE, COLER, RECOL. RECOL is the most
promising one.
Row 3: T C O H E - Could be ECHOT.
Row 4: L U D I B - Could be BUILD.
Row 5: M E U D Q - No obvious combination.
Row 6: H I N W L - Could be WHILN.
Row 7: W E S O L - Could be LOWES, OWELS, SOWEL, WOLES.

From the analysis, RECOL seems to be a valid word and has 5 letters.
Let me double check other possibilities.
Row 1: L E G T N -  TENGLE? No.
Row 3: T C O H E -  Could be CHETO, but not a common word.
Row 4: L U D I B -  Could be BLUID, but not a common word.
Row 6: H I N W L -  Could be WHILE.

Out of the possible options, WHILE and RECOL are valid five-letter
words. Let me re-examine the instruction "Only one of the rows in
the picture is an anagram of a five-letter English word."

Row 1: L E G T N - No obvious five-letter word.
Row 2: O L C R E - CLORE, COLER, RECOL
Row 3: T C O H E - ECHOT
Row 4: L U D I B - BUILD
Row 5: M E U D Q - No obvious five-letter word.
Row 6: H I N W L - WHILE
Row 7: W E S O L - LOWES, OWELS, SOWEL, WOLES

There seems to be more than one. Let me re-check the letter counts.
 All rows have 5 letters.

Rechecking my anagram findings:
Row 2: O L C R E -  Could form RECOL
Row 3: T C O H E - Could form ECHOT
Row 4: L U D I B - Could form BUILD
Row 6: H I N W L - Could form WHILE
Row 7: W E S O L - Could form LOWES

Let me think again. The instruction says *only one*. I might be making
a mistake in identifying a valid word.

Re-examining:
Row 1: L E G T N - No common five-letter word.
Row 2: O L C R E - RECOL
Row 3: T C O H E - ECHOT
Row 4: L U D I B - BUILD
Row 5: M E U D Q - No common five-letter word.
Row 6: H I N W L - WHILE
Row 7: W E S O L - LOWES

Perhaps some of these are not valid English words.
Let me verify the words.
RECOL -  Yes, it's a valid word.
ECHOT - No, ECHO is a word, ECHOT is not.
BUILD - Yes, it's a valid word.
WHILE - Yes, it's a valid word.
LOWES - Yes, it's a valid word.

I am still finding more than one valid word. Let me go through each
row very carefully again.

Row 1: L E G T N - No obvious 5-letter word
Row 2: O L C R E - Could be CLORE, COLER, RECOL.
Row 3: T C O H E - Could be CHOTE. No such word.
Row 4: L U D I B - Could be BUILD.
Row 5: M E U D Q - No obvious 5-letter word.
Row 6: H I N W L - Could be WHILE.
Row 7: W E S O L - Could be LOWES.

Let me verify the validity of each potential word.
RECOL - Valid English word.
BUILD - Valid English word.
WHILE - Valid English word.
LOWES - Valid English word (name of a store).

I am still struggling to find only one. Perhaps I am overlooking
something simple. Let me reread the question carefully.
"Only one of the rows in the picture is an anagram of a five-letter
English word."

Let me try rearranging the letters systematically for each row.

Row 1: L E G T N -  No five letter word.
Row 2: O L C R E -  RECOL
Row 3: T C O H E - No five letter word.
Row 4: L U D I B -  BUILD
Row 5: M E U D Q - No five letter word.
Row 6: H I N W L -  WHILE
Row 7: W E S O L -  LOWES

I am still identifying multiple valid words. Could there be a
constraint I am missing? The hints are just crops, so they don't
add new information.

Let me consider uncommon words.

Row 2: O L C R E -  Could be ORCEL.
Row 3: T C O H E -
Row 7: W E S O L - Could be OLWES.

I am still finding multiple possibilities. The question states
*only one*. This implies that my initial assessment of multiple
possibilities is incorrect. Let me re-examine each row with more
scrutiny for common five-letter words.

Row 1: L E G T N - No.
Row 2: O L C R E - RECOL.
Row 3: T C O H E - No.
Row 4: L U D I B - BUILD.
Row 5: M E U D Q - No.
Row 6: H I N W L - WHILE.
Row 7: W E S O L - LOWES.

I have identified four potential candidates. There must be something
I am not considering. Is there a specific type of five-letter word?
No constraint mentioned.

Let me check my understanding of anagram. An anagram is a
rearrangement of letters to form a new word.

Perhaps some of the words I identified are not standard English words.

RECOL - Yes, it is.
BUILD - Yes, it is.
WHILE - Yes, it is.
LOWES - Yes, it is.

I am still at a loss. The instruction is very clear: "Only one of the
rows... is an anagram of a five-letter English word."

Let me try a different approach. Assume only one is correct
and try to disprove the others.

If Row 2 (O L C R E - RECOL) is the answer, then none of the others
should form a valid five-letter word.
Row 4 (L U D I B) - BUILD is a valid word. This contradicts the
"only one" rule.

If Row 4 (L U D I B - BUILD) is the answer, then none of the others
should form a valid five-letter word.
Row 2 (O L C R E) - RECOL is a valid word. This contradicts the
"only one" rule.

If Row 6 (H I N W L - WHILE) is the answer, then none of the others
should form a valid five-letter word.
Row 2 (O L C R E) - RECOL is a valid word. This contradicts the
"only one" rule.

If Row 7 (W E S O L - LOWES) is the answer, then none of the others
should form a valid five-letter word.
Row 2 (O L C R E) - RECOL is a valid word. This contradicts the
"only one" rule.

There must be something very obvious I am missing.

Let me read the rows aloud and see if something jumps out.
L E G T N
O L C R E
T C O H E
L U D I B
M E U D Q
H I N W L
W E S O L

Is it possible that some of the letter combinations seem like a word
but aren't actually?

Let's focus on making sure each identified word is definitively
correct.

RECOL - Define: To collect again. Yes, it's a valid word.
BUILD - Define: To construct. Yes, it's a valid word.
WHILE - Define: A period of time. Yes, it's a valid word.
LOWES -  While primarily known as a store name, it can be
a plural noun.
However, the question is about anagrams of five-letter words.

Let's go back to each row and try to form words methodically.

Row 1: L E G T N -  Tingle, Longe, Glent. None are common five-letter
words.
Row 2: O L C R E -  Clore, Coler, Lorec, Recol. RECOL is a valid word.
Row 3: T C O H E -  Chote, Cothe, EchoT. None are common five-letter
words.
Row 4: L U D I B -  Bluid, Build. BUILD is a valid word.
Row 5: M E U D Q - No valid word.
Row 6: H I N W L -  Whiln, While. WHILE is a valid word.
Row 7: W E S O L -  Lowes, Owels, Sowle, Woles. LOWES is a valid word.

The problem states *only one*. This is the key.
There must be something about one of these words that makes it
the correct answer over the others.

Could it be about the commonality of the word?  While all are valid,
some are more frequently used.

RECOL - Less common.
BUILD - Very common.
WHILE - Very common.
LOWES - Common (as a store name).

Could there be a nuance in the definition or usage?

Let me consider if the capitalization or the "RD" at the bottom has
any relevance (unlikely for an anagram puzzle).

The crops are there to help see better, so the visual aspect
is important.

Let me look at the letters themselves and see if there's a pattern
or something I've missed.

Maybe one of the identified words isn't as standard as the others
in a pure linguistic sense.

Consider "LOWES". It's primarily a proper noun. Is the puzzle looking
for common nouns or verbs?  The question says "a five-letter English
word," which is quite broad.

Let me revisit the less common words I dismissed earlier.

Row 1: L E G T N - GLENT (a small secluded valley).
Row 3: T C O H E -  None.
Row 6: H I N W L -  WHILN (the pod or husk of seeds).

If GLENT is considered, we have another possibility.
If WHILN is considered, another possibility.

The constraint "only one" is crucial.

Let's assume, for a moment, that the answer is indeed one of the ones
I identified and I need to find a reason to exclude the others.

Could the structure of the letter arrangement provide a clue?
No obvious pattern.

Let me focus on the most common five-letter words from my list:
BUILD and WHILE. If one of these is the answer, why isn't the other?

Perhaps there's a very simple word I'm overlooking in one of the rows.

Row 3: T C O H E -  THROE.

THROE is a valid five-letter word.

Now my list is: RECOL, BUILD, WHILE, LOWES, THROE.
Still more than one.

I am stuck on the "only one" constraint. What could make one row
uniquely solvable?

Could it be about pronunciation or homophones?
Unlikely for an anagram.

Let me go back to the instructions and the image.
There are no additional instructions.

Is it possible there's a very obscure five-letter English word?

Let's review each row and try all possible combinations.
This will be tedious, but the "only one" constraint suggests
a unique solution.

Row 1: L E G T N -  ELTNG, ELNTG, ETLNG, ETNLG, ENLTG, ENTLG...
This is not efficient.

Let me rely on my vocabulary for common words first.

Consider the possibility that one of the words I identified isn't
a standard English word in the context of this puzzle.

Could "LOWES" as a store name not count? But the letters
can form the word.

Let's try working backward from the assumption that only one row
is correct. If I pick a row, can I definitively say the others
don't form any five-letter words?

If Row 2 (O L C R E) is the answer (RECOL), then the others cannot
form a valid five-letter word. But Row 4 (BUILD), Row 6 (WHILE),
and Row 7 (LOWES) do.

There must be a constraint I am not understanding
or a word I am misinterpreting.

Could it be about the frequency of letter usage in the
English language? Unlikely.

Let me consider common knowledge or general vocabulary.

Perhaps one of the letter sets can *only* form one five-letter word,
while others can form multiple.

Row 2: O L C R E - RECOL, CLORE, COLER.
Row 4: L U D I B - BUILD. Only one common word.
Row 6: H I N W L - WHILE. Only one common word.
Row 7: W E S O L - LOWES, OWELS, SOWLE, WOLES.

This is a potential lead. Row 4 and Row 6 seem to have a single,
very common five-letter word.

Let me double-check Row 4 (L U D I B). Are there other common
five-letter words?  BLUID is not common.

Let me double-check Row 6 (H I N W L). Are there other common
five-letter words? WHILN is less common.

The wording "anagram of a five-letter English word" is precise.

Could it be that some of the words I found are plurals or other forms
that don't fit the strict definition?  No, RECOL, BUILD, WHILE
are base forms.

Let me consider the visual arrangement again.
Is there any hidden message or pattern?  The lines separate the rows.

The "RD" in the corner is likely just a watermark.

The color is uniform.

Back to the anagrams. The "only one" is the key.

If I had to pick one, which row is *unambiguously*
a single five-letter English word?

Row 4: L U D I B - BUILD. It's hard to make another common
five-letter word from these letters.

Let's confirm this. Consider permutations.
BLUID is the only other plausible one, and it's not common.

Could the answer be BUILD based on this uniqueness?

Let me test this hypothesis against the other rows.

Row 2: O L C R E - RECOL, CLORE, COLER. Multiple options.
Row 6: H I N W L - WHILE. WHILN is another possibility,
though less common.
Row 7: W E S O L - LOWES, OWELS, etc. Multiple options.

This line of reasoning seems promising.
The "only one" could refer to the row that forms *only one*
common five-letter English word.

If this is the case, Row 4 (L U D I B - BUILD)
fits this criterion best.


Solution: The row that is an anagram of a five-letter English word
is **LUDIB**, which can be rearranged to form the word **BUILD**.

While some other rows can form five-letter words (such as RECOL
from OLCRE, WHILE from HINWL, and LOWES from WESOL), the question
states that "only one of the rows... is an anagram of a five-letter
English word."  Considering the commonality and unambiguous nature
of the resulting word, "BUILD" from "LUDIB" stands out as the most
likely single correct answer. Other rows could potentially form
multiple valid five-letter words, making "LUDIB" unique in its most
obvious and common anagram.
```

That's a pretty long answer, but it's correct!

The answer actually concatenates both the long thinking process, and at the end, the simpler answer deduced from that thinking process.
With a version of the API endpoint that distinguishes clearly both thinking and answer parts, and with an update to the LangChain4j framework,
we'll make it configurable to return or not the thinking steps, in case you want to just return the final answer.

## Thinking about it...

This is very interetsing to see the thinking process the model follows when reasoning about the problem.
Compared to some competing model which hides its thoughts, Gemini shares everything it went through.
And it does it faster!

You would likely not use a reasoning model for each and every question you could ask an LLM, obviously.
However, for solving advanced problems that require a deeper thought process, this is definitely the way to go!

And of course, I'm happy that [LangChain4j](https://docs.langchain4j.dev/) lets me play with this new model out of the box!
If you don't feel like coding right away in Java, you can also play with the model in [Google AI Studio](https://aistudio.google.com/app/prompts/new_chat).
