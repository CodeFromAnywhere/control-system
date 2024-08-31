dev command can be changed into `git dev x` 

# Documentation:

## Installation
Make sure the `code` command of VSCode works, [see docs](https://code.visualstudio.com/docs/setup/mac) 

## Usage
* To add your cwd to `git dev`, type this: `git dev this {label}`. This will also overwrite the label if it was already set.
* To open any VSCode project you've added before, type `git dev {label}`
* If you don't know which codebases you can dev, type `git dev` to see a menu.
* If you try `git dev` for a label that's not in your labels yet, it will see try to authenticate with GitHub and find the most lucky hit of all your available repo's (personal and of your organisations). It will git clone it in the correct organisation folder in your development path (`/Developer` by default), and then it will be opened in VSCode
* To add a repo to your current workspace (belonging to the label you opened), type `git dev add {label}`. This will generate a `.codeworkspace` file with the repo in cwd and the repo of your label
* To find a workspace in GitHub but label it differently, run `git dev {repo-search} as {label}
