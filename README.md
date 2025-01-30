# MNN - Northcoders News API

---

You can access the live API here: https://mnn-njx1.onrender.com

This API allows users to retrieve and interact with articles, comments, and user data. It was built using Node.js, Express, and PostgreSQL, following RESTful principles.

To clone this repository to your local machine, run:
git clone https://github.com/markamcfadden/be-nc-news-project.git
cd be-nc-news-project

To install the necessary dependencies, run npm install.

You will need to create two .env files in the root directory:
.env.development & .env.test
Each file should contain:
PGDATABASE=<database_name>
The correct database names can be found in db/setup.sql
To set up the database, run npm run setup-dbs.
To seed the databases with test data, run npm run seed.
To run the test suites, run npm test.

Minimum requirements;
Node.js v18+
PostgreSQL v14+

This project was created as part of a Digital Skills Bootcamp in Software Engineering provided by Northcoders.
