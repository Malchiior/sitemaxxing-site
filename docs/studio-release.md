# Design workspace first release

## What ships

REDESIGN, ASSETS and PACKAGE in the Sitemaxxing agent open a private owner workspace after a measured report. REPORT, HELP and MENU are documented aliases. The existing multiplayer scoping and send-to-Mac fix-list feature remain intact. Guests retain standard report access; the new generation workspace is owner-only.

The website verifies the agent's Plow credential against api.plow.co and derives the owner from its sole verified owner conversation. One-time, 15-minute tickets establish a seven-day HttpOnly, Secure, same-site owner session. Report viewing codes never authorize provider connections, generation or project mutation. Every API mutation checks the owner, project and origin.

The initial billing path is bring your own OpenAI key. No payment processor, credit prices or checkout account were supplied, so credit purchases are unavailable. STUDIO_BYOK_ENABLED controls connections and generation. STUDIO_ENCRYPTION_KEY is a separate 32-byte hex secret in the deployment environment; AES-256-GCM ciphertext is bound to the owner's identifier. It must be retained to read existing connections and never be committed or included in an image/package. This is application encryption using a deployment secret, not a dedicated managed-KMS integration. Disconnect removes the current saved connection; provider revocation remains available through OpenAI.

## Spending behavior

The owner saves 1–10 outputs and an allowance of 1–20 generation attempts. Each click authorizes one medium-quality image request (1024x1536 screens or 1024x1024 transparent logos/illustrations) to gpt-image-2.5-flare. This is an attempt allowance, NOT a dollar spending cap or a prepaid credit balance. Provider charges vary, and the UI links to provider pricing before generation. The UI never quotes an invented dollar price.

A Blob ETag conditional write reserves an attempt before provider execution. Simultaneous/stale requests cannot both start. One request runs per project. No automatic retries. Uncertain failures count against the allowance; recovery is available after five minutes, but a retry still requires another explicit click. The first sample must be completed and approved before other outputs can start. Regenerating it clears approval. Scope is locked once attempts are used. The primary baseline screenshot is included when present and small enough; subsequent outputs use the approved sample as a visual reference. Other pages are selected from the measured navigation list; their concepts are not fresh audited screenshots.

## Packaging and sharing

PACKAGE creates a ZIP without image API calls, with measured report/fix text, baseline PDF when provided, available assets, versioned images, design plan, implementation prompt and SHA-256 manifest. Sharing creates a new read-only snapshot with a separate six-digit viewing code. It never overwrites the original report or includes credentials, owner identifiers, sessions or owner links. Packages stream through authenticated routes to avoid buffered response size limits.

## Validation and limits

Tests cover plan validation, sample gating, allowance enforcement, stale/concurrent requests, uncertain provider responses, ciphertext binding, authorization denial and package contents. The image provider is mocked for these tests; no real image-generation charge is incurred. A credentialed generation pilot is still required to verify account access, API response and visual quality end to end. Rendering a proposed screenshot does not implement the website. The receiving coding agent must make changes and re-run measured audits.

Source: https://developers.openai.com/api/docs/guides/image-generation (checked 2026-09-28).

## Deferred until configured

Sitemaxxing prepaid credits and checkout, dollar-denominated quotes/reservations, provider selection, managed KMS, dedicated durable job queue, automatic whole-site batch generation, and Latch-hosted image generation. These are not represented as available features. Existing Latch delivery of the fix list continues to work.

## Rollback

Disable STUDIO_BYOK_ENABLED to stop new key connections and generation, then redeploy the website. Existing reports and package downloads remain usable. Do not rotate STUDIO_ENCRYPTION_KEY without a migration plan. The agent image can be rolled back independently; existing owner workspace links remain governed by expiry.
