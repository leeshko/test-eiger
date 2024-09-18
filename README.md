Task: Type: System Design, Planning

1. How can we design the system in a way that every Company will be able to serve
games on their gaming site from their domain?

    First of all, we have to store each company's data, configuration etc. separately in the database, and we have to store data about which user belongs to which company. 

2. What modification should be done to the users table at gPlatform to support this change?
   - add an additional column in the users table with an id, which links the user with the definite gaming site
   - check if some uniqe users data, which is used for registration (like email, phone number, passport number etc) are met maximum once with the same gaming site id;

3. Considering we have 1 backend cluster that serves all companies, how can we validate a user login on one gaming domain in such a way that it does not give
access to a different gaming domain? (i.e. authenticating on site A, grants access to site A only)
  - we can include the gaming site ID in JWT in payload, and later, when user tries to get access to the gaming site, check if they match 
  - also we can store the tenant ID in the user’s session when the user is logged in, and later during requests to backend.
  - we can use OAuth and receive tokens only linked to a specific tenant. In that case the backend will only accept tokens that are scoped for the domain from which the request goes.
