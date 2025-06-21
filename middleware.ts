export { auth as middleware } from "@/auth";

// So that will allow us to have our middleware stuff within our auth file including where we want to protect routes.

// we need that so that everytime a user cames to the site (logged in or not), we assign him a session cart cookie so that we display him the items he has put in the cart
