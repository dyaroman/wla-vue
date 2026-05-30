![Deploy Status](https://github.com/dyaroman/wla-vue/actions/workflows/deploy.yml/badge.svg)

# Websites List App (WLA) – Vue Edition

### 🔗 [View Application](https://dyaroman.github.io/wla-vue/)

**Websites List App (WLA)** is a powerful, interactive index and management tool designed to track, filter, and analyze large collections of web applications.

This repository is the **Vue 3 + Pinia** edition of WLA – a from-scratch rewrite of the original [React edition](https://github.com/dyaroman/wla-react).

> ⚠️ **Data Privacy Note:** All production data has been replaced with realistic mock data to comply with non-disclosure agreements (NDAs) and prevent legal issues with the data owner.

**v3.0.0** – Vue 3, Pinia, Vite 7, Sass

---

## 🔄 Why a Vue Rewrite?

This edition grew out of the [WLA AQA dashboard](https://github.com/dyaroman/wla-aqa) – an E2E test-results dashboard I built with Vue. Working on it made me genuinely enjoy Vue, so I decided to rewrite WLA from the ground up and use the rewrite as a place to implement new ideas the React version never had.

The plan is for this version to eventually **replace the React edition in production**. That migration is still a work in progress – not everything I had planned is finished yet.

### ✨ Improvements over the React edition

- **Command palette (`Cmd`/`Ctrl` + `K`)** – one discoverable entry point for every action (reset filters / tags / sort, open settings drawers, help), replacing the React version's standalone hotkey system.
- **Toast notifications** – lightweight, non-blocking feedback for copy actions and background events.
- **Quick cell actions** – `Alt` + click a cell to filter by its value; `Cmd`/`Ctrl` + click to copy it (hex value for color cells).
- **How-to modal** – an in-app help screen, opened from the command palette.
- **OG image preview** – click a website's Open Graph image to open a full-size preview.
- **Fresh-data auto-reload** – after the tab has been hidden for a while, the app re-checks the backend with an `ETag` HEAD request and reloads automatically when the data has changed.

---

## 🚀 Why This Project Exists

WLA bridges the gap between technical infrastructure and business management, solving three core problems:

### 1. Feature & Campaign Auditing (Management)

Management frequently needs to audit which websites have (or lack) specific configurations, trackers, forms, or `campaignIds`. WLA provides an instant, searchable overview of the entire web ecosystem.

### 2. Boilerplate & Donor Selection (Development)

When launching a new website, developers often look for the best existing "donor" site to duplicate or use as a baseline. WLA lets you filter by features to find the perfect starting point.

### 3. Feature Build Indexing (CI/CD & QA)

During active development, feature branches deploy many test environments. WLA serves as a dynamic index where QA teams and stakeholders can:

- See exactly which websites belong to a specific feature build.
- Sort and filter environments based on their needs.
- Use a built-in **tracking checkbox** system to mark which sites have already been reviewed and which still need attention.

---

## 🎯 Educational Goals

Beyond solving real business problems, this repository is a personal sandbox for mastering modern web development. Where the React edition explores React 19 and Redux Toolkit, this one focuses on:

- Vue 3's Composition API and `<script setup>` single-file components.
- Pinia for ergonomic, modular state management.
- Building a fast, dependency-light UI on top of Vite.
