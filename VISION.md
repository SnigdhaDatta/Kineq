# Kineq — My Product & Engineering Story

> _This is not a project description. This is the story of how I think._

---

## Why I Built This

I watch a lot. K-dramas, anime, C-dramas, Hollywood — all of it. And I kept losing track. Shows I saved in browser bookmarks. Ongoing ones I'd forget where I left off. Completed ones scattered across notes. I tried MyAnimeList — too database-heavy, no room for Hollywood. I tried spreadsheets — too manual, too ugly.

I didn't find what I wanted, so I built it.

But here's the honest truth — I also built Kineq because I wanted to stop being someone who just writes CRUD apps from tutorials. I wanted to know what it feels like to make real product decisions under real constraints, own a system end to end, and deal with the actual messiness of production.

---

## The Product Thinking

Kineq is built around one core insight: **watching a show has phases**. You want to watch something. Then you're watching it. Then you finish it. That's a lifecycle — not a list with a status column.

So I made them three separate flows. Watchlist, Ongoing, Completed. Each with its own behaviour, its own UI, its own API. That decision meant more work, but it also meant the app felt _intentional_ to use.

**The Completed tab** was where I took the biggest product risk — I made it folder-based. You can create folders named anything: "Anime", "K-drama", "Rewatched with mum", whatever. It turns the completed list from a graveyard into a curated collection. That detail mattered to me personally, and it's the feature users comment on most.

**Sharing** was not in the original plan. I added it because I kept wanting to send my ongoing list to a friend without making them sign up. So I built shareable public links for every tab — Watchlist, Ongoing, each Completed folder — all viewable without login. One link, one click, done.

**The AI chatbot** came from a real frustration — I'd finish a drama and not know what to watch next. The chatbot lets you ask anything: "what should I watch if I liked Goblin?", "who acted in Demon Slayer S4?", "any good recent C-dramas?" It's Tavily-backed and lives in a floating widget on every page. It turns the app from a tracker into a companion.

**Reminder emails** came last, and they came from seeing my own Watchlist grow and feeling the guilt of never coming back to it. So I built a daily personalised email — different content for each user based on what's actually in their lists. Not a generic newsletter. Your shows, your state, your reminder.

---

## The Engineering Decisions — And The Ones That Actually Hurt

### Wrong MongoDB query field — silent data bug

When I built the public shared link for Ongoing lists, the share route fetched items like this:

```js
const data = await Ongoing.find({ ongoingSharedId });
```

The problem: `ongoingSharedId` is a field on the **User** model, not on the Ongoing items. The Ongoing collection stores items with a `userId`. So that query was returning an empty array every single time — silently, no error, just zero results.

The fix was obvious once I saw it:

```js
const data = await Ongoing.find({ userId: user._id });
```

But the lesson wasn't obvious: **a query that returns nothing is not the same as a query that throws an error.** MongoDB's `find()` never fails — it just returns `[]`. I had also written `if (!data)` as the error check, which never triggers on an empty array. I had to change it to `if (data.length === 0)`. Two silent failures in the same function, both masking each other.

---

### Redis NX flag — the cache that never updated

I used Redis to cache shared list responses. The pattern was correct — check Redis first, fall back to MongoDB on miss, then write the result back to Redis with a TTL.

But I also added the `NX` flag:

```js
await redisClient.set(
  `ongoingShared:${id}`,
  JSON.stringify(data),
  "EX",
  180,
  "NX",
);
```

`NX` means "only set if key doesn't already exist." I added it without thinking too hard — it sounded like a safe default. In practice it meant: once a key is cached, it can never be overwritten. Even after a user adds a new item, the next request reads the stale cache until TTL expires.

The real fix wasn't just removing `NX`. It was realising I had only wired cache invalidation on edit and delete routes, not on add routes. So even without `NX`, a new item would silently not appear in a shared view for up to 3 minutes. I had to add `redisClient.del()` calls on every add route too.

Cache invalidation is genuinely hard. Not because the code is complex — it's one line. Because knowing _when_ to call it requires thinking about every mutation path that could affect a read.

---

### The cron job that only emailed one user

The reminder email system sends personalised daily emails to every user — different content based on what's actually in their Watchlist, Ongoing, and Completed lists. When I first wrote the `sendReminderMail` function, I had a `for` loop over all users. But inside the loop, I had a `return` statement in both the success and error branches:

```js
for (const currentUser of users) {
  const { data, error } = await resend.emails.send({ ... });
  if (error) {
    return { ok: false, error }; // ← exits the whole function
  }
  return { ok: true, id: data.id }; // ← exits after first success
}
```

The function was returning after the very first user — whether it succeeded or failed. Every other user was silently skipped. In testing with one account I never noticed. In production with multiple users, only one person ever got the email.

The fix was replacing the `for` loop with `Promise.allSettled()` + `.map()`:

```js
const results = await Promise.allSettled(
  users.map(async (currentUser) => sendMailToUser(currentUser)),
);
```

`Promise.allSettled` doesn't short-circuit on failure — one user's email throwing an error doesn't block everyone else's. And removing the premature `return` meant the loop actually ran to completion.

---

### Cross-origin cookies — one missing env variable, cascading failures

Local dev worked fine. Production didn't. Users were getting logged out constantly. The refresh token cookie wasn't being sent on cross-origin requests between my Vercel frontend and EC2 backend.

I had already set `sameSite: 'none'` and `secure: true` conditionally:

```js
secure: process.env.NODE_ENV === 'production' ? true : false,
sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
```

But `NODE_ENV` wasn't set on EC2. So the backend was running in "development" mode in production, setting `secure: false` and `sameSite: 'lax'` — which browsers reject for cross-origin cookies over HTTPS.

One missing env variable cascaded into: cookies not being set → refresh tokens not sent → every access token expiry logging users out. Adding `NODE_ENV=production` to the EC2 environment fixed everything.

The lesson: conditional security logic based on environment variables only works if you actually set those variables everywhere.

---

### CORS — the Authorization header that disappeared

Even after fixing cookies, there was another issue: the backend was returning a new access token in the `Authorization` response header after each authenticated request, but the frontend couldn't read it. Requests were succeeding but the token wasn't being rotated.

The problem was in the CORS configuration. By default, browsers only expose a small set of response headers to JavaScript. Custom headers like `Authorization` have to be explicitly whitelisted:

```js
app.use(
  cors({
    exposedHeaders: ["Authorization"], // ← this was missing
  }),
);
```

Without this, `res.headers.get("Authorization")` returned `null` on the client even when the server was setting it correctly. The fix is one line — but finding it meant understanding that CORS isn't just about blocking requests, it's also about controlling what the browser is _allowed to see_ in responses.

---

### CI/CD — the day I understood why ops is hard

I wanted zero-downtime deploys. The pipeline: push to GitHub → Actions builds Docker image with SHA tag → pushes to Docker Hub → SSHs into EC2 → pulls new image → restarts containers.

What broke repeatedly: the `docker-compose` syntax changed across versions — `docker-compose up` vs `docker compose up`. The SSH step timing out when container restart took longer than the timeout. Image tags not matching between the build step and the deploy step when I used `latest` carelessly.

I switched to SHA-based image tags — each build is tagged with the commit SHA, so every deployment is immutable and traceable. No more `latest` ambiguity. No more wondering which version is actually running.

Every failure taught me something about assumptions — code either works in an environment or it doesn't, and "it works on my machine" is not a deployment strategy.

---

## The Design Decisions

I wanted Kineq to feel like a journal, not a database table. Every design choice was made to reinforce that feeling.

The neobrutalist aesthetic — thick black borders, shadow offsets, monospaced font details — wasn't random. It's the same visual language used by tools people find _satisfying_ to open and use. I wanted someone to open Kineq and feel like they were opening a personal notebook, not logging into an enterprise app.

The onboarding email isn't just a verification email — it introduces the app with feature cards, a CTA button back to the watchlist, and a tone that feels like a person wrote it. The reminder emails are personalised per-user — they reference your actual shows, not generic content. These details matter because they're the difference between a user feeling like a row in a table and feeling like a person the app knows.

---

## What I Learned About Myself

I can start projects. I finish them. I care about the details — not just whether the feature works, but whether it _feels right_ to use.

I also learned that the gap between "it works" and "it's production-ready" is where most of the engineering judgment lives. Rate limits. Cache invalidation. Cookie flags. Environment mismatches. Mobile input edge cases. None of that shows up in tutorials. All of it showed up in Kineq.

Most importantly: I learned that the best products aren't built by people who just want to ship features. They're built by people who actually care about the problem.

I genuinely care about this one.

---

## The Short Version (for anyone skimming)

Kineq is a full-stack watchlist tracker I built because I needed it, deployed it because I wanted real users, and kept improving it because I couldn't stop. It has auth, caching, sharing, reminders, an AI chatbot, email notifications, and a CI/CD pipeline. Every engineering decision in it was made consciously, debugged honestly, and documented here because I want you to see how I think — not just what I built.

**Live:** [kin-eq.snowpie.me](https://kin-eq.snowpie.me)
**Code:** [github.com/SnigdhaDatta/Kineq](https://github.com/SnigdhaDatta/Kineq)

---

_Built solo. Deployed on Vercel + AWS EC2. 10 GitHub stars in the first week. Product Hunt listed._
