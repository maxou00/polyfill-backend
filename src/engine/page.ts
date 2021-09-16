import { nanoid } from "nanoid";
import { FillableDecoration } from "./decoration";
import { ContentField } from "./fields";

export interface Page {
    key: string;
    title: string;
    description: string;
    fields: ContentField[];
}

export interface Fillable {
    id: string;
    title: string;
    subtitle: string;
    locale: string;
    pages: Page[];
    decoration: FillableDecoration;
    createdAt: number;
}

export interface DataForm {
    id: string;
    form_content: Fillable;
    user_id: string;
    allow_anonymous?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface FormResponse {
    id: string;
    formId: string;
    pages: ResponsePage[];
    meta: any;
    createdAt: Date;
    updatedAt: Date;
}

export interface ResponsePage {
    pageId: string;
    responses: FieldResponse[];
}

export interface FieldResponse {
    questionId: string;
    answer: any;
}