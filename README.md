WhatsApp Reminder App

A simple app that sends WhatsApp reminders using **Baileys** WhatsApp Web API.

## FEATURES

1. Create reminders easily.

2. Organize reminders using list-tags for better categorization.

3. Receive WhatsApp notifications:

    - 5 minutes before the reminder,
    - At the exact reminder time,
    - And 5 minutes after the reminder.

## HOW TO USE

1. Setup

- Clone the repository:
  git clone https://github.com/niobesad/whatsapp-reminder.git
  cd whatsapp-reminder

- Install dependencies:
  npm install

- Run database migrations:
  npx knex migrate:latest

2. Link Admin WhatsApp (Baileys QR Code)

- Run the app:
  npm start

- When the app starts at teh first time, a QR code will appear in the terminal.

- Scan this QR code with WhatsApp on your admin phone to link the session.

- Once linked, the app will use this WhatsApp session to send reminders.

3. Open the App

- Keep the app running.

- Go to http://localhost:5000 to create account and login then start using app

- The app will send WhatsApp messages through the linked admin account as it set by user remiders.

TROUBLESHOOTING

- If the QR code does not appear, check the terminal output.

- Re-scan the QR code if the session expires or disconnects.

- Ensure the admin WhatsApp is active and connected to the internet.

---

Feel free to modify or expand this as needed.

## License

This project is licensed under the MIT License.
