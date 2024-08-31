# Indexation (one-time cost)

## Step 1: Making markdown promptable with `GptSection`

How to decrease big markdown file sizes.

- add frontmatter saying it was gpt-sectioned.
- add <!-- GptSection:XXXXXXXX --> to every section and subsections
- if a (sub)section is more than 1000 words, split it up per alinea, where every chunk contains any amount of alineas up to 1000 words. Do this by splitting it up with <!-- GptSection --> at the start of every alinea
- If any alinea is still more than 1000 words, take the first sentences up to 1000 words, and ask where a new topic starts (pharse the sentence where something new starts). Remove that and put that as a first alinea. When doing this, add a comment <!-- GptSection -->

Now, we have still the same sections, but at least we have it split up into alineas smaller than 1000 words.

## Step 2: Analysing every section

Query for every `GptSection`:

- keywords
- shortSummary (one sentence)
- keyDetails
- mainTopic
- contentType: meeting? literature? message? call? brainstorm? content? podcast? video?

## Step 3: Analysing the analysis

Recursively go into as many sections as possible that fit the prompt, bubbling up until there is just one list of keywords and a bit longer summary. This can be stored in frontmatter.

- keywords (simply add them and make them unique)
- summary (recursively list all summaries and prompt to summarize that)
- keyDetails (add all together)
- topics (recursively list all topics and prompt to simplify into a shorter list of topics)
- contentType: take the most common guess from all `GptSection`s

### Step 3a: Classification

Use content-type and summary, and add additional classification. Main classes to classify any markdown

- multi-speaker conversation, single-author copy?
- if it's single-author, is it a message to someone?
- musical lyrics?
- book: fiction / non-fiction?

Also useful:

- word-count

## Step 4: Naming and locating

Using the topics, contentType, and summary, we can choose a proper name and location in the file system.

# Querying / semantic search (per-use cost)

## Querying knowledge base to find `GptSection`s

Now we have an indexation of all our knowledge. A single prompt can provide us with:

- where to look (baseFolderPaths)
- where not to look (baseFolderPaths)
- which topics to look for (string[])
- which keywords to look for (string[])

We can then perform a direct search on markdown frontmatter, GptSection comments, and full file contents. We end up with a list of files and `GptSection`s. Some GptSection's can already be pruned, most likely, based on keywords, topics, etc.

So we have a `GptSection` array with the file that is found. This can already directly link to those locations in the files.

## Answering a question

An additional (recursive) prompt can yield us a more exact result to our question. The amount of processing spent on this prompt can impact the result a lot, also the specific prompting chain and strategy has great impact.
