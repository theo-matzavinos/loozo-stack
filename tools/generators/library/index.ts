const {
  addLintingGenerator,
} = require('../../../../../node_modules/@nrwl/angular/src/generators/add-linting/add-linting');
import {
  Tree,
  updateJson,
  readProjectConfiguration,
  writeJson,
  readJson,
  formatFiles,
} from '@nrwl/devkit';
import { libraryGenerator, UnitTestRunner } from '@nrwl/angular/generators';

import { Linter } from '@nrwl/linter';
import { wrapAngularDevkitSchematic } from '@nrwl/devkit/ngcli-adapter';

export interface GenerateLibOptions {
  name: string;
  directory: string;
  tags: string;
  simpleModuleName?: boolean;
  routing?: boolean;
  generateComponent?: boolean;
  exportComponent?: boolean;
}

export default async function generateLibrary(
  tree: Tree,
  {
    directory,
    name,
    tags,
    simpleModuleName,
    routing,
    generateComponent,
    exportComponent,
  }: GenerateLibOptions,
) {
  const path = `libs/${directory}/${name}`;
  const projectName = `${directory.replace(/\//g, '-')}-${name}`;

  await libraryGenerator(tree, {
    name,
    directory,
    tags,
    buildable: true,
    unitTestRunner: UnitTestRunner.None,
    standaloneConfig: true,
    linter: Linter.None,
    prefix: 'consalio',
    simpleModuleName,
    routing,
    lazy: routing,
    strict: true,
    addModuleSpec: false,
    spec: false,
  });

  await addLintingGenerator(tree, {
    projectName: projectName,
    projectRoot: path,
    prefix: 'consalio',
    setParserOptionsProject: true,
  });

  updateJson(tree, `${path}/package.json`, (packageJson) => {
    packageJson.name = `@consalio/${directory}/${name}`;

    return packageJson;
  });

  updateJson(tree, `${path}/.eslintrc.json`, (eslintJson) => {
    const tsOverrides = eslintJson.overrides[0];

    eslintJson.overrides = [
      {
        files: tsOverrides.files,
        parserOptions: tsOverrides.parserOptions,
      },
    ];

    return eslintJson;
  });

  if (generateComponent) {
    await wrapAngularDevkitSchematic('@schematics/angular', 'component')(tree, {
      name,
      project: projectName,
      export: exportComponent,
      flat: true,
      style: 'css',
      changeDetection: 'OnPush',
      prefix: 'consalio',
      skipTests: true,
    });

    if (exportComponent) {
      const indexTsPath = `${path}/src/index.ts`;
      const indexTsContent = tree.read(indexTsPath)!;

      tree.write(
        indexTsPath,
        Buffer.concat([
          indexTsContent,
          Buffer.from(`export * from './lib/${name}.component';`),
        ]),
      );
    }
  }
}

async function convertToNxProjectGenerator(
  tree: Tree,
  {
    project,
    path,
  }: { project: string; path: string; existingWorkspaceConfig: any },
) {
  const config = readProjectConfiguration(tree, project);

  writeJson(tree, `${path}/project.json`, config);

  // updateJson(tree, 'workspace.json', () => {
  //   existingWorkspaceConfig.projects[project] = path;

  //   return existingWorkspaceConfig;
  // });

  await formatFiles(tree);
}
