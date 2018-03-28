import * as env from '../../env';

// # Start with env
const cfg = { ...env };

// # Add with version specifg config
cfg.WHAPPU_YEAR = '2018';

// # Export config
const config = Object.freeze(cfg);
export default config;
