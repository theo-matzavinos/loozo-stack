import {
  Tree,
  updateProjectConfiguration,
  readProjectConfiguration,
} from '@nrwl/devkit';

export async function addAssetsToClientLib(
  tree: Tree,
  directory: string,
  assetsPath: string,
) {
  const projectConfiguration = readProjectConfiguration(tree, 'todo');

  projectConfiguration.targets?.['build'].options?.['assets'].push({
    input: `${directory}/src/assets`,
    glob: '**/*',
    output: `assets/${assetsPath}`,
  });

  updateProjectConfiguration(tree, 'todo', projectConfiguration);
  tree.write(`${directory}/src/assets/.gitkeep`, '');
}
