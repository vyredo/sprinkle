import { IServerObject } from "./ServerObject";
import { IParameterObject, IReferenceObject, IRequestBodyObject, ICallbackObject } from "./ComponentObject";
import { IExternalDocumentationObject } from "./TagObject";
import { ISecurityRequirementObject } from "./SecurityRequirementObject";

/**
 * Path Item Object
 * 
 * 
 * Describes the operations available on a single path. A Path Item MAY be empty, due to ACL constraints. The path itself is still exposed to the documentation viewer but they will not know which operations and parameters are available.
 */
export interface IPathItemObject {
    $ref:	string; //	Allows for an external definition of this path item. The referenced structure MUST be in the format of a Path Item Object. If there are conflicts between the referenced definition and this Path Item's definition, the behavior is undefined.
    summary:	string; //	An optional, string summary, intended to apply to all operations in this path.
    description?:	string; //	An optional, string description, intended to apply to all operations in this path. CommonMark syntax MAY be used for rich text representation.
    get?:	IOperationObject; //	A definition of a GET operation on this path.
    put?:	IOperationObject; //	A definition of a PUT operation on this path.
    post?:	IOperationObject; //	A definition of a POST operation on this path.
    delete?:	IOperationObject; //	A definition of a DELETE operation on this path.
    options?:	IOperationObject; //	A definition of a OPTIONS operation on this path.
    head?:	IOperationObject; //	A definition of a HEAD operation on this path.
    patch?:	IOperationObject; //	A definition of a PATCH operation on this path.
    trace?:	IOperationObject; //	A definition of a TRACE operation on this path.
    servers?:	IServerObject[]; //	An alternative server array to service all operations in this path.
    parameters?:	IParameterObject[]|IReferenceObject[]; //	A list of parameters that are applicable for all the operations described under this path. These parameters can be overridden at the operation level, but cannot be removed there. The list MUST NOT include duplicated parameters. A unique parameter is defined by a combination of a name and location. The list can use the Reference Object to link to parameters that are defined at the OpenAPI Object's components/parameters.
    // This object MAY be extended with Specification Extensions.
}


/**
 * OperationObject
 * 
 * https://github.com/OAI/OpenAPI-Specification/blob/OpenAPI.next/versions/3.0.0.md#operation-object
 * Describes a single API operation on a path.
 * example: 
 * {
  "tags": [
    "pet"
  ],
  "summary": "Updates a pet in the store with form data",
  "operationId": "updatePetWithForm",
  "parameters": [
    {
      "name": "petId",
      "in": "path",
      "description": "ID of pet that needs to be updated",
      "required": true,
      "schema": {
        "type": "string"
      }
    }
  ],
  "requestBody": {
    "content": {
      "application/x-www-form-urlencoded": {
        "schema": {
          "type": "object",
           "properties": {
              "name": { 
                "description": "Updated name of the pet",
                "type": "string"
              },
              "status": {
                "description": "Updated status of the pet",
                "type": "string"
             }
           },
        "required": ["status"] 
        }
      }
    }
  },
  "responses": {
    "200": {
      "description": "Pet updated.",
      "content": {
        "application/json": {},
        "application/xml": {}
      }
    },
    "405": {
      "description": "Invalid input",
      "content": {
        "application/json": {},
        "application/xml": {}
      }
    }
  },
  "security": [
    {
      "petstore_auth": [
        "write:pets",
        "read:pets"
      ]
    }
  ]
}
 */
export interface IOperationObject{
    tags?:	string[]; //	A list of tags for API documentation control. Tags can be used for logical grouping of operations by resources or any other qualifier.
    summary?:	string; //	A short summary of what the operation does.
    description?:	string; //	A verbose explanation of the operation behavior. CommonMark syntax MAY be used for rich text representation.
    externalDocs?:	IExternalDocumentationObject; //	Additional external documentation for this operation.
    operationId:	string; //	Unique string used to identify the operation. The id MUST be unique among all operations described in the API. Tools and libraries MAY use the operationId to uniquely identify an operation, therefore, it is RECOMMENDED to follow common programming naming conventions.
    parameters: IParameterObject[]|IReferenceObject[]; // A list of parameters that are applicable for this operation. If a parameter is already defined at the Path Item, the new definition will override it but can never remove it. The list MUST NOT include duplicated parameters. A unique parameter is defined by a combination of a name and location. The list can use the Reference Object to link to parameters that are defined at the OpenAPI Object's components/parameters.
    requestBody:	IRequestBodyObject | IReferenceObject; //	The request body applicable for this operation. The requestBody is only supported in HTTP methods where the HTTP 1.1 specification RFC7231 has explicitly defined semantics for request bodies. In other cases where the HTTP spec is vague, requestBody SHALL be ignored by consumers.
    responses:	IResponseObject[]; //	REQUIRED. The list of possible responses as they are returned from executing this operation.
    callbacks?:	Map<string, ICallbackObject | IReferenceObject>; //	A map of possible out-of band callbacks related to the parent operation. The key is a unique identifier for the Callback Object. Each value in the map is a Callback Object that describes a request that may be initiated by the API provider and the expected responses. The key value used to identify the callback object is an expression, evaluated at runtime, that identifies a URL to use for the callback operation.
    deprecated:	boolean; //	Declares this operation to be deprecated. Consumers SHOULD refrain from usage of the declared operation. Default value is false.
    security?:	ISecurityRequirementObject[]; //	A declaration of which security mechanisms can be used for this operation. The list of values includes alternative security requirement objects that can be used. Only one of the security requirement objects need to be satisfied to authorize a request. This definition overrides any declared top-level security. To remove a top-level security declaration, an empty array can be used.
    // servers:	IServerObject[]; //	An alternative server array to service this operation. If an alternative server object is specified at the Path Item Object or Root level, it will be overridden by this value.
    // This object MAY be extended with Specification Extensions.
}
/**
 * Responses Object
 * 
 * https://github.com/OAI/OpenAPI-Specification/blob/OpenAPI.next/versions/3.0.0.md#responsesObject
A container for the expected responses of an operation. The container maps a HTTP response code to the expected response.

The documentation is not necessarily expected to cover all possible HTTP response codes because they may not be known in advance. However, documentation is expected to cover a successful operation response and any known errors.

The default MAY be used as a default response object for all HTTP codes that are not covered individually by the specification.

The Responses Object MUST contain at least one response code, and it SHOULD be the response for a successful operation call.

 */
export interface IResponseObject extends 
    Map<HTTPStatusCode, IResponseObject | IReferenceObject>  //	Any HTTP status code can be used as the property name, but only one property per code, to describe the expected response for that HTTP status code. A Reference Object can link to a response that is defined in the OpenAPI Object's components/responses section. This field MUST be enclosed in quotation marks (for example, "200") for compatibility between JSON and YAML. To define a range of response codes, this field MAY contain the uppercase wildcard character X. For example, 2XX represents all response codes between [200-299]. The following range definitions are allowed: 1XX, 2XX, 3XX, 4XX, and 5XX. If a response range is defined using an explicit code, the explicit code definition takes precedence over the range definition for that code.
    {
    default:	IResponseObject | IReferenceObject; //	The documentation of responses other than the ones declared for specific HTTP response codes. Use this field to cover undeclared responses. A Reference Object can link to a response that the OpenAPI Object's components/responses section defines.
    // This object MAY be extended with Specification Extensions.
}

export type HTTPStatusCode = 100 | 101 | 102 | 103 | 104 |
200 | 201 | 202 | 203 | 204 |
300 | 301 | 302 | 303 | 304 | 
400 | 401 | 402 | 403 | 404 | 
500 | 501 | 502 | 503 | 504