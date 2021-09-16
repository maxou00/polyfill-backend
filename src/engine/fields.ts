export type FieldType = "text" 
    | "number"
    | "selection"
    | "file"

export type FieldFormat = "short" 
    | "paragraph" 
    | "rich" 
    | "email" 
    | "date" 
    | "time" 
    | "datetime" 
    | "dropdown" 
    | "radio" 
    | "checkbox" 
    | "chip"
    | "image"
    | "video"

export enum FieldTypeEnum {
    text = "text", number = "number", selection = "selection", file = "file"
}

export enum FieldFormEnum {
    short = "short", paragraph = "paragraph", rich = "rich", email = "email",
    date = "date", time = "time", datetime = "datetime", dropdown = "dropdown", 
    radio = "radio", checkbox = "checkbox", chip = "chip", image = "image", video = "video"
}

export interface CommonFieldProps {
    key: string;
    type: FieldType;
    format?: FieldFormat;
    title: string;
    description: string;
    required: boolean;
}

export interface TextConstraints {
    type: "text",
    max?: number,
    expression?: string
}

interface RangeableValue {
    min: number;
    max: number;
}

export interface NumberConstraints extends Partial<RangeableValue> {
    type: "number"
}

export interface DateConstraints extends NumberConstraints {
    format: 'date'
}

export interface TimeConstraints extends NumberConstraints {
    format: 'time'
}

export interface DateTimeConstraints extends NumberConstraints {
    format: 'datetime'
}

export interface RangeConstraints extends RangeableValue {
    type: "range"
    step: number
}

export interface IntervalConstraints extends RangeableValue {
    type: "interval",
    step: number
}

export interface FileConstraints {
    type: "file"
    maxSize: number; // in Mb
    maxCount: number; /// max number of files user can input
    formats?: string[];
}

export interface DecorableOption<T = string> {
    key: string;
    value: T;
    description?: string;
    image?: string;
}

export interface SelectionConstraints<T = string> {
    type: "selection"
    options: DecorableOption<T>[];
    allowCustomValue: boolean,
    selection: 'single' | 'multiple',
    maxSelection?: number
}          

export type Field<T> = CommonFieldProps & T;
export type TextField<T = any> = Field<TextConstraints & T>;
export type SelectField<T = any> = Field<SelectionConstraints & T>;
export type FileField<T = any> = Field<FileConstraints & T>;

export type SingleLineField = TextField<{ format: "short" }>

export type RichTextField = TextField<{ format: "rich" }>

export type ParagraphField = TextField<{ format: "paragraph" }>

export type EmailField = TextField<{ format: "email" }>

export type NumberField = Field<NumberConstraints>

export type DateField = Field<DateConstraints>

export type TimeField = Field<TimeConstraints>

export type DateTimeField = Field<DateTimeConstraints>

export type DropdownField = SelectField<{ format: 'dropdown', selection: 'single' }>

export type RadioField = SelectField<{ format: 'radio', selection: 'single' }>

export type CheckboxField = SelectField<{ format: "checkbox", selection: 'multiple' }>

export type ChipField = SelectField<{ format: "chip" }>

export type ContentField =
                        SingleLineField 
                        | RichTextField
                        | ParagraphField
                        | EmailField
                        | NumberField
                        | DateField
                        | TimeField
                        | DateTimeField
                        | DropdownField
                        | RadioField
                        | CheckboxField
                        | ChipField
                        | FileField