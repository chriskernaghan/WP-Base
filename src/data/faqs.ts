// faqs.ts — single source of truth for the homepage FAQ.
// Imported by FAQ.astro to render the accordion, and by index.astro to emit
// FAQPage structured data. Keeping one array means the markup and the schema
// can never drift apart, which is the usual way FAQ rich results get pulled.

export interface Faq {
  q: string;
  a: string;
  open?: boolean;
}

export const faqs: Faq[] = [
  {
    q: 'How quickly can you start?',
    a: "Usually within a day or two. I'll run a free health check on your site, walk you through what I find, and if we're a good fit, I can start that same week. No onboarding decks, no kickoff meetings, just straight into the work.",
    open: true,
  },
  {
    q: 'What does the monthly retainer actually include?',
    a: "Every plan covers core, plugin and theme updates, daily backups, uptime monitoring and a monthly report with search stats, plus a set number of support hours each month. Gold and Platinum add things like performance work and security scanning. If something breaks at 9pm on a Tuesday, I'll deal with it. The monthly report lets you see exactly what's been done.",
  },
  {
    q: 'Is SEO included in the care plans?',
    a: "Yes, the technical side of it is. Silver adds search stats to your monthly report, Gold adds Search Console monitoring and fixes for things like indexing errors, broken links and redirects, and Platinum adds a quarterly SEO review. The work comes out of the hours included in your plan. I can't guarantee rankings or position changes, because search results depend on things nobody controls, including Google's algorithm and what your competitors are doing. What I can do is make sure nothing technical is holding your site back and show you the numbers each month.",
  },
  {
    q: 'Am I locked into a contract?',
    a: "No. It's a rolling monthly arrangement, you can cancel any time. I'd rather keep clients because the work speaks for itself, not because of a contract clause.",
  },
  {
    q: 'Do you only work with WordPress sites?',
    a: "WordPress is my specialism, but I've migrated clients from Squarespace, Wix and other platforms. If you're on something else and want to move to WordPress, that's something I can help with too.",
  },
  {
    q: 'What if I need something outside my included hours?',
    a: "No problem, extra work is billed at a straightforward hourly rate and I'll always check with you before going over. No surprise invoices.",
  },
  {
    q: 'Can you help with analytics and tracking?',
    a: "Yes. I set up GA4 and Google Tag Manager for clients regularly, form submissions, phone clicks, CTA tracking, the lot. You'll actually know what's working on your site instead of guessing.",
  },
  {
    q: "I'm not very technical, is that a problem?",
    a: "Not at all. Most of my clients aren't. I explain things in plain English and handle everything on the technical side. You just need to tell me what you need, I'll take care of how.",
  },
  {
    q: "How do I get in touch if something's urgent?",
    a: "Email or phone, whichever's easier. Response time is typically under an hour during working hours, and I keep an eye on things outside of them too. You're not going into a ticket queue.",
  },
];
