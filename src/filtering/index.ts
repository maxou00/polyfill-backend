export enum DataOperation {
    contain = "contain",
    startWith = "startWith",
    endWith = "endWith",

    eq = "eq",
    gt = "gt",
    gte = "gte",
    lt = "lt",
    lte = "lte"
}

export enum LogicalJoin  {
    and = "and",
    or = "or"
}

export interface SingleRowCondition {
    type: 'single';
    page: string;
    field: string;
    operation: DataOperation;
    negated: boolean;
    value: any;
}

export interface BinaryRowCondition {
    type: 'combined';
    logic: LogicalJoin;
    left: SingleRowCondition | BinaryRowCondition;
    right: SingleRowCondition | BinaryRowCondition;
}

export type FilterChain = SingleRowCondition | BinaryRowCondition;

export interface DataFormFilter {
    id: string;
    label: string;
    code: string;
    schemaId: string;
    user_id: string;
    filter: FilterChain;
    created_at: string;
    updated_at: string;
}