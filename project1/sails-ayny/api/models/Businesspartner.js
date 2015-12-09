/**
 * Businesspartner.js
 *
 * @description :: Businesspartner model handles the classification information about a specific person. This person can be alive or dead, even fictional. It captures data points related directly to the person. Potential tags include address, related URL, job title and birth date.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
module.exports = {

  attributes: {

    additionalName: {
      type: 'string',
      required: true
    }, // An additional name can be used for a middle name. e.g. "Kumar"

    affiliation: {
      type: 'string'
    }, // e.g a school/university, a club, or a team.         

    birthDate: {
      type: 'date'
    },

    deathDate: {
      type: 'date'
    },

    duns: {
      type: 'string'
    }, // The Dun & Bradstreet DUNS number for identifying an organization or business person.

    familyName: {
      type: 'string'
    }, // In the U.S., the last name of an Person.

    gender: {
      type: 'string'
    }, // Gender of the person. e.g. Male, Female.      

    givenName: {
      type: 'string'
    }, // In the U.S., the first name of a Person.        

    honorificPrefix: {
      type: 'string'
    }, // e.g. Dr/Mrs/Mr.

    honorificSuffix: {
      type: 'string'
    }, // e.g M.D./PhD/MSCSW        

    jobTitle: {
      type: 'string'
    }, // e.g Technical Lead)

    nationality: {
      type: 'string'
    }, //  Nationality of the person 

    taxID: {
      type: 'string'
    }, // e.g. The TIN in the US or the CIF/NIF in Spain. 

    vatID: {
      type: 'string'
    }, // Value-added Tax ID           

    businessPartnerType: {
      type: 'string'
    }, // Indicates the type of business partner (person, org, group, family etc)   

    emailid: {
      type: 'string',
      required: true,
      unique: true,
      email: true
    }, // E-mailid is single value and later it will extended to hanlde multiple values e.g. [ {...}, {...}, ...]

    Id: {
      collection: 'User',
      via: 'userId'
    }

        // AuditLog for person
        // auditLog:
        // Media Associated with the person, can be image etc. Array of Media e.g. [ {...}, {...}, ...]   
        // associatedMedia: // This attribute will be enable later 
        // Array of Address e.g. [ {...}, {...}, ...] 
        // addresses: This attribute will be enable later  
        // WorksFor: 
        // contactPoint:                 

    }
};