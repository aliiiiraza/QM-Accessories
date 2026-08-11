# QM Accessories — Meta Pixel + GTM Practice Store

A small e-commerce demo website made for practicing Meta Pixel, Google Tag Manager, dataLayer and Meta Events Manager.

## Files

- index.html
- style.css
- script.js

## Events included

The JavaScript pushes these events to `window.dataLayer`:

- `qm_page_view`
- `view_item`
- `meta_view_content`
- `add_to_cart`
- `meta_add_to_cart`
- `search`
- `begin_checkout`
- `meta_initiate_checkout`
- `add_payment_info`
- `meta_add_payment_info`
- `purchase`
- `meta_purchase`
- `contact`
- `meta_contact`
- `select_promotion`

## Important

This project does NOT contain a real Meta Pixel ID or GTM ID.

Add your real GTM container later. Then create Meta Pixel tags inside GTM and map the custom dataLayer events to Meta events.

The checkout is a demo. No real payment is processed. A Purchase event is fired when the user submits the demo checkout form.

## GitHub

1. Create a new GitHub repository, e.g. `qm-accessories`.
2. Upload `index.html`, `style.css`, `script.js`, and optionally `README.md`.
3. Make sure `index.html` is in the repository root.
4. Commit the files.
5. Deploy the repository with Vercel.

## Vercel

Import the GitHub repository into Vercel.

Framework Preset: Other / No Framework

Build Command: leave empty.

Output Directory: leave empty.

Deploy.

After deployment, open the Vercel URL and test the cart and checkout.

## GTM

Add the GTM installation code to `index.html` where the comments indicate.

Then create Custom Event triggers for the events in `script.js`.

For Meta Pixel, use Custom HTML tags or your preferred Meta Pixel GTM setup. Map:

- `meta_view_content` → ViewContent
- `meta_add_to_cart` → AddToCart
- `meta_initiate_checkout` → InitiateCheckout
- `meta_add_payment_info` → AddPaymentInfo
- `meta_purchase` → Purchase
- `meta_search` → Search
- `meta_contact` → Contact

Use GTM Preview/Tag Assistant first, then Meta Events Manager Test Events.
