# BuyNothing - The Dopamine-Free Shopping App

## Overview

BuyNothing is a React-based web application that simulates the Amazon-like shopping experience without real purchases. It helps users overcome impulsive shopping habits by providing a complete e-commerce simulation using AI-generated professional product images.

## Key Features

- **Complete Shopping Experience**: Product browsing, cart management, fake checkout, and order tracking
- **AI-Generated Products**: 47+ authentic Home & Kitchen products created using GPT-4o Vision analysis of Midjourney images
- **Chrome Extension**: "iBuyNothing Guard" for Amazon checkout interruption
- **User Authentication**: Login system with money-saving stats tracking and visit streaks
- **Professional Product Images**: 100+ Midjourney-generated product images with perfect alignment

## Technology Stack

### Frontend
- React with TypeScript
- Wouter for routing
- Zustand for state management
- TanStack Query for server state
- Tailwind CSS with shadcn/ui components
- Vite for development and building

### Backend
- Node.js with Express
- PostgreSQL with Drizzle ORM
- OpenAI GPT-4o for product generation
- Neon serverless database connection

## Project Structure

```
├── client/              # React frontend application
├── server/              # Express backend API
├── shared/              # Shared TypeScript schemas
├── chrome-extension/    # iBuyNothing Guard extension
├── midjourney-images/   # AI-generated product images
├── midjourney-prompts/  # Prompts for image generation
└── scripts/             # Database and AI processing scripts
```

## Key Accomplishments

### Complete Home & Kitchen Category (January 2025)
- ✅ 100 Midjourney images processed using AI vision
- ✅ 47 authentic products created with realistic branding
- ✅ Professional product names and specifications
- ✅ Review counts and ratings system
- ✅ Static image serving for frontend display

### Chrome Extension Features
- ✅ Amazon checkout page detection and intervention
- ✅ Time-based personalized messaging
- ✅ Cart total display and BuyNothing redirection
- ✅ Session-based control to prevent spam
- ✅ Brand-consistent design

### AI Integration
- ✅ OpenAI GPT-4o Vision for image analysis
- ✅ Authentic product generation from visual content
- ✅ Realistic pricing and feature extraction
- ✅ Professional brand name creation
- ✅ Category-specific product organization

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```
   DATABASE_URL=your_postgresql_url
   OPENAI_API_KEY=your_openai_key
   ```

3. Push database schema:
   ```bash
   npm run db:push
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

## Database Schema

- **Products**: Comprehensive product catalog with features, ratings, and images
- **Users**: Authentication with savings tracking and visit streaks
- **Cart/Orders**: Full e-commerce simulation without real transactions
- **Reviews**: Product review system with ratings and comments

## Future Development

### Ready for Expansion
- Electronics category (48 images ready)
- Men's & Women's Clothing categories
- Beauty & Personal Care category
- Jewelry category
- Complete workflow system for processing remaining categories

### Proven Workflow
1. Midjourney image generation with optimized prompts
2. AI vision analysis for authentic product creation
3. Database integration with realistic review counts
4. Frontend display with proper image serving

## Contributing

This project demonstrates a complete AI-powered e-commerce simulation with authentic product generation and user behavior modification features. The codebase is ready for production deployment and further category expansion.

## License

This project is for educational and demonstration purposes, showcasing AI integration in e-commerce applications.