export interface ITagObject{
    name:	string; //	REQUIRED. The name of the tag.
    description?:	string; //	A short description for the tag. CommonMark syntax MAY be used for rich text representation.
    externalDocs?:	IExternalDocumentationObject; //	Additional external documentation for this tag.
}

export interface IExternalDocumentationObject {
    description?: string; //	A short description of the target documentation. CommonMark syntax MAY be used for rich text representation.
    url:	string;	// REQUIRED. The URL for the target documentation. Value MUST be in the format of a URL.
}