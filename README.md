# Wedding Vendor Contract Management System

A streamlined web application for wedding vendors to create, manage, and process digital contracts with AI assistance.

## Quick Start

### Prerequisites

-   Node.js 20+
-   OpenAI API key

### Installation

```bash
git clone https://github.com/techlism/wedding-vendor-managemnet-system.git
cd wedding-vendor-managemnet-system
npm install
```

### Configuration

Create `.env.local`:

```bash
OPENAI_API_KEY=your_openai_api_key_here
JWT_SECRET=your-secret
```

### Database Setup

```bash
npm run db:push
```

### Development

```bash
npm run dev
```

Access at http://localhost:3000

## Usage

### Test Accounts

-   Photographer: `photographer@test.com` / `password123`
-   Caterer: `caterer@test.com` / `password123`
-   Florist: `florist@test.com` / `password123`

### Contract Workflow

1. **Create Contract**: Add client details and service information
2. **AI Generation**: Use AI assist to generate contract content
3. **Edit & Customize**: Modify using the rich text editor
4. **Finalize**: Lock contract for client signing
5. **Collect Signature**: Client signs digitally

### Contract States

-   **Draft**: Editable, work in progress
-   **Final**: Locked, ready for signature
-   **Signed**: Completed with digital signature

## Vendor Types

Each vendor type has specialized contract templates and details asked

## Tech Stack

-   **Next.js 15** - React framework with App Router
-   **SQLite** - Database with Drizzle ORM
-   **OpenAI API** - AI contract generation
-   **TipTap** - Rich text editor
-   **Tailwind CSS** - Styling
-   **TypeScript** - Type safety

## API Reference

### Authentication

```bash
POST /api/login     # User login
POST /api/logout    # Session logout
```

### Contracts

```bash
POST /api/contracts                # Generate AI content
POST /api/contracts/create         # Create new contract
GET  /api/contracts/[id]           # Get contract
POST /api/contracts/[id]/finalize  # Lock for signing
POST /api/contracts/[id]/sign      # Add signature
```

## Development Commands

```bash
npm run dev        # Start development server
npm run build      # Production build
npm run start      # Start production server
npm run lint       # Run ESLint
npm run db:push    # Update database schema
npm run db:studio  # Open database admin
```

## Deployment

### Vercel (Recommended)

1. Connect GitHub repository
2. Add `OPENAI_API_KEY` environment variable
3. Deploy

### Other Platforms

-   Ensure SQLite database persistence
-   Configure environment variables
-   Set up build commands

## Architecture Decisions

**SQLite Database**: Chosen for simplicity and easy deployment without external database dependencies.

**JWT Authentication**: Secure HTTP-only cookies for session management without external auth providers.

**AI Integration**: OpenAI API provides professional contract generation tailored to vendor types.

**Rich Text Editor**: TipTap offers flexible contract editing with legal document formatting needs.
