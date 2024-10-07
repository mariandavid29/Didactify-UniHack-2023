const { VertexAI } = require("@google-cloud/vertexai");

// Initialize Vertex with your Cloud project and location
const vertex_ai = new VertexAI({
  project: "elegant-folder-423114-c8",
  location: "europe-central2",
});
const model = "gemini-1.5-pro-preview-0409";

// Instantiate the models
const generativeModel = vertex_ai.preview.getGenerativeModel({
  model: model,
  generationConfig: {
    maxOutputTokens: 8192,
    temperature: 1,
    topP: 0.95,
  },
  safetySettings: [
    {
      category: "HARM_CATEGORY_HATE_SPEECH",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
      category: "HARM_CATEGORY_DANGEROUS_CONTENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
      category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
      category: "HARM_CATEGORY_HARASSMENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
  ],
});

const pattern = new RegExp("\\{[^{}]*\\}", "g");

export async function generateContent(baseText, input, questions) {
  try {
    const inputText = {
      text: `${input}`,
    };

    const req = {
      contents: [{ role: "user", parts: [baseText, inputText] }],
    };

    const res = await generativeModel.generateContent(req);
    const resText = res.response.candidates[0].content.parts[0].text;
    const matches = resText.match(pattern);
    if (!matches || matches.length <= 0) {
      throw new Error("JSON error");
    }

    const question1 = JSON.parse(matches[0]);
    const question2 = JSON.parse(matches[1]);

    return [question1.text, question2.text];
  } catch (error) {
    console.log(error);
  }
}

export async function generateContentSummary(baseText, input) {
  try {
    const inputText = {
      text: `${input}`,
    };

    const req = {
      contents: [{ role: "user", parts: [baseText, inputText] }],
    };

    const res = await generativeModel.generateContent(req);
    const resText = res.response.candidates[0].content.parts[0].text;
    const matches = resText.match(pattern);
    if (!matches || matches.length <= 0) {
      throw new Error("JSON error");
    }

    const summary = JSON.parse(matches[0]);
    return summary;
  } catch (error) {
    console.log(error);
  }
}

export async function generateContentWithQuestions(baseText, input, questions) {
  try {
    const inputText = {
      text: `This is the topic: ${input}`,
    };

    const questionsText = {
      text: `To give you more context, so you can create a better and more tailored roadmap use this vector of questions and answers to better understand the needs of the user: 
      ${questions.toString()}`,
    };

    const req = {
      contents: [{ role: "user", parts: [baseText, inputText, questionsText] }],
    };

    const res = await generativeModel.generateContent(req);
    const resText = res.response.candidates[0].content.parts[0].text;

    console.log(resText);
    const matches = resText.slice(7, -3);

    const r1 = JSON.parse(matches);

    return [r1.unit1, r1.unit2];
  } catch (error) {
    console.log(error);
  }
}

export async function generateContentWithMC(baseText, title, summary) {
  try {
    const summaryText = {
      text: `This is the transcript: ${summary}`,
    };

    const titleText = {
      text: `This is the title of the lesson: ${title}`,
    };

    const req = {
      contents: [{ role: "user", parts: [baseText, summaryText, titleText] }],
    };

    const res = await generativeModel.generateContent(req);
    const resText = res.response.candidates[0].content.parts[0].text;

    const matches = resText.slice(7, -3);

    const r1 = JSON.parse(matches);
    return r1;
  } catch (error) {
    console.log(error);
  }
}
