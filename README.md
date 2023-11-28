# User-Registration

## Secure User Registration, JWT Authentication, and User Profile

## Installation

To get started with the project, follow these steps:

1. Clone the repository to your local machine:

2. cd User-Registration

3. -npm install

4.  -npm start

PORT will be started on server 5000

- npm test to run all the test. tests are defined in test.js

Project consists of 3 apis 

/api/auth/signup: [name, email, password required fields]
/api/auth/login: [email, password required]
/api/users/:id: 

# Authentication:
Choice: JSON Web Token (JWT)
Explanation:
JWTs are used for authentication upon user login.
They are stateless, allowing for scalability and easier integration with client-side applications.
The token contains user information and is signed to ensure data integrity.
Implementation:
User Registration:

Secure user registration with hashed and salted passwords stored in the database.
Unique email validation during registration to prevent duplicate accounts.
JWT Authentication:

Implemented a /api/auth/login route that generates a JWT upon successful authentication.
The JWT contains necessary user information, allowing for subsequent authorized requests.
User Profile:

Implemented a /api/users/:id route to retrieve user information based on the provided userId.
Encryption:
Choice: bcrypt for Password Hashing
Explanation:
bcrypt is a widely used and secure algorithm for hashing passwords.
It incorporates salting, making it resilient against rainbow table attacks.
The hashing process is deliberately slow to mitigate brute-force attacks.
Implementation:
User Registration:

Used bcrypt to hash and salt user passwords during registration.
Ensured the secure storage of sensitive user information in the database.
Payload Encryption:

Employed secure encryption libraries for sensitive user data stored in the database.
CORS Setup:
Choice: Specific Allowed Origins
Explanation:
Limited the allowed origins to specific domains (api.example.com) to enhance security.
Provided additional access to specific routes for the user-agent "Dart."
Implementation:
Global CORS Configuration:

Applied a global CORS middleware to restrict API access to the specified domains.
Configured the CORS middleware to handle pre-flight requests and respond appropriately.
User-Agent "Dart" Access:

Allowed unrestricted access to /api/public for user-agent "Dart."
Restricted access to /api/users/:id for user-agent "Dart" only if authenticated with a valid JWT.
General Design Principles:

Scalability:
Designed authentication to be stateless using JWTs for scalability.
Encrypted sensitive data to ensure confidentiality and integrity.

Security:
Prioritized security by using industry-standard practices like bcrypt for password hashing.
Enforced strict CORS policies to control and limit cross-origin requests.
Flexibility:

Configured the system to easily adapt to changes in allowed origins or user-agent requirements.
Ensured that the design allows for the addition of new features or changes in security requirements.

# Rate Limiting:
Choice: express-rate-limit Middleware
Explanation:
Used express-rate-limit middleware to implement rate limiting for API endpoints.
Protects against abuse, potential DDoS attacks, and ensures fair usage of the API.
Provides configurable options for setting limits based on time windows and the maximum number of requests per IP.
Implementation:
Middleware Integration:

Implemented rate limiting middleware using express-rate-limit.
Configured the middleware to limit requests to a specific number per IP within a defined time window (e.g., 100 requests per 15 minutes).
Customizable Configuration:

Chose a window of 15 minutes and a maximum of 100 requests as initial settings.
Adjusted the configuration to meet the specific requirements of the application.
