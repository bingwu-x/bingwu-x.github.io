---
title: Implemented a SAT Solver
author: bingwu
pubDatetime: 2026-07-16T20:54:09.972+08:00
slug: implementing-a-sat-solver
featured: false
draft: false
tags:
  - SAT
  - Fun
description:
  "Yet another NP-complete problem."
timezone: "Asia/Shanghai"
---

The essence of a CDCL-based boolean SAT solver is mainly about
analyzing prior mistakes. I recently finished implementing one, so I
wanted to document a few of its core ideas.

The problem space of a SAT problem is often massive for a standard
search-based algorithm. A CDCL-based SAT solver isn't magic. It's
trying to perfect the pruning.

## Propagation

Propagation is the step to deduce outcomes of a variable
assignment. The solver attempts assignments that cooperate with
decisions to ensure all clauses evaluate to True.

For a decision made randomly or heuristically, the propagation step
examines the consequences by looking at clauses that contain
literals that have been made False.

If a decision leads to False for part of a clause, then:
+ If the clause is already True, the decision doesn't change the
clause's value;
+ If other part of the clause has unassigned values, there's still a
chance the clause can evaluate to True, so the focus about this clause shifts
to that part;
+ If the clause becomes a unit clause, meaning it has only one
unassigned literal left, the solver assigns that literal to True, so
that this clause remains True;
+ If this decision results in the final remaining literal becoming
False, the solver raises this clause as a conflict.

There are other methods implementing propagation with performance
variations. The above is the two-watched literal approach.


## Conflict Analysis

This is the part that differentiates the solver from a standard DFS
searching because it allows the solver to prune branches that
mathematically lead to other dead ends early enough.

It's just like time travel. Every effect has a cause. Tracing how one
event happened produces a Tree of previous events. The antecedents of
literals in the conflict clause form that Tree.  When a unit clause
was forced to True in the propagation step, the unit clause became the
antecedent for that specific unassigned variable.

The solver keeps replacing variables with their antecedents until the
conflict clause contains only one variable assigned at current
decision level. The conflict clause after this replacement becomes the
*asserting clause* or the *learned clause*. That single variable
represents the very beginning of the conflict clause's failure. The
second-highest(most recent) decision level is called the *asserting
level*.

The conflict must be resolved at the nearest possible decision level
which is the asserting level:
+ revert the solver to the state of the asserting level;
+ add the learned clause for propagation;


## Conclusion

Honestly, it wasn't as challenging as I expected. Finishing this one
slightly destroyed my interest in the area. I should try adding
advanced heuristics, or implementing some algebraic SAT solver.
