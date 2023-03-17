import { addAssetsToClientLib } from '../client-lib-with-assets';
import generateLibrary from '../library';
import { Tree } from '@nrwl/devkit';

export default async function (
  tree: Tree,
  {
    domain,
    assets,
    routing,
    scope,
    generateComponent,
  }: {
    domain: string;
    assets: boolean;
    routing: boolean;
    scope: 'advisor' | 'corporate';
    generateComponent: boolean;
  }
) {
  const libraryPath = `libs/${domain}/shell`;

  await generateLibrary(tree, {
    name: `${scope}-shell`,
    directory: `${domain}/shell`,
    tags: `domain:${domain},type:shell,scope:${scope}`,
    routing,
    generateComponent,
    simpleModuleName: true,
  });

  if (assets) {
    await addAssetsToClientLib(tree, libraryPath, `${domain}/shell`);
  }
}
