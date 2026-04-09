# EDI / PO Tracking System

![Google Apps Script](https://img.shields.io/badge/Google%20Apps%20Script-4285F4?logo=google&logoColor=white)
![Google Sheets](https://img.shields.io/badge/Google%20Sheets-34A853?logo=googlesheets&logoColor=white)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success)
![License](https://img.shields.io/badge/License-MIT-blue)

A lightweight **EDI / PO tracking system built using Google Apps Script and Google Sheets** to streamline warehouse operations.

The tool replaces manual spreadsheets used to track:

- EDI issues
- Pending PO confirmations
- Inbound DC problems
- Vendor follow-ups

Operators log issues through a **web form**, and close them once resolved.

---

# Overview

Many warehouses track pending deliveries using manual Excel sheets.  
This project digitizes that workflow using **Google Apps Script Web Apps**.

Operators can:

- Log DC or invoice issues
- Track pending EDI confirmations
- Close records once resolved
- Monitor open issues via dashboard

All records are stored in **Google Sheets**.

---

# Features

## Log DC / Invoice Issues

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

All entries are stored in the **MAIN_LOG** sheet.

---

## Close Pending Records

Operators close issues by entering:

- **EDI Number** (for Without EDI cases)
- **Customer Invoice Number** (for Inward DC)

The system automatically:

- Updates status
- Records closing date
- Calculates time taken

---

## Open Points Dashboard

The **OPEN_POINTS** sheet automatically displays all pending issues.

It includes:

- Vendor
- DC / Invoice numbers
- Aging tracker
- Pending status

This sheet can be shared with customers to highlight unresolved issues.

---

## Aging Tracker

The system tracks how long each issue remains open.

This helps identify:

- vendor delays
- customer EDI delays
- operational bottlenecks

---

## Concurrency Safe

The application uses **Google Apps Script LockService** to prevent data conflicts when multiple users submit records simultaneously.

---

# System Architecture
