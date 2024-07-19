import { ActionResult } from '@baik/types';
import { OpenAI } from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const translate = async ({
  text,
  language,
  option,
}: {
  text: string;
  language: string;
  option?: string;
}): Promise<ActionResult> => {
  try {
    const prompt = text;

    const systemMessages: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `You will be provided with a sentence in Korean, and your task is to translate it into ${language}.`,
      },
      {
        role: 'system',
        content: `If it's text in Markdown format, translate it without breaking the formatting`,
      },
    ];
    if (option) systemMessages.push({ role: 'system', content: option });

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [...systemMessages, { role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 1,
    });

    const translatedText = completion.choices[0].message.content;

    return {
      data: { item: translatedText, success: true },
      message: 'Successfully translated text',
    };
  } catch (error) {
    return {
      message: 'Failed to translate text',
      error: {
        code: 'UTILS>TRANSLATE_ERROR',
        message: error instanceof Error ? error.message : String(error),
      },
    };
  }
};

export default {
  translate: {
    run: translate,
    skip_auth: false,
  },
};
