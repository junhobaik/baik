import * as archive from './archive';
import * as auth from './auth';
import * as dashboard from './dashboard';
import * as storage from './storage';
import * as utils from './utils';

const client = { auth, dashboard, archive, utils, storage };

export default client;
