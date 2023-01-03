# Command Project Management
<img width="1280" alt="image" src="https://user-images.githubusercontent.com/13155120/210288388-6e44b0d6-2875-4d3b-877f-9bcf496ad970.png">

You can see the app in production here:
<https://scrum-management-frontend.onrender.com/>

To see the app running with mock data, login with:
email: RobertClarke@test.com
pass: dbz28wg6Z5GJ8cE

You can view the backend repository here:
<https://github.com/bissbr01/scrum-management-backend>

## Architecture
Command Project Managment consists of a decoupled frontend and backend, with several other 3rd party api's also being called.  

![File_000 (2)](https://user-images.githubusercontent.com/13155120/210289485-bf8a9a7f-1845-4ac9-a83a-33a496521fa1.png)

The frontend is hosted by Render, who serves the static single page app via a global content delivery network.  The frontend calls Auth0 to securely handle login and OAuth SSO.  The Backend persists state information to an AWS RDS database and calls Sendgrid's email api for email notifications on colleague requests and Dicebear's avatar api for default avatar placeholders.  

A relational database seemed like a strong option when I was architecting this project since there are many different objects which are deeply related to each other:
![image](https://user-images.githubusercontent.com/13155120/210289702-daf7ff20-fb36-4141-82f8-f1413ff6e802.png)
Since multiple users can belong to multiple projects which each have a team with numerous comments, issues, and notifications, this results in slow queries for the expensive larger calls.  In the future, I'd like to explore read replicas of the database, sharding, and/or a Redis cache to speed up slow queries.

### Login
![File_000](https://user-images.githubusercontent.com/13155120/210289121-24e4c1b3-b804-4a08-b412-731db11062a4.png)
1. User navigates to home url.
2. Frontend redirects to Auth0 to handle OAuth federated login or direct login.
3. If first login, a new user account is created in backend postgresdb
4. Auth0 returns an access token and id token (both Json Web Tokens) to the frontend
5. The frontend calls the backend via http API with the provided access token for authorization
6. The backend looks up the access token's user can provides access to the requested resources if the user has the required authorization level.
