import fs from 'fs';

import {componentConfig} from './rollup.config';

const restPath = `${__dirname}/rest/admin`;
const restConfigs = fs
  .readdirSync(restPath, {withFileTypes: true})
  .filter((dirent) => dirent.isDirectory() && dirent.name !== '__tests__')
  .reduce(
    (acc, {name}) =>
      acc.concat(
        componentConfig(`rest/admin/${name}/index.ts`, `/rest/admin/${name}`),
      ),
    [],
  );

const config = restConfigs;

export default config;
