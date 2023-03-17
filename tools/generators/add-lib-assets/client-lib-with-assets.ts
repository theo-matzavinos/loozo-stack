import { Tree, readProjectConfiguration } from '@nrwl/devkit';
import { addAssetsToClientLib } from '../client-lib-with-assets';

export default async function (
  tree: Tree,
  { library, path }: { library: string; path: string }
) {
  const config = readProjectConfiguration(tree, library);

  await addAssetsToClientLib(tree, config.root, path);
}
