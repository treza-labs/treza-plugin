---
name: treza-video-pipelines
description: Use the Treza MCP server to turn a brief into a finished AI video and publish it to YouTube or TikTok. Use when the user asks for a video, a Short, a clip from a podcast or long video, a scheduled channel, or a cost estimate for a render.
---

# Treza video pipelines

Treza runs AI video pipelines as node graphs: writer, video and image models, narration, music, captions, publisher. The MCP server exposes 16 tools that cover authoring, running, budgeting, and publishing.

## Workflow

1. **Check credits first.** Call `get_credit_balance`. Runs spend a real prepaid balance. If it is empty, send the user to the returned `topUpUrl`. A wallet-holding agent can pay the x402 block in the response instead.
2. **Start from a template when one fits.** `list_pipeline_templates`, then `create_pipeline` with `templateId`. Templates cover captioned Shorts, podcast clipping, dubbing, and more.
3. **Otherwise build the graph.** `list_node_types` and `get_node_type` describe every node. `get_node_type` on a model-bearing node (video-gen, image-gen, tts, ai-model) returns the live model catalog with supported durations, aspect ratios, and voices. Pick ids from that list, never guess.
4. **Estimate before running.** `estimate_run_cost` on the pipeline. Tell the user the number before `run_pipeline`.
5. **Run and poll.** `run_pipeline`, then `get_run` until status is `completed` or `failed`. Renders take minutes.
6. **Publishing needs a channel.** `list_connected_channels` returns the ids a youtube-upload or tiktok-upload node needs. Channels are connected by a human in the Treza app.
7. **Schedules fire from the published snapshot.** A schedule-trigger on the draft does nothing until `publish_pipeline`. Use `set_schedule_paused` to pause or resume without republishing.

## Rules

- Never call `run_pipeline` or `publish_pipeline` without telling the user the estimated cost.
- Everything you create is visible at https://www.trezalabs.com/platform, so name pipelines clearly.
- Account creation happens in the OAuth flow when the client connects. If tools return 401, the user needs to connect the server, not paste a key.
