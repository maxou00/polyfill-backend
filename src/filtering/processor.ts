import { FilterChain } from ".";
import { DataForm, FormResponse } from "../engine/page";
import { checkRowConditionChain } from "./conditionchecker";

export class FilterChainProcessor {
    chain: FilterChain;
    schema: DataForm;
    dataset: FormResponse[];

    /**
     *
     */
    constructor(schema: DataForm, dataset: FormResponse[], filter: FilterChain) {
        this.schema = schema;
        this.dataset = dataset;
        this.chain = filter;        
    }


    filter() {
        return this.runStaged(this.dataset, this.chain);
    }

    runStaged(previousStageDataset: FormResponse[], chainPosition: FilterChain) {
        let match: FormResponse[] = [];
        previousStageDataset.forEach((row) => {
            if(this.checkSingleRow(row, chainPosition)) {
                match.push(row);
            }
        })
        return match;
    }

    checkSingleRow(row: FormResponse, chainPosition: FilterChain) {
        return checkRowConditionChain(this.schema, row, chainPosition)
    }
}