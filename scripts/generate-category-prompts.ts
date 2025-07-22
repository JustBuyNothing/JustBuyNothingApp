import fs from 'fs';

const ELECTRONICS_PROMPTS = [
  "Professional product photo of gaming laptop, black and RGB lighting, clean white background, studio lighting, 4K, ultra-detailed --ar 1:1 --style raw",
  "Professional product photo of wireless noise-canceling headphones, matte black finish, clean white background, studio lighting, 4K, ultra-detailed --ar 1:1 --style raw",
  "Professional product photo of DSLR camera with lens, silver and black body, clean white background, studio lighting, 4K, ultra-detailed --ar 1:1 --style raw",
  "Professional product photo of business ultrabook laptop, silver aluminum body, clean white background, studio lighting, 4K, ultra-detailed --ar 1:1 --style raw",
  "Professional product photo of smartphone, sleek design, clean white background, studio lighting, 4K, ultra-detailed --ar 1:1 --style raw",
  "Professional product photo of wireless earbuds with charging case, white finish, clean white background, studio lighting, 4K, ultra-detailed --ar 1:1 --style raw",
  "Professional product photo of mechanical gaming keyboard, RGB backlighting, clean white background, studio lighting, 4K, ultra-detailed --ar 1:1 --style raw",
  "Professional product photo of 4K streaming device, compact design, clean white background, studio lighting, 4K, ultra-detailed --ar 1:1 --style raw",
  "Professional product photo of fitness tracker watch, sport band, clean white background, studio lighting, 4K, ultra-detailed --ar 1:1 --style raw",
  "Professional product photo of all-in-one printer, white and black design, clean white background, studio lighting, 4K, ultra-detailed --ar 1:1 --style raw"
];

const HOME_KITCHEN_PROMPTS = [
  "Professional product photo of digital air fryer, sleek black design, clean white background, studio lighting, 4K, ultra-detailed --ar 1:1 --style raw",
  "Professional product photo of high-speed blender, modern design, clean white background, studio lighting, 4K, ultra-detailed --ar 1:1 --style raw",
  "Professional product photo of coffee maker, stainless steel finish, clean white background, studio lighting, 4K, ultra-detailed --ar 1:1 --style raw",
  "Professional product photo of stand mixer, elegant design, clean white background, studio lighting, 4K, ultra-detailed --ar 1:1 --style raw",
  "Professional product photo of food processor, modern kitchen appliance, clean white background, studio lighting, 4K, ultra-detailed --ar 1:1 --style raw",
  "Professional product photo of rice cooker, compact design, clean white background, studio lighting, 4K, ultra-detailed --ar 1:1 --style raw",
  "Professional product photo of slow cooker, ceramic insert, clean white background, studio lighting, 4K, ultra-detailed --ar 1:1 --style raw",
  "Professional product photo of electric kettle, stainless steel, clean white background, studio lighting, 4K, ultra-detailed --ar 1:1 --style raw",
  "Professional product photo of toaster oven, modern design, clean white background, studio lighting, 4K, ultra-detailed --ar 1:1 --style raw",
  "Professional product photo of vacuum cleaner, sleek design, clean white background, studio lighting, 4K, ultra-detailed --ar 1:1 --style raw"
];

const BOOKS_PROMPTS = [
  "Professional product photo of hardcover book, elegant cover design, clean white background, studio lighting, 4K, ultra-detailed --ar 1:1 --style raw",
  "Professional product photo of e-reader device, slim design, clean white background, studio lighting, 4K, ultra-detailed --ar 1:1 --style raw",
  "Professional product photo of cookbook, beautiful food photography cover, clean white background, studio lighting, 4K, ultra-detailed --ar 1:1 --style raw",
  "Professional product photo of business book, professional cover design, clean white background, studio lighting, 4K, ultra-detailed --ar 1:1 --style raw",
  "Professional product photo of fiction novel, artistic cover, clean white background, studio lighting, 4K, ultra-detailed --ar 1:1 --style raw",
  "Professional product photo of textbook, educational design, clean white background, studio lighting, 4K, ultra-detailed --ar 1:1 --style raw",
  "Professional product photo of art book, beautiful imagery cover, clean white background, studio lighting, 4K, ultra-detailed --ar 1:1 --style raw",
  "Professional product photo of children's book, colorful illustration cover, clean white background, studio lighting, 4K, ultra-detailed --ar 1:1 --style raw",
  "Professional product photo of biography book, portrait cover, clean white background, studio lighting, 4K, ultra-detailed --ar 1:1 --style raw",
  "Professional product photo of self-help book, inspiring cover design, clean white background, studio lighting, 4K, ultra-detailed --ar 1:1 --style raw"
];

const VIDEO_GAMES_PROMPTS = [
  "Professional product photo of gaming console, sleek black design, clean white background, studio lighting, 4K, ultra-detailed --ar 1:1 --style raw",
  "Professional product photo of wireless gaming controller, ergonomic design, clean white background, studio lighting, 4K, ultra-detailed --ar 1:1 --style raw",
  "Professional product photo of gaming headset, over-ear design with microphone, clean white background, studio lighting, 4K, ultra-detailed --ar 1:1 --style raw",
  "Professional product photo of gaming mouse, RGB lighting, clean white background, studio lighting, 4K, ultra-detailed --ar 1:1 --style raw",
  "Professional product photo of gaming chair, ergonomic design, clean white background, studio lighting, 4K, ultra-detailed --ar 1:1 --style raw",
  "Professional product photo of gaming monitor, curved screen, clean white background, studio lighting, 4K, ultra-detailed --ar 1:1 --style raw",
  "Professional product photo of gaming keyboard, mechanical switches, clean white background, studio lighting, 4K, ultra-detailed --ar 1:1 --style raw",
  "Professional product photo of gaming mousepad, large size, clean white background, studio lighting, 4K, ultra-detailed --ar 1:1 --style raw",
  "Professional product photo of gaming desk, modern design, clean white background, studio lighting, 4K, ultra-detailed --ar 1:1 --style raw",
  "Professional product photo of gaming speakers, RGB lighting, clean white background, studio lighting, 4K, ultra-detailed --ar 1:1 --style raw"
];

const TOYS_GAMES_PROMPTS = [
  "Professional product photo of board game box, colorful artwork, clean white background, studio lighting, 4K, ultra-detailed --ar 1:1 --style raw",
  "Professional product photo of puzzle, beautiful landscape image, clean white background, studio lighting, 4K, ultra-detailed --ar 1:1 --style raw",
  "Professional product photo of building blocks set, colorful pieces, clean white background, studio lighting, 4K, ultra-detailed --ar 1:1 --style raw",
  "Professional product photo of action figure, detailed design, clean white background, studio lighting, 4K, ultra-detailed --ar 1:1 --style raw",
  "Professional product photo of educational toy, bright colors, clean white background, studio lighting, 4K, ultra-detailed --ar 1:1 --style raw",
  "Professional product photo of card game set, premium cards, clean white background, studio lighting, 4K, ultra-detailed --ar 1:1 --style raw",
  "Professional product photo of stuffed animal, soft plush texture, clean white background, studio lighting, 4K, ultra-detailed --ar 1:1 --style raw",
  "Professional product photo of remote control car, sporty design, clean white background, studio lighting, 4K, ultra-detailed --ar 1:1 --style raw",
  "Professional product photo of art supplies set, organized case, clean white background, studio lighting, 4K, ultra-detailed --ar 1:1 --style raw",
  "Professional product photo of science kit, educational components, clean white background, studio lighting, 4K, ultra-detailed --ar 1:1 --style raw"
];

const PROMPT_TEMPLATES = {
  'electronics': ELECTRONICS_PROMPTS,
  'home-and-kitchen': HOME_KITCHEN_PROMPTS,
  'books': BOOKS_PROMPTS,
  'video-games': VIDEO_GAMES_PROMPTS,
  'toys-and-games': TOYS_GAMES_PROMPTS
};

function generateCategoryPrompts(category: string, count: number = 50) {
  const validCategories = Object.keys(PROMPT_TEMPLATES);
  
  if (!validCategories.includes(category)) {
    console.error(`❌ Invalid category: ${category}`);
    console.log(`Valid categories: ${validCategories.join(', ')}`);
    return;
  }

  const basePrompts = PROMPT_TEMPLATES[category];
  const prompts: string[] = [];
  
  // Generate variations of base prompts
  for (let i = 0; i < count; i++) {
    const basePrompt = basePrompts[i % basePrompts.length];
    
    // Add variations to make prompts unique
    const variations = [
      basePrompt,
      basePrompt.replace('clean white background', 'minimal white background'),
      basePrompt.replace('studio lighting', 'professional lighting'),
      basePrompt.replace('4K, ultra-detailed', '8K, professional quality'),
      basePrompt + ', commercial photography style'
    ];
    
    prompts.push(variations[Math.floor(Math.random() * variations.length)]);
  }
  
  // Remove duplicates and ensure we have exactly the requested count
  const uniquePrompts = [...new Set(prompts)];
  const finalPrompts = uniquePrompts.slice(0, count);
  
  // Save to file
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `${category}-prompts-${timestamp}.md`;
  
  const content = `# ${category.toUpperCase()} Midjourney Prompts\n\nGenerated: ${new Date().toISOString()}\nTotal Prompts: ${finalPrompts.length}\n\n` +
    finalPrompts.map((prompt, i) => `${i + 1}. ${prompt}`).join('\n\n');
  
  fs.writeFileSync(filename, content);
  
  console.log(`🎯 Generated ${finalPrompts.length} prompts for ${category}`);
  console.log(`📁 Saved to: ${filename}`);
  
  return finalPrompts;
}

// Export for use in other scripts
export { generateCategoryPrompts };

// Command line usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const category = process.argv[2];
  const count = parseInt(process.argv[3]) || 50;
  
  if (!category) {
    console.log('Usage: tsx scripts/generate-category-prompts.ts <category> [count]');
    console.log('Categories: electronics, home-and-kitchen, books, video-games, toys-and-games');
    console.log('Default count: 50');
    process.exit(1);
  }
  
  generateCategoryPrompts(category, count);
}