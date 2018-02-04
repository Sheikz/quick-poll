import * as fs from "fs";

/**
 * The path to the configuration file
 */
const configFile = "./config/configuration.json";

/**
 * Loads the configuration
 */

export const config: any = (process.env.NODE_ENV === 'production') ? 
    {} : JSON.parse(fs.readFileSync(configFile, "utf8"));
