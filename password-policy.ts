import * as  passwordValidator from 'password-validator';

// Create a schema
const schema = new passwordValidator();

// Add properties to it
schema
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits()                                 // Must have digits
    .has().not().spaces()                           // Should not have spaces
    // .is().not().oneOf(['Passw0rd', 'Password123']);

export function passwordpolicy(password: string) {
    return schema.validate(password, { list: true })
}