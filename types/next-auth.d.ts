import { DefaultSession } from "next-auth";

declare module "next-auth" {
  export interface Session {
    user: {
      role: string;
    } & DefaultSession["user"];
  }
}

// in user-button.tsx file, we added a link to the dropdown menu for the admin area but we want to display it only if the role of the user is admin. Because by default the session does not have this info and we received an error, we created this file (documentation) so that the session will remain as is and just add to it the role key (no need to include it somewhere).
