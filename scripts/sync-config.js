#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const configPath = path.join(root, "config", "config.js");
const statePath = path.join(root, "config", ".sync-state.json");

function readConfig() {
  const source = fs.readFileSync(configPath, "utf8");
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: configPath });
  if (!sandbox.window.SITE_CONFIG) {
    throw new Error("config/config.js did not define window.SITE_CONFIG.");
  }
  return sandbox.window.SITE_CONFIG;
}

function readState() {
  try {
    return JSON.parse(fs.readFileSync(statePath, "utf8"));
  } catch (error) {
    return {};
  }
}

function writeState(config) {
  const state = {
    brandName: config.brand.name,
    legalName: config.brand.legalName,
    email: config.contact.recipientEmail,
    address: config.contact.address
  };
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2) + "\n");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function replaceAll(source, from, to) {
  if (!from || from === to) return source;
  return source.replace(new RegExp(escapeRegExp(from), "g"), to);
}

function walk(directory, files = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules" || entry.name === "assets/images") continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(fullPath, files);
    else files.push(fullPath);
  }
  return files;
}

function shouldSyncFile(filePath) {
  const relative = path.relative(root, filePath);
  if (relative === path.join("config", ".sync-state.json")) return false;
  if (relative === path.join("scripts", "sync-config.js")) return false;
  return /\.(html|php|js|css|md|json)$/i.test(filePath);
}

const config = readConfig();
const state = readState();
const legacy = config.legacy || {};

const replacements = [
  [state.legalName, config.brand.legalName],
  [state.brandName, config.brand.name],
  [state.email, config.contact.recipientEmail],
  [state.address, config.contact.address],
  [legacy.legalName || "Nearloom Local Ltd.", config.brand.legalName],
  [legacy.brandName || "Nearloom", config.brand.name],
  [legacy.email || "hello@nearloomlocal.com", config.contact.recipientEmail],
  [legacy.address || "24 Meridian Court, Leeds, LS1 4AB, United Kingdom", config.contact.address]
]
  .filter(([from, to]) => typeof from === "string" && typeof to === "string" && from && from !== to)
  .sort((a, b) => b[0].length - a[0].length);

let changed = 0;

for (const filePath of walk(root).filter(shouldSyncFile)) {
  const before = fs.readFileSync(filePath, "utf8");
  let after = before;
  for (const [from, to] of replacements) {
    after = replaceAll(after, from, to);
  }
  if (after !== before) {
    fs.writeFileSync(filePath, after);
    changed += 1;
    console.log("updated " + path.relative(root, filePath));
  }
}

writeState(config);
console.log("config sync complete. files changed: " + changed);
