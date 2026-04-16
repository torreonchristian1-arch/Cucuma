// pages/api/ai/generate.js
// Server-side Claude API call - keeps API key secure

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { type, brandName, tagline, product, style, finish, layout, font, primary, secondary, accent, mockupStyle } = req.body;

  let prompt = "";

  if (type === "mockup") {
    prompt = `You are a luxury product mockup designer. Generate a mockup description for:
Brand: ${brandName}, Product: ${product}, Label Style: ${style}, Finish: ${finish}, Layout: ${layout}, Font: ${font}, Primary Color: ${primary}, Scene: ${mockupStyle}

Respond ONLY with valid JSON, no markdown, no extra text:
{"description":"2 sentence vivid product mockup description","ideogramPrompt":"detailed photorealistic product mockup prompt for Ideogram AI, luxury beauty photography style, ${product} bottle with ${brandName} label in ${primary} color scheme, ${mockupStyle} background, professional studio lighting, high end beauty brand","retailPrice":49.99,"wholesalePrice":22.99,"margin":54}`;
  } else if (type === "catalogue") {
    prompt = `You are a luxury beauty brand copywriter for ${brandName}. Write product content for: ${product}

Respond ONLY with valid JSON, no markdown, no extra text:
{"title":"${brandName} ${product}","shortDesc":"compelling one liner under 10 words","fullDesc":"2-3 sentence Shopify product description","keyBenefits":["benefit 1","benefit 2","benefit 3","benefit 4"],"ingredients":["key ingredient 1","key ingredient 2","key ingredient 3"],"suggestedRetailPrice":49.99,"wholesaleCost":22.99,"profitMargin":54,"tags":["skincare","beauty","luxury","private-label","${product.toLowerCase().replace(/ /g,'-')}"],"seoTitle":"SEO title under 60 chars","seoDescription":"SEO meta description under 160 chars"}`;
  } else {
    return res.status(400).json({ error: "Invalid type" });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Anthropic API error:", err);
      return res.status(500).json({ error: "AI generation failed. Please try again." });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || "";

    try {
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      return res.status(200).json(parsed);
    } catch {
      // Return raw text if JSON parsing fails
      return res.status(200).json({
        description: text.slice(0, 300),
        ideogramPrompt: `Luxury ${product} with ${brandName} branding, ${style} label, ${finish} finish, ${mockupStyle} background, photorealistic beauty photography`,
        fullDesc: text.slice(0, 300),
        retailPrice: 49.99,
        wholesalePrice: 22.99,
        suggestedRetailPrice: 49.99,
        wholesaleCost: 22.99,
        margin: 54,
        profitMargin: 54,
      });
    }
  } catch (err) {
    console.error("Generate error:", err);
    return res.status(500).json({ error: "Network error. Please try again." });
  }
}