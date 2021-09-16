import { CommonFieldProps, ContentField } from "../fields";

export type ValidationFunction = (question: ContentField, response: any) => any;
export type CombineValidationFunction = (...validators: ValidationFunction[]) => ValidationFunction;

export const commonErrors: ValidationFunction = (q: CommonFieldProps, r: any) => {
    if (q.required && !r) {
        return "Une réponse est requise";
    }
}

export const combineValidators: CombineValidationFunction = (...validators: ValidationFunction[]) => {
    return (q: ContentField, r: any) => {
        for (const key in validators) {
            let err = validators[key](q, r);
            if (err) {
                return err;
            }
        }
        return undefined;
    }
}
