import { Tree, updateJson } from '@nrwl/devkit';

import generateLibrary from '../library';
import generateShell from '../shell';
import generateApi from '../api';

const affectedSchemaFilePaths = ['api', 'feature', 'shell', 'ui', 'util'].map(
  (path) => `tools/generators/${path}/schema.json`,
);

export default async function (
  tree: Tree,
  {
    name,
    api,
    advisorShell,
    corporateShell,
  }: {
    name: string;
    api: boolean;
    advisorShell: boolean;
    corporateShell: boolean;
  },
) {
  const domainTag = `domain:${name}`;

  await generateLibrary(tree, {
    directory: name,
    name: 'domain',
    tags: `${domainTag},type:domain`,
  });

  if (api) {
    await generateApi(tree, {
      domain: name,
    });
  }

  if (advisorShell) {
    await generateShell(tree, {
      domain: name,
      assets: false,
      routing: true,
      generateComponent: false,
      scope: 'advisor',
    });
  }

  if (corporateShell) {
    await generateShell(tree, {
      domain: name,
      assets: false,
      routing: true,
      generateComponent: false,
      scope: 'corporate',
    });
  }

  updateJson(tree, '.eslintrc.json', (rules) => {
    const enforceModuleBoundariesRule = rules.overrides.find(
      (override: { rules: Record<string, string[]> }) =>
        '@nrwl/nx/enforce-module-boundaries' in override.rules,
    );
    const depConstraintsConfig =
      enforceModuleBoundariesRule.rules['@nrwl/nx/enforce-module-boundaries'][1]
        .depConstraints;

    depConstraintsConfig.push({
      sourceTag: `domain:${name}`,
      onlyDependOnLibsWithTags: [
        `domain:${name}`,
        'type:shared',
        'type:api',
        'type:shell',
      ],
    });

    return rules;
  });

  updateJson(tree, 'workspace.code-workspace', (vsCodeWorkspace) => {
    const folders: { path: string; name: string }[] = vsCodeWorkspace.folders;

    folders.push({
      name,
      path: `libs/${name}`,
    });

    folders.sort((folder1, folder2) =>
      folder1.path.localeCompare(folder2.path),
    );

    return vsCodeWorkspace;
  });

  affectedSchemaFilePaths.forEach((path) =>
    updateJson(tree, path, (schema) => {
      schema.properties.domain.enum.push(name);

      return schema;
    }),
  );
}
