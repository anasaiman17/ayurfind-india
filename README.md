# This project is independently designed and developed.

## Project info

## How can I edit this code?

There are several ways of editing your application.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <ayurfind-india>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

---
Built by Anas Aiman

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── Header.tsx      # Navigation header
│   ├── PlantCard.tsx   # Plant display card
│   ├── ImageIdentifier.tsx  # AI identification component
│   └── ...
├── pages/              # Page components
├── contexts/           # React contexts (Auth)
├── hooks/              # Custom React hooks
├── integrations/       # Supabase client & types
├── data/               # Static data & types
└── assets/             # Images and static assets

supabase/
├── functions/          # Edge functions
│   └── identify-plant/ # AI plant identification
├── migrations/         # Database migrations
└── config.toml         # Supabase configuration
```

## Database Schema

### Tables

- **plants** - Medicinal plant data with multilingual names, uses, and precautions
- **profiles** - User profile information
- **user_roles** - Role-based access control (admin/user)

### Storage

- **plant-images** - Public bucket for plant images

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License
