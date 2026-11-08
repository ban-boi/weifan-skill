#!/usr/bin/env node
"use strict";
/* ============================================================
   weifan-skill 一行安装器（零依赖，纯 Node，Windows/macOS/Linux 通用）

   把技能复制进本机已检测到的 Agent 用户级技能目录（全局技能，
   所有会话可用）。用法：

     npx github:ban-boi/weifan-skill            # 自动检测并安装（中文版）
     npx ban-boi/weifan-skill                   # 同上（npm 的 GitHub 短格式）
     npx github:ban-boi/weifan-skill --en       # 安装英文版（SKILL.en.md → SKILL.md）
     npx github:ban-boi/weifan-skill --list     # 只显示检测到的客户端，不写入
     npx github:ban-boi/weifan-skill --all      # 不做检测，全部候选客户端都装
     npx github:ban-boi/weifan-skill --client=claude   # 只装指定客户端

   技能本体是纯指令（SKILL.md），本安装器只做本机文件复制。
   ============================================================ */
const fs = require("fs");
const path = require("path");
const os = require("os");

const NAME = "weifan";
const HOME = os.homedir();

/* 候选客户端：probe 目录存在 = 视为已安装该客户端 */
const CLIENTS = [
  { id: "agents", label: "通用 Agent 目录（ZCode / OpenClaw 等）", base: [".agents", "skills"], probe: ".agents" },
  { id: "zcode",  label: "ZCode（旧版目录）",                     base: [".zcode", "skills"],  probe: ".zcode" },
  { id: "claude", label: "Claude Code",                           base: [".claude", "skills"], probe: ".claude" },
  { id: "cursor", label: "Cursor",                                base: [".cursor", "skills"], probe: ".cursor" },
];

/* 参数解析 */
const args = process.argv.slice(2);
const getArg = (k) => args.find((a) => a === k || a.startsWith(k + "="));
const has = (k) => Boolean(getArg(k));
const EN = has("--en");
const LIST_ONLY = has("--list");
const ALL = has("--all");
const clientArg = getArg("--client");
const CLIENT_FILTER = clientArg ? clientArg.split("=")[1] : null;

const skillSrc = EN ? path.join(__dirname, "SKILL.en.md") : path.join(__dirname, "SKILL.md");

function targetDir(c) {
  return path.join(HOME, ...c.base, NAME);
}

function detected(c) {
  return fs.existsSync(path.join(HOME, c.probe));
}

function pick() {
  let list = CLIENTS;
  if (CLIENT_FILTER) {
    list = list.filter((c) => c.id === CLIENT_FILTER);
    if (list.length === 0) {
      console.error(`未知客户端 id：${CLIENT_FILTER}（unknown client id）`);
      console.error(`可选值 / available: ${CLIENTS.map((c) => c.id).join(", ")}`);
      process.exit(1);
    }
    return list;
  }
  if (ALL) return list;
  const hit = list.filter(detected);
  /* 一个都没检测到 → 退回通用 Agent 目录 */
  if (hit.length === 0) return [CLIENTS[0]];
  return hit;
}

function installInto(c) {
  const dir = targetDir(c);
  const skillFile = path.join(dir, "SKILL.md");
  /* 已有同名技能且内容不同 → 先备份，避免悄悄覆盖用户自己的修改 */
  if (fs.existsSync(skillFile)) {
    const old = fs.readFileSync(skillFile, "utf8");
    if (old !== fs.readFileSync(skillSrc, "utf8")) {
      const bak = path.join(dir, `SKILL.md.bak-${Date.now()}`);
      fs.writeFileSync(bak, old);
      console.log(`  ↺ 目标已存在且内容不同，旧版已备份：${bak}`);
    }
  }
  fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(skillSrc, skillFile);
  for (const f of ["README.md", "LICENSE"]) {
    const src = path.join(__dirname, f);
    if (fs.existsSync(src)) fs.copyFileSync(src, path.join(dir, f));
  }
  console.log(`  ✓ ${c.label}`);
  console.log(`    ${skillFile}`);
}

function main() {
  console.log(`weifan · 架构喂饭模式 — Agent Skill 安装器${EN ? "（英文版）" : ""}`);
  console.log("");
  if (LIST_ONLY) {
    console.log("检测到的客户端 / detected clients:");
    for (const c of CLIENTS) {
      console.log(`  ${detected(c) ? "✓" : "·"} ${c.id.padEnd(8)} ${c.label}${detected(c) ? "" : "（未检测到）"}`);
    }
    console.log("");
    console.log(`不带参数将安装到：${pick().map((c) => targetDir(c)).join("、")}`);
    return;
  }

  if (!fs.existsSync(skillSrc)) {
    console.error(`找不到技能文件 / missing: ${skillSrc}`);
    process.exit(1);
  }

  const targets = pick();
  console.log(`安装到 ${targets.length} 个客户端 / installing to ${targets.length} client(s):`);
  for (const c of targets) installInto(c);

  console.log("");
  console.log("完成 / done。重启你的 Agent 客户端，然后说「喂饭」即可进入架构教练模式。");
  console.log("(Restart your agent client, then say \"weifan\" to enter coaching mode.)");
}

main();
