# Technical test

Jonny Wright

## Running the challenge

To run the challenge:

```
npm i
npm run
```

## Comments

I was severly limited for time in attempting this project. There were several things that I would have liked to make better, but just didn't have the time. I have aimed for quality over quantity where I have made a tradeoff - there are edge cases that I did not get to, but I think that I have built a quality codebase that could be extended to handle those edge cases. Hopefully this code submission gives a representitative view of how I approach the problem and writing code in general, as well as some guide as to how I would approach prioritising the remaining things I did not get to.

### Project layout

This project is based on a skeleton of a node ts template that I made a few years ago. There are probably a few unneeded parts that I have not weeded out yet (e.g. docker scripts are overkill for this problem).

The high level layout of this project is loosely based on clean architecture. There is

- `domain` folder containing the defintions of the data structure (i.e. the input and output types)
- `application` folder containing the "business rule" - the logic of building a tree from the input
- `frameworks` folder containing any technology for making the logic into a runnable program. Currently this is just a `main` function, but it would also be where I would add a CLI or HTTP server.

I like this layout as it helps to surface the core objects and application rules at the top level, not just how the application is run.

### TODOs

As I mention we all would like infinite time to create perfectly crafted code, there are a few more thing I did not get to. Here are the things that I would do in order of priority.

- I would like to give the option to run the project under different conditions.
  - I think the most important is to allow a command line parameter or env var to read the input (or inputs), and also output the result to a file.
  - I would also consider adding a CLI with options to choose different inputs.
  - This CLI may also include some tools to generate some random trees, flatten them and check that rebuilding the tree resulted in the original tree.
- I missed some major edge cases. I have some unit tests for these (see `src/application/build-node-tree.spec.ts`), but didn't get to them all, so many are just marked with `todo`. I would like to finish all these and have a think if I missed any more edge cases.
- I am pretty sure that my solution for ordering the children within a parent is sub optimal. It is `O(n^2)`. I have a gut feeling that there is a solution where I find the last child and follow the links backwards to the first child, but I couldn't get this to work nicely with empty lists of children.
- I have not tested whether sorting the top level children is correct. I would like to have more confidence.
