import { TextConstraints, TextField } from "../fields";
import { combineValidators, ValidationFunction } from "./base";

const lengthValidator: ValidationFunction = (q: TextConstraints & { format: string }, r: string) => {
    let max = 256;

    if(["short", "email"].includes(q.format)) {
        max = q.max || 128;
        if(r.length > max) {
            return `Pas plus de ${max} caractères.`;
        }
    }
    else if(["paragraph", "rich"].includes(q.format)) {
        max = q.max || 600;
        let exp = /[,\s\.;:']/;
        let wordCount = r.split(exp).filter((part) => part.trim().length !== 0).length;
        
        if(wordCount > max) {
            return `Pas plus de ${max} mots.`;
        }
    }
}

const emailValidator: ValidationFunction = (q: TextConstraints & { format: string }, r: string) => {
    if("email" === q.format) {
        let exp = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/
        if(!r.match(exp)) {
            return `Votre réponse n'est pas une adresse électronique valide.`;
        }
    }
}

const textErrors: ValidationFunction = combineValidators(lengthValidator, emailValidator);

export default textErrors;