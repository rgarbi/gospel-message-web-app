import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/session';
import { checkToken, ResponseObject } from '@/lib/api_client';
import { getApiServerLocation } from './lib/utils';
 
export async function middleware(request: NextRequest) {
  let cookie = request.cookies.get('session')
  if(cookie) {
    //TODO: Check the token!
    let jwtPayload = await decrypt(cookie.value)
    if (jwtPayload) {
      let responseObject: ResponseObject = await checkToken(getApiServerLocation(), jwtPayload.token as string, jwtPayload.userId as string)

      if (responseObject.statusCode > 300) {
        console.log("Token was invalid")
        return NextResponse.redirect(new URL('/auth', request.url))
      }
      
    }
    

  } else {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|auth|forgot-password).*)',
      ],
}
