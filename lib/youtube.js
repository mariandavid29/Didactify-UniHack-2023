import axios from "axios";
import { YoutubeTranscript } from "youtube-transcript";
// import strict_output from "./gpt";

import { generateContentWithMC } from "./gemini";

export async function searchYoutube(searchQuery) {
  searchQuery = encodeURIComponent(searchQuery);
  const { data } = await axios.get(
    `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}&q=${searchQuery}&videoDuration=medium&videoEmbeddable=true&type=video&maxResults=5`,
  );
  if (!data) {
    console.log("youtube fail");
    return null;
  }
  if (data.items[0] == undefined) {
    return null;
  }
  return data.items[0].id.videoId;
}

export async function getTranscript(videoId) {
  try {
    let transcript_arr = await YoutubeTranscript.fetchTranscript(videoId, {
      lang: "en",
      country: "EN",
    });
    let transcript = "";
    for (let t of transcript_arr) {
      transcript += t.text + " ";
    }
    return transcript.replaceAll("\n", "");
  } catch (error) {
    console.log(error);
  }
}

export async function getQuestionsFromTranscript(transcript, course_title) {
  const baseText = {
    text: `You only have one job. You will be given a transcript of an education youtube video and the title of the video and you must generate a hard Multiple Choice Question, with a \"question_text\", 3 possible wrong answers (\"option1\", \"option2\", \"option3\") and a correct \"question_ans\".
    
    Please provide a response in a structured JSON format that matches the following model: 
    {
      \"question\": {
        \"question_text\": \"The text of the question\",
        \"option1\": \"First answer option\",
        \"option2\": \"Second answer option\",
        \"option3\": \"Third answer option\",
        \"question_ans\": \"The correct answer option\"
      }
    }

    Do not use any characters that might brake the JSON format like " inside the JSON object.
`,
  };

  const questions = await generateContentWithMC(
    baseText,
    course_title,
    transcript.text,
  );

  // const questions = await strict_output(
  //   "You are a helpful AI that is able to generate Multiple Choice Question and answers, the length of each answer should not be more than 20 words.BE CONCISE",
  //   new Array(3).fill(
  //     `BE CONCISE. You are to generate a random hard mcq question about ${course_title} with context of the following transcript: ${transcript}.`,
  //   ),
  //   {
  //     question: "question",
  //     answer: "answer with max length of 20 words",
  //     option1: "option1 with max length of 20 words",
  //     option2: "option2 with max length of 20 words",
  //     option3: "option3 with max length of 20 words",
  //   },
  // );
  return [questions];
}
