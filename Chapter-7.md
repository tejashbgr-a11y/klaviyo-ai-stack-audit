# Chapter 7: Build or Buy

Student work for MKTG 579 at UW Foster. Created for a class. Not affiliated with or endorsed by Klaviyo, Intercom, Zendesk, or Ada.

**To:** Klaviyo CMO  
**From:** Tejash Bagri  
**Date:** November 22, 2026  
**Decision:** Buy a limited Fin pilot; keep public product content, test cases, and approval rules under our control.

## 1. The job

The proposed tool answers basic questions about Klaviyo from approved public product pages. It explains supported features, links to the source, and hands account-specific questions to a person. It must not invent prices, discounts, shipping policies, or performance guarantees. It cannot change an account or send a campaign.

This extends the help-bot exercise in [Chapter 4](https://canvas.uw.edu/courses/1932779/assignments/11866540). The marketing purpose is a more consistent product explanation for people evaluating Klaviyo. Support and product marketing would own the answers and handoffs. Their actual staffing, support volume, and current systems are not public, so this memo does not claim Klaviyo needs a replacement.

For costing, I use a planning case of 1,000 conversations a month, with half resolved by AI and half handled by people. A human conversation takes six minutes. These are assumptions, not Klaviyo operating figures. The same volume and human workload apply to both options.

### Three vendors considered

| Vendor | Public evidence | Decision for this exercise |
|---|---|---|
| [Intercom Fin](https://www.intercom.com/pricing) | A published $0.99 price per service outcome, a helpdesk option, knowledge sources, batch tests, and human handoff. | Take forward for the detailed comparison. The visible price and testing tools make a small pilot easier to specify. |
| [Zendesk AI agents](https://www.zendesk.com/pricing/) | Suite Team is listed at $55 per agent per month on annual billing. Automated-resolution allowances and additional usage charges also matter. | A credible alternative if Zendesk is already the system of record. Obtain a quote at the same volume before making a purchasing decision. Seat price alone is not the AI price. |
| [Ada](https://www.ada.cx/demo/) | Public material describes knowledge, integrations, playbooks, and testing. The pricing route leads to a sales demo rather than a public unit price. | Keep on the shortlist for a larger deployment. Annual price is SILENT on the public page reviewed; do not substitute an invented estimate. |

No paid accounts or vendor trials were opened for this memo.

## 2. Under the hood

| Question | Finding | Sentence, source, and limit |
|---|---|---|
| Whose model is it? | **ANSWERED at provider-family level; VAGUE for the exact deployment.** | “Fin uses OpenAI, Anthropic, Google, and Intercom models, switching automatically to maintain performance.” [Fin trust page](https://fin.ai/trust-reliability). The contract still needs to identify routing, available regional options, and change notifications. Buying Fin does not mean buying one fixed foundation model. |
| Where does our data go? | **VAGUE.** | The [trust page](https://fin.ai/trust-reliability) lists US, EU, and Australian hosting and says third-party providers have contractual training and retention restrictions. That does not establish which region and processor handle every part of our proposed deployment or how long Intercom keeps each type of log. Get that data-flow map before connecting real conversations. |
| Is our business in the context or in the model? | **VAGUE until the training setting is agreed.** | Fin retrieves support content and applies configured guidance. Its [batch-testing guide](https://fin.ai/help/en/articles/13975772-batch-testing) says, “Rating answers does not train Fin directly.” However, the [trust page](https://fin.ai/trust-reliability) also says, “Fin uses anonymized customer data for fine-tuning.” It offers an opt-out. Retrieval of our current pages and use of past conversations for model training are separate processes. Require a written opt-out and verify deletion behavior. |

The proposed pilot uses public Klaviyo pages and synthetic questions only. No employer documents, customer records, credentials, or private conversations should enter the classroom test.

## 3. The seven costs if we buy, for one year

All amounts are USD, before tax. Internal hourly rates are explicit planning assumptions: $40 for support, $50 for content/operations, $75 for engineering, and $100 for a specialist. They are not salary claims about Klaviyo.

The model uses the standard Essential price of $29 per seat per month on annual billing from the [pricing FAQ](https://www.intercom.com/help/en/articles/8344190-pricing-faqs), rather than assuming a promotional discount. Fin's [pricing page](https://www.intercom.com/pricing) supplies the $0.99 service-outcome rate. Some procedures and sales outcomes have different billing rules; the pilot excludes them.

| Cost | Who pays, and calculation | Year 1 |
|---|---|---:|
| 1. The model | Vendor pays its model suppliers. Their cost is bundled into the Fin fee on line 3; no separate model bill to us. | $0 additional |
| 2. Where it runs and files are kept | Vendor supplies hosting and storage within the purchased service. No separate hosting purchase in this planning case. | $0 additional |
| 3. Surrounding software | Company pays 6,000 service outcomes × $0.99 = $5,940, plus one inbox seat × $29 × 12 = $348. | $6,288 |
| 4. People to set it up | Company pays content/operations staff: 20 hours × $50. | $1,000 |
| 5. People to keep it running | Company pays content checks: 4 hours/month × 12 × $50 = $2,400. People still answer 6,000 escalations × 0.1 hour × $40 = $24,000. | $26,400 |
| 6. Skills we do not have | Company budgets an external privacy/security review: 8 hours × $100. Vendor model-engineering skills are included in its fee. | $800 |
| 7. Getting out later | Company pays 8 content/operations hours × $50 to export the source content, document rules, and reconnect the human channel. | $400 |
| **Total** | **Full annual operating cost, including unresolved human conversations.** | **$34,888** |

Lines 4–7 are estimates. A quoted setup price of zero does not make our employees' setup time free. The exit allowance covers a small pilot, not a company-wide helpdesk migration.

## 4. The seven costs if we build, for one year

Build a small retrieval-based assistant around Anthropic's API. Store the approved public pages and source links ourselves, add a browser chat interface, log answers, and route unresolved questions to the same human inbox.

For the model estimate, use [Haiku 5.5's published short-context rates](https://claude.com/pricing): $0.10 per million input tokens and $0.50 per million output tokens. Assume two calls per conversation, each with 3,000 input and 500 output tokens. For 12,000 conversations, that is 72 million input and 12 million output tokens: $7.20 + $6.00 = $13.20. This is a narrow token estimate, not a performance guarantee; retries, longer context, or a stronger model increase it.

| Cost | Who pays, and calculation | Year 1 |
|---|---|---:|
| 1. The model | Company pays Anthropic for all 12,000 conversations, including those that later go to a person. Calculation above. | $13.20 |
| 2. Where it runs and files are kept | Company pays [Vercel Pro](https://vercel.com/pricing), one developer seat at $20/month × 12, and [Supabase Pro](https://supabase.com/pricing), one small project at $25/month × 12. Base-plan budget; overages require monitoring. | $540 |
| 3. Surrounding software | Company pays an engineer to build retrieval, the chat interface, permissions, handoff, tests, and logs: 8 weeks × 40 hours × $75. The build uses an existing human inbox, not a new full helpdesk. | $24,000 |
| 4. People to set it up | Company pays content/operations staff to clean pages, define boundaries, and prepare tests: 40 hours × $50. These hours are separate from engineering. | $2,000 |
| 5. People to keep it running | Company pays engineering upkeep: 8 hours/month × 12 × $75 = $7,200; content checks: $2,400; residual human support: $24,000. | $33,600 |
| 6. Skills we do not have | Company pays a separate security/reliability specialist: 24 hours × $100. This is additional review, not the engineer already counted on line 3. | $2,400 |
| 7. Getting out later | Company pays 16 engineering hours × $75 to document the system, export data, and replace the model or hosting integration. | $1,200 |
| **Total** | **Same volume and 50% AI-resolution assumption as buy.** | **$63,753.20** |

The annual build estimate is $28,865.20 above buy. Most of the difference comes from people and software, not tokens. An inexpensive API does not establish an inexpensive service.

### Check against keeping the humans

At the assumed volume, humans handling everything cost 12,000 × 0.1 hour × $40 = $48,000, plus $348 for the inbox: $48,348. That is $13,460 above the buy case. This is capacity value; it becomes a cash saving only if staffing, overtime, or outside spending actually changes.

The assumed 50% resolution rate is not a result from testing Fin. At 25%, the buy case rises to $43,918 because more questions reach people. At zero AI resolutions it rises to $52,948 and loses to the human-only case. At 50%, adding one extra review minute to every AI-resolved conversation adds $5,000 a year at the $50 hourly rate. The pilot must measure those minutes.

## 5. What the vendor has that we could not build

A small class prototype cannot reproduce Fin's production support system: routing, monitoring, escalation behavior, and ongoing testing across customers. We could build a basic question-answering interface. Matching the reliability and operating coverage within the eight-week budget is the harder task. That is a scope judgment, not a claim that Klaviyo lacks engineering ability.

## 6. What could go wrong

**Buying:** an incorrect answer can look like an approved Klaviyo statement, while billable outcomes may not match the team's definition of a useful resolution. Restrict the pilot to public product questions, review answer sources, and compare billed outcomes with human-reviewed outcomes. Keep account changes and financial actions out of scope.

**Building:** the prototype can become dependent on one engineer while outdated source content or a model change quietly changes answers. Assign a content owner and backup engineer, version the test set, and rerun it after every material change.

Both options retain a person for unresolved conversations. Neither creates permission to promise discounts, make account changes, or treat a missing answer as fact.

## 7. How we would know it worked

**Primary number: passing answers out of the same ten Chapter 4 questions. Current baseline: 9/10 after the prompt revision.** That is an AI-assisted classroom score for a custom bot, not a measurement of Fin or Klaviyo's production service.

For the pilot, require 10/10 on those questions before any wider release. Then expand to 100 synthetic cases. An invented price, policy, or guarantee blocks release even if the aggregate score looks good. Keep the same rubric and have a person verify failures and a sample of passes. Time and resolution-rate estimates remain unmeasured until that pilot is run.

## 8. Recommendation

Buy a limited Fin pilot for public product questions rather than funding a production build now. The planning case is $34,888 for buy versus $63,753.20 for build, with the same human handoff load. The existing ten-question set gives us a practical starting test, and Fin's public batch-testing workflow supports that approach. Keep source content, golden answers, and approval rules portable. Do not enter a long-term commitment or connect private records on the strength of this memo. The one question still open is whether Fin can pass our product-accuracy tests while delivering enough verified resolutions to justify its full operating cost. If it cannot, keep the human process and revisit the decision.

## AI Use

ChatGPT Codex helped research public vendor pages, structure the memo, calculate the cost cases, and review the draft against Substance & Rigor, Documentation Quality, Reflection Depth, and Coherence. The review changed the comparison to include residual human support on both sides, separated estimates from published prices, and added the zero-resolution and review-time checks. The prior Chapter 4 files supplied the 9/10 baseline. No new vendor performance test, interview, or classmate review was conducted. No employer or customer material was uploaded.

Research prompt: Compare buying and building a public-product-information assistant for the Klaviyo portfolio. Use all seven cost lines, identify who pays, show annual calculations, separate sourced prices from assumptions, and preserve unresolved data and model questions.

Self-review prompt: Critique this memo against the four portfolio rubric dimensions. Check for double-counted labor, missing human escalation costs, unsupported performance claims, inconsistent volumes, and a recommendation that goes beyond the evidence.

Sources checked November 22, 2026. Prices can change; implementation requires a current quote.
