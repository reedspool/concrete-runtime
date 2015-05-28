# Concrete Programming Language

------------------------

## Abstract

Concrete is a new programming language. Concrete's closest relatives are Factor, and BASIC, but it has a unique twist: There is no heap memory: the output of all operations are stored within the code. `3 2 + _` for example evaluates to `3 2 + 5`. See more in the examples below.

Try out the [NEW web version](http://counseller-corinne-56612.bitballoon.com/)!

For the more adventurous, you can install and play with Concrete on your home machine right now! 

1. Clone this repository
2. run `npm install && node node_environment_utilities/main.js` in your terminal.

See also the [Trello Board](https://trello.com/b/LjKsfBw4/concrete).

------------------------

## Example Programs
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
    0#A 1#B + _#C . "," . _ . 
      @B @A move 
      @C @B move 
      0#I 1 + _#J 20 > _ 6 0 ? _ jump 
      @J @I move @A jump

    // While loop
    5#A 1 + 6#B 5 > "Greater Than" 6 0 ? 6 jump @B @A move @A jump

    // Names
    4#A A get _

    // Composed Folds
    [ 3 3 [ 4 4 ] 3 ]

    // Call
    2 3 [ _ _ * _ ] call _

    // Reduce
    [ 1 1 1 1 1 1 2 3 7 ] [ _ _ * _ ] 1 reduce 42

    // Reduce with names
    [ 1 1 1 1 1 1 2 3 7 ] [ _ _ * _#A @A get _ ] 1 reduce 42

-------------------------

## Concrete

Programming should be fun and easy for everyone. If you've learned some programming before, you've probably had the same thought I did, "each individual step of programming is easy, so why is programming so hard to learn?"

Our computers and programming languages are not easy to work with. Our modern interpreters and compilers spit back harsh, unhelpful commentary. Most programming languages are built on, for many people, the scariest part of grade school: Mathematics. Many years of amazing research has gone into efficiency and correctness, but only a fraction of that into the real world, human aspects of programming.

To those just beginning their programming path, I think you can program. I think you can program right now. I think you're definitely smart, keen, and quick enough.

I think you will struggle with some parts of programming. The computer world has different rules than our daily life. You'll have to learn them, and you'll screw up and forget stuff just like all of us.

But, you can program. You can program right now. You're definitely smart enough. If you take your time, you can be a great programmer.

