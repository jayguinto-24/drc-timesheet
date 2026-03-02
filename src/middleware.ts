import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // you can add extra logic later if needed
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/timesheet/:path*", "/admin/:path*"],
};