'use server'

import { logIn, ResponseObject, signUp, AuthTokenResponse } from '@/lib/api_client';
import { LoginFormSchema, LoginFormState, SignUpFormSchema, SignUpFormState } from '@/lib/definitions'
import { createSession, deleteSession } from '@/lib/session';
import { getApiServerLocation } from '@/lib/utils';
import { redirect } from 'next/navigation';

export async function signup(state: SignUpFormState, formData: FormData) {
    console.log('RUNNING SIGNUP!');

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

export async function login(state: LoginFormState, formData: FormData) {
      // Validate form fields
    const validatedFields = LoginFormSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    })

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const { email, password } = validatedFields.data

    // Call the rust service to log in.
    let loginResponse = await logIn(getApiServerLocation(), email, password);

    if (loginResponse.statusCode > 300) {
        console.log('Got a status code of: ' + loginResponse.statusCode);

        if(loginResponse.statusCode == 400) {
            return {
                message: "Email Address or password were incorrect."
            } 
        }

        if(loginResponse.statusCode >= 500) {
            return {
                message: "Unable to contact the server. Please try again."
            } 
        }

    }

    //set the cookie.
    let loginResponseObject: AuthTokenResponse = Object.assign(new AuthTokenResponse(), loginResponse.object); 
    await createSession(email, loginResponseObject.user_id, loginResponseObject.token, loginResponseObject.expires_on)

    redirect('/')
}

export async function logout() {
    deleteSession()
    redirect('/auth')
}


