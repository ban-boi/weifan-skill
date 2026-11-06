**English** | [简体中文](EVALUATION.md)

# weifan Evaluation Methodology & Data

Every change to this skill followed "failure evidence first, then the edit" (TDD applied to skill documents). This file records the methodology and key data, for reproduction and audit.

## Method

### 1. Corpus: real usage sessions (not synthetic scenarios)

Sessions were identified from the local agent-conversation database (SQLite) by **actual skill-invocation markers** (the Skill tool's `skill: weifan` parameter or injected skill content) and exported to readable transcripts (user's words + coach's replies + tool-call summaries). Noise cleaning: system-injected reminders dropped whole, pure tool turns skipped, old conversations pasted by the user not counted as that user's live signals.

### 2. Version split

Each skill invocation's timestamp is compared against the skill file's modification time to decide which version that session used — sessions crossing a version boundary belong to the group of the moment the skill was invoked.

### 3. Blind rubric scoring

Each session gets an independent scoring subagent: same model, same scoring prompt, **unaware which version group the session belongs to**. Dimensions (0/1/2, with verbatim evidence):

| # | Dimension | What is checked |
|---|---|---|
| R1 | Material cross-check | When pasted material contains load-bearing conclusions, checked against current code first; two-axis; progressive disclosure |
| R2 | First-block choice | The "nearest, highest-explanatory-power missing common prerequisite", not the material's topic heading |
| R3 | Zero-background handling | Prerequisites skipped after declaration? Scope follows the user's referent? |
| R4 | Term admission | Sampled terms first carrying argumentative weight: one-of-three compliant? |
| R5 | Two-axis status | Plan/test components narrated as production facts? Inference disguised as fact? |
| R6 | Single cognitive center | One center per turn (or one legal closed chain); one-sentence summarizable |
| R7 | Multi-question reduction & queueing | Reduced to a stated common-prerequisite hypothesis first; queue only if reduction fails; never one section per question |
| R8 | Confirmation quality | Ending targets a specific relation/distinction/fork; no bare "understood?" |
| R9 | Main-axis anchoring | Still answers the user's current question; not dragged off by side code |
| R10 | Citation accuracy | Load-bearing file:line sampled, symbol-level verification |
| R11 | Cognition probe | Conditional depth probe before entering a new area |
| R12 | Willingness to continue | Behavioral proxy: verbatim quotes of dissatisfaction / takeover / satisfaction |

### 4. Wording micro-tests

Before a rule change lands, fresh-context subagents run the pressure scenario (multiple copies + a no-new-rule control): the wording counts only if behavior converges across copies and guardrails hold (e.g. "never force a gap when reduction fails"). Single-turn synthetic tests cannot detect long-session discipline decay — final effectiveness is decided by the next review of natural usage.

## Key data (v3 vs pre-optimization baseline, 12-session blind review)

| Metric | Baseline (4 sessions) | v3 (8 sessions) |
|---|---|---|
| R4 term-admission violating sessions | 3/4 (bare jargon ×2, name-only concepts ×1) | 1/8 (minor) |
| R8 confirmation / R9 main-axis violation turns | 0 / 0 | 0 / 0 (~90 teaching turns) |
| Confusion-word turns (candidate-level*) | 73/588 ≈ 12.2% | 19/369 ≈ 5.1% |
| Satisfaction-word turns (candidate-level*) | ≈ 10.9% | ≈ 22.8% |

\* Candidate-level: a keyword hit is neither teaching failure nor success — deeper follow-up questions also hit confusion words after teaching improves; used only as a same-direction consistency signal alongside the rubric.

The prime directive ("deliverable = a model") has behavioral evidence: in multiple sessions the user derived new conclusions with the just-built model, predicted system behavior, or caught the coach's self-contradictions — including a user spontaneously asking "from the questions I'm asking, which part of my cognitive model is still not standing?" (the directive internalized as an expectation of the coach).

v3 residual weaknesses (the basis for v4): multi-question turns answered one-section-per-question (all remaining R6/R7 violations came from such turns); R11 conditional probe the least-followed rule.

## Limitations (stated honestly)

- Natural usage is not a controlled experiment: topics and execution pressure differ between groups; no strict causal attribution
- One scoring agent per session, single pass (same prompt, blind, but no inter-rater reliability check)
- R10 verifies paths/symbols only (line numbers drift with code evolution)
- The cross-session retention metric (does the concept stick?) collected candidate leads only, no paired verification
