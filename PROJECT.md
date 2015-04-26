# Programming Game

## Revving up
1. Install node & npm
2. npm install lodash baconjs
3. node main.js


## Goals
1. Turing Complete - Can we prove this?
2. Fun
3. Timing - Each step at the current level of interest should take the same amt of time
4. Memory - Leave the memory hanging out, show where stuff comes in
5. Characters - Anthropomorphizing 
6. Honesty - Metaphors that reveal truth, not obscure it
7. Helpful - Any block will tell you what its current job is, bug messages offer real steps towards help

## Implemented Operators
+
0 1 2 3 ...
true false
and or ? < > eq =
copy jump slide get move . print
_ 2#index

## To Implement
- * / % floor sin PI
"Hello World!" append
dance draw 
[ in _ _ + _ out ]#sum [ 3 4 5 6 7 ] @sum 0 reduce _
[ 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 ]
[ in _#n @n get _ 2 > _ 5 0 ? _ slide 1 out end @n @Fib call _#a @n 1 - @Fib call _#b #a #b + _ out ]#Fib 50 @Fib  _

### Next steps
* Names are just aliases for addresses. 
* read text input from STDIN
* Read arguments from STDIN
* Implement naming
* Separate logging timing of side effects/outputs from daemon movement
* Make a block registry and factory
* Separate daemon impl
* Make a package.json file with dependencies and description
* Take out extraneous requires
* Make a more rigorous typing system for Blocks
* Implement strings
* Explore/ design folds & calling
* Implement folds and calling
* Use browserify or webpack to get this into the browser.
* Make a web browser view and editor
* Use a real unit testing framework
* Separate Address
* Make a trello board for this, post it in README

### Future
* IMMUTABLES!!! IMMUTABLE UNIVERSES!!!!
* More variety of side effects