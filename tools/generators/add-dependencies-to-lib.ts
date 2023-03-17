import { updateJsonInTree } from '@nrwl/workspace';

export interface Dependencies {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
}

export function addDependenciesToLib(
  directory: string,
  {
    dependencies,
    devDependencies,
    optionalDependencies,
    peerDependencies,
  }: Dependencies
) {
  return updateJsonInTree(`${directory}/package.json`, (packageJson) => {
    packageJson.dependencies = { ...packageJson.dependencies, ...dependencies };
    packageJson.devDependencies = {
      ...packageJson.devDependencies,
      ...devDependencies,
    };
    packageJson.optionalDependencies = {
      ...packageJson.optionalDependencies,
      ...optionalDependencies,
    };
    packageJson.peerDependencies = {
      ...packageJson.peerDependencies,
      ...peerDependencies,
    };

    return packageJson;
  }) as any;
}
