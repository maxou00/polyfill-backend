import { NumberField } from "../fields";
import { combineValidators, ValidationFunction } from "./base";

const limitValidation: ValidationFunction = (q: NumberField, r: any) => {
    if(!q.format && r) {
        if(q.min && r < q.min) {
            return `Doit etre supérieur ou égal à ${q.min}`;
        }
        if(q.max && r > q.max) {
            return `Doit etre inférieur ou égal à ${q.max}`;
        }
    }
}

const dateTimeValidation: ValidationFunction = (q: NumberField, r: any) => {
    if(["date", "datetime"].includes(q.format as string) && r) {
        if(q.min) {
            let min = q.min;
            let rInMillis = Date.parse(r);
            if(rInMillis < min) {
                return `Date minimale acceptée: ${new Date(min).toDateString()}`;
            }
        }
        if(q.max) {
            let max = q.max;
            let rInMillis = Date.parse(r);
            if(rInMillis > max) {
                return `Date maximale acceptée: ${new Date(max).toDateString()}`;
            }
        }
    }
}


const numberErrors: ValidationFunction = combineValidators(limitValidation, dateTimeValidation); 

export default numberErrors;