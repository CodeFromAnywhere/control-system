import { textToText } from "ai-models";
import { RecordingType } from "ai-types";
import { transcriptionToGptChunks } from "ai-chunking";
export const CHUNK_TOKEN_SIZE = 2048;

/**
 Function that uses AI (LLM's mostly) that tries to determine the recording type from a transcription from an audio.

 Uses `Transcription` file, then chunks the english text, and tries to determine the type as efficiently as possible.
 */

export const getRecordingType = async (
  absoluteTranscriptionFilePath: string,
): Promise<RecordingType> => {
  const chunks = await transcriptionToGptChunks(
    absoluteTranscriptionFilePath,
    CHUNK_TOKEN_SIZE,
  );
  if (!chunks) return "unknown";
  if (chunks.length > 4) {
    // might be book
    const audiobookPromptResult = await textToText({
      text: `Does this text seem to be a transcription of an audiobook?

      ---
      ${chunks[0]}
      ---
      
      Respond with "true" if it does, "false" otherwise.
      `,
    });
    if (audiobookPromptResult.chatResponse?.trim() === "true") {
      return "audiobook";
    }
  }

  const musicPromptResult = await textToText({
    text: `Does this text seem to be a transcription of music?

    ---
    ${chunks[0]}
    ---
    
    Respond with "true" if it does, "false" otherwise.
    `,
  });
  if (musicPromptResult.chatResponse?.trim() === "true") {
    return "music";
  }

  const firstDetectedRecordingType = await chunks.reduce(
    async (previous, chunk) => {
      const promisedPrevious = await previous;
      // already determined, don't do more stuff
      if (promisedPrevious !== "unknown") return promisedPrevious;

      const prompt = `Consider this transcript, and classify it into one of the following: "conversation", "monologue", "voicemail", "code", "unknown", "other". \n\n\n ---\n${chunk}\n---\nIf you don't know for sure, reply with "unknown". Reply with only the word of the classification.`;

      const promptResult = (await textToText({ text: prompt })).chatResponse;

      if (!promptResult) return promisedPrevious;

      if (promptResult.includes("conversation")) return "conversation";
      if (promptResult.includes("monologue")) return "monologue";
      if (promptResult.includes("code")) return "code";
      if (promptResult.includes("voicemail")) return "voicemail";
      if (promptResult.includes("other")) return "other";

      return "unknown";
    },
    new Promise((resolve) => resolve("unknown")) as Promise<RecordingType>,
  );

  return firstDetectedRecordingType;
};
