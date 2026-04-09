# EDI / PO Tracking System

![Google Apps Script](https://img.shields.io/badge/Google%20Apps%20Script-4285F4?logo=google&logoColor=white)
![Google Sheets](https://img.shields.io/badge/Google%20Sheets-34A853?logo=googlesheets&logoColor=white)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success)
![License](https://img.shields.io/badge/License-MIT-blue)

A lightweight **EDI / PO tracking system built with Google Apps Script and Google Sheets** to streamline warehouse operations.

This tool replaces manual spreadsheets used to track **EDI issues, pending PO confirmations, and inbound delivery challans (DC)**.

It provides a simple **web interface for logging issues, closing records, and automatically tracking open problems**.

---

# Overview

Many warehouses maintain separate Excel sheets to track:

- Vendor DCs without EDI
- Pending purchase order confirmations
- Inward deliveries waiting for EDI numbers
- Manual follow-ups with customers

This project digitizes that process using **Google Apps Script Web Apps**.

Operators log issues through a web form and close them once resolved.

All records are stored in a central **Google Sheet database**.

---

# Features

### Log DC / Invoice Issues
Operators can log:

- Plant
- Vendor
- Type (Without EDI / Inward DC)
- Vendor Invoice Number
- DC Number
- Part Number
- Quantity
- Dock
- Remarks

Records are stored in a central **MAIN_LOG** sheet.

---

### Close Pending Records

Operators can close open entries by entering:

- EDI number (for Without EDI cases)
- Customer invoice number (for Inward DC)

The system automatically:

- Updates status
- Records closing date
- Calculates time taken to resolve

---

### Open Points Dashboard

An **Open Points sheet** automatically displays all pending issues using a live filter.

It includes:

- Vendor
- DC / Invoice numbers
- Aging tracker
- Pending status

This sheet can be shared directly with customers to highlight unresolved issues.

---

### Aging Tracker

The system automatically tracks how long an issue remained open.

This helps identify:

- vendor delays
- customer EDI delays
- operational bottlenecks

---

### Concurrency Safe

The system uses **Google Apps Script LockService** to prevent conflicts when multiple users submit records simultaneously.

This ensures reliable logging in multi-user environments.

---

# System Architecture
