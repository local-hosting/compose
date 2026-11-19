# `@local-hosting/compose`

Always-on, **non-AI** human text → `@local-hosting/frames` (lexicon / rules).

```
spatial-ai → local-ai → compose → frames
                     ↑
               languages + text→frame
```

This repo owns **`SUPPORTED_LANGUAGES`** and compose. **Frames** stays grammar-only. Optional neural compose lives in `@local-hosting/local-ai` (basic) / `@local-hosting/spatial-ai` (spatial layer) and should depend on **compose**, not frames directly.

```ts
import { composeWords, SUPPORTED_LANGUAGES } from '@local-hosting/compose'

const result = composeWords(text, table, labels, 'es')
```

## Languages

`ar`, `en`, `es`, `fr`, `he`, `hi`, `it`, `nl`, `pt`, `ta`, `zh-Hans`, `zh-Hant`

## Example messages

### Everyday (family)

- We need milk for breakfast 🥛 → `report` demand
- I can offer a ride to school 🙂 → `report` offer
- Are you home yet? → `query`
- Dinner plan: pickup the kids from school → `intent`
- Can you confirm the medicine dose? ✅ → `verify`

### Resilience (off-grid / disaster)

- We need lodging for three families tonight 🏠 → `report` demand
- Offering food at the shelter — come by if you can 🍞 → `report` offer
- Is the shelter open right now? → `query`
- Flood is rising — evacuate now, high priority 🚨 → `intent`
- Confirmed: medicine arrived at the lobby ✅ → `verify`

### Multilingual (sample)

- es: Necesitamos leche para el desayuno 🥛
- es: ¿Está abierto el refugio?
- fr: On offre de la nourriture à l’abri 🍞
- zh-Hans: 我们需要住宿 🏠

## Commands

```bash
yarn install
yarn build && yarn test
```

Depends on `@local-hosting/frames` via the parent workspace (install from `local-hosting/` after cloning `frames`).
