# Contributing

The most useful thing you can send this project is a report that a number here looks wrong or out of date.

## A number looks wrong or out of date

Every constant's row on the [index](https://u00dxk2.github.io/bounds-ledger/), and every constant's own page, has a **looks wrong?** link. It opens a GitHub issue draft in this repository with the constant's name and ID and the seven-character upstream mirror commit filled in. Add what you know: the source you are comparing against, and where in it the number appears.

Two things to know before you send it:

- **The bounds are not ours.** The tables are copied from [teorth/optimizationproblems](https://github.com/teorth/optimizationproblems). If a bound there is wrong or has been improved, the correction belongs in that repository. A report here tells this ledger what to check. It does not change upstream's table.
- **The main upper and lower bounds come from the last-listed rows of their mirrored tables, not "the record".** Audit notes can show other rows. Upstream's bounds tables can contain earlier entries alongside the last-listed row, so a last-listed row that is weaker than an earlier one is not by itself an error.

## A constant you need is not here

Search the index. If nothing matches, the page offers a link to a GitHub issue draft with your search term in the title and body. That is how we learn what to watch next.

## Code

The scripts are Node with no dependencies. `npm test` runs the self-tests without the network, and [`docs/README.md`](docs/README.md) lists the documents in reading order. Open an issue before a large change, because the repository has rules about what may be published (`AGENTS.md`).
