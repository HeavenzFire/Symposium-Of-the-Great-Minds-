import { GoogleGenAI } from "@google/genai";
import type { Thinker } from '../types';

if (!process.env.API_KEY) {
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

/**
 * Gets the initial, independent response from each thinker.
 */
export const getInitialResponses = async (
  question: string, 
  thinkers: Thinker[]
): Promise<{ thinker: Thinker; response: string }[]> => {
  const promises = thinkers.map(async (thinker) => {
    try {
      const systemInstruction = `You are embodying the persona of ${thinker.name}, the renowned ${thinker.field}.
---
PERSONA DETAILS:
${thinker.persona}
---
Respond to the following question from this perspective, in your characteristic voice, tone, and style. Be insightful and concise. Do not introduce yourself or mention you are an AI. Directly address the question.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: question,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.6,
          topP: 0.9,
        },
      });

      return { thinker, response: response.text };
    } catch (error) {
      console.error(`Error fetching initial response for ${thinker.name}:`, error);
      return { 
        thinker, 
        response: `An error occurred while consulting ${thinker.name}. Please check the console for details.` 
      };
    }
  });

  return Promise.all(promises);
};

/**
 * Generates rebuttals from each thinker based on the initial responses of their colleagues.
 */
export const getRebuttals = async (
  question: string,
  initialResponses: { thinker: Thinker; response: string }[]
): Promise<{ thinker: Thinker; rebuttal: string }[]> => {
  const debateContext = initialResponses
    .map(res => `${res.thinker.name} said: "${res.response}"`)
    .join('\n\n');

  const rebuttalPromises = initialResponses.map(async (initial) => {
    // For each thinker, provide the context of what everyone ELSE said.
    const otherResponses = initialResponses
      .filter(res => res.thinker.id !== initial.thinker.id)
      .map(res => `${res.thinker.name} said: "${res.response}"`)
      .join('\n\n');

    try {
      const debateInstruction = `You are embodying the persona of ${initial.thinker.name}. You are in a symposium with other great minds.
---
PERSONA DETAILS:
${initial.thinker.persona}
---
The initial question was: "${question}"
You already gave an initial response. Now, you have heard from your colleagues. Here are their thoughts:
---
COLLEAGUES' RESPONSES:
${otherResponses}
---
Now, provide a brief follow-up statement or rebuttal. You can agree, disagree with specific points, or build upon their ideas. Address their points directly while staying in character. Be concise.`;
        
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: "Please provide your follow-up statement.",
        config: {
          systemInstruction: debateInstruction,
          temperature: 0.7, // Slightly higher temp for more creative debate
          topP: 0.9,
        },
      });

      return { thinker: initial.thinker, rebuttal: response.text };
    } catch (error) {
      console.error(`Error fetching rebuttal for ${initial.thinker.name}:`, error);
      return { 
        thinker: initial.thinker, 
        rebuttal: `An error occurred while ${initial.thinker.name} was formulating a rebuttal.` 
      };
    }
  });

  return Promise.all(rebuttalPromises);
};