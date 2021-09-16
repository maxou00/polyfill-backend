import { FileField } from "../fields";
import { ValidationFunction } from "./base";

const fileErrors: ValidationFunction = (q: FileField, r: any) => {
    return undefined;
}

export default fileErrors;