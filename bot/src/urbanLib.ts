// this will be the library that will be used to get the urban dictionary definitions, random words, word of the day, etc.
export interface Definitions {
    list: TermDefinition[]
}

export interface TermDefinition {
    word: string,
    definition: string,
    permalink?: string,
    thumbs_up?: number,
    thumbs_down?: number,
    current_vote?: string,
    sound_urls?: string[],
    author: string,
    defid?: number,
    written_on: string,
    example: string
}

export type Autocomplete = string[];

export interface ExtraAutocomplete {
    results: AutocompleteResult[]
}

export interface AutocompleteResult {
    term: string,
    preview: string
}


// definitions
// https://api.urbandictionary.com/v0/define?term=hi

export async function getDefinition(term: string): Promise<Definitions> {
    try {
        const res = await fetch(`https://api.urbandictionary.com/v0/define?term=${term}`);
        return res.json();
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}


// random definitions
// https://api.urbandictionary.com/v0/random

export async function getRandom(): Promise<Definitions> {
    try {
        const res = await fetch(`https://api.urbandictionary.com/v0/random`);
        return res.json();
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

// words of the day
// https://api.urbandictionary.com/v0/words_of_the_day

export async function getWordsOfTheDay(): Promise<Definitions> {
    try {
        const res = await fetch(`https://api.urbandictionary.com/v0/words_of_the_day`);
        return res.json();
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

// autocomplete search
// https://api.urbandictionary.com/v0/autocomplete?term=hi

export async function getAutocomplete(term: string): Promise<Autocomplete> {
    try {
        const res = await fetch(`https://api.urbandictionary.com/v0/autocomplete?term=${term}`);
        return res.json();
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

// extra autocomplete search
// https://api.urbandictionary.com/v0/autocomplete-extra?term=h

export async function getExtraAutocomplete(term: string): Promise<ExtraAutocomplete> {
    try {
        const res = await fetch(`https://api.urbandictionary.com/v0/autocomplete-extra?term=${term}`);
        return res.json();
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

export async function replaceTermsWithLinks(text: string): Promise<string> {
    return text.replace(/\[(.*?)\]/g, (match, p1) => {
        return `[${p1}](https://www.urbandictionary.com/define.php?term=${encodeURIComponent(p1)})`;
    });
}