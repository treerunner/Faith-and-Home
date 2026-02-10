# Faith & Home Research Project

A bilingual (English/Spanish) website for the Faith & Home Research Project at the University of Notre Dame. This site provides information about the research project studying Catholic families' religious practices and how they shape family life.

## Features

- **Bilingual Support**: Full English and Spanish translations with automatic language detection
- **Responsive Design**: 12-column grid system that adapts to all screen sizes
- **Smooth Transitions**: Page transitions with slide animations
- **Markdown Content**: Content managed through markdown files for easy updates
- **Three Pages**: Home, Privacy Policy, and Terms and Conditions

## Tech Stack

- **Framework**: SvelteKit with Svelte 5
- **Content**: MDsveX for markdown processing
- **Styling**: Custom CSS with CSS Grid
- **Deployment**: Vercel
- **Language**: JavaScript

## Project Structure

```
Faith-and-Home/
├── src/
│   ├── routes/           # Pages and routing
│   │   ├── +layout.svelte
│   │   ├── +page.svelte  # Home page
│   │   ├── privacy/
│   │   └── terms/
│   ├── lib/
│   │   ├── components/   # Reusable components
│   │   ├── stores/       # Svelte stores (locale)
│   │   └── utils/        # Utility functions
│   ├── content/          # Markdown content files
│   │   ├── en/           # English content
│   │   └── es/           # Spanish content
│   ├── app.css           # Global styles
│   └── app.html          # HTML template
├── static/               # Static assets
└── assets/               # Project assets (brochures, etc.)
```

## Development

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install
```

### Running Locally

```bash
# Start development server
npm run dev

# Open http://localhost:5173
```

### Building for Production

```bash
# Build the site
npm run build

# Preview production build
npm run preview
```

## Deployment to Vercel

This project is configured for deployment to Vercel using the SvelteKit Vercel adapter.

### Option 1: Deploy via Vercel CLI

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy to Vercel
vercel

# Deploy to production
vercel --prod
```

### Option 2: Deploy via GitHub

1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Vercel will automatically detect the SvelteKit configuration
5. Click "Deploy"

### Environment Variables

No environment variables are required for basic operation. All content is stored in markdown files.

## Content Management

### Adding/Editing Content

Content is stored in markdown files under `src/content/`. Each page has separate English and Spanish versions:

- **Home**: `src/content/en/home.md` and `src/content/es/home.md`
- **Privacy**: `src/content/en/privacy.md` and `src/content/es/privacy.md`
- **Terms**: `src/content/en/terms.md` and `src/content/es/terms.md`

To update content:
1. Edit the appropriate markdown file
2. Commit and push changes
3. Vercel will automatically redeploy

### Language Detection

The site automatically detects the user's browser language and sets the initial language preference. Users can toggle between English and Spanish using the language switcher in the header. The language preference is saved to localStorage.

## Customization

### Colors

Colors are defined as CSS variables in `src/app.css`:

```css
--primary-color: #2c5282;
--secondary-color: #805ad5;
--text-color: #2d3748;
--bg-color: #ffffff;
```

### Grid System

The 12-column responsive grid is defined in `src/app.css`. Use classes like `.col-6`, `.col-12`, etc. on elements within a `.grid` container.

### Max Width

The maximum content width is set to 1200px in `src/app.css` via the `--max-width` CSS variable.

## License

See LICENSE file for details.
