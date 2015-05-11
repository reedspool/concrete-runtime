var peanutz = require('./concrete_grammar_from_pegjs.js')
peanutz.parse("0#A 1#B + _#C @C . \",\" . _ . @B @A move @C @B move 0#I 1 + _#J 20 > _ 5 0 ? _ slide @J @I move 0 jump END")