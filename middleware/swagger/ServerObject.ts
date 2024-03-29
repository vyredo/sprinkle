export interface IServerObject {
    url:	string; //	REQUIRED. A URL to the target host. This URL supports Server Variables and MAY be relative, to indicate that the host location is relative to the location where the OpenAPI document is being served. Variable substitutions will be made when a variable is named in {brackets}.
    description?:	string; //	An optional string describing the host designated by the URL. CommonMark syntax MAY be used for rich text representation.
    variables?:	IServerVariableObject[]; //	A map between a variable name and its value. The value is used for substitution in the server's URL template.
}

export interface IServerVariableObject {
    enum?: string[]  // An enumeration of string values to be used if the substitution options are from a limited set.; 
    default: string; // REQUIRED. The default value to use for substitution, and to send, if an alternate value is not supplied. Unlike the Schema Object's default, this value MUST be provided by the consumer.
    description?: string; // An optional description for the server variable. CommonMark syntax MAY be used for rich text representation.
}