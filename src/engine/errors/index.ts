import { combineValidators, commonErrors, ValidationFunction } from "./base";
import fileErrors from "./file";
import numberErrors from "./number";
import selectionErrors from "./selection";
import textErrors from "./text";

export const FieldErrorMap: { [key: string]: ValidationFunction } = {
    text: combineValidators(commonErrors, textErrors),
    number: combineValidators(commonErrors, numberErrors),
    selection: combineValidators(commonErrors, selectionErrors),
    file: combineValidators(commonErrors, fileErrors)
}

export * from "./base";