#!/usr/bin/env node
// scripts/regen-types.cjs
//
// Headless regeneration of `prismicio-types.d.ts`. Slice Machine's adapter
// generates types as a side effect of slice/customtype hooks (see
// node_modules/@slicemachine/adapter-next/dist/plugin.js — `upsertGlobalTypeScriptTypes`
// is called from slice-update / custom-type-update hooks). To trigger a
// regen without the SM UI, we invoke `slices.updateSlice()` once with an
// existing slice's current model — a no-op file write, but it fires the
// hook chain that rewrites the types file.

const { createSliceMachineManager } = require("@slicemachine/manager");

(async () => {
  const manager = createSliceMachineManager({ cwd: process.cwd() });
  await manager.plugins.initPlugins();

  const { sliceIDs } = await manager.slices.readSliceLibrary({ libraryID: "./slices" });
  if (!sliceIDs?.length) {
    console.error("No slices found in ./slices — cannot trigger regen.");
    process.exit(1);
  }

  // Use the first slice as the trigger.
  const triggerID = sliceIDs[0];
  const { model, errors: readErrors } = await manager.slices.readSlice({
    libraryID: "./slices",
    sliceID: triggerID,
  });
  if (readErrors?.length) {
    console.error("Failed to read trigger slice:", readErrors);
    process.exit(1);
  }

  console.log(`Triggering types regeneration via slice update on "${triggerID}"...`);
  const { errors } = await manager.slices.updateSlice({ libraryID: "./slices", model });
  if (errors?.length) {
    console.error("Errors during update:", errors);
    process.exit(1);
  }

  console.log("Done. prismicio-types.d.ts should now reflect all 16 slices + 6 custom types.");
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
