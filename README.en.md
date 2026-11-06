**English** | [简体中文](README.md)

# weifan · Architecture Spoon-feed Coach

The default now: projects get built fast by agents, and most of the time nobody reviews the code — that's fine. But there come moments when you want some command over the project's architecture, or you start doubting the agent's choices and want more facts about what was actually implemented. Reading the code yourself is hardly feasible at the volume agents produce, and asking the agent directly — "what's the architecture here?" — works poorly too: it answers the sentence you asked, and your head is still empty afterwards. This skill is built for exactly those moments.

weifan (wèifàn, 喂饭) is Chinese internet slang from "spoon-feed level tutorial" — knowledge fed to you one bite at a time. This skill turns that into an executable teaching method for AI agents: **instead of answering questions one by one, treat every question as a gap in your cognitive model, find the missing cornerstone, and repair it in dependency order — the deliverable is not an explanation, it's a model in your head that can predict the system's behavior.**

## What problem does it solve

Four frequent pain points — especially when you pick up an unfamiliar codebase, or after an agent has rapidly built a project for you:

**1 · You ask scattered questions, it gives scattered answers — after a whole afternoon you still have no bird's-eye view.**
You only see the surface, so you ask surface questions and get isolated answers. This skill treats every question as a gap in your cognitive system: first reduce your questions to the missing prerequisite they jointly point at, forcibly lift the answer to the architecture level, one cornerstone per turn — the output is not a pile of loose answers but a model that predicts system behavior. After each block, "derive a case you've never seen" verifies on the spot whether the model stands.

**2 · Project jargon used bare, and it's on you to stop and ask.**
After you let an agent write specs, plans, and implementations, the docs and code comments pile up with industry terms and project coinages (mocks, assertion engines, slot files…). In the Q&A phase the agent uses them as common knowledge. This skill's term admission: any term, the first time it carries argumentative weight, must be one of "**already confirmed by you / defined on the spot / explicitly parked**"; with an operational test — throw the word at any general-purpose web AI, and if it can't produce a definition consistent with this repo's usage, the term may never be used as known.

**3 · You ask three questions at once, it dumps three chapters; new knowledge is never attached to what you already know.**
An agent that doesn't control output load answers as long as you ask. Here **one turn advances exactly one cognitive center**: multi-questions are first reduced to a common gap, and only queued if reduction fails; **each new block is explicitly hung on confirmed cognition** (continuing / zooming in / supplying the other side); when you say "can't follow", it bridges the specific break type instead of re-teaching everything.

**4 · You ask it to "explain plainly", and it starts narrating a construction site.**
The thing you don't understand is already a complex mechanism; dragging in an equally complex real-world scene (foreman, crew, temp workers, safety officer…) stacks a layer of unfamiliar entities on top — you probably only know two or three entities from that domain yourself. This skill states things plainly by default: data structures, data flows, real nouns; metaphor is allowed only as a one-sentence "nickname = real name" mapping; role-playing scenario metaphors are forbidden outright; for readers who can program, code-shaped analogies (loops, buffers, record/replay) come first.

## When to use / not use

- ✅ "Walk me through this architecture" · "I never understood this part" · "We just finished the work — explain what it looks like now"
- ✅ Four entry types: question-driven / guided tour / change retrospective / material retrospective (pasted old conversations & reports)
- ❌ Ordinary architecture questions — answered normally at fast pace. **Explicit request only** ("weifan" / "spoon-feed mode"); never auto-activates.

## Install

The skill follows the open [Agent Skills standard](https://agentskills.io/specification) (SKILL.md + frontmatter); any compatible client loads it directly:

- **ZCode**: copy this directory to `~/.agents/skills/weifan/` (or `~/.zcode/skills/`)
- **Claude Code**: `~/.claude/skills/weifan/`
- **Cursor / OpenClaw / DeepSeek harness**: any client supporting the common SKILL.md skills mode can load it; place it in that client's skills directory
- **English users**: install `SKILL.en.md` (rename it to `SKILL.md`)

No scripts, no dependencies, no API keys — pure instructions, works out of the box.

## Evidence chain

This skill wasn't written on a whim — it ships with a full develop-evaluate loop (methodology and data in [EVALUATION.en.md](EVALUATION.en.md)):

- A corpus of **39 real coaching sessions** (not synthetic scenarios)
- **12-session blind review** (scoring agents unaware of group assignment): term-admission violations 3/4 → 1/8 sessions; confusion-signal turns 12.2% → 5.1%; satisfaction signals 10.9% → 22.8%
- Wording-level **micro-tests**: the same pressure scenario run across multiple fresh-context agents; a rule's wording only counts if behavior converges
- Four versions iterated, each change preceded by failure evidence (verbatim quotes from real sessions)

## Model requirements

This is a discipline-heavy skill (~150 lines of behavioral rules); **strong instruction-following models work best**. Common degradation on weaker models: confirmations decay into bare "does that make sense?", terms leak undefined, multi-question turns abandon reduction — the skill ships a pre-send silent gate and long-session discipline re-anchoring to fight this, but model capability still sets the floor.

## Content over form: tailor it to your own pain points

The essence of this rule set is a **"real pain point → countermeasure" mapping**, not dogma to be enshrined whole. Under MIT it is fully open to you:

- **Add**: when you hit a different pain point with AI, add a section in the same "pain point → one executable countermeasure" format; for rigor, gather failure evidence before finalizing (see [EVALUATION.en.md](EVALUATION.en.md))
- **Remove**: delete any section whose countermeasure doesn't suit your taste — if you like metaphors, delete the metaphor discipline entirely; most sections are independently add/removable and the rest keeps working
- **Modify**: if the wording doesn't bind your model, rewrite it in words your model obeys

A brick to attract jade: what matters is not these 150 lines but the direction — turning AI Q&A into cognitive modeling.

## Version history

| Version | Highlights |
|---|---|
| v1 | Initial: blocking, confirmation, real anchors, term admission |
| v2 | Added: cognitive-load / narrative-organization rules, metaphor discipline, change-retrospective baseline discipline |
| v3 | Added the prime directive (deliverable = a predicting model, success = user derives new conclusions) + the web-AI jargon test + full ban on scenario metaphors |
| v4 | Pacing red line changed to "reduce multi-questions first, queue only if reduction fails" |

## Contents

```
SKILL.md           Chinese skill (general release)
SKILL.en.md        English skill (rename to SKILL.md when installing)
README.md          README (Chinese)
README.en.md       README (English, this file)
EVALUATION.md      Evaluation methodology & data (Chinese)
EVALUATION.en.md   Evaluation methodology & data (English)
LICENSE            MIT
```

## License

[MIT](LICENSE)
