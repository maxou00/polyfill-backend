import { DataOperation, FilterChain, LogicalJoin, SingleRowCondition } from ".";
import { ContentField } from "../engine/fields";
import { DataForm, FormResponse } from "../engine/page";

function contain(field: ContentField, condition: SingleRowCondition, answer: any) {
    return (answer+"").includes(condition.value);
}

function startWith(field: ContentField, condition: SingleRowCondition, answer: any) {
    return (answer+"").startsWith(condition.value);
}

function endWith(field: ContentField, condition: SingleRowCondition, answer: any) {
    return (answer+"").endsWith(condition.value);
}

function eq(field: ContentField, condition: SingleRowCondition, answer: any) {
    return answer === condition.value || answer+"" === condition.value+""
}

function gt(field: ContentField, condition: SingleRowCondition, answer: any) {
    let check = answer;
    let value = parseFloat(condition.value);
    
    if(typeof check === "number" && typeof condition.value === "number") {
        return check > value;
    }
    return false;
}

function gte(field: ContentField, condition: SingleRowCondition, answer: any) {
    let check = answer;
    let value = parseFloat(condition.value);
    
    if(typeof check === "number" && typeof condition.value === "number") {
        return check >= value;
    }
    return false;
}

function lt(field: ContentField, condition: SingleRowCondition, answer: any) {
    let check = answer;
    let value = parseFloat(condition.value);
    
    if(typeof check === "number" && typeof condition.value === "number") {
        return check < value;
    }
    return false;
}

function lte(field: ContentField, condition: SingleRowCondition, answer: any) {
    let check = answer;
    let value = parseFloat(condition.value);
    
    if(typeof check === "number" && typeof condition.value === "number") {
        return check <= value;
    }
    return false;
}

export const DataOperators = {
    contain, startWith, endWith, eq, gt, gte, lt, lte
}

export function doFieldMatch(field: ContentField, condition: SingleRowCondition, answer: any) {
    switch(condition.operation) {
        case DataOperation.contain : {
            return condition.negated && contain(field, condition, answer)
        }
        case DataOperation.startWith : {
            return startWith(field, condition, answer)
        }
        case DataOperation.endWith : {
            return endWith(field, condition, answer)
        }
        case DataOperation.eq : {
            return eq(field, condition, answer)
        }
        case DataOperation.gt : {
            return gt(field, condition, answer)
        }
        case DataOperation.gte : {
            return gte(field, condition, answer)
        }
        case DataOperation.lt : {
            return lt(field, condition, answer)
        }
        case DataOperation.lte : {
            return lte(field, condition, answer)
        }
        default: {
            return false;
        }
    }
}

export function checkRowConditionChain(schema: DataForm, row: FormResponse, chain: FilterChain): boolean {
    if(chain.type === "single") {
        let field = schema.form_content.pages.find((p) => p.key === chain.page)?.fields.find((f) => f.key === chain.field);
        let response = row.pages.find((p) => p.pageId === chain.page)?.responses.find((r) => r.questionId === chain.field);
        if(field && response) {
            let match = Boolean(doFieldMatch(field, chain, response) || false);
            return chain.negated ? !match : match;
        }
    }
    else if(chain.logic === LogicalJoin.and) {
        return checkRowConditionChain(schema, row, chain.left) && checkRowConditionChain(schema, row, chain.right);
    }
    else if(chain.logic === LogicalJoin.or) {
        return checkRowConditionChain(schema, row, chain.left) || checkRowConditionChain(schema, row, chain.right);
    }
    return false;
}