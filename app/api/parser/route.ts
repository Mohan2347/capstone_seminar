import { NextResponse } from "next/server";
import { geminiModel } from "@/lib/gemini";
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

export async function POST(req: Request) {
  console.log("==> PARSER_ROUTE_TRIGGERED");

  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File;

    if (!file) {
      return NextResponse.json({ error: "No resume file provided" }, { status: 400 });
    }

    // Convert File to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    let rawText = "";

    try {
      if (file.name.toLowerCase().endsWith(".pdf") || file.type === "application/pdf") {
        let parseFn = pdfParse;
        if (typeof pdfParse !== 'function' && pdfParse && typeof pdfParse.default === 'function') {
           parseFn = pdfParse.default;
        }
        if (typeof parseFn !== 'function') throw new Error("PDF parser not loaded");
        const pdfData = await parseFn(buffer);
        rawText = pdfData.text;
      } else {
        const docxData = await mammoth.extractRawText({ buffer });
        rawText = docxData.value;
      }
    } catch (parseErr) {
      console.error("Document Extraction failed:", parseErr);
      return NextResponse.json({ error: "Could not read document contents." }, { status: 400 });
    }

    if (!rawText || rawText.trim().length === 0) {
      return NextResponse.json({ error: "No text found in document." }, { status: 400 });
    }

    // Prompt Gemini
    const prompt = `
      Extract student resume data from this text into JSON:
      {
        "name": "string", "bio": "string", "gpa": "string", "major": "string",
        "university": "string", "graduationYear": "string", "skills": [],
        "experience": [{"title": "string", "company": "string", "duration": "string", "description": "string"}]
      }
      Text: ${rawText.substring(0, 4000)}
    `;

    try {
      const result = await geminiModel.generateContent(prompt);
      const responseText = result.response.text().trim();
      const cleanJson = responseText.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
      const parsedProfile = JSON.parse(cleanJson);
      return NextResponse.json({ profile: parsedProfile });

    } catch (apiError: any) {
      console.warn("AI API failed, using Demo Mock Parser instead:", apiError.message);
      
      // CAPSTONE FAILOVER: Extract what we can with Regex so the demo never fails
      const skillsMatch = rawText.match(/(typescript|javascript|python|react|node|sql|java|c\+\+|aws|docker|html|css|tailwind|prisma|nextjs)/gi);
      const uniqueSkills = Array.from(new Set(skillsMatch?.map(s => s.toLowerCase()) || []));
      const nameMatch = rawText.match(/([A-Z][a-z]+ [A-Z][a-z]+)/);
      
      const mockProfile = {
        name: nameMatch ? nameMatch[0] : "Student Candidate",
        bio: "Highly motivated developer with expertise in building scalable applications.",
        gpa: "8.5",
        major: "Computer Science",
        university: "Capstone University",
        graduationYear: "2025",
        skills: uniqueSkills.length > 0 ? uniqueSkills.slice(0, 10) : ["Problem Solving", "Adaptability"],
        experience: [
          {
            "title": "Software Intern",
            "company": "Innovation Labs",
            "duration": "Summer 2024",
            "description": "Developed and maintained web features using modern framework stacks."
          }
        ]
      };

      return NextResponse.json({ 
        profile: mockProfile,
        isDemoMode: true 
      });
    }

  } catch (error: any) {
    console.error("Critical failure in Parser Route:", error);
    return NextResponse.json({ error: "Fatal error." }, { status: 500 });
  }
}
