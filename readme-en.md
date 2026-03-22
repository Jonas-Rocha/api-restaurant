# API Restaurant - Study Documentation

This project is a Backend API developed for restaurant management. The main goal of this repository is to serve as a study base in backend development with Node.js and TypeScript, applying good practices in code organization, relational databases, and data validation.

## Technologies Used

The project ecosystem was built using the following technologies:

* Node.js: JavaScript/TypeScript execution environment for the server.
* TypeScript: A JavaScript superset that adds static typing, ensuring greater code security and predictability.
* Express: A minimalist framework for creating routes and managing network ports.
* Knex.js: SQL Query Builder used to interact with the database and manage Migrations and Seeds.
* Zod: A library focused on validation and sanitization of data received by requests.

## Architecture and Structure

The main source code is contained in the `src/` folder, which is organized following the separation of concerns:

* Controllers: Layer responsible for receiving requests, processing business logic, and returning a response.
* Routes: Layer that maps URLs (endpoints) to their respective methods in the controllers.
* Database: Centralizes all data infrastructure.
  * Migrations: Versioning scripts for creating and altering table structures.
  * Seeds: Scripts for inserting initial data into the database, such as initial products and tables.
  * Types: Centralization of typing (contracts/interfaces) of the tables to help the developer and TypeScript.
* Middlewares: Layer that intercepts requests. Used mainly for capturing and standardizing global errors.
* Utils: Common utility functions or classes, such as the Custom Exceptions class (AppError).

## Implemented Features

The system has specialized features for practical restaurant management:

### Product Management (Menu)
* Registration of new products requiring a valid name (more than 6 characters) and a strictly positive price.
* Complete menu consultation with support for fragmented text search by product name.
* Smart and punctual editing of a product's properties.
* Total exclusion and removal of old items from the menu.

### Physical Table Management
* Identification and ordered listing of available tables in the restaurant.

### Attendance Control (Table Sessions)
* Opening an account linked to a customer's arrival at the table. The system has a lock to prevent the table, once occupied, from undergoing accidental reopenings before payment.
* Listing the flow and history of accounts, allowing you to see from newly opened accounts to closed registers in the past.
* Ending the session (closing the account), documenting the exact moment the table was freed in the database.

### Order Management (Orders)
* Ordering command linking a consumed product to an already instantiated and open table.
* Fundamental cash protection: The price at the exact second of the order is encapsulated in the order history, protecting against future menu readjustments that would destroy old sales histories if queried dynamically in the wrong way.
* Detailing everything consumed by a certain table in a list format, displaying quantities and the visual projection of the unit total together.
* Dynamic closing automatically calculating the total amount spent based on the sum of all consumed items (Subtotal).

## Final Considerations

The project is highly documented and commented line by line for educational purposes in the `src/` folder. The entire flow was planned to return an assertive view to the user; moreover, there is a middleware aimed at readjusting any internal problem to readable HTTP statuses, avoiding the base framework's dead screens.
