# LeverAGE

### The proving ground for autonomous trading intelligence.

**Build. Train. Evaluate. Prove.**

<img width="1351" height="667" alt="image" src="https://github.com/user-attachments/assets/d9d83c22-a432-420d-92ac-8ceef8aaa1d3" />

LeverAGE is an agentic trading and market simulation platform designed to help users create, configure, and evaluate autonomous trading agents in a controlled environment.

Instead of simply claiming that an AI agent is intelligent or profitable, LeverAGE aims to give that agent a measurable performance history.

Users can create an agent, define its strategy and risk profile, run evaluations against market data, observe its decisions, and analyze its performance over time.

The long-term vision is to create a competitive environment where humans and AI agents can test their strategies, compare results, and build a verifiable record of performance before moving toward live financial execution.

> **The market doesn't care how smart your agent sounds. Prove it.**

---

## Table of Contents

* [Overview](#overview)
* [The Problem](#the-problem)
* [Our Solution](#our-solution)
* [How LeverAGE Works](#how-leverage-works)
* [Core Product Features](#core-product-features)
* [The Agent Evaluation Engine](#the-agent-evaluation-engine)
* [Agent Configuration](#agent-configuration)
* [Supported Strategies](#supported-strategies)
* [Performance and Decision Logging](#performance-and-decision-logging)
* [The Arena](#the-arena)
* [Human vs Agent](#human-vs-agent)
* [Solana and $ANSEM](#solana-and-ansem)
* [Product Status](#product-status)
* [Development Roadmap](#development-roadmap)
* [Technical Architecture](#technical-architecture)
* [Project Structure](#project-structure)
* [Getting Started](#getting-started)
* [Environment Variables](#environment-variables)
* [Development Principles](#development-principles)
* [Future Vision](#future-vision)
* [Contributing](#contributing)
* [Disclaimer](#disclaimer)
* [License](#license)

---

## Overview

Financial markets are becoming increasingly automated. AI agents can analyze information, follow strategies, and eventually interact with financial infrastructure.

But building an agent is not the same as proving that the agent can perform well.

LeverAGE is being developed as the environment between those two stages.

The platform is designed around a simple idea:

> **Give an agent a controlled environment. Let it observe the market, make decisions, manage risk, and create a verifiable performance record.**

The platform combines agent creation, market simulation, decision tracking, performance analytics, and competitive evaluation into one connected product.

### The Product Journey

```text
LEARN
  ↓
BUILD
  ↓
TRAIN
  ↓
COMPETE
  ↓
PROVE
  ↓
DEPLOY
```

This is the long-term journey LeverAGE is designed to support.

---

## The Problem

Trading strategies and AI agents are often judged by claims that are difficult to verify.

A developer might say:

> "My agent made 500%."

A trader might share a screenshot of a successful trade.

A strategy might look profitable in theory.

But these claims do not necessarily tell us:

* How much risk was taken?
* How severe was the largest drawdown?
* Was the performance consistent?
* How many decisions were made?
* What market conditions produced the result?
* Did the agent follow its strategy?
* Would the same strategy perform differently in another market?

Beginners also face a different challenge.

They may want to learn trading and experiment with strategies without immediately risking real capital.

Developers building autonomous agents need an environment where they can test their systems and measure results.

LeverAGE is being developed to address these problems through controlled simulation and measurable evaluation.

---

## Our Solution

LeverAGE provides a structured environment where users can:

1. Create an autonomous trading agent.
2. Configure its strategy, market focus, and risk profile.
3. Start a controlled evaluation.
4. Feed market data into the evaluation.
5. Allow the agent to make decisions.
6. Apply risk-management rules.
7. Record decisions and outcomes.
8. Measure performance over time.
9. Compare agents through an Arena.

The central product is not merely an agent builder.

It is the evaluation environment surrounding the agent.

### The Core Intelligence Loop

```text
OBSERVE
   ↓
REASON
   ↓
DECIDE
   ↓
MANAGE RISK
   ↓
MEASURE
   ↓
REPEAT
```

Every stage is intended to become part of the actual application behaviour rather than remaining only a visual concept.

---

## How LeverAGE Works

### 1. Create an Account

Users can register, verify their email, and sign in to their own LeverAGE account.

Each user's agents belong to their account.

The application is designed to support multiple users with separate agent ownership and private account data.

### 2. Create an Agent

A user creates an agent by providing its configuration.

For example:

```text
Agent Name: Oracle
Strategy: Momentum
Market: SOL
Risk Profile: Balanced
Maximum Allocation: 25%
```

The agent is then stored in the user's account.

### 3. Start an Evaluation

The user starts an evaluation for the selected agent.

The evaluation can be configured with:

* Market;
* Evaluation duration;
* Starting virtual capital.

For example:

```text
Agent: Oracle
Market: SOL
Duration: 24 hours
Starting Capital: $10,000 virtual USDC
```

### 4. Receive Market Data

The evaluation engine supplies market data to the agent.

The initial implementation is intended to support historical market data for replay-based evaluation.

Live paper trading is a future option.

### 5. Make Decisions

The agent observes the market and makes a decision according to its strategy.

Possible actions include:

* LONG;
* SELL / EXIT;
* HOLD.

The exact action model will depend on the strategy engine and simulation design.

### 6. Apply Risk Management

The evaluation applies the agent's risk parameters.

For example, if the agent has a maximum allocation of 25%, the strategy cannot exceed that configured exposure.

### 7. Record the Result

The system records the decision, market conditions, allocation, and resulting performance.

Over time, this creates a history that can be analyzed and compared.

---

## Core Product Features

### Authentication and User Accounts

The current foundation includes:

* Account registration;
* Email verification;
* Sign-in;
* User-specific agent ownership;
* Private account data.

The multi-user foundation has been tested with two separate accounts creating their own agents.

### Agent Creation

Users can create and configure agents.

Each agent has its own identity and configuration.

The current product foundation includes:

* Agent name;
* Strategy;
* Market focus;
* Risk profile;
* Maximum allocation;
* Agent ownership.

### Agent Dashboard

The dashboard provides the environment for viewing and managing agents.

The existing interface includes agent lists, agent details, and dashboard integration.

### Agent Evaluation

The planned evaluation engine is responsible for:

* Receiving market data;
* Running strategy logic;
* Producing decisions;
* Applying risk rules;
* Updating virtual portfolios;
* Recording performance.

This is the next major product-development phase.

### Performance Analytics

The intended evaluation output includes:

* Portfolio value;
* Return;
* Drawdown;
* Win rate;
* Number of decisions;
* Position history;
* Strategy performance.

### The Arena

The Arena is the planned competitive layer of LeverAGE.

It will allow evaluated agents to be compared under measurable conditions.

### AI-Assisted Learning

The broader vision includes an AI assistant that helps users understand market behaviour, trading concepts, and the performance of their own strategies.

This is part of the product vision and is not yet presented as a completed feature.

---

## The Agent Evaluation Engine

The Agent Evaluation Engine is the core of LeverAGE's next development phase.

The objective is to replace placeholder performance data with actual evaluation results generated by the application.

### Why This Matters

The current agent foundation allows users to create and own agents.

The evaluation engine gives those agents a purpose.

Without evaluation, an agent is only configured.

With evaluation, it can begin to produce a measurable record.

### Evaluation Flow

```text
USER CREATES AGENT
        ↓
USER STARTS EVALUATION
        ↓
LEVERAGE LOADS MARKET DATA
        ↓
AGENT OBSERVES DATA
        ↓
AGENT REASONS
        ↓
AGENT MAKES A DECISION
        ↓
RISK RULES APPLY
        ↓
VIRTUAL PORTFOLIO UPDATES
        ↓
DECISION IS STORED
        ↓
NEXT MARKET STEP
        ↓
PERFORMANCE IS CALCULATED
```

### Initial Evaluation Approach

The recommended first implementation is **historical simulation**.

Historical simulation allows the system to replay a market period without requiring the user to wait for a future trading window.

For example:

> "How would Oracle have performed over this historical period?"

This makes it possible to build and test the evaluation architecture before introducing live paper trading.

### Future Evaluation Approach

Live paper trading may be introduced later.

In that mode, the agent would observe real market prices going forward while using virtual capital.

No real capital is required for the core simulation experience.

---

## Agent Configuration

The current agent model supports the configuration of a strategy, market focus, and risk profile.

### Example Agent

```text
Name: Oracle
Strategy: Momentum
Market: SOL
Risk: Balanced
Maximum Allocation: 25%
```

### Configuration Goals

The configuration system should allow users to define the behaviour of their agent in a structured way.

This includes:

* Strategy selection;
* Market selection;
* Risk profile;
* Allocation limits;
* Evaluation parameters.

The initial version focuses on platform-configured agents.

Users do not yet need to upload their own AI agent code.

---

## Supported Strategies

The planned initial strategy engine includes four strategy types.

### Momentum

A momentum strategy attempts to identify and respond to continued price movement.

It may use market conditions such as price changes, volume, and momentum indicators.

### Mean Reversion

A mean-reversion strategy attempts to identify situations where price may move back toward a reference level.

### Trend Following

A trend-following strategy attempts to participate in sustained market trends.

### Hybrid

A hybrid strategy combines multiple strategy approaches into one configured system.

### Important Note

These strategies are part of the planned evaluation engine.

The current application has not yet completed the implementation of the real evaluation logic for these strategies.

The first objective is to build a deterministic, controlled strategy engine that can be measured reliably.

AI reasoning and more advanced agent integrations can be introduced as the evaluation architecture matures.

---

## Performance and Decision Logging

A major part of LeverAGE's purpose is to make agent behaviour measurable.

The system is designed to move beyond placeholder charts and simulated decision histories.

### What Should Be Recorded?

For each decision, the evaluation engine should store information such as:

* Market timestamp;
* Market price;
* Market observation;
* Agent reasoning;
* Action;
* Confidence;
* Allocation;
* Result.

Conceptually:

```json
{
  "action": "LONG",
  "confidence": 0.82,
  "reasoning": "Current conditions support the momentum strategy."
}
```

This is an example of the intended decision format, not a claim that the full AI decision interface is already implemented.

### Performance Metrics

The planned performance system includes:

| Metric               | Purpose                                          |
| -------------------- | ------------------------------------------------ |
| Portfolio Value      | Tracks the value of the virtual portfolio.       |
| Return               | Measures the change in portfolio value.          |
| Drawdown             | Measures decline from a previous portfolio peak. |
| Win Rate             | Measures the proportion of winning trades.       |
| Decision Count       | Tracks the number of recorded decisions.         |
| Position History     | Tracks positions held over time.                 |
| Strategy Performance | Helps compare how strategies behave.             |

### The LeverAGE Score

The long-term vision includes a multi-factor evaluation score.

The score may combine:

* Return;
* Risk control;
* Drawdown;
* Consistency;
* Execution quality;
* Strategy discipline;
* Survival during volatility.

The exact formula is not yet finalized.

The score should be transparent and should not be presented as an industry-standard measure before it has been properly designed and tested.

---

## The Arena

The Arena is the competitive environment planned for LeverAGE.

Its purpose is to make agent performance comparable.

Rather than relying only on screenshots or claims, users should be able to compare agents using recorded evaluation data.

### Example

```text
Oracle vs Agent 30 vs Alpha
```

Possible comparison metrics include:

| Agent    | Return | Drawdown | Win Rate | Decisions |
| -------- | -----: | -------: | -------: | --------: |
| Oracle   |   +12% |      -4% |      63% |       120 |
| Agent 30 |    +8% |      -2% |      71% |        97 |
| Alpha    |    -3% |      -8% |      42% |       130 |

**The figures above are illustrative examples, not live LeverAGE results.**

The Arena should eventually make it possible to ask:

> Which agent performs better?

And more importantly:

> Better according to what?

Higher return?

Lower risk?

Better consistency?

Better decision quality?

This is why LeverAGE is designed around measurable evaluation rather than profit alone.

---

## Human vs Agent

A future competitive feature is the ability to compare human traders and autonomous agents in the same simulation environment.

Both sides could receive identical virtual capital and operate under the same market conditions.

Humans would make decisions manually.

Agents would make decisions autonomously.

This creates an engaging competition format:

> **Can humans outperform AI in the market?**

Potential competitions include:

* Human vs Agent;
* Strategy vs Strategy;
* Seven-Day Survival Challenge;
* Risk Management Challenge;
* The ANSEM Challenge.

These are future product concepts, not currently completed features.

---

## Solana and $ANSEM

LeverAGE is being developed with Solana as its primary ecosystem.

The original hackathon concept was built around The AnsemHack, which requires an agent-centered product and tokenization as part of entry.

$ANSEM is intended to serve as a central asset and benchmark for the hackathon-specific experience.

### The ANSEM Challenge

A future flagship competition could place agents in a structured simulation involving $ANSEM and selected Solana market conditions.

The challenge could evaluate:

* Agent performance;
* Risk management;
* Consistency;
* Decision quality;
* Market behaviour.

The goal is to create a meaningful product use case around $ANSEM rather than simply displaying the token.

### Long-Term Ecosystem Direction

LeverAGE is not intended to replace ClawPump.

The long-term vision is that LeverAGE can serve as an evaluation and proving environment for agents before they move toward live financial infrastructure.

> **ClawPump gives agents the ability to act. LeverAGE helps determine what they can prove.**

This is a future integration direction, not a claim that live ClawPump deployment is currently implemented.

---

## Product Status

LeverAGE is currently in active development.

The project has completed important foundation work, but the core evaluation engine is still being built.

### Completed Foundation

#### Phase 1 — Foundation and Design System

* Marketing site;
* Design system;
* Black and green visual identity;
* Authentication;
* Dashboard shell;
* Navigation;
* Honest empty states.

#### Phase 1B — Visual Environment and Motion

* Environmental design;
* Intelligence loop visuals;
* Agent preview;
* Arena preview;
* Smooth animations.

#### Phase 2 — Agent Creation and Ownership

* `agents` database table;
* Row Level Security (RLS);
* User isolation;
* Agent creation;
* Agents list;
* Agent detail page;
* Dashboard reflects real agents.

### Multi-User Testing

The agent ownership foundation has been tested with two separate users.

The test confirmed that:

* User A could create Oracle;
* User B could create Agent 30;
* Both agents were created successfully;
* The accounts remained separate;
* Each agent belonged to the correct user.

This is an important milestone because LeverAGE now has the beginning of a real multi-user application rather than only a static frontend.

### Current Limitation

The agent currently does not yet perform real market evaluation.

The following are still part of the development work:

* Real market data integration;
* Historical or live evaluation;
* Actual strategy execution;
* Real decision logging;
* Performance calculation;
* Portfolio simulation;
* Agent comparison using evaluation results.

The existing performance graph and decision history should not be treated as verified trading performance.

---

## Development Roadmap

### Phase 3 — Agent Evaluation Engine

This is the immediate next major development phase.

#### Phase 3A — Evaluation Database

Introduce the data structures required for evaluation.

Conceptual tables:

```text
agents
   │
   ├── evaluations
   │
   ├── decisions
   │
   ├── positions
   │
   └── performance_snapshots
```

#### `evaluations`

Tracks the evaluation itself.

Expected fields include:

```text
id
agent_id
status
starting_capital
current_capital
market
started_at
completed_at
```

#### `decisions`

Tracks decisions made during evaluation.

Expected fields include:

```text
id
evaluation_id
agent_id
timestamp
market_price
observation
reasoning
action
confidence
allocation
result
```

#### `positions`

Tracks the positions currently held by an agent.

#### `performance_snapshots`

Stores portfolio performance over time.

All user-owned evaluation data should be protected with appropriate access controls and Row Level Security.

---

### Phase 3B — Evaluation Creation

Users should be able to open an agent and select:

* Market;
* Evaluation period;
* Starting virtual capital.

They should then be able to start an evaluation.

The agent page should transition from showing placeholder performance to displaying actual evaluation status and results.

---

### Phase 3C — Strategy Engine

Implement the four initial strategy types:

* Momentum;
* Mean Reversion;
* Trend Following;
* Hybrid.

The first implementation should prioritize deterministic and testable strategy behaviour.

---

### Phase 3D — Real Decision Logging

Turn the intelligence loop into actual application behaviour.

```text
OBSERVE
   ↓
REASON
   ↓
DECIDE
   ↓
MANAGE RISK
   ↓
MEASURE
```

Each decision should create a real database record.

---

### Phase 3E — Real Performance

Calculate and display:

* Portfolio value;
* Return;
* Drawdown;
* Win rate;
* Number of decisions;
* Position history.

This is the transition from simulated presentation to actual evaluation data.

---

### Phase 4 — Arena

Once agents have real evaluation records, introduce meaningful comparison.

Potential features:

* Public agent profiles;
* Evaluation history;
* Agent leaderboard;
* Performance comparison;
* Competition periods;
* Risk-adjusted scoring.

---

### Phase 5 — Bring Your Own Agent

The long-term product may allow advanced users to connect their own AI agents.

A user could eventually connect:

* An API;
* An AI model;
* Their own agent endpoint.

LeverAGE would provide the environment, simulation, risk controls, logging, and measurement.

The external agent could return a decision such as:

```json
{
  "action": "LONG",
  "confidence": 0.82,
  "reasoning": "Current conditions support the strategy."
}
```

The platform would then handle evaluation.

This is the direction that could make LeverAGE more than a configured-agent application.

> **The user builds the intelligence. LeverAGE proves what it does.**

---

## Technical Architecture

LeverAGE is being developed as a web application with a frontend, backend, database, market-data layer, and evaluation engine.

### Frontend

The frontend provides the user-facing product experience.

The project uses a modern web stack centered around:

* Next.js;
* TypeScript;
* Tailwind CSS.

The visual direction emphasizes a premium, dark, technical interface with a strong focus on clarity and motion.

### Backend

The backend is responsible for:

* Authentication;
* User accounts;
* Agent ownership;
* Agent configuration;
* Evaluations;
* Decisions;
* Positions;
* Performance data.

### Database

The application currently uses a database-backed agent model with Row Level Security.

The evaluation engine will extend this model with evaluation-specific tables.

### Evaluation Engine

The evaluation engine is responsible for:

1. Loading market data;
2. Passing data to the strategy or agent;
3. Receiving a decision;
4. Applying risk rules;
5. Updating the virtual portfolio;
6. Recording the decision;
7. Calculating performance.

### Market Data

The initial evaluation approach is historical simulation.

Market-data integration will be required to support the actual evaluation engine.

Live paper trading is a future option.

### Agent Integration

The initial MVP focuses on agents configured inside LeverAGE.

A future version may support external agents through an API or agent endpoint.

---

## Project structure

```text
src/
├── app/          route segments: (marketing), (auth), (onboarding), (app), api/
├── components/   ui/ (primitives), layout/ (app shell), marketing/, shared/ (logo, motion)
├── features/     auth/, agents/, evaluations/ — business logic, schemas, and server actions
├── lib/          Supabase clients, env validation, utils, constants
├── config/       site.ts, navigation.ts
└── middleware.ts session refresh + route protection
```

The actual repository structure should be treated as the source of truth for implementation details.

---

## Getting Started

### Prerequisites

Before running LeverAGE locally, ensure you have:

* Node.js installed;
* npm or another compatible package manager;
* Access to the project's repository;
* The required environment variables;
* Access to the project's database.

### Installation

Clone the repository:

```bash
git clone <YOUR_REPOSITORY_URL>
```

Navigate into the project:

```bash
cd <PROJECT_DIRECTORY>
```

Install dependencies:

```bash
npm install
```

Create your local environment file:

```bash
cp .env.example .env.local
```

If the project does not yet include an `.env.example` file, create `.env.local` and add the required environment variables.

Run the development server:

```bash
npm run dev
```

Open the local development URL shown by Next.js.

### Note

The exact setup commands and environment variables should be updated to match the repository's actual configuration before this README is finalized for public use.

---

## Environment Variables

The project may require environment variables for authentication, database access, and future market-data services.

The exact variable names should be documented here once the repository configuration is confirmed.

For example:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

These are illustrative examples of common Supabase configuration names, not a verified list of LeverAGE's current environment variables.

Never commit secrets, private API keys, or service-role credentials to the repository.

---

## Development Principles

### Build the Engine Before Decorating the Dashboard

The next priority is the actual evaluation engine.

The product should not continue adding visual features without building the functionality that creates user value.

### Real Data Over Placeholder Data

Placeholder graphs and simulated histories are useful during early interface development.

They should be replaced with actual evaluation data as the engine becomes available.

### Measurable Performance

An agent should be evaluated using transparent metrics.

Profit alone is not enough.

### User Ownership and Privacy

Each user's agents and evaluation data must remain properly isolated.

### Controlled Simulation First

Historical simulation is the recommended first evaluation approach.

It allows the team to test the system before introducing live paper trading or real execution.

### Build for the Long Term

The architecture should allow the product to evolve from platform-configured agents toward external agent integrations.

---

## Future Vision

LeverAGE is being developed toward a future where autonomous financial agents can build a measurable reputation.

An agent could eventually have a profile showing:

```text
ALPHA-01

LeverAGE Score: 91.4

Return: +18.2%
Maximum Drawdown: 5.1%
Risk Discipline: 94/100
Consistency: 89/100

Simulation History: 127 days
Total Decisions: 1,842
```

The figures above are illustrative.

The long-term vision includes:

* Agent evaluation;
* Strategy benchmarking;
* Public agent profiles;
* Human vs Agent competitions;
* Strategy discovery;
* Agent reputation;
* Community competitions;
* Advanced simulation;
* Bring Your Own Agent integrations;
* Potential live-deployment pathways.

The goal is to create a platform where agents can move from experimentation toward demonstrated capability.

---

## Contributing

LeverAGE is an evolving project.

Contributions, ideas, feedback, and technical collaboration are welcome as the project develops.

If you would like to contribute:

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test your changes locally.
5. Submit a pull request.

For major changes, please open an issue first to discuss the proposed direction.

---

## Disclaimer

LeverAGE is a trading simulation and agent evaluation project.

It is not currently a live trading platform.

Virtual performance does not guarantee future results.

Historical simulation does not guarantee that an agent will perform the same way in live markets.

Nothing in this project should be interpreted as financial advice or a recommendation to buy or sell any asset.

Any future live-trading or token-related functionality will require additional technical, security, regulatory, and risk considerations.

---

## License

The project's license will be specified by the maintainers.

Until a license is added to the repository, the project should not be assumed to be available for unrestricted reuse or redistribution.

---

# LeverAGE

**Build. Train. Evaluate. Prove.**

> The next age of trading intelligence begins with proof.
