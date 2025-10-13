# Quick Start Guide - City Autocomplete Feature

## What Was Added? 🎯

A smart city search feature on the Raw Materials page that:
- ✅ Shows matching cities as you type
- ✅ Auto-updates the map when you select a city
- ✅ Moves the pin to the exact location
- ✅ Works for all cities in Sri Lanka

## How to Use It 🚀

### Step 1: Navigate to Page
```
http://localhost:3000/inventory/add-supply/raw-materials
```

### Step 2: Start Typing
1. Find the "Collected Location Name" field
2. Start typing a city name (e.g., "Colombo")
3. Wait a moment (300ms) for suggestions

### Step 3: Select City
1. Click on your desired city from the dropdown
2. Watch the magic happen:
   - ✨ Input field updates with full address
   - 📍 Map centers on the selected city
   - 📌 Pin jumps to exact coordinates

### Step 4: Fine-tune (Optional)
- Drag the pin to adjust exact location
- Location name updates automatically

## Visual Flow 📋

```
User Types "Colombo"
        ↓
[Searching cities... (300ms delay)]
        ↓
Dropdown appears with suggestions:
┌─────────────────────────────────┐
│ Colombo                         │ ← Click here
│ Colombo, Western Province...   │
├─────────────────────────────────┤
│ Colombo Fort                    │
│ Colombo 07, Western Province... │
├─────────────────────────────────┤
│ Mount Lavinia                   │
│ Mount Lavinia, Colombo...       │
└─────────────────────────────────┘
        ↓
Map Updates + Pin Moves + Coordinates Update
```

## What Happens Behind the Scenes 🔧

```javascript
1. User types → Debounced search (300ms)
                    ↓
2. API Call → Nominatim (OpenStreetMap)
                    ↓
3. Results → Filtered & Formatted
                    ↓
4. Display → Dropdown with 5 suggestions
                    ↓
5. Click → Update location + coordinates
                    ↓
6. Map → Re-center + Move pin (zoom level 13)
```

## Key Features ⭐

| Feature | Description |
|---------|-------------|
| **Auto-complete** | Instant city suggestions while typing |
| **Debouncing** | Smart 300ms delay to reduce API calls |
| **Map Integration** | Automatic map updates on selection |
| **Draggable Pin** | Manual fine-tuning still available |
| **Reverse Geocoding** | Dragging pin updates location name |
| **Loading State** | Shows "Searching cities..." indicator |
| **Hover Effects** | Visual feedback on dropdown items |

## Example Searches 🔍

Try these cities:
- **Major Cities**: Colombo, Kandy, Galle, Jaffna
- **Hill Country**: Nuwara Eliya, Ella, Bandarawela
- **Coastal**: Negombo, Trincomalee, Batticaloa
- **Central**: Kurunegala, Anuradhapura, Polonnaruwa

## Technical Stack 💻

```
Frontend
├── React (Hooks: useState, useEffect)
├── React-Leaflet (Map component)
├── Nominatim API (Geocoding)
├── Custom CSS (Dropdown styling)
└── Debounce (Performance optimization)

API
└── OpenStreetMap Nominatim
    ├── Search: City autocomplete
    └── Reverse: Coordinate to address
```

## Files Modified 📁

```
frontend/src/Components/Inventory/
├── AddRawMaterial.js
│   ├── + searchCities() function
│   ├── + handleLocationChange() with debounce
│   ├── + handleCitySelect() for selection
│   ├── + MapUpdater component (dynamic map)
│   └── + City suggestions state management
│
└── AddRawMaterial.css
    ├── + .city-suggestions-dropdown
    ├── + .suggestion-item
    ├── + .location-input-wrapper
    └── + Hover & loading styles
```

## Testing Checklist ✅

- [ ] Start frontend: `npm start` in frontend folder
- [ ] Navigate to raw materials page
- [ ] Type "Colombo" in location field
- [ ] See dropdown with suggestions
- [ ] Click on a city
- [ ] Verify map updates
- [ ] Verify pin moves
- [ ] Drag pin manually
- [ ] Check coordinates display
- [ ] Try different cities

## Troubleshooting 🔧

| Issue | Solution |
|-------|----------|
| Dropdown not appearing | Type at least 2 characters |
| No suggestions | Check internet connection |
| Map not updating | Refresh page, check console |
| Slow response | Normal - API call takes 1-2 seconds |

## Performance Metrics 📊

```
⚡ Debounce Delay: 300ms
🔢 Max Suggestions: 5 cities
⏱️ API Response Time: ~1-2 seconds
📏 Coordinate Precision: 5 decimal places
🗺️ Zoom Level: 13 (good city view)
```

## Before vs After 🔄

### Before
```
❌ User had to type exact location manually
❌ No help finding coordinates
❌ Had to use external tools to find lat/lng
❌ Risk of typos in location names
```

### After
```
✅ Autocomplete suggestions while typing
✅ Instant coordinate lookup
✅ One-click city selection
✅ Accurate, validated location data
✅ Beautiful dropdown UI
✅ Map updates automatically
```

## Quick Code Reference 📝

### Search Function
```javascript
const searchCities = async (query) => {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${query},Sri Lanka&format=json&limit=5`
  );
  const data = await res.json();
  // Format and display suggestions
};
```

### Selection Handler
```javascript
const handleCitySelect = (suggestion) => {
  setFormData({
    ...formData,
    collectedLocationName: suggestion.name,
    collectedLocation: { 
      lat: suggestion.lat, 
      lng: suggestion.lng 
    }
  });
};
```

### Map Updater
```javascript
function MapUpdater({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}
```

## Need Help? 🆘

1. **Check browser console** (F12) for errors
2. **Verify internet connection** (API requires online access)
3. **Clear browser cache** if styling looks wrong
4. **Try different browsers** (Chrome, Firefox recommended)
5. **Check Nominatim status** at status.openstreetmap.org

---

**Ready to Test!** 🎉

Just start your frontend server and navigate to the raw materials page. Start typing a city name and watch the magic happen!

**Created**: October 13, 2025
**Status**: ✅ Ready for Use
