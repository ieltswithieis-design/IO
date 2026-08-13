# IEIS.IO IELTS Academic Reading Platform — Local Build

This package is a ready-to-run local IEIS.IO Academic Reading practice platform.

## Included

- Exact supplied IEIS.IO logo asset at `assets/IEIS.IO.png`
- Student sign-up/sign-in with local browser persistence
- Student dashboard and attempt history
- 60-minute examination timer
- Exactly 3 passages and 40 questions per complete test
- Passage distribution: 13 + 13 + 14
- Question navigator, flagging and answer persistence during an attempt
- Automatic marking and result review
- Practice Band Estimate clearly labelled as non-official
- 100 complete teaching tests
- 3,000 searchable passages
- Staff/admin dashboard
- Structural validation indicators
- Responsive desktop/tablet/mobile UI

## Run locally

Because this is a browser application, the easiest option is to serve the folder with any simple static HTTP server.

### Python

```bash
python -m http.server 8000
```

Then open:

`http://localhost:8000`

Do not open `index.html` directly with `file://` if your browser blocks local JSON fetches.

## Demo accounts

Student:
- Email: student@ieis.io
- Password: Student123!

Staff:
- Email: staff@ieis.io
- Password: Staff123!

Admin:
- Email: admin@ieis.io
- Password: Admin123!

These credentials are intended for the local build only.

## Important production note

This local package persists account and examination data in the browser. It is therefore suitable as a fully runnable local build, testing environment and frontend foundation, but it is NOT a secure public authentication system.

For production deployment, replace local authentication/persistence with a secure backend such as Supabase and enforce authorization at the database/backend layer. Do not expose service-role keys or private credentials in the browser.

## Content note

The reading materials are independently generated practice materials. They are not official British Council, IDP or Cambridge IELTS content.

## Logo requirement

The supplied IEIS.IO logo is copied unchanged into the assets directory and referenced directly by the application. It is not redrawn, recoloured, cropped or otherwise modified.

## IELTS Academic Reading practice band conversion

The result screen now converts raw correct answers out of 40 into whole/half Academic Reading bands using the standard indicative table used by IELTS/IDP:
39–40=9.0, 37–38=8.5, 35–36=8.0, 33–34=7.5, 30–32=7.0, 27–29=6.5, 23–26=6.0, 19–22=5.5, 15–18=5.0, 13–14=4.5, 10–12=4.0, 8–9=3.5, 6–7=3.0, 4–5=2.5, 2–3=2.0, 0–1=1.0.
