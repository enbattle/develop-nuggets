## What it is

SQL injection: an attacker supplies input that gets concatenated directly
into a SQL query, changing what the query actually does. It happens
whenever a query is built by gluing strings together instead of using
parameters.

```python
# vulnerable — user_input becomes part of the SQL itself
query = f"SELECT * FROM users WHERE email = '{user_input}'"
db.execute(query)
```

If `user_input` is `' OR '1'='1`, the query becomes
`WHERE email = '' OR '1'='1'`: true for every row, returning the entire
table. If it's `'; DROP TABLE users; --`, the database may execute that as
a second statement entirely.

## Why it matters

It's consistently one of the most common and most damaging vulnerabilities
in software (a mainstay of the OWASP Top 10 for a reason). A successful
injection can read, modify, or delete an entire database, or bypass
authentication outright, and the vulnerable code often looks completely
unremarkable until someone tests it with the right input.

## The fix: parameterized queries

Never build SQL by concatenating or interpolating untrusted input directly
into it. Use parameterized queries (prepared statements), where the query
structure and the data are sent to the database separately: the driver
guarantees the data can never be interpreted as SQL syntax, no matter what
it contains.

```python
# safe — value is passed separately, never interpreted as SQL
query = "SELECT * FROM users WHERE email = ?"
db.execute(query, (user_input,))
```

Every mainstream database driver and ORM supports this. There's rarely a
good reason to build a query by string concatenation at all.

## Where it applies

Any code that builds a database query from external input — form fields,
URL parameters, HTTP headers, even values that "shouldn't" contain SQL
syntax (attackers don't respect that assumption). The same underlying bug
class (untrusted input treated as code) also shows up as command
injection and, in a different form,
[cross-site scripting](/nuggets/xss).

## The actual rule

The real rule is never let input be interpreted as code in the first
place, not "sanitize or escape it carefully" after the fact — sanitization
has to be remembered and done correctly on every single query, and one
missed spot is all it takes. Parameterized queries make the safe behavior
the default instead of a discipline every developer has to maintain by
hand.
