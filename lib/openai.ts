import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
});

export interface ContractPrompt {
    vendorType: 'photographer' | 'caterer' | 'florist';
    clientName: string;
    eventDate: string;
    venue: string;
    servicePackage: string;
    amount: number;
    section?: string;
    vendorName?: string;
}

export async function generateContractContent(prompt: ContractPrompt): Promise<string> {
    const systemPrompt = `You are a professional contract writer specializing in wedding vendor contracts. Generate professional, legally-appropriate contract content in clean HTML format. Be specific to the vendor type and include relevant clauses.

    IMPORTANT: Return only clean HTML content without any markdown such as \`\`\`\ html (strictly avoid that) . Use proper HTML tags like <h2>, <p>, <ul>, <li>, <strong>, etc. Do not include any markdown syntax like # or *.`;

    const userPrompt = `Generate a professional wedding contract for a ${prompt.vendorType} with these details:
        - Client: ${prompt.clientName}
        - Event Date: ${prompt.eventDate}
        - Venue: ${prompt.venue}
        - Service: ${prompt.servicePackage}
        - Amount: $${prompt.amount}
        - Vendor/Provider Name: ${prompt.vendorName}

        ${prompt.section ? `Focus specifically on the ${prompt.section} section.` : 'Include all standard sections: payment terms, services provided, cancellation policy, and vendor-specific clauses.'}
        
        Remember:
        - NO signature sections or signature lines (the sign will be handled separately)
        - Put date of today that is ${new Date(Date.now()).toLocaleDateString()}
        - NO tables or complex formatting
        - Use simple HTML tags only
        - Make it professional and comprehensive

        Format the output in clean HTML with proper heading tags (<h2>), paragraphs (<p>), and bullet points (<ul><li>). Make it professional and comprehensive. Don't use too many whitespaces in between lines.`;

    try {
        const completion = await openai.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            model: 'openai/gpt-oss-120b',
            max_tokens: 8000,
            temperature: 0.5,
        });

        return completion.choices[0]?.message?.content || '';
    } catch (error) {
        console.error('OpenAI API Error:', error);
        return getFallbackContent(prompt.vendorType);
    }
}

function getFallbackContent(vendorType: string): string {
    const fallbacks = {
        photographer: `<h2>Photography Services Agreement</h2>
            <h3>Services Provided</h3>
            <ul>
            <li>Wedding day photography coverage (8 hours)</li>
            <li>Edited high-resolution images</li>
            <li>Online gallery delivery</li>
            <li>Professional editing and color correction</li>
            </ul>

            <h3>Payment Terms</h3>
            <ul>
            <li>50% deposit required to secure date</li>
            <li>Remaining balance due 30 days before event</li>
            <li>Late payments subject to 1.5% monthly service charge</li>
            </ul>

            <h3>Cancellation Policy</h3>
            <ul>
            <li>Full refund if cancelled 90+ days before event</li>
            <li>50% refund if cancelled 30-89 days before event</li>
            <li>No refund if cancelled within 30 days of event</li>
            </ul>`,

        caterer: `<h2>Catering Services Agreement</h2>

            <h3>Services Provided</h3>
            <ul>
            <li>Menu preparation and service</li>
            <li>Professional wait staff</li>
            <li>Setup and cleanup</li>
            <li>All necessary serving equipment</li>
            </ul>

            <h3>Payment Terms</h3>
            <ul>
            <li>25% deposit required to secure date</li>
            <li>Final guest count due 7 days before event</li>
            <li>Final payment due day of event</li>
            </ul>

            <h3>Cancellation Policy</h3>
            <ul>
            <li>Full refund if cancelled 60+ days before event</li>
            <li>50% refund if cancelled 30-59 days before event</li>
            <li>25% refund if cancelled within 30 days</li>
            </ul>`,

        florist: `<h2>Floral Services Agreement</h2>

            <h3>Services Provided</h3>
            <ul>
            <li>Bridal bouquet and boutonnieres</li>
            <li>Ceremony and reception arrangements</li>
            <li>Setup and delivery</li>
            <li>Fresh, high-quality flowers</li>
            </ul>

            <h3>Payment Terms</h3>
            <ul>
            <li>50% deposit required to secure date</li>
            <li>Remaining balance due 14 days before event</li>
            <li>Credit card payments accepted</li>
            </ul>

            <h3>Cancellation Policy</h3>
            <ul>
            <li>Full refund if cancelled 30+ days before event</li>
            <li>25% refund if cancelled 14-29 days before event</li>
            <li>No refund if cancelled within 14 days</li>
            </ul>`
    };

    return fallbacks[vendorType as keyof typeof fallbacks] || fallbacks.photographer;
}