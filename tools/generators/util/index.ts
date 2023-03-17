import { Tree } from '@nrwl/devkit';

import generateLibrary from '../library';

export default async function (
  tree: Tree,
  { name, domain }: { name: string; domain: string }
) {
  await generateLibrary(tree, {
    name,
    directory: `${domain}/util`,
    tags: `domain:${domain},type:util`,
  });
}
