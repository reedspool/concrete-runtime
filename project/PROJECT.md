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
8. Motion - Use animation and motion to suggest the flow of data and order of operations within the machine.
9. Haters Gonna Hate - Concerned with making a powerful programming language, but not with time or memory efficiency, or code elegance, except when those interfere with playability.

## Implemented Operators
+ - * / 
0 1 2 3 ... "Hello World!" 
true false
? < >
move jump get . print
_ 2#index

## To Implement
% floor sin PI
append  eq = and or 
dance draw

## Implemented Statements
// Basic ops and values
3 2 + _
3 2 - _
3 2 * _
4 2 / _
3 2 > _
3 2 < _
"true" 5 4 ? _

  // Any kind of whitespace will do
3 2 +        _
3 2 +   \t\n     _

  // Sequences of ops
0 1 + _ 1 + _ 1 + _ 1 + _ 1 + _ 1 + _
0 1 + 1 1 + 2 1 + 3 1 + 4 1 + 5 1 + 6

3 4 + 7 5 > "Greater Than" bigger smaller ? bigger

// Fibs
'0#A 1#B + _#C . "," . _ . @B @A move @C @B move 0#I 1 + _#J 20 > _ 6 0 ? _ jump @J @I move @A jump

// While loop
5#A 1 + 6#B 5 > "Greater Than" 6 0 ? 6 jump @B @A move @A jump

// Names
'4#A A get _

// Composed Folds
[ 3 3 [ 4 4 ] 3 ]

// Call
2 3 [ _ _ * _ ] call _

// Reduce
[ 1 1 1 1 1 1 2 3 7 ] [ _ _ * _ ] 1 reduce 42

// Reduce with names
[ 1 1 1 1 1 1 2 3 7 ] [ _ _ * _#A @A get _ ] 1 reduce 42
