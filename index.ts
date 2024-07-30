import {
    BedrockAgentRuntimeClient,
    RetrieveAndGenerateType,
    RetrieveAndGenerateCommand,
    RetrieveAndGenerateCommandInput
} from "@aws-sdk/client-bedrock-agent-runtime"

import express from "express";
const app = express();

const port = 3000

app.get('/bedrock', async (req, res) => {
    const answer = await ragBedrockKnowledgeBase(req.query.sessionId ? req.query.sessionId.toString() : null , "COWIWU1SJ3", req.query.query ? req.query.query.toString() : null);
    res.send(answer)
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})

const region = "us-east-1";
const credentials = {
    accessKeyId: process.env.accessKeyId as string,
    secretAccessKey: process.env.secretAccessKey as string
}

export const ragBedrockKnowledgeBase = async (sessionId: string | null, knowledgeBaseId: string, query: string | null) => {
    console.log(`sessionId ${sessionId} query ${query}`)
    const client = new BedrockAgentRuntimeClient({ region, credentials });
    const input: RetrieveAndGenerateCommandInput = {
        input: { text: `"\n\nHuman:${query}\n\nAssistant:"` }, // user question
        retrieveAndGenerateConfiguration: {
            type: RetrieveAndGenerateType.KNOWLEDGE_BASE,
            knowledgeBaseConfiguration: {
                knowledgeBaseId: knowledgeBaseId,
                //your existing KnowledgeBase in the same region/ account
                // Arn of a Bedrock model, in this case we jump to claude 2.1, the latest. Feel free to use another
                modelArn: "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-v2:1", // Arn of a Bedrock model
            },
        }
    }

    if (sessionId && sessionId != "") {
        input.sessionId = sessionId
    }

    const command = new RetrieveAndGenerateCommand(input);

    const response = await client.send(command)
    return response
}