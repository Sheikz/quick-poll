"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
/**
 * The path to the configuration file
 */
const configFile = "./config/configuration.json";
/**
 * Loads the configuration
 */
exports.config = JSON.parse(fs.readFileSync(configFile, "utf8"));
