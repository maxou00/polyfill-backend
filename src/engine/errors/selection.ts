import { SelectField } from "../fields";
import { ValidationFunction } from "./base";

const selectionErrors: ValidationFunction = (q: SelectField, r: any) => {
    return undefined;
}

export default selectionErrors;