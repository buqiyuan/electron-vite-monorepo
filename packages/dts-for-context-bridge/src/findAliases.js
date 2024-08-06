import {SyntaxKind} from "ts-morph";


/**
 * Find relevant method names from ESM imports
 * @param file
 * @return {Set<string>}
 *
 * @example
 * import electron from 'electron';
 * import electronAlias from 'electron';
 * import {contextBridge} from 'electron';
 * import {contextBridge as contextBridge} from 'electron';
 */
function findAliasesFromESImports(file) {
  return file
    .getDescendantsOfKind(SyntaxKind.ImportDeclaration)
    .reduce(
      (aliases, declaration) => {

        /**
         * Skip imports from not 'electron' module
         */
        if (declaration.getModuleSpecifier().getLiteralValue() !== 'electron') {
          return aliases
        }


        const importClause = declaration.getImportClause()

        /**
         * Skip imports without clause
         * @example
         * import 'module';
         */
        if (!importClause) {
          return aliases
        }

        /**
         * Skip type-only imports
         * @example
         * import type {contextBridge} from 'electron'
         */
        if (importClause.isTypeOnly()) {
          return aliases
        }


        const defaultImport = importClause.getDefaultImport()
        if (defaultImport) {
          aliases.add(`${defaultImport.getText()}.contextBridge.exposeInMainWorld`)
        }

        importClause
          .getNamedImports()
          .forEach(specifier => {

            /**
             * Skip type-only imports
             * @example
             * import {type contextBridge} from 'electron'
             */
            if (specifier.isTypeOnly()) {
              return
            }

            const {name, alias} = specifier.getStructure()
            if (name === 'contextBridge') {
              aliases.add(`${alias || name}.exposeInMainWorld`)
            }
          })

        return aliases
      },
      /** @type {Set<string>} */new Set
    )
}

/**
 * Find relevant method names from CJS require()
 * @param file
 * @return {Set<string>}
 *
 * @example
 * const electron = require('electron');
 * const electronAlias = require('electron');
 * const {contextBridge} = require('electron');
 * const {contextBridge: contextBridgeAlias} = require('electron');
 * const {contextBridge: {exposeInMainWorld}} = require('electron');
 * const {contextBridge: {exposeInMainWorld: exposeInMainWorldAlias}} = require('electron');
 */
function findAliasesFromCJSRequires(file) {
  return file
    .getDescendantsOfKind(SyntaxKind.CallExpression)
    .reduce(
      (aliases, expression) => {

        /**
         * Skip any not `require` calls
         */
        if (expression.getExpression().getText() !== 'require') {
          return aliases
        }

        /**
         * Skip `require` from not `electron`
         */
        const moduleName = expression.getArguments()[0]
        if (!moduleName || moduleName.getType().getLiteralValue() !== 'electron') {
          return aliases
        }

        /**
         * Skip `require` without any variable declaration
         * @example
         * require('electron')
         */
        const variableDeclarationList = expression.getFirstAncestorByKind(SyntaxKind.VariableDeclarationList)
        if (!variableDeclarationList) {
          return aliases
        }

        const declarations = variableDeclarationList.getDeclarations()

        declarations.forEach(declaration => {
          switch (declaration.compilerNode.name.kind) {

            /**
             * @example
             * const electron = require('electron');
             * const electronAlias = require('electron');
             */
            case SyntaxKind.Identifier :
              aliases.add(`${declaration.compilerNode.name.getText()}.contextBridge.exposeInMainWorld`)
              break;

            /**
             * @example
             * const {contextBridge} = require('electron');
             * const {contextBridge: contextBridgeAlias} = require('electron');
             * const {contextBridge: {exposeInMainWorld}} = require('electron');
             * const {contextBridge: {exposeInMainWorld: exposeInMainWorldAlias}} = require('electron');
             */
            case SyntaxKind.ObjectBindingPattern :
              declaration.compilerNode.name.elements
                .forEach(/** @type {import('ts-morph').BindingElement} */e => {
                  const prop = e.propertyName || e.name
                  if (prop.escapedText !== 'contextBridge') return
                  if (typeof e.name.escapedText === 'string') {
                    aliases.add(`${e.name.escapedText}.exposeInMainWorld`)
                  } else if (e.name.kind === SyntaxKind.ObjectBindingPattern) {
                    const subBindings = e.name.elements
                    subBindings.forEach(e => {
                      const prop = e.propertyName || e.name
                      if (prop.escapedText !== 'exposeInMainWorld') return
                      if (typeof e.name.escapedText === 'string') {
                        aliases.add(`${e.name.escapedText}`)
                      }
                    })
                  }
                })
              break;
          }
        })

        return aliases
      },
      /** @type {Set<string>} */new Set()
    )


}


/**
 * Returns an array of aliases for an electron.contextBridge.exposeInMainWorld:
 * - Looks for alternative names in imports and `require`
 *
 * @param {import("ts-morph").SourceFile} file
 * @returns {Set<string>}
 */
export function findAliases(file) {
  const aliases = findAliasesFromESImports(file)
  findAliasesFromCJSRequires(file).forEach(s => aliases.add(s))
  return aliases
}
