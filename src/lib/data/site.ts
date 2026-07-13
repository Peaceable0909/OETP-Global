export const site = {
  name: "Competence & Business Services",
  shortName: "Competence",
  tagline: "Your Journey. Our Expertise.",
  description:
    "We connect ambitious students and professionals to world-class education and global opportunities — with honest, end-to-end support from application to arrival.",
  // TODO: replace with the real company contacts once the domain email + WhatsApp line exist
  whatsapp: "https://wa.me/2340000000000",
  telegram: "https://t.me/competencebot",
  email: "info@competence.example",
  address: "Lagos, Nigeria",
};

export const stats = [
  { value: 6, suffix: "+", label: "Destinations" },
  { value: 98, suffix: "%", label: "Visa Success Rate" },
  { value: 2500, suffix: "+", label: "Students Guided" },
  { value: 50, suffix: "+", label: "Partner Institutions" },
];

export const services = [
  { icon: "🎓", title: "Admission Processing", desc: "We secure your admission letter from trusted partner institutions.", free: true },
  { icon: "🛂", title: "Visa Assistance", desc: "End-to-end guidance through every step of the visa process.", free: false },
  { icon: "📄", title: "Document Review", desc: "We check your documents before submission so nothing gets rejected.", free: true },
  { icon: "🧭", title: "Career Counseling", desc: "Honest advice on which destination and program fits your goals.", free: true },
  { icon: "🏫", title: "University Placement", desc: "Matched to institutions where your profile is strongest.", free: false },
  { icon: "💰", title: "Scholarship Guidance", desc: "We flag every waiver and scholarship you qualify for.", free: true },
  { icon: "🗣️", title: "Interview Preparation", desc: "Mock interviews and coaching for admission and visa interviews.", free: false },
  { icon: "🛬", title: "Post-Arrival Support", desc: "Accommodation, orientation and settling-in help after you land.", free: false },
];

export const journey = [
  { step: "01", title: "Apply", desc: "Fill the form and upload your documents. You get an Application ID instantly." },
  { step: "02", title: "Assessment", desc: "A counselor reviews your profile and recommends your best-fit destination — free." },
  { step: "03", title: "Admission", desc: "We process your admission with the institution and secure your offer letter." },
  { step: "04", title: "Visa", desc: "Guided document prep and submission. We're transparent about which services are paid." },
  { step: "05", title: "Fly", desc: "Pre-departure briefing, arrival support, and help settling in." },
];

export const testimonials = [
  { name: "Chinedu O.", destination: "Cyprus 🇨🇾", text: "From application to visa in 6 weeks. They told me exactly what was free and what I was paying for — no surprises." },
  { name: "Aisha B.", destination: "Albania 🇦🇱", text: "The culinary program changed my life. Morning classes, afternoon work — I was earning within my first month." },
  { name: "Tunde A.", destination: "Malaysia 🇲🇾", text: "I didn't have IELTS and thought it was over. They found me a pathway program and I'm now in year two of my degree." },
  { name: "Blessing E.", destination: "Cyprus 🇨🇾", text: "My documents were rejected twice with another agent. Competence reviewed everything first and my visa came through." },
  { name: "Ibrahim S.", destination: "Cambodia 🇰🇭", text: "Fast admission, honest advice, real support after arrival. I recommend them to everyone back home." },
];

export const faqs = [
  { q: "How long does admission take?", a: "It depends on the destination — Cambodia can take as little as 2 weeks, Cyprus and Malaysia typically 4–6 weeks. Your counselor gives you a realistic timeline upfront." },
  { q: "Can I work while studying?", a: "In most of our destinations, yes. Albania's culinary program is specifically designed with morning-only classes so you can work. Cyprus and Malaysia permit part-time student work." },
  { q: "How much is tuition?", a: "From €2,800/year in Albania and $2,500/year in Cambodia up to €3,200+/year in Cyprus. Every destination page lists real figures, and we help you budget for living costs too." },
  { q: "What documents do I need?", a: "At minimum: an international passport, your secondary school certificate, transcripts, and passport photographs. Some programs also want a CV. Our form lets you upload everything in one place." },
  { q: "Can I travel with my family?", a: "Generally not during studies. In Albania, family reunification becomes possible once you secure employment after your program. We'll advise you honestly per destination." },
  { q: "Do I need IELTS?", a: "Not always. Several partner institutions accept alternative proof of English or internal tests. Tell us your situation and we'll match you to programs that fit." },
  { q: "How much are your service charges?", a: "We're transparent: assessment, counseling, document review and scholarship guidance are free. Visa processing support and some placement services are paid — you'll see exact fees before committing to anything." },
  { q: "What happens after I submit my application?", a: "You instantly receive an Application ID. A counselor contacts you within 24–48 hours on WhatsApp or email to review your profile and plan next steps." },
];

export const generateApplicationIdHint = "CBS-######";
