# BuyNothing - The Dopamine-Free Shopping App

A React-based web application that provides a complete Amazon-like shopping experience without real purchases. Features AI-generated products, Chrome extension for shopping intervention, and authentic product catalog using Midjourney images.

## Quick Start

1. **Install dependencies:** `npm install`
2. **Start development:** `npm run dev`
3. **Access app:** Open browser to localhost:5000

## Core Features

- **Realistic Shopping Experience**: Complete e-commerce simulation with cart, checkout, and order tracking
- **AI-Powered Product Catalog**: Products generated from Midjourney images using OpenAI Vision
- **Chrome Extension**: "iBuyNothing Guard" interrupts Amazon checkout pages
- **Authentic Images**: Brand-free professional product photography
- **Categories**: Electronics, Home & Kitchen, Books, Video Games, Toys & Games

## Workflow System

### Adding New Products

1. **Generate Prompts**: `tsx scripts/generate-category-prompts.ts [category]`
2. **Generate Images**: Use prompts in Midjourney, upload to `midjourney-images/[category]/`
3. **Process Images**: `tsx scripts/process-new-images.ts [category]`

### Available Categories
- `electronics` - Tech products, laptops, cameras, headphones
- `home-and-kitchen` - Kitchen appliances, home decor, household items
- `books` - Books, e-readers, educational materials
- `video-games` - Gaming consoles, controllers, accessories
- `toys-and-games` - Board games, toys, puzzles, educational games

## Technical Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Wouter routing
- **Backend**: Node.js, Express, PostgreSQL, Drizzle ORM
- **AI**: OpenAI GPT-4o Vision for product analysis
- **Images**: Midjourney for professional product photography

## Documentation

- `COMPLETE_WORKFLOW_SYSTEM.md` - Detailed workflow guide
- `EXTENSION_TESTING_GUIDE.md` - Chrome extension testing
- `replit.md` - Project architecture and preferences

## Chrome Extension

The iBuyNothing Guard extension interrupts Amazon checkout pages with personalized messages to help users reconsider impulsive purchases. Download from `/api/download/chrome-extension`.