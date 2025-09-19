# Wedding Vendor Contract Management System

A modern web application designed specifically for wedding vendors to streamline their contract creation, management, and signing process. Built with Next.js, this platform supports photographers, caterers, and florists with AI-powered contract generation and digital signature capabilities.

Features
Core Functionality
Multi-Vendor Support: Tailored for photographers, caterers, and florists with vendor-specific contract templates
AI-Powered Contract Generation: Uses OpenAI to create professional, legally-appropriate contracts based on your inputs
Smart Contract Editor: Rich text editor powered by TipTap for easy content customization
Digital Signatures: Secure signature collection with both drawn and typed signature options
Contract Status Tracking: Manage contracts through draft, final, and signed states
Dashboard & Management
Vendor Dashboard: Overview of all contracts with status tracking and metrics
Real-time Updates: Track contract progress and client interactions
Secure Authentication: Role-based access for different vendor types
Getting Started
First, run the development server:

npm run dev

# or

yarn dev

# or

pnpm dev

# or

bun dev
Open <http://localhost:3000> with your browser to see the result.

You can start editing the page by modifying app/page.tsx. The page auto-updates as you edit the file.

This project uses next/font to automatically optimize and load Geist, a new font family for Vercel.

Learn More
To learn more about Next.js, take a look at the following resources:

Next.js Documentation - learn about Next.js features and API.
Learn Next.js - an interactive Next.js tutorial.
You can check out the Next.js GitHub repository - your feedback and contributions are welcome!

Deploy on Vercel
The easiest way to deploy your Next.js app is to use the Vercel Platform from the creators of Next.js.

Check out our Next.js deployment documentation for more details.

Prerequisites
Node.js 18+
OpenAI API key for AI contract generation
Installation
Clone the repository
git clone <https://github.com/techlism/wedding-vendor.git>
cd wedding-vendor
Install dependencies
npm install
Set up environment variables

# Create .env.local file

OPENAI_API_KEY=your_openai_api_key_here
Initialize the database
npm run db:push
Start the development server
npm run dev
Visit <http://localhost:3000> to access the application.

Quick Start Guide
For Wedding Vendors
Login with Test Credentials:

Photographer: <photographer@test.com> / password123
Caterer: <caterer@test.com> / password123
Florist: <florist@test.com> / password123
Create Your First Contract:

Click "Create New Contract" from your dashboard
Fill in client details (name, event date, venue, service package, amount)
Use "AI Assist" to generate professional contract content
Customize the contract using the rich text editor
Save as draft or finalize for client signing
Contract Workflow:

Draft: Editable contract in progress
Final: Locked contract ready for client signature
Signed: Completed contract with digital signature
Vendor-Specific Templates
The system includes specialized templates for each vendor type:

Photographers: 8-hour coverage, image delivery, payment terms
Caterers: Menu service, staff, guest count management
Florists: Bouquet and arrangement services, delivery terms
Technology Stack
Framework: Next.js 15 with App Router
Database: SQLite with Drizzle ORM
Authentication: JWT-based with secure HTTP-only cookies
AI Integration: OpenAI API for contract generation
Editor: TipTap rich text editor
Styling: Tailwind CSS with custom components
TypeScript: Full type safety throughout
API Endpoints
Authentication
POST /api/login - User authentication
POST /api/logout - Session termination
Contracts
POST /api/contracts - AI contract content generation
POST /api/contracts/create - Create new contract
GET /api/contracts/[id] - Retrieve contract details
POST /api/contracts/[id]/finalize - Lock contract for signing
POST /api/contracts/[id]/sign - Add digital signature
Development
Database Management

# Push schema changes

npm run db:push

# Open database studio

npm run db:studio
Build and Deploy

# Create production build

npm run build

# Start production server

npm run start

# Run linting

npm run lint
Deployment
The application is designed for easy deployment on platforms like Vercel:

Connect your GitHub repository to Vercel
Add your OPENAI_API_KEY environment variable
Deploy with automatic builds on push
For other platforms, ensure SQLite database persistence and environment variable configuration.

Contributing
This project was developed by @techlism. Contributions are welcome - please feel free to submit issues and pull requests.

License
This project is private and proprietary. All rights reserved.
