import patternSvgs from '../assets/json/bg-patterns.json'

export const SHEET_ID = '13eAGD0f2Y1BcLqpgwoAcV5q5BouyzZ4E7HFa1UtfDwI';
export const CARDS_GOOGLE_SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=2001267068#gid=2001267068`;
export const SPECIAL_CARDS_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=1966736245#gid=1966736245`;
export const DEFAULT_SETTINGS = {
    theme: 'light',
    sound: true,
    language: 'en',
    themeColor: '#4ECDC4',
    backgroundKey: "4",
    roundSecondsDuration: 60
};

export const BACKGROUNDS = [
    {
        name: "Circuit Board",
        key: "1",
    },
    {
        name: "I Like Food",
        key: "3",
    },
    {
        name: "Bubbles",
        key: "4",
    },
    {
        name: "Puzzle",
        key: "5",
    }
];

function encodeSvgToDataUrl(svgString) {
    const cleanedSvg = svgString.replace(/\s+/g, ' ').trim();
    const encodedSvg = encodeURIComponent(cleanedSvg)
        .replace(/'/g, '%27')
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29');
    return `url("data:image/svg+xml,${encodedSvg}")`;
}

export function getBackgroundPatternStyle(key, color) {
    const pattern = patternSvgs[key];
    if (!pattern) {
        return {};
    }

    const svgContent = pattern.baseSvg.replace(/\{\{fillColor\}\}/g, color);
    const backgroundUrl = encodeSvgToDataUrl(svgContent);

    return {
        backgroundImage: backgroundUrl,
        backgroundRepeat: 'repeat',
    };
}
