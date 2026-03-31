# AI Agent Review Prompt & Suggestions

## Gemini Agent Review Prompt

Copy and paste the following prompt to trigger a deep review of this Next.js application:

```markdown
Analyze the provided Next.js codebase (Next.js 16, React 19, Tailwind CSS 4).
Your goal is to provide a comprehensive review focusing on:
1. **Performance Optimizations:** Identify bottlenecks in data fetching (App Router patterns) and client-side rendering.
2. **Refactoring & Code Quality:** Suggest improvements for large components (e.g., CkanApiTester), better separation of concerns, and type safety.
3. **Bug Hunting:** Look for deprecated API usage (e.g., execCommand), potential hydration issues, and missing error boundaries.
4. **Security & Validation:** Evaluate API routes for missing input validation (recommend Zod) and insecure practices.
5. **Modernization:** Ensure the codebase leverages the latest features of React 19 (e.g., 'use' hook, improved transitions) and Tailwind CSS 4 (semantic variables).
6. **Unused Code:** Identify dead code, unused dependencies, or redundant logic.

Provide your feedback in a structured format, triaged by "Low Hanging Fruit" (Easy/High Impact) vs. "Strategic Improvements" (Complex/Long Term).
```

---

## Triage of Suggested Improvements

Below is an initial triage of improvements based on a preliminary scan of the codebase.

### 🟢 Low Hanging Fruit (Quick Wins)
1.  **Deprecation Fix (`CkanApiTester.tsx`):**
    - **Issue:** Uses `document.execCommand('copy')` which is deprecated.
    - **Fix:** Replace with `navigator.clipboard.writeText()`.
2.  **Tailwind CSS 4 Modernization:**
    - **Issue:** Hardcoded hex values (e.g., `#004562`, `#f6a732`) are scattered across `app/page.tsx` and components.
    - **Fix:** Move these to semantic variables in `globals.css` using the new `@theme` block in Tailwind 4.
3.  **Request Validation (`app/predict/api/route.ts`):**
    - **Issue:** The `POST` handler manually checks for `title` and `domeinen`.
    - **Fix:** Use **Zod** to define a schema and validate the request body, providing better error messages and type safety.
4.  **Hydration Optimization:**
    - **Issue:** `CkanApiTester.tsx` uses a `mounted` state to prevent hydration errors.
    - **Fix:** Evaluate if some parts can be server-rendered or if `dynamic(() => ..., { ssr: false })` is a cleaner approach for specific sub-components.

### 🟡 Strategic Refactorings
1.  **Component Decomposition:**
    - **Target:** `CkanApiTester.tsx` (~350 lines).
    - **Action:** Split into `ApiConsole.tsx`, `ApiExamples.tsx`, and `EndpointList.tsx` for better maintainability.
2.  **API Client Robustness (`lib/ckan.ts`):**
    - **Issue:** `fetchCKAN` uses `console.error` and returns `null` on failure.
    - **Action:** Implement a custom `AppError` class and a more sophisticated logging/notification system.
3.  **Metadata Loading:**
    - **Issue:** `model_metadata.json` is imported directly in the API route.
    - **Action:** If the file grows, consider using a caching strategy or an external config service to keep the bundle size small and the API responsive.

### 🔴 Bugs & Optimizations
1.  **External Service Timeouts:**
    - **Issue:** Calls to `EMBEDDING_SERVICE_URL` and `TF_SERVING_URL` lack timeout configurations.
    - **Fix:** Add an `AbortController` or timeout signal to `fetch` calls to prevent hanging the Next.js API route if backend services are slow.
2.  **Loading States:**
    - **Issue:** Some pages rely on client-side loading states after mounting.
    - **Fix:** Leverage Next.js `loading.tsx` files and React Suspense for a smoother "instant loading" feel.
