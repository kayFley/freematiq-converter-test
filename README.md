## Overview

This Currency Converter is a React-based application that allows users to:

- Convert between multiple currencies in real-time
- Add and manage multiple currency pairs
- Swap currencies with a single click
- View current exchange rates
- Save conversion pairs to local storage

The app fetches live exchange rates from the Central Bank of Russia API.

## Key Features

- 💱 Real-time currency conversion
- ➕ Add multiple currency pairs
- 🔄 Swap currencies with one click
- 💾 Local storage persistence
- 📱 Responsive design
- ⚡ Fast and intuitive interface

## Installation

### Prerequisites

- Node.js

### Steps

1. Clone the repository:
2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm run dev
# or
bun dev
```

4. Open your browser and visit:

```
http://localhost:5173
```

## Usage

### Adding Currency Pairs

1. Click the "Добавить пару валют" (Add currency pair) button at the bottom
2. Two new conversion fields will appear

### Converting Currencies

1. Enter an amount in the first field
2. The equivalent amount will automatically appear in the second field
3. The current exchange rate will display below the pair

### Changing Currencies

1. Click the currency selector next to an amount field
2. Choose a new currency from the dropdown menu
3. The conversion will automatically update

### Swapping Currencies

1. Click the swap icon (↔️) between two currencies
2. The currencies and amounts will instantly swap positions

### Removing a Pair

1. Click the "×" icon in the top-right corner of a currency pair
2. The pair will be removed from your list

## Customization

### Adding New Currencies

To add new currencies, edit `src/constants/coins.ts`:

```ts
export const COINS = [
	// ... existing currencies
	{ id: 'PLN', name: 'PLN', code: 'PL', title: 'Польша' },
]
```
