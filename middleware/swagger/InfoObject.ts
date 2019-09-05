export interface IInfoObject {
    title: string; // The title of the application.
    description: string; //	A short description of the application. CommonMark syntax MAY be used for rich text representation.
    termsOfService:	string; //	A URL to the Terms of Service for the API. MUST be in the format of a URL.
    contact:	IContactObject;	// The contact information for the exposed API.
    license:	ILicenseObject;	// The license information for the exposed API.
    version:	string; //	REQUIRED. The version of the OpenAPI document (which is distinct from the OpenAPI Specification version or the API implementation version).
}

export interface IContactObject {
    name:	string; //	The identifying name of the contact person/organization.
    url:	string; //	The URL pointing to the contact information. MUST be in the format of a URL.
    email: 	string; //	The email address of the contact person/organization. MUST be in the format of an email address.
}

export interface ILicenseObject {
    name:	string; //	REQUIRED. The license name used for the API.
    url:	string; //	A URL to the license used for the API. MUST be in the format of a URL.
}