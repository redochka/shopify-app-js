import fs from 'fs';

import * as pkg from '../../package.json';
import {
  getPlugins,
  esmConfigs,
  cjsConfigs,
} from '../../config/rollup/rollup.config';

export function componentConfig(input, outDir) {
  return [
    {
      input,
      plugins: getPlugins(`./dist/esm${outDir}`),
      external: Object.keys(pkg.dependencies),
      // TODO: Some things are omitted if we enable treeshaking, we might need to change the code
      treeshake: false,
      output: [
        {
          ...esmConfigs,
          dir: `./dist/esm`,
          preserveModules: true,
          preserveModulesRoot: './',
        },
      ],
    },
    {
      input,
      plugins: getPlugins(`./dist/cjs${outDir}`),
      external: Object.keys(pkg.dependencies),
      // TODO: Some things are omitted if we enable treeshaking, we might need to change the code
      treeshake: false,
      output: [
        {
          ...cjsConfigs,
          dir: `./dist/cjs`,
          preserveModules: true,
          preserveModulesRoot: './',
        },
      ],
    },
  ];
}

const adapterPath = `${__dirname}/adapters`;
const adapterConfigs = fs
  .readdirSync(adapterPath, {withFileTypes: true})
  .filter((dirent) => dirent.isDirectory() && dirent.name !== '__e2etests__')
  .reduce(
    (acc, {name}) =>
      acc.concat(
        componentConfig(`adapters/${name}/index.ts`, `/adapters/${name}`),
      ),
    [],
  );

const config = [
  ...adapterConfigs,
  ...componentConfig('lib/index.ts', '/lib'),
  ...componentConfig('runtime/index.ts', '/runtime'),
];

export default config;
