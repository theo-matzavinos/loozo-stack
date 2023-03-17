import { Tree, updateJson } from '@nrwl/devkit';

export default function (tree: Tree) {
  updateJson(tree, '.eslintrc.json', (rules) => {
    const enforceModuleBoundariesRule = rules.overrides.find(
      (override: { rules: Record<string, string[]> }) =>
        '@nrwl/nx/enforce-module-boundaries' in override.rules,
    );
    const depConstraintsConfig: any[] = (enforceModuleBoundariesRule.rules[
      '@nrwl/nx/enforce-module-boundaries'
    ][1].depConstraints = []);

    depConstraintsConfig.push({
      sourceTag: 'type:api',
      onlyDependOnLibsWithTags: [
        'type:ui',
        'type:domain',
        'type:util',
        'type:api',
      ],
    });

    depConstraintsConfig.push({
      sourceTag: 'type:feature',
      onlyDependOnLibsWithTags: [
        'type:ui',
        'type:domain',
        'type:util',
        'type:api',
        'type:shared',
      ],
    });

    depConstraintsConfig.push({
      sourceTag: 'type:ui',
      onlyDependOnLibsWithTags: [
        'type:domain',
        'type:util',
        'type:api',
        'type:shared',
        'type:ui',
      ],
    });

    depConstraintsConfig.push({
      sourceTag: 'type:domain',
      onlyDependOnLibsWithTags: ['type:util', 'type:api', 'type:shared'],
    });

    depConstraintsConfig.push({
      sourceTag: 'type:shared',
      onlyDependOnLibsWithTags: ['type:shared'],
    });

    depConstraintsConfig.push({
      sourceTag: 'type:shell',
      onlyDependOnLibsWithTags: [
        'type:ui',
        'type:domain',
        'type:feature',
        'type:util',
        'type:api',
        'type:shared',
      ],
    });

    return rules;
  }) as any;
}
