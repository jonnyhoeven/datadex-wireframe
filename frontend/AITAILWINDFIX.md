# Tailwind CSS 4 Modernization Prompt

Copy and paste the following prompt to have an agent modernize the styling:

```markdown
Modernize the styling of this Next.js application by migrating hardcoded hex colors to semantic variables using Tailwind CSS 4 features:

1. **Identify Hex Colors:** Search for hardcoded colors like `#004562` (NIPV Blue) and `#f6a732` (Data4OOV Orange) in `app/page.tsx` and components (e.g., `CkanApiTester.tsx`, `Sidebar.tsx`).
2. **Update globals.css:** Define these colors as semantic variables within the `@theme` block in `app/globals.css`. For example:
   ```css
   @theme {
     --color-brand-blue: #004562;
     --color-brand-orange: #f6a732;
   }
   ```
3. **Refactor Components:** Replace the hardcoded hex strings with the new Tailwind utility classes (e.g., `text-brand-blue`, `bg-brand-orange`).

**Validation:** Run `yarn build` to ensure the changes haven't introduced any regressions or build errors.
**Commit:** If successful, commit the changes with a message like "style: migrate hardcoded colors to semantic tailwind theme variables".
```
