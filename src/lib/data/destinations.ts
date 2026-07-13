export type Destination = {
  slug: string;
  name: string;
  flag: string;
  tagline: string;
  heroGradient: string;
  accent: string;
  summary: string;
  capital: string;
  language: string;
  currency: string;
  intakeMonths: string;
  visaProcessing: string;
  programLength: string;
  tuitionFrom: string;
  workRights: string;
  featured: boolean;
  highlights: string[];
  programs: { name: string; length: string; note: string }[];
  visaSteps: { title: string; detail: string }[];
  requirements: string[];
  documents: string[];
  faqs: { q: string; a: string }[];
};

export const destinations: Destination[] = [
  {
    slug: "albania",
    name: "Albania",
    flag: "🇦🇱",
    tagline: "One-Year Culinary Program",
    heroGradient: "from-red-700 via-red-600 to-rose-500",
    accent: "#DC2626",
    summary:
      "Albania's one-year culinary program is our hottest offer: no age limit, morning-only classes so you have the whole afternoon to work, job support after graduation, and a clear pathway to bring your family once you secure employment.",
    capital: "Tirana",
    language: "Albanian (programs taught in English)",
    currency: "Euro (€) accepted widely",
    intakeMonths: "Jan, May, Sep",
    visaProcessing: "2 – 4 weeks",
    programLength: "1 year",
    tuitionFrom: "€2,800 / year",
    workRights: "Work while you study — classes are mornings only",
    featured: true,
    highlights: [
      "No age requirement — anyone can apply",
      "Short 1-year program",
      "Morning classes only, afternoons free to work",
      "Job placement support after graduation",
      "Bring family members once you secure work (after studies)",
      "Admissions currently open",
    ],
    programs: [
      { name: "Culinary Arts", length: "1 year", note: "Hands-on professional kitchen training" },
      { name: "Pastry & Baking", length: "1 year", note: "Specialization track" },
      { name: "Food & Beverage Management", length: "1 year", note: "Hospitality-focused" },
    ],
    visaSteps: [
      { title: "Apply online", detail: "Fill our application form and upload your documents." },
      { title: "Admission letter", detail: "We process your admission with the culinary school." },
      { title: "Visa application", detail: "We guide you through the straightforward Albanian student visa." },
      { title: "Fly to Tirana", detail: "Arrival support, accommodation guidance and orientation." },
    ],
    requirements: [
      "No age limit",
      "Secondary school completion",
      "Basic English communication",
      "Valid international passport",
    ],
    documents: ["International passport", "Secondary school certificate", "Passport photograph", "CV / Resume"],
    faqs: [
      { q: "Is there an age limit?", a: "No. The Albania culinary program has no age requirement — this is one of its biggest advantages." },
      { q: "Can I work while studying?", a: "Yes. Classes run in the mornings only, leaving your afternoons and evenings free to work." },
      { q: "Can my family join me?", a: "Family reunification is possible once you secure employment after your studies — not during the study period." },
      { q: "How long is the program?", a: "Just one year, after which you receive an internationally recognized certificate and job placement support." },
    ],
  },
  {
    slug: "cyprus",
    name: "Cyprus",
    flag: "🇨🇾",
    tagline: "Straightforward Visa, EU-Standard Education",
    heroGradient: "from-sky-700 via-sky-600 to-cyan-500",
    accent: "#0284C7",
    summary:
      "Cyprus combines a genuinely straightforward student visa process with EU-standard education, English-taught programs, and the right to work while you study — one of the most reliable routes for African students.",
    capital: "Nicosia",
    language: "Greek / English-taught programs",
    currency: "Euro (€)",
    intakeMonths: "Feb, Jun, Oct",
    visaProcessing: "4 – 6 weeks",
    programLength: "1 – 4 years",
    tuitionFrom: "€3,200 / year",
    workRights: "Part-time work permitted for students",
    featured: true,
    highlights: [
      "Visa process is straightforward with high success rates",
      "English-taught programs",
      "Work while you study",
      "EU-standard education and lifestyle",
      "Admissions currently open",
    ],
    programs: [
      { name: "Nursing & Health Sciences", length: "3 – 4 years", note: "High demand pathway" },
      { name: "Business Administration", length: "3 – 4 years", note: "Bachelor & Masters" },
      { name: "Hospitality & Tourism", length: "2 – 3 years", note: "Strong local industry" },
      { name: "Foundation / Pathway", length: "1 year", note: "Entry route without IELTS" },
    ],
    visaSteps: [
      { title: "Apply online", detail: "Submit the application form with your academic documents." },
      { title: "University admission", detail: "We secure your admission letter from a partner institution." },
      { title: "Visa processing", detail: "Document guidance and embassy submission support end-to-end." },
      { title: "Travel & arrival", detail: "Pre-departure briefing and arrival support in Cyprus." },
    ],
    requirements: [
      "Secondary school certificate (WAEC/NECO accepted)",
      "Valid international passport",
      "English proficiency (IELTS not always required)",
      "Proof of funds guidance provided",
    ],
    documents: ["International passport", "Academic certificates", "Transcripts", "Passport photograph", "CV / Resume"],
    faqs: [
      { q: "Do I need IELTS?", a: "Not always — many partner institutions accept alternative proof of English or an internal test. We advise you based on your profile." },
      { q: "Can I work while studying?", a: "Yes, students can work part-time in permitted sectors." },
      { q: "How long does the visa take?", a: "Typically 4–6 weeks once your documents are complete." },
    ],
  },
  {
    slug: "malaysia",
    name: "Malaysia",
    flag: "🇲🇾",
    tagline: "Affordable, English-Taught, Post-Study Options",
    heroGradient: "from-indigo-700 via-blue-600 to-sky-500",
    accent: "#4F46E5",
    summary:
      "Malaysia offers globally ranked universities at a fraction of Western costs, fully English-taught programs, a large international student community, and post-study work options.",
    capital: "Kuala Lumpur",
    language: "Malay / English-taught programs",
    currency: "Ringgit (RM)",
    intakeMonths: "Jan, May, Sep",
    visaProcessing: "3 – 6 weeks",
    programLength: "1 – 4 years",
    tuitionFrom: "$2,800 / year",
    workRights: "Part-time work during semester breaks",
    featured: true,
    highlights: [
      "Affordable tuition and living costs",
      "English is widely spoken",
      "Globally ranked universities",
      "Post-study work options",
      "Large African student community",
    ],
    programs: [
      { name: "Business & Management", length: "3 years", note: "Bachelor & Masters" },
      { name: "Information Technology", length: "3 years", note: "Strong tech job market" },
      { name: "Engineering", length: "4 years", note: "Internationally accredited" },
      { name: "Foundation Programs", length: "1 year", note: "Pathway to degree" },
    ],
    visaSteps: [
      { title: "Apply online", detail: "Submit your application and academic documents." },
      { title: "University offer", detail: "We obtain your offer letter and EMGS approval." },
      { title: "Visa approval letter", detail: "Student pass processed before you travel." },
      { title: "Fly to Malaysia", detail: "Airport clearance and arrival support." },
    ],
    requirements: [
      "Secondary school certificate",
      "Valid international passport",
      "Academic transcripts",
      "English proficiency (flexible options)",
    ],
    documents: ["International passport", "Academic certificates", "Transcripts", "Passport photograph"],
    faqs: [
      { q: "Is Malaysia affordable?", a: "Yes — tuition and living costs are among the lowest for the quality of education offered." },
      { q: "Are programs in English?", a: "Yes, international programs are fully English-taught." },
    ],
  },
  {
    slug: "cambodia",
    name: "Cambodia",
    flag: "🇰🇭",
    tagline: "Fast Admissions, Emerging Opportunity",
    heroGradient: "from-violet-700 via-purple-600 to-fuchsia-500",
    accent: "#7C3AED",
    summary:
      "Cambodia is an emerging destination with fast admissions, low costs, English-taught programs and a growing economy full of opportunity in hospitality and business.",
    capital: "Phnom Penh",
    language: "Khmer / English-taught programs",
    currency: "US Dollar ($) widely used",
    intakeMonths: "Rolling admissions",
    visaProcessing: "2 – 4 weeks",
    programLength: "1 – 4 years",
    tuitionFrom: "$2,500 / year",
    workRights: "Work opportunities available",
    featured: true,
    highlights: [
      "Fast, simple admissions",
      "English-taught programs",
      "Very low living costs",
      "US Dollar economy",
      "Growing hospitality and business sectors",
    ],
    programs: [
      { name: "Hospitality Management", length: "2 – 3 years", note: "Booming tourism sector" },
      { name: "Business Administration", length: "3 years", note: "English-taught" },
      { name: "International Relations", length: "3 years", note: "Regional hub" },
    ],
    visaSteps: [
      { title: "Apply online", detail: "Simple application with basic documents." },
      { title: "Admission letter", detail: "Fast processing with partner institutions." },
      { title: "Visa on arrival / e-visa", detail: "One of the simplest visa routes available." },
      { title: "Arrival support", detail: "Accommodation and orientation assistance." },
    ],
    requirements: ["Secondary school certificate", "Valid international passport", "Basic English"],
    documents: ["International passport", "Academic certificates", "Passport photograph"],
    faqs: [
      { q: "How fast is admission?", a: "Cambodia has rolling admissions — processing can complete in as little as 2 weeks." },
      { q: "Is it affordable?", a: "Yes, both tuition and living costs are very low, and the economy uses US dollars." },
    ],
  },
  {
    slug: "algeria",
    name: "Algeria",
    flag: "🇩🇿",
    tagline: "Quality Education Close to Home",
    heroGradient: "from-emerald-700 via-green-600 to-teal-500",
    accent: "#059669",
    summary:
      "Algeria offers affordable, quality education within Africa — shorter travel, lower costs, and straightforward admission for students seeking French- and Arabic-language programs plus growing English options.",
    capital: "Algiers",
    language: "Arabic / French / some English programs",
    currency: "Algerian Dinar (DZD)",
    intakeMonths: "Sep, Feb",
    visaProcessing: "3 – 5 weeks",
    programLength: "1 – 5 years",
    tuitionFrom: "Very low tuition",
    workRights: "Limited student work permitted",
    featured: false,
    highlights: [
      "Close to home — short travel from West Africa",
      "Very affordable tuition",
      "Straightforward admission",
      "Rich academic tradition",
    ],
    programs: [
      { name: "Medicine & Pharmacy", length: "5 – 7 years", note: "Renowned faculties" },
      { name: "Engineering", length: "4 – 5 years", note: "Strong technical schools" },
      { name: "Languages & Humanities", length: "3 years", note: "French/Arabic immersion" },
    ],
    visaSteps: [
      { title: "Apply online", detail: "Submit your application and academic records." },
      { title: "Admission processing", detail: "We work with partner institutions on your placement." },
      { title: "Visa support", detail: "Full guidance through the Algerian student visa." },
      { title: "Arrival", detail: "Orientation and settling-in support." },
    ],
    requirements: ["Secondary school certificate", "Valid international passport", "French or Arabic is an advantage"],
    documents: ["International passport", "Academic certificates", "Transcripts", "Passport photograph"],
    faqs: [
      { q: "Do I need French?", a: "Many programs are in French or Arabic, but English-taught options are growing. We match you to the right program." },
    ],
  },
  {
    slug: "maldives",
    name: "Maldives",
    flag: "🇲🇻",
    tagline: "Study Hospitality in Paradise",
    heroGradient: "from-cyan-600 via-teal-500 to-emerald-400",
    accent: "#0D9488",
    summary:
      "The Maldives is the world's most famous tourism economy — study hospitality and tourism where the industry actually happens, with strong internship and job pathways in world-class resorts.",
    capital: "Malé",
    language: "Dhivehi / English widely used",
    currency: "Rufiyaa (MVR) / USD accepted",
    intakeMonths: "Jan, Jul",
    visaProcessing: "2 – 4 weeks",
    programLength: "1 – 3 years",
    tuitionFrom: "$3,000 / year",
    workRights: "Resort internships integrated into study",
    featured: false,
    highlights: [
      "World-leading tourism industry on your doorstep",
      "Resort internships built into programs",
      "English widely spoken",
      "Direct pathway into hospitality careers",
    ],
    programs: [
      { name: "Hospitality & Tourism Management", length: "2 – 3 years", note: "Resort partnerships" },
      { name: "Culinary & F&B Service", length: "1 – 2 years", note: "Work in 5-star kitchens" },
    ],
    visaSteps: [
      { title: "Apply online", detail: "Submit your application and documents." },
      { title: "Admission & sponsor", detail: "We arrange your institutional sponsorship." },
      { title: "Student visa", detail: "Simple processing with our guidance." },
      { title: "Arrival", detail: "Meet-and-greet plus accommodation support." },
    ],
    requirements: ["Secondary school certificate", "Valid international passport", "Basic English"],
    documents: ["International passport", "Academic certificates", "Passport photograph", "CV / Resume"],
    faqs: [
      { q: "Can I work in resorts while studying?", a: "Internships in partner resorts are integrated into most hospitality programs — you gain real experience as you study." },
    ],
  },
];

export const featuredDestinations = destinations.filter((d) => d.featured);
export const getDestination = (slug: string) => destinations.find((d) => d.slug === slug);
