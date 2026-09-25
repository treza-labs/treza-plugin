---
name: treza-video-pipelines
description: Use the Treza MCP server to turn a brief into a finished AI video and publish it to YouTube or TikTok. Use when the user asks for a video, a Short, a clip from a podcast or long video, a scheduled channel, edits to media they already made (captions, music, joining clips), or a cost estimate for a render.
---

# Treza video pipelines

Treza runs AI video pipelines as node graphs: writer, video and image models, narration, music, captions, publisher. The MCP server exposes 24 tools that cover authoring, running, finishing existing media, connecting channels, publishing, and budgeting.

## Workflow

1. **Check credits first.** Call `get_credit_balance`. Runs spend a real prepaid balance. When it will not cover the work, tell the user and pass on the link the response includes. A wallet-holding agent can pay the x402 block when the response carries one.
2. **Start from a template when one fits.** `list_pipeline_templates`, then `create_pipeline` with `templateId`. Templates cover captioned Shorts, podcast clipping, dubbing, and more.
3. **Otherwise build the graph.** `list_node_types` and `get_node_type` describe every node. `get_node_type` on a model-bearing node (video-gen, image-gen, tts, ai-model) returns the live model catalog with supported durations, aspect ratios, and voices. Pick ids from that list, never guess.
4. **Estimate before running.** `estimate_run_cost` on the pipeline. Tell the user the number before `run_pipeline`.
5. **Run and poll.** `run_pipeline`, then `get_run` until the status is no longer `running` (it ends as `success`, `partial`, `error`, or `cancelled`). Renders take minutes.
6. **Publishing needs a channel.** `list_connected_channels` returns the ids a youtube-upload or tiktok-upload node needs. When the one the user wants is missing, call `connect_channel` and give them its link. They finish it in their own browser, signed in to Treza, and the page tells them when it is connected; then check `list_connected_channels` again.
7. **Schedules fire from the published snapshot.** A schedule-trigger on the draft does nothing until `publish_pipeline`. Use `set_schedule_paused` to pause or resume without republishing.
8. **Finish media the account already has.** A file the user gives you goes into the library first with `import_media` (an attachment, a public link, or a local file sent through `create_upload_url`). `list_assets` returns the account's images, videos, and audio, newest first. `assemble_video` joins clips in order into one video, optionally over narration and a music bed, with burned-in captions. `edit_asset` runs node operations from `list_node_types` (captions, upscale, trim, crop, and more) over one file, in order. Only pass urls that came from `list_assets` or a run's outputs in `get_run`. Both render in the background and spend credits: tell the user before calling, then poll `get_run` with the returned `pipelineId` and `runId`.
9. **Post a finished video when asked.** `publish_asset` lays one video out for the user with the account it will post as. In clients that show panels it posts only when they press Post, and on TikTok they choose who can view it and confirm its disclosures there. In a client without panels, publish through a pipeline that ends in a youtube-upload or tiktok-upload node.

## Rules

- Never call `run_pipeline` or `publish_pipeline` without telling the user the estimated cost, and never call `assemble_video` or `edit_asset` without telling the user it spends credits.
- Never publish anything the user did not ask you to publish.
- Everything you create is visible at https://www.trezalabs.com/platform, so name pipelines clearly.
- Account creation happens in the OAuth flow when the client connects. If tools return 401, the user needs to connect the server, not paste a key.
