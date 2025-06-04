# WhatsApp Reminder App

A simple app that sends WhatsApp reminders using **Baileys** WhatsApp Web API.

---
## FEATURES

1. Create reminders easily.  
2. Organize reminders using list-tags for better categorization.  
3. Receive WhatsApp notifications:  
   - 5 minutes before the reminder,  
   - At the exact reminder time,  
   - And 5 minutes after the reminder.  
4. Choose who gets the reminder:  
   - Send to your own phone or a list member's phone.  
5. Manage list members:  
   - Add or delete phone numbers from your reminder list.  
6. Completion tracking:  
   - Only reminders marked complete from the user’s own phone will be counted.  
7. User Interface:  
   - UI for managing list members.  
   - UI for filtering reminders by tags.  

---

## HOW TO USE

1. **Setup**
   - Clone the repository:
     ```bash
     git clone https://github.com/niobesad/whatsapp-reminder.git
     ```
   - Enter the directory: 
     ```bash
     cd whatsapp-reminder
     ```
   - Install dependencies: 
     ```bash
     npm install
     ```
   - Run database migrations:
     ```bash
     npx knex migrate:latest
     ```

2. **Link Admin WhatsApp (Baileys QR Code)**
   - Run the app:
     ```bash
     npm start
     ```
   - When the app starts for the first time, a QR code will appear in the terminal.
   - Scan this QR code with WhatsApp on your admin phone to link the session.
   - Once linked, the app will use this WhatsApp session to send reminders.

3. **Open the App**
   - Keep the app running.
   - Go to [http://localhost:5000](http://localhost:5000) to create an account, log in, and start using the app.
   - The app will send WhatsApp messages through the linked admin account as set by user reminders.


TROUBLESHOOTING

   - If the QR code does not appear, check the terminal output.
   - Re-scan the QR code if the session expires or disconnects.
   - Ensure the admin WhatsApp is active and connected to the internet.

---

Feel free to modify or expand this as needed.

## License

This project is licensed under the MIT License.
