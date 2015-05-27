Universes have a daemon and a tape

A Tape has a list of Blocks with addresses, and possibly Names

A Daemon is just an address on the Tape. Consider it the writer/reader head of the Turing machine.

A Name maps to a single address.
An Offset 

The Universe controls the state of its tape, stepping the daemon along it, and controlling the side effects that blocks can have.

A Block is either an Operator, a Number, a Fold (with its own Tape inside), A Falsey.