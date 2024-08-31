# push: improved git utilities

As the cli that I use the most, I feel that there are some improvements possible that would increase my productivity quite a bit.

4) `push sync [-pull/-push] <message>` runs `papapackage ls`, runs `git pull` for all libraries, then runs `push <message>` for all packages with local changes (or one of the two only, if specified)
5) `push watch` uses `papapackage` to watch changes, and runs `push "improvements"` after n minutes of inactivity in every branch. make it's possible to disable publishing to npm in this case, and make sure it only pushes if the tests pass.
6) `git stretch [--all] <message>` runs `git --stretch <message>` for current repo or for `--all`
7) pushing without message could use GPT3 to think of a message based on your changes
8) pushing without emoji could use GPT3 to think of an emoji based on your message (gitmoji replacement)
9) `git new [--mv path]` runs `git init` and `npm init` and `hub create` and `push "initial commit"` for the current directory, using the current directory name as name for npm and github (optionally setting an organisation as config, and optionally moving the current directory to somewhere else). This makes it easy to open source a component in your codebase, so could also be called `open` as an alias and separate repo (see Code-From-Anywhere/opportunities#10)
10) add tags for versioning convention: `-b` for breaking, `-p` for patch, `-m` for minor (or something)

Wow. If you think about it, it can grow quickly!

# git add
install cli could be a wrapper on yarn + npm based on the files it finds in the dir so you don't make the mistake