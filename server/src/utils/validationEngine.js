function validateExercise(userCode, solutionPattern) {
  // Option A validation: Check for specific string patterns or keywords
  // This is a naive implementation. For robust checking, we would use an AST parser.
  
  // Normalize code (remove extra whitespace/newlines)
  const normalizedCode = userCode.replace(/\s+/g, ' ').trim();
  const normalizedSolution = solutionPattern.replace(/\s+/g, ' ').trim();

  // 1. Direct match check
  if (normalizedCode.includes(normalizedSolution)) {
    return { success: true, message: 'Correct!' };
  }

  // 2. Regex check (if solution is a regex string)
  try {
    const regex = new RegExp(solutionPattern, 'i');
    if (regex.test(userCode)) {
      return { success: true, message: 'Correct!' };
    }
  } catch (e) {
    // solutionPattern wasn't a regex
  }

  return { 
    success: false, 
    message: 'Solution does not contain required logic. Hint: Try using ' + solutionPattern 
  };
}

module.exports = { validateExercise };
