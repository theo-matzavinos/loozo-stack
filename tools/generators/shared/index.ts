import { addAssetsToClientLib } from '../client-lib-with-assets';
import generateLibrary from '../library';
import { Tree } from '@nrwl/devkit';

export default async function (
  tree: Tree,
  {
    name,
    assets,
  }: {
    name: string;
    assets: boolean;
  }
) {
  const libraryPath = `libs/shared/${name}`;

  await generateLibrary(tree, {
    name,
    directory: `shared`,
    tags: `type:shared`,
    simpleModuleName: true,
    generateComponent: true,
    exportComponent: true,
  });

  if (assets) {
    await addAssetsToClientLib(tree, libraryPath, `shared/${name}`);
  }
}
