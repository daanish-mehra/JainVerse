import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, storyId } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'ElevenLabs API key not configured' },
        { status: 503 }
      );
    }

    // Use an Indian voice ID - Priya is a good Indian English voice
    // You can find other Indian voices at https://elevenlabs.io/voice-library
    const voiceId = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM"; // Rachel - Indian English
    
    // For Indian voices, you might want to use: "pNInz6obpgDQGcFmaJgB" (Adam - can do Indian accent)
    // Or search for Indian voices in their library

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text: text.substring(0, 5000), // Limit to 5000 characters per request
          model_id: 'eleven_multilingual_v2', // Supports multiple languages including Hindi
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('ElevenLabs API error:', errorText);
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      const audioBuffer = await response.arrayBuffer();
      const audioBase64 = Buffer.from(audioBuffer).toString('base64');

      return NextResponse.json({
        success: true,
        audio: `data:audio/mpeg;base64,${audioBase64}`,
        storyId,
      });
    } catch (error) {
      console.error('ElevenLabs narration error:', error);
      return NextResponse.json(
        {
          error: 'Failed to generate narration',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Narrate API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

