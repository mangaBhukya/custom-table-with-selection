# Paginated Table - Customized Row Selection (Vite + React + PrimeReact)

A simple and clean React application using **Vite**, **TypeScript**, and **PrimeReact** to render a paginated table that supports row selection across pages.

## Features

- Built with Vite for fast development
- Data fetched from a paginated API (Art Institute of Chicago API used as example)
- Select rows across multiple pages
- Input-based row fetch using OverlayPanel (e.g., fetch exactly 15 rows)
- Styled with Tailwind CSS + PrimeReact components
- Efficient memory usage — doesn't load full dataset

## Tech Stack

- **React + TypeScript**
- **Vite**
- **PrimeReact** (DataTable, OverlayPanel, Button, InputNumber)
- **Tailwind CSS**
- **Axios** for API calls

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/mangaBhukya/custom-table-with-selection.git
cd custom-table-with-selection
```

### 2. nstall dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

The app will be running at http://localhost:5173.

## How It Works

- Uses DataTable from PrimeReact with server-side pagination.
- Maintains selected rows across multiple pages using custom logic.

  - Updates selected rows across pages by removing old ones from the current page and adding new selections.
  - Helps keep only the latest selected rows from all pages together.

- An OverlayPanel lets you enter a number, then fetches only that many rows page by page from the API.
- Avoids full dataset storage by slicing results per user input.
