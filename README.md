# Technical test

Jonny Wright

## Running the challenge

### Pre-reqs

Node.js must be installed. Then run

```
npm i
```

### Basic

To run the challenge:

```
npm run
```

### With a different file as input

The challenge can be run on different input files:

```
npm run start -- -f <<PATH_TO_JSON_FIL>>
```

### Interactive

The challenge can be run with an extremely basic CLI (further possible extension described below).

```
npm run start:interactive

```

## Comments

### General approach

To break this problem down I took the following steps:

- Do some prechecks - checking that it is possible to build a tree at all (e.g. do all the nodes have a unique id?)
- Attempting to build the tree in two stages:
  - Assigning each child to its parent (without ordering the children)
  - Ordering the children
- Do some post checks - checking that what we have built is a tree, e.g. that there are no circular loops

To compliment this, instead of throwing an exception, each step can output a `success` or `failure`. Each `failure` an contain multiple failure reasons. I took this approach to give better output: I would rather see 1 message with 10 different reasons, than fix one problem and re-run 10 times.

#### Alternate approaches

I also considered an algorithm based on the following idea:

- start by adding to the output the node with `parentNodeId = null` and `previousNodeId = null`, then remove this node from the input list
- Then continue in iterations to add to the output any node that can be directly connected to the output (e.g. in the second iteration this would be any node with `parentNodeId = <<firstNodeid>>` and `previousNodeId = null`). Remove these from the input list too.
- Continue until either all the nodes are placed in the output, or no more can be placed.

This approach has the advantage that it is more simple, and therefore quicker to implement and also for another developer to pick up. However I decided against this approach as it is sould potentially take much longer to run - potentially `O(n^2)` if the nodes are in reverse order that they would be added to the output. Additionally it is not possible to identify as easily what is wrong with an input if there is a problem (e.g. circular loop). For these two reasons I avoided this approach.

### Project layout

This project is based on a skeleton of a node ts template that I made a few years ago. There may be a few unneeded parts that I have not weeded out yet.

The high level layout of this project is loosely based on [clean architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html). There is

- `domain` folder containing the defintions of the data structure (i.e. the input and output types)
- `application` folder containing the "business rule" - the logic of building a tree from the input
- `frameworks` folder containing any technology for making the logic into a runnable program. This chooses which version of the program to run and deals with external dependecies (e.g. reading files), but it would also be where I would add a HTTP server or UI etc. If there were a database (or any other external dependencies e.g. Redis, external APIs, ...) I would put an implementation of that dependency here with a corresponding interface in the domain level.

Each layer can only access the layer(s) about it, so application logic can access domain type definitions, but cannot access concrete dependency implementaions.

I like this layout as it helps to surface the core objects and application rules at the top level, not just how the application is run.

### Further extensions

We would all love infinite time to create the perfect code. There are a few things that I did not get to, so instead of letting this excercise drag on here are some things that I considered that I did not get to:

- It would be good to create a few test tools to verify the correctness:
  - I considered creating a tool to generate some random trees, flatten them and check that rebuilding the tree resulted in the original tree.
  - Or a tool that checked the performance of the solution on very large tree sizes.
  - Or also a tool that generates random inputs. Each random input should either result in a tree being built, or reporting an error as to why the input is invalid. Any input that results in an unhandled exception or looping forever could be identified and corrected with a tool like this.
- I would like to add the tools above to the CLI.
- I have not yet implemented the complete logic for reporting multiple errors in an input. I would like to finish this as reporting multiple errors is the reason that I took this approach over throwing an error.
- Currently the only method of output is to print the tree to the console where the program was run. I considered adding different output methods (e.g. write to a file), but this did not seem high priority.
- The interactive CLI would benefit from auto-complete when selecting file.
