# FASHN AI Virtual Try-On Next.js App

This is a Next.js application for the FASHN Virtual Try-On API, allowing users to upload model and garment images to see virtual try-on results.

## Features

- **Virtual Try-On**: Apply clothing items to model photos using FASHN AI's advanced technology
- **Responsive UI**: Clean, modern interface that works on desktop and mobile
- **Client-side Image Preprocessing**: Automatic resizing and optimization for API best practices
- **Flexible Configuration**: Control all API parameters through an intuitive interface
- **Example Images**: Built-in examples to explore capabilities without uploading files

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- FASHN API key (get one from [fashn.ai](https://fashn.ai))

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/fashn-AI/tryon-nextjs-app
   cd fashn-nextjs
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env.local` file in the root directory with your FASHN API key:
   ```
   FASHN_API_KEY=your-api-key-here
   ```

4. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Upload a model image (a photo of a person)
2. Upload a garment image (a clothing item)
3. Configure the parameters:
   - Garment photo type (Auto, Flat-Lay, Model)
   - Category (Auto, Top, Bottom, Full-body)
   - Moderation level
   - Run mode (Performance, Balanced, Quality)
   - Seed
   - Number of samples
4. Click "Run" to see the results

## API Parameters Explained

- **Category**: Determines how the API interprets the clothing item
  - `Auto`: Automatically detect garment type (best for general use)
  - `Top`: Upper body garments like shirts, t-shirts (most reliable category)
  - `Bottom`: Lower body garments like pants, skirts (requires clear garment image)
  - `Full-body`: Complete outfits like dresses, jumpsuits (requires full-body model)

- **Photo Type**: Helps optimize processing based on garment image style
  - `Auto`: Automatic detection (general use)
  - `Flat-Lay`: Garment laid flat (e-commerce product images)
  - `Model`: Garment worn by a model (photos with people)

- **Run Mode**: Balances processing speed vs. quality
  - `Performance`: Fastest processing (~7s), lower quality
  - `Balanced`: Good balance of speed (~9s) and quality
  - `Quality`: Best results but slowest (~13s)

- **Other Settings**: 
  - `Segmentation Free`: May improve quality for complex backgrounds
  - `Moderation Level`: Controls content filtering (permissive, conservative, none)
  - `Seed`: Controls randomness for reproducible results
  - `Number of Samples`: Generate multiple variations (1-4)

## Image Preprocessing

This application implements best practices for image preprocessing before sending to the FASHN API:

- **Resize**: Images with height exceeding 2000px are automatically resized while maintaining aspect ratio
- **Format**: Images are converted to JPEG format with a quality setting of 95%
- **Base64 Encoding**: Images are sent as base64 strings rather than URLs for simplicity in this demo app
  (Note: In production, FASHN recommends using CDN-hosted images for better performance)

These preprocessing steps help ensure optimal performance with the API while keeping payload sizes reasonable.

## Best Practices for Better Results

- **Image Ratio**: Use 2:3 aspect ratio for best results
- **Single Subject**: Include only one person per model image
- **Framing**: Focus/zoom on the subject to fill most of the frame
- **Pose Consistency**: Use similar poses between model and garment images
- **Image Quality**: Higher resolution and clear lighting improve output quality

## Technical Architecture

- **Frontend**: React with Next.js App Router, TailwindCSS for styling
- **API**: Serverless API routes that securely communicate with FASHN API
- **Image Processing**: Client-side preprocessing using Canvas API
- **Error Handling**: Graceful fallbacks and informative error messages

## Deployment

You can deploy this application to any hosting platform that supports Next.js applications. Make sure to set up your environment variables (`FASHN_API_KEY` and `FASHN_ENDPOINT_URL`) on your hosting platform.

Popular deployment options include:
- [Vercel](https://vercel.com/) (seamless Next.js deployment)
- [Netlify](https://www.netlify.com/)
- [AWS Amplify](https://aws.amazon.com/amplify/)
- [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform)

## Credits

- [FASHN AI](https://fashn.ai) - Virtual Try-On API
- [Next.js](https://nextjs.org/) - React Framework
- [TailwindCSS](https://tailwindcss.com/) - CSS Framework

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
