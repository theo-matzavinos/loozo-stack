import generateLibrary from '../library';
import { Tree } from '@nrwl/devkit';

export default async function (tree: Tree, { domain }: { domain: string }) {
  await generateLibrary(tree, {
    name: 'api',
    directory: `${domain}`,
    tags: `domain:${domain},type:api`,
  });
}
