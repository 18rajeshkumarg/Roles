# Organisation Management

This folder is the complete Organisation Management project: React frontend plus Django backend.

## Run

```powershell
npm install
npm run dev:all
```

Open http://127.0.0.1:5175/Roles/. Django API runs at http://127.0.0.1:8000/api/ and Admin Panel at http://127.0.0.1:8000/admin/.

## Accounts

These sample accounts are for local development only. Production seeds a separate admin password from the Render `ADMIN_PASSWORD` secret and does not create sample employee accounts.

- `admin` / `admin123`
- `eng_mgr` / `eng_mgr123`
- `dev1` / `dev1123`

The React application includes Organisation Management, dashboard, people, departments, roles, attendance, payroll, and Admin Panel screens. React uses the Django backend, migrations, database, REST API, and administration system in `backend/`.

The whole project is run from this folder with one command.

## SketricGen chat

The published SketricGen Brand Agent is embedded on both the React site (`index.html`) and the Django site (the shared `backend/templates/base.html` template). Both use agent ID `skbrand_38c5aef5-bf35-4f10-a954-75f8b6137aba`, the compact floating-pill layout, and load the external widget after the page load during browser idle time to keep initial rendering responsive.

To connect Telegram to this same agent:

1. Create a bot with [Telegram's @BotFather](https://t.me/BotFather) and copy its token.
2. Sign in to [SketricGen](https://www.sketricgen.ai), open this Brand Agent, and go to **Publish → Telegram → Connect**.
3. Paste the token in SketricGen and select **Connect**. The bot then uses this Brand Agent; no bot token needs to be stored in this repository or website.
4. Open the bot in Telegram and send it a message to test the integration.

See the [SketricGen Telegram deployment guide](https://docs.sketricgen.ai/deploy/telegram) for details. Telegram is connected in the SketricGen agent settings, not by the website embed. If a bot token has been shared in chat or another public place, revoke it with @BotFather and generate a replacement before connecting it.
