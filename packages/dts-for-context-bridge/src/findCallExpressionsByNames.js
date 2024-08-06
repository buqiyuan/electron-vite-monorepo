import {SyntaxKind} from "ts-morph";

/**
 * Searches the file for method calls by the specified names
 * @param {import('ts-morph').SourceFile} file
 * @param {Set<string>} names
 * @return {import('ts-morph').CallExpression[]}
 */
export function findCallExpressionsByNames(file, names) {
  return file
    .getDescendantsOfKind(SyntaxKind.CallExpression)
    .filter(e => {
        // Only allow calls by specified names
        if (!names.has(e.getExpression().getText())) {
          return false;
        }

        // Must contain at least two arguments
        const args = e.getArguments()
        if (args.length < 2) {
          return false
        }

        // First argument should be non-empty string
        if (!args[0].getType().isStringLiteral() || args[0].getType().getLiteralValue().trim() === '') {
          return false
        }

        return true
      }
    )
}
