# Some handy commands
export CONTROL_SYSTEM_DIR=$HOME/Desktop/p2/common/control-system
w() { echo "$PASSWORD" | sudo -S pmset disablesleep 1 }
s() { echo "$PASSWORD" | sudo -S pmset disablesleep 0 }
d() { bun $CONTROL_SYSTEM_DIR/src/toggle-dark-mode/toggleDarkMode.cli.ts }
t() { bun $CONTROL_SYSTEM_DIR/src/time.cli.ts }
m() { bun $CONTROL_SYSTEM_DIR/src/play-music/playMusic.cli.ts }
