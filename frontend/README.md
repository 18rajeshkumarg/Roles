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
