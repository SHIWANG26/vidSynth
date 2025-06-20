import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"


export default withAuth(
    function middleware(req) {
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized({ req, token }) {
                const { pathname } = req.nextUrl;
                if (
                    pathname.startsWith("/api/auth") ||
                    pathname === "/login" ||
                    pathname === "/register"
                ) {
                    return true; // Allow access to auth API routes
                }
                return !!token; // Explicitly return false if not authorized

                if (pathname === "/" || pathname.startsWith("/api/videos")) {
                    return true; // Allow access to home and videos API routes
                }
                return !!token; // Allow access to other routes only if the user is authenticated
            }
        }
    }
);

export const config = {
    matcher: [
        /*
        *Match all requests except:
        * - _next/static(static files)
        * - _next/image(image optimization)
        * - favicon.ico(favicon)
        * - public folder(static files)
        */
       "/((?!_next/static|_next/image|favicon.ico|public/).*)",
    ],
};