# Medicinal Plants Database

An AI-powered medicinal plant identification and database application built with React, TypeScript, and Supabase.

## Features

- 🌿 **AI Plant Identification** - Upload or capture plant images for AI-powered identification
- 🔍 **Advanced Search** - Search plants by name, scientific name, or in multiple languages (Hindi, Tamil, Telugu)
- 📚 **Comprehensive Database** - Detailed medicinal plant information including uses, dosage, and precautions
- 🌐 **Multilingual Support** - Search and view content in English, Hindi, Tamil, and Telugu
- 🌙 **Dark/Light Mode** - Beautiful UI with theme support
- 👤 **User Authentication** - Secure login and signup with role-based access

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase (Database, Auth, Edge Functions, Storage)
- **AI**: Lovable AI Gateway (Gemini 2.5 Flash for vision)
- **Animation**: Framer Motion

## Local Development Setup

### Prerequisites

- Node.js 18+ or Bun
- A Supabase project (or use the existing Lovable Cloud backend)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd <project-folder>
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   
   Fill in your Supabase credentials in `.env`:
   ```
   VITE_SUPABASE_URL="https://your-project.supabase.co"
   VITE_SUPABASE_PROJECT_ID="your-project-id"
   VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

5. **Open in browser**
   
   Navigate to `http://localhost:5173`

### Edge Functions

The project uses Supabase Edge Functions for AI plant identification. These are automatically deployed when using Lovable Cloud.

If you're self-hosting, you'll need to:
1. Set up the `LOVABLE_API_KEY` secret in your Supabase project
2. Deploy the edge functions using Supabase CLI:
   ```bash
   supabase functions deploy identify-plant
   ```

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
