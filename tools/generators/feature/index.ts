import { addAssetsToClientLib } from '../client-lib-with-assets';
import generateLibrary from '../library';
import { Tree } from '@nrwl/devkit';

export default async function (
  tree: Tree,
  {
    name,
    domain,
    routing,
    assets,
    scope,
  }: {
    name: string;
    domain: string;
    routing: boolean;
    assets: boolean;
    scope: 'advisor' | 'corporate';
  }
) {
  const libraryPath = `libs/${domain}/features/${name}`;

  await generateLibrary(tree, {
    name,
    directory: `${domain}/features`,
    tags: `domain:${domain},type:feature,scope:${scope}`,
    routing,
    simpleModuleName: true,
    generateComponent: true,
  });

  if (assets) {
    await addAssetsToClientLib(tree, libraryPath, `${domain}/features/${name}`);
  }
}
