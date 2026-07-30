# E-E-A-T Strategy — My Quick Trippers

Google's quality rater guidelines prioritize **Experience, Expertise, Authoritativeness, and Trustworthiness (E-E-A-T)** — especially for YMYL (Your Money or Your Life) sites, which includes travel booking (transactions + safety).

## 1. Experience & Expertise
Google wants to see that real people who know travel are writing the content.

- **Author Profiles:** We changed the Blog schema author from the faceless "Organization" to a named persona ("Rajesh Kumar, MQT India"). 
- **Action Required:** Build a `/team/rajesh-kumar` or `/author/rajesh` page detailing his 10+ years in Indian tourism. Link the blog author schema to this URL.
- **First-hand Evidence:** In blog posts, use phrases like "When our team visited Gulmarg last winter..." rather than generic Wikipedia-style summaries. Include original photos if possible.

## 2. Authoritativeness
Why should Google trust MQT over a generic travel blog?

- **Credentials:** Prominently display the **ISO 9001:2008** certification on the About page and footer.
- **Government Approval:** Highlight "Govt. Approved Tour Operator" with the relevant ministry logo.
- **Media Mentions:** Create an "As Featured In" section if MQT has been mentioned in local news or travel magazines.

## 3. Trustworthiness
The most critical factor for conversion and SEO.

- **Reviews & Testimonials:** The current package schema uses fake review counts. This is dangerous.
  - *Action:* Integrate a real review platform (TrustPilot, Google Reviews API) or collect genuine video testimonials.
- **Transparency:** 
  - Ensure `/about-us` has photos of the real founders/team and the physical office in New Delhi.
  - Ensure `/contact-us` clearly lists the physical address, phone numbers, and company registration details (GST number).
  - Ensure `/terms-and-conditions` and `/privacy-policy` are accessible and robust (currently missing routes).
- **Secure Payment:** When `/pay-online` is built, explicitly state the payment gateway (Razorpay/Stripe) and use security badges (PCI DSS compliant).
