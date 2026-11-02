export const site = {
  name: "Trophy Kiprono",
  tagline: "Speak with Confidence. Lead with Impact.",
  phone: "+254 720 631 906",
  phoneHref: "tel:+254720631906",
  linkedin: "https://www.linkedin.com/in/trophy-kiprono-public-speaking-coach/",
  description:
    "Public speaking, communications and leadership training, executive and life coaching, and books by Trophy Kiprono in Kenya.",
} as const;

export type Service = {
  slug: string;
  title: string;
  description: string;
  topics: string[];
  outcomes: string[];
};

export const services: Service[] = [
  {
    slug: "public-speaking",
    title: "Public Speaking Coaching",
    description: "Find your voice, organise your ideas and communicate with greater confidence in front of an audience.",
    topics: ["Speech structure and storytelling", "Voice, pace and delivery", "Presentation practice", "Managing speaking nerves"],
    outcomes: ["A clearer message", "More intentional delivery", "A practical approach to preparation"],
  },
  {
    slug: "corporate-training",
    title: "Corporate Training",
    description: "Give your team practical tools for clearer communication, professional presence and effective leadership.",
    topics: ["Workplace communication", "Team presentations", "Leadership communication", "Professional presence"],
    outcomes: ["More purposeful conversations", "Shared communication tools", "A development focus tailored to your team"],
  },
  {
    slug: "executive-coaching",
    title: "Executive Coaching",
    description: "Create space to reflect on your leadership, communicate your direction and approach decisions with intention.",
    topics: ["Leadership presence", "Communicating direction", "Professional goals", "Reflective decision-making"],
    outcomes: ["Clearer leadership priorities", "A considered communication style", "Actionable development goals"],
  },
  {
    slug: "life-coaching",
    title: "Life Coaching",
    description: "Explore what matters to you, gain clarity on your next step and build a practical path towards your goals.",
    topics: ["Personal goals and priorities", "Confidence and self-expression", "Navigating change", "Accountability and reflection"],
    outcomes: ["A clearer sense of direction", "Achievable next steps", "Space for personal reflection"],
  },
  {
    slug: "etiquette-soft-skills",
    title: "Etiquette & Soft Skills",
    description: "Approach professional and social situations with confidence, consideration and a stronger sense of presence.",
    topics: ["Professional etiquette", "Interpersonal communication", "Social confidence", "Workplace relationships"],
    outcomes: ["More considered interactions", "Practical professional habits", "Greater awareness of your presence"],
  },
  {
    slug: "english-tutoring",
    title: "Private English Tutoring",
    description: "Develop your spoken and written English through individual support focused on your communication goals.",
    topics: ["Conversational English", "Speaking and pronunciation", "Written communication", "Individual learning goals"],
    outcomes: ["Focused language practice", "Clearer everyday communication", "A learning direction suited to you"],
  },
];

export function getSiteUrl() {
  const configured = process.env.SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");
  return new URL(configured);
}
