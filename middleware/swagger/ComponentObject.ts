import { IExternalDocumentationObject } from "./TagObject";
import { TDataType } from './DataType'
import { IServerObject } from "./ServerObject";
import { IPathItemObject } from "./PathItemObject";
/**
 * Components Object
 * 
 *   https://github.com/OAI/OpenAPI-Specification/blob/OpenAPI.next/versions/3.0.0.md#componentsObject  
 *   Holds a set of reusable objects for different aspects of the OAS. All objects defined within the components object will have no effect on the API unless they are explicitly referenced from properties outside the components object.
 */

export interface IComponentObject {
    schemas: 	Map<string, ISchemaObject | IReferenceObject>;      //	An object to hold reusable Schema Objects.
    responses:	Map<string, IResponseObject | IReferenceObject>;    //	An object to hold reusable Response Objects.
    parameters:	Map<string, IParameterObject | IReferenceObject>;	// An object to hold reusable Parameter Objects.
    examples?:	Map<string, IExampleObject | IReferenceObject>;	    // An object to hold reusable Example Objects.
    requestBodies:	Map<string, IRequestBodyObject | IReferenceObject>; //	An object to hold reusable Request Body Objects.
    headers:	Map<string, IHeaderObject | IReferenceObject>; //	An object to hold reusable Header Objects.
    securitySchemes:	Map<string, ISecuritySchemeObject | IReferenceObject>; //	An object to hold reusable Security Scheme Objects.
    links:	Map<string, ILinkObject | IReferenceObject>; //	An object to hold reusable Link Objects.
    callbacks:	Map<string, ICallbackObject | IReferenceObject>; //	An object to hold reusable Callback Objects.
}

/**
 * https://github.com/OAI/OpenAPI-Specification/blob/OpenAPI.next/versions/3.0.0.md#schemaObject
 * Schema Object
 * The Schema Object allows the definition of input and output data types. These types can be objects, but also primitives and arrays. This object is an extended subset of the JSON Schema Specification Wright Draft 00.
 */
export interface ISchemaObject {
    nullable:	boolean; //	Allows sending a null value for the defined schema. Default value is false.
    discriminator:	IDiscriminatorObject; //	Adds support for polymorphism. The discriminator is an object name that is used to differentiate between other schemas which may satisfy the payload description. See Composition and Inheritance for more details.
    readOnly?:	boolean; //	Relevant only for Schema "properties" definitions. Declares the property as "read only". This means that it MAY be sent as part of a response but SHOULD NOT be sent as part of the request. If the property is marked as readOnly being true and is in the required list, the required will take effect on the response only. A property MUST NOT be marked as both readOnly and writeOnly being true. Default value is false.
    writeOnly?:	boolean; //	Relevant only for Schema "properties" definitions. Declares the property as "write only". Therefore, it MAY be sent as part of a request but SHOULD NOT be sent as part of the response. If the property is marked as writeOnly being true and is in the required list, the required will take effect on the request only. A property MUST NOT be marked as both readOnly and writeOnly being true. Default value is false.
    xml:	IXMLObject; //	This MAY be used only on properties schemas. It has no effect on root schemas. Adds additional metadata to describe the XML representation of this property.
    externalDocs: IExternalDocumentationObject[]; //	External Documentation Object	Additional external documentation for this schema.
    example?:	any; //	A free-form property to include an example of an instance for this schema. To represent examples that cannot be naturally represented in JSON or YAML, a string value can be used to contain the example with escaping where necessary.
    deprecated?:	boolean; //	Specifies that a schema is deprecated and SHOULD be transitioned out of usage. Default value is false.
}

/**
 * Reference Object 
 * 
 * https://github.com/OAI/OpenAPI-Specification/blob/OpenAPI.next/versions/3.0.0.md#referenceObject
 * A simple object to allow referencing other components in the specification, internally and externally.
 * The Reference Object is defined by JSON Reference and follows the same structure, behavior and rules.
 * For this specification, reference resolution is accomplished as defined by the JSON Reference specification and not by the JSON Schema specification.
 * 
 * Example
        {
            Reference Object Example
            "$ref": "#/components/schemas/Pet"
        }
        {
            Relative Schema Document Example
            "$ref": "Pet.json"
        }
        {
            Relative Documents With Embedded Schema Example
            "$ref": "definitions.json#/Pet"
        }
 */

export interface IReferenceObject {
    "$ref":	string; //	REQUIRED. The reference string.
    // This object cannot be extended with additional properties and any properties added SHALL be ignored.
}

/**
 * Discriminator Object
 *
 * https://github.com/OAI/OpenAPI-Specification/blob/OpenAPI.next/versions/3.0.0.md#discriminatorObject
 * When request bodies or response payloads may be one of a number of different schemas, a discriminator object can be used to aid in serialization, deserialization, and validation. The discriminator is a specific object in a schema which is used to inform the consumer of the specification of an alternative schema based on the value associated with it.
 * When using the discriminator, inline schemas will not be considered.
 * 
 * Example: 
 * In scenarios where the value of the discriminator field does not match the schema name or implicit mapping is not possible, an optional mapping definition MAY be used:

    MyResponseType:
    oneOf:
    - $ref: '#/components/schemas/Cat'
    - $ref: '#/components/schemas/Dog'
    - $ref: '#/components/schemas/Lizard'
    - $ref: 'https://gigantic-server.com/schemas/Monster/schema.json'
    discriminator:
        propertyName: pet_type
        mapping:
        dog: '#/components/schemas/Dog'
        monster: 'https://gigantic-server.com/schemas/Monster/schema.json'
    Here the discriminator value of dog will map to the schema #/components/schemas/Dog, rather than the default (implicit) value of Dog. If the discriminator value does not match an implicit or explicit mapping, no schema can be determined and validation SHOULD fail. Mapping keys MUST be string values, but tooling MAY convert response values to strings for comparison.

    When used in conjunction with the anyOf construct, the use of the discriminator can avoid ambiguity where multiple schemas may satisfy a single payload.

    In both the oneOf and anyOf use cases, all possible schemas MUST be listed explicitly. To avoid redundancy, the discriminator MAY be added to a parent schema definition, and all schemas comprising the parent schema in an allOf construct may be used as an alternate schema.
 */
export interface IDiscriminatorObject {
    propertyName:	string; //	REQUIRED. The name of the property in the payload that will hold the discriminator value.
    mapping:	Map<string, string>; //	An object to hold mappings between payload values and schema names or references.
}

/**
 * XML Object
 *
 * https://github.com/OAI/OpenAPI-Specification/blob/OpenAPI.next/versions/3.0.0.md#xml-object
 * A metadata object that allows for more fine-tuned XML model definitions.
 * When using arrays, XML element names are not inferred (for singular/plural forms) and the name property SHOULD be used to add that information. See examples for expected behavior.
 */
export interface IXMLObject {
    name:	string; //	Replaces the name of the element/attribute used for the described schema property. When defined within items, it will affect the name of the individual XML elements within the list. When defined alongside type being array (outside the items), it will affect the wrapping element and only if wrapped is true. If wrapped is false, it will be ignored.
    namespace:	string; //	The URI of the namespace definition. Value MUST be in the form of an absolute URI.
    prefix:	string; //ß	The prefix to be used for the name.
    attribute:	boolean; //	Declares whether the property definition translates to an attribute instead of an element. Default value is false.
    wrapped:	boolean; //	MAY be used only for an array definition. Signifies whether the array is wrapped (for example, <books><book/><book/></books>) or unwrapped (<book/><book/>). Default value is false. The definition takes effect only when defined alongside type being array (outside the items).
    //This object MAY be extended with Specification Extensions.
}


/**
 * Response Object
 * 
 * https://github.com/OAI/OpenAPI-Specification/blob/OpenAPI.next/versions/3.0.0.md#responseObject
 * Describes a single response from an API Operation, including design-time, static links to operations based on the response.
 * 
 * Example: 
 * {
  "description": "A complex object array response",
  "content": {
    "application/json": {
      "schema": {
        "type": "array",
        "items": {
          "$ref": "#/components/schemas/VeryComplexType"
        }
      }
    }
  }
}
 */
export interface IResponseObject {
    description:	string; //	REQUIRED. A short description of the response. CommonMark syntax MAY be used for rich text representation.
    headers:	Map<string, IHeaderObject | IReferenceObject>; //	Maps a header name to its definition. RFC7230 states header names are case insensitive. If a response header is defined with the name "Content-Type", it SHALL be ignored.
    content:	Map<string, IMediaTypeObject>; //	A map containing descriptions of potential response payloads. The key is a media type or media type range and the value describes it. For responses that match multiple keys, only the most specific key is applicable. e.g. text/plain overrides text/*
    links:	Map<string, ILinkObject | IReferenceObject>; //	A map of operations links that can be followed from the response. The key of the map is a short name for the link, following the naming constraints of the names for Component Objects.
    // This object MAY be extended with Specification Extensions.
}

/**
 * Header Object
 * 
 * https://github.com/OAI/OpenAPI-Specification/blob/OpenAPI.next/versions/3.0.0.md#headerObject
The Header Object follows the structure of the Parameter Object with the following changes:
Header Object Example
A simple header of type integer:

{
  "description": "The number of allowed requests in the current period",
  "schema": {
    "type": "integer"
  }
}
 */
export interface IHeaderObject extends IParameterObject{
    // All traits that are affected by the location MUST be applicable to a location of header (for example, style).
}

/**
 * Parameter Object
 * 
 * https://github.com/OAI/OpenAPI-Specification/blob/OpenAPI.next/versions/3.0.0.md#parameterObject
Describes a single operation parameter.

A unique parameter is defined by a combination of a name and location.

Parameter Locations
There are four possible parameter locations specified by the in field:

path - Used together with Path Templating, where the parameter value is actually part of the operation's URL. This does not include the host or base path of the API. For example, in /items/{itemId}, the path parameter is itemId.
query - Parameters that are appended to the URL. For example, in /items?id=###, the query parameter is id.
header - Custom headers that are expected as part of the request. Note that RFC7230 states header names are case insensitive.
cookie - Used to pass a specific cookie value to the API.
 */
export interface IParameterObject {
    name:	string; /**	REQUIRED. The name of the parameter. Parameter names are case sensitive.
                        If in is "path", the name field MUST correspond to the associated path segment from the path field in the Paths Object. See Path Templating for further information.
                        If in is "header" and the name field is "Accept", "Content-Type" or "Authorization", the parameter definition SHALL be ignored.
                        For all other cases, the name corresponds to the parameter name used by the in property.
                    */
    in:	string;     //	REQUIRED. The location of the parameter. Possible values are "query", "header", "path" or "cookie".
    description:	string; /**	A brief description of the parameter. This could contain examples of use. 
                                CommonMark syntax MAY be used for rich text representation.  */
    required:	boolean; /**	Determines whether this parameter is mandatory. If the parameter location is "path", this property
                     is REQUIRED and its value MUST be true. Otherwise, the property MAY be included and its default value is false. */
    deprecated:	boolean; //	Specifies that a parameter is deprecated and SHOULD be transitioned out of usage.
    allowEmptyValue:	boolean; /**	Sets the ability to pass empty-valued parameters. This is valid only for query parameters and allows sending a parameter with an empty value. Default value is false. If style is used, and if behavior is n/a (cannot be serialized), the value of allowEmptyValue SHALL be ignored.
The rules for serialization of the parameter are specified in one of two ways. For simpler scenarios, a schema and style can describe the structure and syntax of the parameter. */
    style:	string; /**	Describes how the parameter value will be serialized depending on the type of the parameter value. Default values   (based on value of in): for query - form; for path - simple; for header - simple; for cookie - form. */
    explode:	boolean; /**	When this is true, parameter values of type array or object generate separate parameters for each value of the array or key-value pair of the map. For other types of parameters this property has no effect. When style is form, the default value is true. For all other styles, the default value is false. */
    allowReserved:	boolean; /**	Determines whether the parameter value SHOULD allow reserved characters, as defined by RFC3986 :/?#[]@!$&'()*+,;= to be included without percent-encoding. This property only applies to parameters with an in value of query. The default value is false. */
    schema:	ISchemaObject | IReferenceObject; //	The schema defining the type used for the parameter.
    example:	any; /**	Example of the media type. The example SHOULD match the specified schema and encoding properties if present. The example object is mutually exclusive of the examples object. Furthermore, if referencing a schema which contains an example, the example value SHALL override the example provided by the schema. To represent examples of media types that cannot naturally be represented in JSON or YAML, a string value can contain the example with escaping where necessary.
     */
    examples:	Map<string, IExampleObject | IReferenceObject>; /**	Examples of the media type. Each example SHOULD contain a value in the correct format as specified in the parameter encoding. The examples object is mutually exclusive of the example object. Furthermore, if referencing a schema which contains an example, the examples value SHALL override the example provided by the schema. */
    content:	Map<string, IMediaTypeObject>; /**	A map containing the representations for the parameter. The key is the media type and the value describes it. The map MUST only contain one entry.  */
}

/**
 * Example Object
 * 
 * https://github.com/OAI/OpenAPI-Specification/blob/OpenAPI.next/versions/3.0.0.md#exampleObject
 */
export interface IExampleObject {
    summary:	string; //	Short description for the example.
    description:	string; //	Long description for the example. CommonMark syntax MAY be used for rich text representation.
    value:	any; /** Embedded literal example. The value field and externalValue field are mutually exclusive. To represent examples of media types that cannot naturally represented in JSON or YAML, use a string value to contain the example, escaping where necessary.*/
    externalValue:	string; /**	A URL that points to the literal example. This provides the capability to reference examples that cannot easily be included in JSON or YAML documents. The value field and externalValue field are mutually exclusive. */
    // This object MAY be extended with Specification Extensions.
}


/**
 * Link Object
 * 
 * https://github.com/OAI/OpenAPI-Specification/blob/OpenAPI.next/versions/3.0.0.md#linkObject
The Link object represents a possible design-time link for a response. The presence of a link does not guarantee the caller's ability to successfully invoke it, rather it provides a known relationship and traversal mechanism between responses and other operations.

Unlike dynamic links (i.e. links provided in the response payload), the OAS linking mechanism does not require link information in the runtime response.

For computing links, and providing instructions to execute them, a runtime expression is used for accessing values in an operation and using them as parameters while invoking the linked operation.

OperationRef Examples
As references to operationId MAY NOT be possible (the operationId is an optional value), references MAY also be made through a relative operationRef:

links:
  UserRepositories:
    # returns array of '#/components/schemas/repository'
    operationRef: '#/paths/~12.0~1repositories~1{username}/get'
    parameters:
      username: $response.body#/username
or an absolute operationRef:

links:
  UserRepositories:
    # returns array of '#/components/schemas/repository'
    operationRef: 'https://na2.gigantic-server.com/#/paths/~12.0~1repositories~1{username}/get'
    parameters:
      username: $response.body#/username
 * 
 */
export interface IMediaTypeObject {
    operationRef:	string; /**	A relative or absolute reference to an OAS operation. This field is mutually exclusive of the operationId field, and MUST point to an Operation Object. Relative operationRef values MAY be used to locate an existing Operation Object in the OpenAPI definition.
    */
    operationId:	string; /**	The name of an existing, resolvable OAS operation, as defined with a unique operationId. This field is mutually exclusive of the operationRef field. */
    parameters:	Map<string, any | Expression>; //	A map representing parameters to pass to an operation as specified with operationId or identified via operationRef. The key is the parameter name to be used, whereas the value can be a constant or an expression to be evaluated and passed to the linked operation. The parameter name can be qualified using the parameter location [{in}.]{name} for operations that use the same parameter name in different locations (e.g. path.id).
    requestBody:	any | Expression; //	A literal value or {expression} to use as a request body when calling the target operation.
    description:	string; //	A description of the link. CommonMark syntax MAY be used for rich text representation.
    server:	IServerObject; //	A server object to be used by the target operation.
    //This object MAY be extended with Specification Extensions.
}

export enum Expression {
    $Method='$method',//	The allowable values for the $method will be those for the HTTP operation.
    RequestedMediaType='$request.header.accept', //s
    RequestParameter='$request.path.id', //	Request parameters MUST be declared in the parameters section of the parent operation or they cannot be evaluated. This includes request headers.
    RequestBodyProperty='$request.body#/user/uuid',//	In operations which accept payloads, references may be made to portions of the requestBody or the entire body.
    $URL='$url',	
    ResponseValue='$response.body#/status', //	In operations which return payloads, references may be made to portions of the response body or the entire body.
    ResponseHeader='$response.header.Server',//	Single header values only are available
}


/**
 * ILinkObject
 * 
 * https://github.com/OAI/OpenAPI-Specification/blob/OpenAPI.next/versions/3.0.0.md#linkObject
 * 
The Link object represents a possible design-time link for a response. The presence of a link does not guarantee the caller's ability to successfully invoke it, rather it provides a known relationship and traversal mechanism between responses and other operations.

Unlike dynamic links (i.e. links provided in the response payload), the OAS linking mechanism does not require link information in the runtime response.

For computing links, and providing instructions to execute them, a runtime expression is used for accessing values in an operation and using them as parameters while invoking the linked operation.

 */
export interface ILinkObject{
    operationRef:	string; //	A relative or absolute reference to an OAS operation. This field is mutually exclusive of the operationId field, and MUST point to an Operation Object. Relative operationRef values MAY be used to locate an existing Operation Object in the OpenAPI definition.
    operationId:	string; //	The name of an existing, resolvable OAS operation, as defined with a unique operationId. This field is mutually exclusive of the operationRef field.
    parameters:	Map<string, any | Expression>; //	A map representing parameters to pass to an operation as specified with operationId or identified via operationRef. The key is the parameter name to be used, whereas the value can be a constant or an expression to be evaluated and passed to the linked operation. The parameter name can be qualified using the parameter location [{in}.]{name} for operations that use the same parameter name in different locations (e.g. path.id).
    requestBody:	any | Expression; //	A literal value or {expression} to use as a request body when calling the target operation.
    description:	string; //	A description of the link. CommonMark syntax MAY be used for rich text representation.
    server:	IServerObject; //	A server object to be used by the target operation.
    // This object MAY be extended with Specification Extensions.
} 

/**
 * Request Body Object
 * 
 * 
 * Describes a single request body. 
 */
export interface IRequestBodyObject {
    description?:	string; //	A brief description of the request body. This could contain examples of use. CommonMark syntax MAY be used for rich text representation.
    content:	Map<string, IMediaTypeObject>; //	REQUIRED. The content of the request body. The key is a media type or media type range and the value describes it. For requests that match multiple keys, only the most specific key is applicable. e.g. text/plain overrides text/*
    required?: boolean; //	Determines if the request body is required in the request. Defaults to false.
    // This object MAY be extended with Specification Extensions.
}

/**
 * Security Scheme Object
 * 
 * 
Defines a security scheme that can be used by the operations. Supported schemes are HTTP authentication, an API key (either as a header or as a query parameter), OAuth2's common flows (implicit, password, application and access code) as defined in RFC6749, and OpenID Connect Discovery.

 */
export interface ISecuritySchemeObject {
    type:	string; //	REQUIRED. The type of the security scheme. Valid values are "apiKey", "http", "oauth2", "openIdConnect".
    description?:	string; //A short description for security scheme. CommonMark syntax MAY be used for rich text representation.
    name:	string; //	REQUIRED. The name of the header, query or cookie parameter to be used.
    in:	string; // REQUIRED. The location of the API key. Valid values are "query", "header" or "cookie".
    scheme:	string; // REQUIRED. The name of the HTTP Authorization scheme to be used in the Authorization header as defined in RFC7235.
    bearerFormat: string; // ("bearer")	A hint to the client to identify how the bearer token is formatted. Bearer tokens are usually generated by an authorization server, so this information is primarily for documentation purposes.
    flows:	IOAuthFlowsObject; // REQUIRED. An object containing configuration information for the flow types supported.
    openIdConnectUrl:	string; // REQUIRED. OpenId Connect URL to discover OAuth2 configuration values. This MUST be in the form of a URL.
    // This object MAY be extended with Specification Extensions.
}

/**
 * OAuth Flows Object
 * 
 * https://github.com/OAI/OpenAPI-Specification/blob/OpenAPI.next/versions/3.0.0.md#oauthFlowsObject
Allows configuration of the supported OAuth Flows.
 */
export interface IOAuthFlowsObject{
    implicit:	IOAuthFlowsObject; //	Configuration for the OAuth Implicit flow
    password:	IOAuthFlowsObject; //	Configuration for the OAuth Resource Owner Password flow
    clientCredentials:	IOAuthFlowsObject; //	Configuration for the OAuth Client Credentials flow. Previously called application in OpenAPI 2.0.
    authorizationCode:	IOAuthFlowsObject; //	Configuration for the OAuth Authorization Code flow. Previously called accessCode in OpenAPI 2.0.
    // This object MAY be extended with Specification Extensions.
}

/**Callback Object
 * 
 * 
 * 
A map of possible out-of band callbacks related to the parent operation. Each value in the map is a Path Item Object that describes a set of requests that may be initiated by the API provider and the expected responses. The key value used to identify the callback object is an expression, evaluated at runtime, that identifies a URL to use for the callback operation.

 */
export type ICallbackObject = Map<Expression, IPathItemObject>;
// {expression}	Path Item Object	A Path Item Object used to define a callback request and expected responses. A complete example is available.
// This object MAY be extended with Specification Extensions.