Command “clone”: looks for remote that matches the first argument the most in list of remotes, clones it, pulls it, checks out a branch and optionally makes a new branch from that one, then it runs “yarn setup —if-present” if available, and opens it in VSCode, which will also run the tasks.

At the end it crawls your computer for folders with `.git` folder inside, and sees which remotes are there, and updates the list of remotes. If this is easy, it also should add remotes of your authenticated GitHub user that are available on GitHub, somehow.

example: clone [Code-From-Anywhere/]coworksurf [from test [to sprint1may]]
