# CogRealm - Living Fiction Memory

Where Fiction Remembers🧠.

Build living knowledge graphs of your favorite fictional universes🧙‍♀️. Explore *relationships*, *timelines*, and *characters* through **AI-powered memory**.

## The Idea

Instead of storing documents and using RAG, we store an entire fictional universe.

- Every character.
- Every location.
- Every event.
- Every relationship.
- Every organization.
- Every weapon/attack.
- Every quote.

Everthing gets stored in memory.

## Working Example
```
One Piece Wiki 
      |
Cognee Memory 
(
    Characters,
    Events,
    Relationships,
    Locations,
    Abilities
)
     |
Graph Search
     |
    LLM
     |
Interesting
  answers
```

## The Killer Feature 

Don't just answer factual questions. It answers hypothetical ones.

Example: `What advice would Naruto give to Harry Potter after Sirius died?` not just something simple like `Who is Naruto's father?`

The system should do the following:
```
    Naruto 
      |
   Retrieve
      +
    Harry
      |
   Retrieve 
      +
 Losses Naruto 
  experienced
      +
Retrieve Harry's 
   situation
      |
  Generate an 
  answer that 
 actually sounds
  like Naruto
```

Users can ask 
> Roast me like Dr. House
or 
> Give tech startup advice as Tony Stark
or 
> How would Sherlock Holmes investigate this murder?

## Worlds to support
A dropdown for varies universes:

- Naruto 
- One Piece 
- Harry Potter 
- Marvel 
- DC 
- Game of Thrones 
- Star Wars 
- Lord of the Rings 
- Breaking Bad 
- Attack on Titan 

Then adding multi-universe conversations.
Example: `(characters) Naruto + Batman + Sherlock Holmes + Tony Stark -> (prompt) How would these four stop Light Yagami?`, each character speaks independently.

## Relationship Explorer

Ask 
> Explain why Snape hated James Potter.

Instead of paragraph, it shows:
```
James -> Bullied -> Snape 
Snape -> Loved -> Lily
Lily -> Married -> James 
```
This immediately showcases Cognee.

## Time Line Queries

> What happened before Marineford?

> Who knew the truth about Itachi before Sasuke got to know about it?

> How did Walter White become Heisenberg?

## Memory Reasoning

> If Jiriya never died, how would the story change?

> What would happen if people didn't forget that Peter Parker is Spiderman?

## Dynamic Memory (Create your universes)

Let users create alternate universes, for example: `Harry Potter joins Slytherin.` and store this memory, now your future questions uses this memory, for example: `What would happen to Ron?`.

This can be incredibly fun and useful in creating alternate universes, what ifs etc.

## Data Gathering

```
{
    Famdom Wiki,
    Character Wikis,
    Public datasets,
    JSON exports etc.
}
        |
      Clean
        |
      Chunk
        |
      Cognee 
        |
 Knowledge Graph 
```

## Query Pipeline

```
User Question 
      |
Cognee Search 
      |
  Retrieve 
 Characters 
   Events 
Relationships
      |
 LLM Prompt
      |
   Response
```

## Example Questions 

1. Normal - `Who killed Ace?`
2. Relationship - `Why does Zoro repect Luffy?`
3. Timeline - `Explain everything leading to Avengers Endgame.`
4. Hypothetical - `Could Batman solve the Kira case?`
5. Personality - `Convince me to study with a Erwin Smith speech.`
6. Cross-universe - `Would Walter White survive in Game of Thrones?`
7. Debate - `Have Sherlock and L debate who is smarter.`

## Why Cognee?

Instead of **Vector Search**, we do **Entity Graph > Memory > Relationships > Reasoning > Context Retrieval**. Which allows for way better responses as relevant memory is provided to the LLM for generating a response.


