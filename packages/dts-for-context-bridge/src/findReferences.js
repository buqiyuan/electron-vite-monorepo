import {findCallExpressionsByNames} from "./findCallExpressionsByNames.js";
import {findAliases} from "./findAliases.js";
import {getDataFromCallExpression} from "./getDataFromCallExpression.js";

/**
 *
 * @param {import('ts-morph').Project} project
 * @returns {Map<string, {value: string, docs?: string[]}>}
 */
export function findReferences(project) {
  const references = new Map()

  project.getSourceFiles().forEach(file => {
    findCallExpressionsByNames(file, findAliases(file))
      .forEach(e => {
        const {apiKey, api, docs} = getDataFromCallExpression(e)
        references.set(apiKey, {value: api, docs})
      })
  })

  return references
}


