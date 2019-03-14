import dev from './development';
import prod from './production';
const env = process.env.NODE_ENV || "development";

export default env === "production" ? prod : dev;