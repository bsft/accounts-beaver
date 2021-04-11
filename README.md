# Accounts Beaver

Accounts Beaver streamlines the invoicing process—with one click, you can send out your invoice by email. Simply enter the relevant information and Accounts Beaver does the rest for you.

## Setup

Accounts Beaver requires NodeJS and npm to run.
After cloning repo, open a terminal in the backend folder and run `npm install`.
To get full email capabilities, a valid [SendGrid](https://sendgrid.com/) API key is required to be loaded into the `API_KEY` environment variable. This can be done at the operating system level or by creating a file named `.env` in the backend folder with the contents `API_KEY=<your_api_key_here>`. The node module dotenv is included with the `server.js` file to load such `.env` files.

## Usage

The backend server can be run with the command `node server.js`, which creates an Express server listening on port 3000. `frontend/index.html` can be loaded into the browser directly from the file system and the app will have full functionality if the SendGrid API key is setup as described above.

If the SendGrid API key is not supplied, a pdf will be generated when the invoice form is filled out, but the pdf will not be sent via email.

The pdf will be generated at `backend/invoice.pdf'
