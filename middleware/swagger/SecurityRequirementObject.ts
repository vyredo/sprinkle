/**
 * https://github.com/OAI/OpenAPI-Specification/blob/OpenAPI.next/versions/3.0.0.md#securityRequirementObject
 * Security Requirement Object Examples
 * Non-OAuth2 Security Requirement
 * {
 *   "api_key": []
 * }
 * OAuth2 Security Requirement
 * {
 *    "petstore_auth": [
 *      "write:pets",
 *      "read:pets"
 *    ]
 * }
 */
export interface ISecurityRequirementObject {
    [key: string]: string[]; // Each name MUST correspond to a security scheme which is declared in the Security Schemes under the Components Object. If the security scheme is of type "oauth2" or "openIdConnect", then the value is a list of scope names required for the execution. For other security scheme types, the array MUST be empty.
}