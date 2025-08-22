import { NextResponse } from 'next/server';
import Fashn from 'fashn';

const FASHN_ENDPOINT_URL = process.env.FASHN_ENDPOINT_URL || "https://api.fashn.ai";
const FASHN_API_KEY = process.env.FASHN_API_KEY;

// Helper to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      model_image, // base64 string
      garment_image, // base64 string
      garment_photo_type,
      category,
      mode,
      segmentation_free,
      seed,
      num_samples,
      api_key, // User-provided API key
      model_name, // Model version selection (v1.5, tryon-v1.6, tryon-staging)
    } = body;

    // Use environment API key if available, otherwise use user-provided key
    const apiKey = FASHN_API_KEY || api_key;

    if (!apiKey) {
      return NextResponse.json({ 
        error: "API key required. Please provide your FASHN API key.",
        requiresApiKey: true 
      }, { status: 401 });
    }

    // Validate inputs
    if (!model_image || !garment_image) {
      return NextResponse.json({ error: "Missing model or garment image" }, { status: 400 });
    }

    const inputs = {
      model_image,
      garment_image,
      garment_photo_type: garment_photo_type.toLowerCase(),
      category,
      mode: mode.toLowerCase(),
      segmentation_free,
      seed: parseInt(seed, 10),
      num_samples: parseInt(num_samples, 10),
    };

    const apiPayload = {
      model_name: model_name,
      inputs: inputs
    }

    const baseURL = FASHN_ENDPOINT_URL;
    const client = new Fashn({ apiKey, baseURL });

    console.log(`Sending request to FASHN API: ${baseURL}/run`);
    const runResponse = await client.predictions.run(apiPayload);
    const predId = runResponse.id;
    console.log(`Prediction ID: ${predId}`);
    if (!predId) {
      return NextResponse.json({ error: "Failed to get prediction ID from FASHN API" }, { status: 500 });
    }

    // Poll status
    const maxPollingTime = 180 * 1000; // 3 minutes in milliseconds
    const pollingInterval = 2 * 1000; // 2 seconds
    const startTime = Date.now();

    while (Date.now() - startTime < maxPollingTime) {
      console.log(`Polling status for ID: ${predId}`);
      const statusData = await client.predictions.status(predId);

      console.log(`Prediction status: ${statusData.status}`);

      if (statusData.status === "completed") {
        console.log("Prediction completed.");
        return NextResponse.json({ output: statusData.output });
      } else if (statusData.status === "failed") {
        console.error(`Prediction failed with id ${predId}: ${JSON.stringify(statusData.error)}`);
        return NextResponse.json({ error: `Prediction failed: ${statusData.error?.message || 'Unknown reason'}` }, { status: 500 });
      }

      await delay(pollingInterval);
    }

    return NextResponse.json({ error: "Maximum polling time exceeded." }, { status: 504 }); // Gateway Timeout

  } catch (error: Error | unknown) {
    if (error instanceof Fashn.APIError) {
      console.error("FASHN API /run error:", error);
      
      // Check for authentication errors
      if (error.status === 401 || error.status === 403) {
        return NextResponse.json({ 
          error: "Invalid API key. Please check your FASHN API key and try again.",
          requiresApiKey: true 
        }, { status: 401 });
      }

      if (error.status === 429) {
        return NextResponse.json({ 
          error: "Rate limit exceeded. Please try again later.",
        }, { status: 429 });
      }
      
      return NextResponse.json({ error: `API run failed: ${error.cause}` }, { status: error.status });
    } else {
      console.error("Error in /api/tryon:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
  }
}