export function proposalPrompt(topic: string) {
  return `
Generate a professional academic project proposal.

Topic: ${topic}

Include:
1. Title
2. Abstract
3. Problem Statement
4. Objectives
5. Scope
6. Technologies
7. Expected Outcome

Use formal academic language.
`;
}

export function synopsisPrompt(topic: string) {
  return `
Generate a complete project synopsis.

Topic: ${topic}

Include:
1. Introduction
2. Problem Statement
3. Objectives
4. Existing System
5. Proposed System
6. Advantages
7. Modules
8. Conclusion
`;
}