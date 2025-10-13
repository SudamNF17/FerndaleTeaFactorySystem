# City Selection Map Pin Fix - Testing Guide

## What Was Fixed 🔧

Fixed the issue where selecting a city from the autocomplete dropdown wasn't correctly updating the map pin position.

## Changes Made

### 1. Enhanced `handleCitySelect` Function
- Added coordinate validation
- Added debug logging to track selection
- Ensured coordinates are properly parsed as floats
- Added error handling for invalid coordinates

```javascript
const handleCitySelect = (suggestion) => {
  console.log("Selected city:", suggestion);
  console.log("Coordinates - Lat:", suggestion.lat, "Lng:", suggestion.lng);
  
  // Ensure coordinates are valid numbers
  const newLat = parseFloat(suggestion.lat);
  const newLng = parseFloat(suggestion.lng);
  
  if (isNaN(newLat) || isNaN(newLng)) {
    console.error("Invalid coordinates:", suggestion);
    alert("Invalid location coordinates. Please try another city.");
    return;
  }
  
  setFormData((prev) => ({
    ...prev,
    collectedLocationName: suggestion.name,
    collectedLocation: { lat: newLat, lng: newLng },
  }));
  
  setShowSuggestions(false);
  setCitySuggestions([]);
  
  console.log("Updated location:", { lat: newLat, lng: newLng });
};
```

### 2. Improved `MapUpdater` Component
- Added validation for center coordinates
- Added smooth animation for map transitions
- Added debug logging to track map updates
- Added safety checks before calling setView

```javascript
function MapUpdater({ center, zoom }) {
  const map = useMap();
  
  useEffect(() => {
    console.log("MapUpdater - Updating map center to:", center, "zoom:", zoom);
    if (map && center && center.length === 2 && !isNaN(center[0]) && !isNaN(center[1])) {
      map.setView(center, zoom, {
        animate: true,
        duration: 1
      });
    }
  }, [center, zoom, map]);
  
  return null;
}
```

### 3. Enhanced MapContainer
- Added scrollWheelZoom for better interaction
- Added proper attribution
- Kept MapUpdater for dynamic updates
- Maintained draggable marker functionality

## Testing Instructions 📋

### Step 1: Open Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Keep it open to see debug logs

### Step 2: Navigate to Page
```
http://localhost:3000/inventory/add-supply/raw-materials
```

### Step 3: Test City Selection

#### Test Case 1: Select Colombo
1. Click on "Collected Location Name" field
2. Type "Colombo"
3. Wait for dropdown to appear
4. Click on "Colombo" from the list

**Expected Results:**
- Console shows: "Selected city: {name, lat, lng, city}"
- Console shows: "Coordinates - Lat: 6.9270786 Lng: 79.861243"
- Console shows: "Updated location: {lat: 6.9270786, lng: 79.861243}"
- Console shows: "MapUpdater - Updating map center to: [6.9270786, 79.861243] zoom: 13"
- Map smoothly animates to Colombo
- Pin appears at Colombo location
- Input field shows full address

#### Test Case 2: Select Kandy
1. Clear the location field
2. Type "Kandy"
3. Click on "Kandy" from dropdown

**Expected Results:**
- Map animates to Kandy (Lat: ~7.29, Lng: ~80.63)
- Pin moves to Kandy
- Location field updated

#### Test Case 3: Select Galle
1. Clear the location field
2. Type "Galle"
3. Select "Galle" from dropdown

**Expected Results:**
- Map moves to southern Sri Lanka
- Pin positioned at Galle (Lat: ~6.05, Lng: ~80.22)

### Step 4: Verify Map Interaction

#### Test Dragging Pin
1. After selecting a city, drag the pin to a different location
2. **Expected**: Location name updates automatically

#### Test Zoom
1. Use mouse wheel to zoom in/out
2. **Expected**: Map zooms properly, pin stays in place

### Step 5: Test Edge Cases

#### Invalid City Search
1. Type "xyz123abc"
2. **Expected**: No dropdown appears (no matching cities)

#### Quick Switching
1. Type "Colombo" and select it
2. Immediately type "Kandy" and select it
3. Type "Galle" and select it
4. **Expected**: Map smoothly transitions between locations

## Debug Console Output Example 🖥️

When selecting Colombo, you should see:
```
Selected city: {
  name: "Colombo, Western Province, Sri Lanka",
  lat: 6.9270786,
  lng: 79.861243,
  city: "Colombo"
}
Coordinates - Lat: 6.9270786 Lng: 79.861243
Updated location: {lat: 6.9270786, lng: 79.861243}
MapUpdater - Updating map center to: [6.9270786, 79.861243] zoom: 13
```

## Troubleshooting 🔍

### Issue: Map Not Moving
**Check:**
1. Open browser console - any errors?
2. Are coordinates valid numbers?
3. Check console logs - is MapUpdater being called?

**Solution:**
- If you see coordinate validation errors, the API might be returning invalid data
- Try a different city
- Check internet connection

### Issue: Pin Not Appearing
**Check:**
1. Are coordinates within valid ranges?
   - Latitude: -90 to 90
   - Longitude: -180 to 180
2. Is marker position array properly formatted?

**Solution:**
- Check console for coordinate values
- Verify `formData.collectedLocation` structure

### Issue: Map Jumps Back
**Check:**
1. Are there multiple state updates happening?
2. Is drag event interfering?

**Solution:**
- Check console for multiple "Updated location" logs
- Ensure only one update per selection

## What to Look For ✅

### Successful Selection Indicators:
- ✅ Console log shows selected city data
- ✅ Console log shows coordinate parsing
- ✅ Console log shows map update
- ✅ Map smoothly animates to new location (1 second duration)
- ✅ Pin appears at correct position
- ✅ Location input shows full address
- ✅ Dropdown closes automatically
- ✅ Coordinates displayed below map are correct

### Signs of Issues:
- ❌ Console errors about NaN or undefined
- ❌ Map doesn't move
- ❌ Pin stays at old location
- ❌ Multiple rapid map updates
- ❌ Map jumps to default location (6.9271, 79.8612)

## Technical Details 🔧

### Coordinate Format
- **API Returns**: String values like "6.9270786"
- **We Parse**: `parseFloat()` converts to numbers
- **Map Expects**: Array `[lat, lng]` with numbers

### State Update Flow
```
User clicks city
    ↓
handleCitySelect(suggestion)
    ↓
Parse coordinates (parseFloat)
    ↓
Validate (isNaN check)
    ↓
Update formData.collectedLocation
    ↓
React re-renders component
    ↓
MapUpdater receives new center prop
    ↓
useEffect triggers
    ↓
map.setView() called with animation
    ↓
Map smoothly pans to new location
```

### Why parseFloat?
The Nominatim API returns coordinates as strings:
```json
{
  "lat": "6.9270786",  // ← STRING!
  "lon": "79.861243"   // ← STRING!
}
```

We need numbers for the map:
```javascript
const newLat = parseFloat(suggestion.lat);  // 6.9270786 (number)
const newLng = parseFloat(suggestion.lng);  // 79.861243 (number)
```

## Common Sri Lankan Cities for Testing 🗺️

| City | Approx Lat | Approx Lng | Region |
|------|-----------|-----------|--------|
| Colombo | 6.93 | 79.86 | Western |
| Kandy | 7.29 | 80.63 | Central |
| Galle | 6.05 | 80.22 | Southern |
| Jaffna | 9.66 | 80.01 | Northern |
| Trincomalee | 8.58 | 81.23 | Eastern |
| Negombo | 7.21 | 79.84 | Western |
| Nuwara Eliya | 6.97 | 80.78 | Central |
| Anuradhapura | 8.31 | 80.40 | North Central |
| Matara | 5.95 | 80.54 | Southern |
| Batticaloa | 7.73 | 81.70 | Eastern |

## Success Criteria ✨

The fix is working correctly if:
1. ✅ Selecting any city from dropdown updates the map
2. ✅ Pin moves to the correct city location
3. ✅ Map animates smoothly (not instant jump)
4. ✅ No console errors
5. ✅ Location name updates properly
6. ✅ Can select multiple cities in sequence
7. ✅ Manual pin dragging still works
8. ✅ Coordinates display correctly below map

## Additional Notes 📝

- **Animation Duration**: Set to 1 second for smooth transition
- **Zoom Level**: Automatically zooms to level 13 (good city view)
- **Debug Logs**: Can be removed in production by deleting console.log statements
- **Error Handling**: Invalid coordinates show alert and prevent map update

---

**Testing Date**: October 13, 2025
**Status**: ✅ Ready for Testing
**Expected Outcome**: Map pin correctly updates when selecting cities from dropdown
