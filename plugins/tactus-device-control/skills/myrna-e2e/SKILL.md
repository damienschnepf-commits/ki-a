---
name: myrna-e2e
description: Run the existing JoyHub Myrna end-to-end acceptance action through Tactus and Intiface using only reported device capabilities.
---

Use the bundled `tactus` MCP server.

For the acceptance action:

1. Call `server_status`.
2. Call `list_devices` and select the device whose reported name is exactly `JoyHub Myrna`. Do not invent a device id.
3. Use only a capability actually reported for that device.
4. For the first acceptance action, use vibration at intensity 0.15 or the nearest valid value accepted by the tool schema.
5. Keep the action brief. The MCP process is configured with a 1.5 second continuous-output watchdog.
6. Stop the selected device with `stop_device` immediately after the brief action. If device state is ambiguous or stop fails, call `stop_all`.
7. Report PASS only after the tool calls succeed and the operator confirms real physical movement and a clean stop. Otherwise report the first failed boundary only.

Do not change Intiface, Bluetooth pairing, project architecture, or device definitions during this workflow.
