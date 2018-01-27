import * as fs from "fs";

/**
 * The path to the configuration file
 */
const configFile = "./config/configuration.json";

/**
 * Loads the configuration
 */
export const config: any = JSON.parse(fs.readFileSync(configFile, "utf8"));
