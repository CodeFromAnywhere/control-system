#!/usr/bin/env node
import { disableScreenSleep } from "./toggle-screen-sleep.js";
import { disableScreenSleep2 } from "./toggle-screen-sleep.js";
import { enableScreenSleep } from "./toggle-screen-sleep.js";

const [password] = process.argv.slice(2);

//disableScreenSleep(password);

enableScreenSleep("");
