'use server'

import { getApiServerLocation } from '@/lib/utils';
import { redirect } from 'next/navigation';

export async function signup(state: SignUpFormState, formData: FormData) {

      // Validate form fields
      const validatedFields = SignUpFormSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
    })

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const { name, email, password } = validatedFields.data

    // Call the rust service to log in.
    let responseObject: ResponseObject = await signUp(getApiServerLocation(), email, password, name);
    
    if (responseObject.statusCode > 300) {
        console.log('Got a status code of: ' + responseObject.statusCode);

        if(responseObject.statusCode == 409) {
            return {
                message: "Unable to create a user with that email address."
            }              
        }

        if(responseObject.statusCode >= 500) {
            return {
                message: "Unable to contact the server. Please try again."
            } 
        }

    }

    let signUpResponse: AuthTokenResponse = Object.assign(new AuthTokenResponse(), responseObject.object); 

    //set the cookie.
    await createSession(email, signUpResponse.user_id, signUpResponse.token, signUpResponse.expires_on)

    redirect('/')
}
