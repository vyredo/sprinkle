import { string } from "joi";
import { ContentType } from "./mimeType";
import { TProtocols } from "./types";
import { ITagObject, IExternalDocumentationObject } from "./TagObject";
import { IServerObject } from "./ServerObject";
import { IInfoObject } from "./InfoObject";
import { ISecurityRequirementObject } from "./SecurityRequirementObject";
import { IPathItemObject } from "./PathItemObject";

// export type Type = 'params' | 'response' | 'body';
interface ISwagger {
    openapi: string; // REQUIRED. This string MUST be the semantic version number of the OpenAPI Specification version that the OpenAPI document uses. The openapi field SHOULD be used by tooling specifications and clients to interpret the OpenAPI document. This is not related to the API info.version string.
    info: IInfoObject; // REQUIRED. Provides metadata about the API. The metadata MAY be used by tooling as required.
    servers: IServerObject[]; //An array of Server Objects, which provide connectivity information to a target server. If the servers property is not provided, or is an empty array, the default value would be a Server Object with a url value of /.
    tags?: ITagObject[]; //  list of tags used by the specification with additional metadata. The order of the tags can be used to reflect on their order by the parsing tools. Not all tags that are used by the Operation Object must be declared. The tags that are not declared MAY be organized randomly or based on the tools' logic. Each tag name in the list MUST be unique.
    schemes?: TProtocols[];
    consumes?: ContentType[];
    produces?: ContentType[];
    externalDocs?: IExternalDocumentationObject[]; // Additional external documentation.

    // below not yet
    components:  unknown[]; //An element to hold various schemas for the specification.
    security: ISecurityRequirementObject[];
    paths: IPathItemObject[];   
}

export enum Type {
    PARAMS = 'params',
    RESPONSE = 'response',
    BODY = 'body',
    QUERY = 'query',
    HEADERS = 'headers'
}
