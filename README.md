# Concrete Programming Language

------------------------

## Abstract

Concrete is a new programming language. Concrete's closest relatives are Factor, and BASIC, but it has a unique twist: There is no heap memory: the output of all operations are stored within the code. `3 2 + _` for example evaluates to `3 2 + 5`. See more in the examples below.

Try out the [NEW(er) web version](http://goal-keeper-deborah-51172.bitballoon.com/)!

For the more adventurous, you can install and play with Concrete on your home machine right now! 

1. Clone this repository
2. run `npm install && node node_environment_utilities/main.js` in your terminal.

See also the [Trello Board](https://trello.com/b/LjKsfBw4/concrete).

## Language Specifics

A Concrete program is made up of "blocks" of text (code). The blocks are separated by a space (any whitespace will do). For example, `3 2 + _` is a simple Concrete program with 4 blocks, namely `3`, `2`, `+` ("plus"), and `_` ("blank").

Each block is "executed" in order, one at a time, from left to right. Most blocks represent information such as numbers (`1 2 3 4 2014`), quoted strings of text (`"Hello how are you"`), addresses (`@Beginning @I`), or the blank block (`_`); these blocks are called "values". Nothing happens when value blocks are executed.

Operator blocks cause something to happen when executed. Some operators are `+`, `-`, `*`, `/`, `jump`, `move`, and `reduce`. When these blocks are executed, any inputs required are taken from the left. For example, in the program `3 2 + _`, `3` and `2` are to be added together. If the execution causes data to be output, it is output to the right of the operator. Outputs overwrite the blocks they are placed in, so that's why you normally see a blank where output is expected. For example, if I executed the program `3 2 + 24`, the `24` would be overwritten by `5`.

Each block can be named by adding a hashmark followed by a single word (no spaces). That word is now the name of that block, and it can be referred to as an address. An address block starts with the AT sign followed by a name, so `3#MyNumber` would be addressed as `@MyNumber`. Many important operators take addresses as input.

Operations can be strung together, using prior outputs. `1 1 + _ 1 + _ 1 + _ 1 + _` will finally result in `5`, the sum of all those `1` blocks. 

To use previous results which are not conveniently placed, use the `move` block. To change the order of execution, we use `jump`. Together, we can use them to make a never-ending counter:

`1#A 1 + _#C @C @A move @A jump`

`move` takes two addresses as inputs. Above, that's `@C` and `@A`. The value at the first address is placed into the space with the second address. Above, the result of the addition replaces one of the inputs; each time `+` is executed, it will use the updated number.

`jump` takes one input, an address. It changes the next place of execution to be at that address. In the above example, `@A jump` causes the next execution point to be at `1#A`, so the whole program loops infinitely.

It's <em>that</em> easy. [Try it out here!](http://goal-keeper-deborah-51172.bitballoon.com/)

## Programming 101

<strong>In Progress</strong> I want to write all of a Programming 101 course with Concrete. I am seeing that this is quite an undertaking. Please let me know if you would be interested in seeing this made, or if you would like to contribute. Thanks!

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

    /* By the way, JavaScript */
    // style comments work how you think.

    // Sequences of ops
    0 1 + _ 1 + _ 1 + _ 1 + _ 1 + _ 1 + _
    // resolves to
    0 1 + 1 1 + 2 1 + 3 1 + 4 1 + 5 1 + 6

    3 4 + 7 5 > "Greater Than" bigger smaller ? bigger

    // Fibonacci sequences (@A contains the @Ith Fibonacci)
    0#A 1#B + _#C . "," . _ . 
      @B @A move 
      @C @B move 
      0#I 1 + _#J 20 > _ 6 0 ? _ jump 
      @J @I move @A jump

    // Halting While-loop
    5#A 1 + 6#B 5 > "Greater Than" 6 0 ? 6 jump @B @A move @A jump

    // Names
    4#A A get _

    // Composed Folds
    [ 3 3 [ 4 4 ] 3 ]

    // Call
    2 3 [ _ _ * _ ] call _

    // Reduce
    [ 1 1 1 1 1 1 2 3 7 ] [ _ _ * _ ] 1 reduce 42

-------------------------

## Concrete Thoughts

Programming should be fun and easy for everyone. If you've learned some programming before, you've probably had the same thought I did, "each individual step of programming is easy, so why is programming so hard to learn?"

Our computers and programming languages are not easy to work with. Our modern interpreters and compilers spit back harsh, unhelpful commentary. Most programming languages are built on, for many people, the scariest part of grade school: Mathematics. Many years of amazing research has gone into efficiency and correctness, but only a fraction of that into the real world, human aspects of programming.

To those just beginning their programming path, I think you can program. I think you can program right now. I think you're definitely smart, keen, and quick enough.

I think you will struggle with some parts of programming. The computer world has different rules than our daily life. You'll have to learn them, and you'll screw up and forget stuff just like all of us.

But, you can program. You can program right now. You're definitely smart enough. If you take your time, you can be a great programmer.

