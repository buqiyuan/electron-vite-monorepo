import {Project} from "ts-morph";
import {findReferences} from "./findReferences.js";


function getDtsFileToWrite(input) {
  const project = new Project(input.endsWith('tsconfig.json')
    ? {
      tsConfigFilePath: input
    }
    : {}
  );

  if (!input.endsWith('tsconfig.json')) {
    project.addSourceFilesAtPaths(input);
  }

  const dtsFile = project.createSourceFile('./tmp.d.ts')
  const interfaceDeclaration = dtsFile.addInterface({
    name: 'Window',
  })

  findReferences(project)
    .forEach(({value, docs}, key) => {
      interfaceDeclaration.addProperty({
        name: key,
        type: value,
        isReadonly: true,
        docs,
      })
    })

  return dtsFile
}


export function generate({input, output}) {
  getDtsFileToWrite(input).copyImmediatelySync(output, {
    overwrite: true
  })
}

export function generateAsync({input, output}) {
  return getDtsFileToWrite(input).copyImmediately(output, {
    overwrite: true
  })
}
