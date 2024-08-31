#!/usr/bin/env node
import { playMusic } from "../playMusic.js";

const [musicFolderName] = process.argv.slice(2);

playMusic({ musicFolderName });
