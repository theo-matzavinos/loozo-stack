import { addAssetsToClientLib } from '../client-lib-with-assets';
import generateLibrary from '../library';
import { Tree } from '@nrwl/devkit';

export default async function (
  tree: Tree,
  {
    name,
    domain,
    assets,
  }: {
    name: string;
    domain: string;
    assets: boolean;
  }
) {
  const libraryPath = `libs/${domain}/client/ui/${name}`;

  await generateLibrary(tree, {
    name,
    directory: `${domain}/ui`,
    tags: `domain:${domain},type:ui`,
    simpleModuleName: true,
    exportComponent: true,
    generateComponent: true,
  });

  if (assets) {
    await addAssetsToClientLib(tree, libraryPath, `${domain}/${name}`);
  }
}
