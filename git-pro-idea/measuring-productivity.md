```
prod () { git log --stat --since "${2:-10 years ago}" --until "${3:-1 second ago}" --author="$1" --pretty=tformat: --numstat -- 'app/**/*.ts*' | awk '{ add += $1; subs += $2; loc += $1 - $2; productivity += $1 - 0.8 * $2; } END { printf "added lines: %s, removed lines: %s, total lines: %s, productive lines: %.0f \n", add, subs, loc, productivity }' }

authors () { git log --format="%an" | sort -u }

pros () {
    IFS=$'\n'
    authorsArray=( $(authors) )
    for a in $authorsArray; do ( echo $a && prod $a ); done;
}
```

Instead of doing PR-Pay based on estimated story points, you should also be able to assign coins based on the result of the `prod` command above for a specific PR or time period.

In the end I think it should be a combination of:
* WakaTime
* Real time
* Productivity (LOC)
* Milestones (features implemented) (see #8)
* Exposure (views)