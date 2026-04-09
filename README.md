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

- Vendor delays
- Customer EDI delays
- Operational bottlenecks

---

## Concurrency Safe

The application uses **Google Apps Script LockService** to prevent conflicts when multiple users submit records simultaneously.

---

# System Architecture

Warehouse Operators  
│  
└── Web Form (Apps Script UI)  
  │  
  ▼  
Google Apps Script Backend  
│  
└── Business Logic  
  │  
  ▼  
Google Sheets Database  

Sheets Used:
- MAIN_LOG
- MASTER_VENDOR
- MASTER_PART
- OPEN_POINTS

---

# Project Structure

Repository Structure:

edi-po-tracker-appscript  
│  
├── code.gs  
├── index.html  
└── README.md  

---

# Database Schema

## MAIN_LOG

| Column | Field |
|------|------|
| A | SR No |
| B | Receipt Date |
| C | Plant |
| D | Type |
| E | Vendor |
| F | Vendor Invoice No |
| G | DC No |
| H | EDI No |
| I | Customer Invoice No |
| J | Part No |
| K | Qty |
| L | Dock |
| M | Status |
| N | Closed On |
| O | Remark |
| P | Time Taken |

---

# Open Points Formula

`=IFERROR(FILTER(MAIN_LOG!A2:P, MAIN_LOG!M2:M="Pending"), "")`

---

# Tech Stack

- Google Apps Script
- Google Sheets
- HTML
- CSS
- JavaScript

---

# Deployment

1. Open the Apps Script project  
2. Deploy as **Web App**  
3. Grant permissions  
4. Share the link with operators  

---

# Use Case

Designed for:

- Warehouse operations
- Supply chain teams
- Inbound logistics
- Vendor coordination workflows

---

# Future Improvements

Possible enhancements:

- Email alerts for pending records
- Vendor aging reports
- Dashboard analytics
- Escalation alerts
- Mobile optimization

---

# License

MIT License

---

# Author

By Yash Aparajit

--
