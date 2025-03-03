# Modern Portfolio Website

A modern, minimal, black and white portfolio website built with Next.js, featuring 3D effects and smooth animations.

## Features

- Responsive design that works on all devices
- Modern black and white aesthetic
- Interactive 3D background with scroll effects
- Smooth animations and transitions
- Sections for About, Projects, Skills, and Contact
- Contact form with validation
- Optimized for performance

## Technologies Used

- **Next.js**: React framework for server-rendered applications
- **TypeScript**: For type safety and better developer experience
- **Tailwind CSS**: For styling and responsive design
- **Three.js / React Three Fiber**: For 3D effects and animations
- **Framer Motion**: For smooth animations and transitions

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository or download the source code

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Customization

### Personal Information

To customize the portfolio with your information:

1. Update the personal details in each component:
   - `src/components/Hero.tsx`: Your name and title
   - `src/components/About.tsx`: Your bio, education, and experience
   - `src/components/Projects.tsx`: Your projects
   - `src/components/Skills.tsx`: Your skills
   - `src/components/Contact.tsx`: Your contact information
   - `src/components/Footer.tsx`: Your name and copyright

2. Replace placeholder images with your own:
   - Add your project images to the `public` directory
   - Update image paths in the `Projects.tsx` component

### Styling

The website uses Tailwind CSS for styling. You can customize the look and feel by:

1. Modifying the color scheme in `src/app/globals.css`
2. Adjusting component styles in their respective files
3. Customizing the 3D background in `src/components/Background3D.tsx`

## Deployment

This portfolio can be easily deployed to platforms like Vercel, Netlify, or GitHub Pages.

For Vercel deployment (recommended for Next.js):

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Follow the deployment steps

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Next.js team for the amazing framework
- Three.js and React Three Fiber for 3D capabilities
- Framer Motion for animation utilities
