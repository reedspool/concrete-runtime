# Programming Game

## Goals
1. Turing Complete
2. Fun
3. Timing
4. Memory
5. Characters

## Things to Implement
+ - * / % floor sin PI
0 1 2 3 5.12 true false
and or ? < > eq =
copy{-2} copy{A} goto{B}
_ 2#index

### Next steps
* Parse words into tape
* Execute tape reducing daemon over tape
* read text input from STDIN or arg
* nice print out of all state at every step in console
* Put this on github for jack
* Make a simple way to unit test
* Build a legit math problem solver
* IMMUTABLES!!! IMMUTABLE UNIVERSES!!!!
* Figure out time

#### Unit tests I want to run

3 2 + _                       3 2 + 6
3 2 > _                       3 2 > true
true 5 4 ? _                  true 5 4 ? 5
ptr{-1}                       ! Never terminates
4#A A _                       4#A A 4

