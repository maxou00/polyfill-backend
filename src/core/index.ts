
export enum Tables {
    schema = "forms",
    dataset = "form_response",
    filter = "filters"
}

export enum PusherEvent {
    
    schema_added = 'schema_added',
    schema_updated = "schema_updated",
    schema_deleted = "schema_deleted",

    filter_added = "filter_added",
    filter_updated = "filter_updated",
    filter_deleted = "filter_deleted",

    response_added = "response_added",
    response_updated = "response_updated",
    response_deleted = "response_deleted",

    dataset_updated = "dataset_updated"

}