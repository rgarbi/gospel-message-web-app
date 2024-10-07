'use server'

import { logIn, ResponseObject, signUp, AuthTokenResponse, forgotPassword, forgotPasswordResetPassword } from '@/lib/api_client';
import { ForgotPasswordFormSchema, ForgotPasswordFormState, LoginFormSchema, LoginFormState, ResetPasswordFormSchema, ResetPasswordFormState, SignUpFormSchema, SignUpFormState } from '@/lib/definitions'
import { AuthSession, createSession, deleteSession, getAuthInfoFromSessionCookie } from '@/lib/session';
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

export async function forgotpassword(state: ForgotPasswordFormState, formData: FormData) {
    const validatedFields = ForgotPasswordFormSchema.safeParse({
        email: formData.get('email'),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const { email } = validatedFields.data

    // Call the rust service to log in.
    let responseObject: ResponseObject = await forgotPassword(getApiServerLocation(), email);
    
    if (responseObject.statusCode > 300) {
        console.log('Got a status code of: ' + responseObject.statusCode);

        if(responseObject.statusCode == 409) {
            return {
                message: "Unable to send forgot password email."
            }              
        }

        if(responseObject.statusCode >= 500) {
            return {
                message: "Something unexpected happened while attempting to send the forgot password request. Please try again."
            } 
        }

    }

    return {
        message: "If a user with that email exists we have sent them instructions for resetting their password."
    }
}

export async function resetPasswordServerAction(state: ResetPasswordFormState, formData: FormData) {
    const validatedFields = ResetPasswordFormSchema.safeParse({
        password: formData.get('password'),
        passwordConfirmed: formData.get('passwordConfirmed'),
    })

    if (!validatedFields.success) {
        console.log(validatedFields.error.flatten().fieldErrors)
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const { password } = validatedFields.data

    let session: AuthSession = await getAuthInfoFromSessionCookie();

    let responseObject: ResponseObject = await forgotPasswordResetPassword(getApiServerLocation(), session.token, session.user_id, password);
    
    if (responseObject.statusCode > 300) {
        console.log('Got a status code of: ' + responseObject.statusCode);

        if(responseObject.statusCode >= 500) {
            return {
                message: "Something unexpected happened while setting the new password. Please try again."
            } 
        }
    }

    redirect('/')
}

export async function logout() {
    deleteSession()
    redirect('/auth')
}


