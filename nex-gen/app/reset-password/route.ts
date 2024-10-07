import { AuthTokenResponse, exchangeOtpForToken } from '@/lib/api_client';
import { createSession } from '@/lib/session';
import { getApiServerLocation } from '@/lib/utils';
import type { NextApiRequest, NextApiResponse } from 'next'
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';
 
export async function GET(req: NextRequest, res: NextApiResponse) {
    let otp = req.nextUrl.searchParams.get('otp')

    if (otp) {
       let response = await exchangeOtpForToken(getApiServerLocation(), otp)

       if (response.statusCode > 300) {
            console.log('Got a status code of ' + response.statusCode + ' when trying to exchange the OTP for a token!');
            redirect('/auth')
       }

       let tokenResponse: AuthTokenResponse = Object.assign(new AuthTokenResponse(), response.object); 

        //set the cookie.
        await createSession("", tokenResponse.user_id, tokenResponse.token, tokenResponse.expires_on)
        redirect('/reset')


    } else {
        console.log("Missing required query param otp.")
        redirect('/auth')
    }

  
}

//Handle the /reset-password?otp=6CClloQrfe8CeG9Yt5SMTpru5Sp1kXfu0IjOlCKb0jNhE6SiWa endpoint

