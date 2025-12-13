// prompts.js

// Import the JSON data
import promptTemplates  from '../assets/json/prompts.json';

// Safe prompt templates for multiple languages (no backticks, safe for JS strings)
// export const promptTemplates = ... // (This is now in prompts.json)

/**
 * Builds the Ekiwoki content generation prompt for a specific language.
 *
 * @param {object} params - The parameters for the prompt.
 * @param {string} [params.theme] - The theme for the cards.
 * @param {string} [params.author] - The author tag to be used.
 * @param {number} [params.standardCount] - Number of standard cards to generate.
 * @param {number} [params.specialCount] - Number of special cards to generate.
 * @param {string} [params.lang='en'] - The language code ('ru', 'en', 'fr', 'de', 'es', 'it', 'zh').
 * @returns {string} The fully constructed prompt string.
 */
export function buildPrompt({theme, author, standardCount, specialCount, lang = 'en'} = {}) {
    const language = (lang || 'en').toLowerCase();
    const template = promptTemplates[language] || promptTemplates.en;

    // Default values if parameters are null or undefined
    const finalTheme = (theme || '').toString() || 'THEME';
    const finalAuthor = (author || '').toString() || 'AI';
    const finalStandardCount = String(standardCount != null ? standardCount : 5);
    const finalSpecialCount = String(specialCount != null ? specialCount : 5);

    return template
        .replace(/{{THEME}}/g, finalTheme)
        .replace(/{{AUTHOR}}/g, finalAuthor)
        .replace(/{{STANDARD_COUNT}}/g, finalStandardCount)
        .replace(/{{SPECIAL_COUNT}}/g, finalSpecialCount);
}

// Example usage:
// import { buildPrompt } from './prompts.js';
// const prompt = buildPrompt({ theme: 'ИГРЫ И ПРИСТАВКИ', author: 'AI', standardCount: 10, specialCount: 5, lang: 'ru' });
// console.log(prompt);