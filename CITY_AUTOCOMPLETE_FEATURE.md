# City Autocomplete with Map Integration Feature

## Overview
This document describes the city autocomplete feature implemented for the Raw Materials inventory page, allowing users to search for cities in Sri Lanka and automatically update the map pin location.

## Page Location
**URL**: `http://localhost:3000/inventory/add-supply/raw-materials`

## Features Implemented

### 1. City Autocomplete Search

#### How It Works
- User starts typing a city name in the "Collected Location Name" field
- After typing 2+ characters, the system searches for matching cities in Sri Lanka
- A dropdown appears showing up to 5 matching locations
- Each suggestion displays:
  - **City Name** (bold, prominent)
  - **Full Address** (smaller text below)

#### Search Behavior
- **Debounced Search**: 300ms delay after user stops typing
- **Minimum Characters**: 2 characters required to trigger search
- **Auto-close**: Dropdown closes when clicking a suggestion or blurring the input
- **Loading State**: Shows "Searching cities..." while API call is in progress

### 2. Map Integration

#### Dynamic Map Updates
When a user selects a city from the dropdown:
1. **Location Input Updates**: Field populated with full address
2. **Map Re-centers**: Map view moves to the selected city
3. **Marker Updates**: Pin moves to exact coordinates
4. **Zoom Level**: Map zooms to level 13 for better visibility

#### Manual Map Interaction
- **Draggable Marker**: Users can still drag the pin manually
- **Reverse Geocoding**: Dragging updates the location name
- **Coordinates Display**: Lat/Lng shown below map (5 decimal precision)

### 3. User Experience Enhancements

#### Visual Feedback
- Hover effects on dropdown items (light blue highlight)
- Loading indicator while searching
- Smooth transitions and animations
- Professional styling with shadows

#### Accessibility
- Keyboard navigation support
- Clear placeholder text with instructions
- Autocomplete disabled to prevent browser interference
- Focus/blur event handling

## Technical Implementation

### Frontend Changes (`AddRawMaterial.js`)

#### New State Variables
```javascript
const [citySuggestions, setCitySuggestions] = useState([]);
const [showSuggestions, setShowSuggestions] = useState(false);
const [searchingCities, setSearchingCities] = useState(false);
```

#### Key Functions

##### 1. `searchCities(query)`
- Calls Nominatim API (OpenStreetMap)
- Searches for locations in Sri Lanka
- Filters and formats results
- Updates suggestions state

```javascript
const searchCities = async (query) => {
  // Minimum 2 characters required
  if (!query || query.length < 2) return;
  
  // API call to Nominatim
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      query
    )},Sri Lanka&format=json&limit=5&addressdetails=1`
  );
  
  // Process and format results
  const suggestions = data.map((item) => ({
    name: item.display_name,
    lat: parseFloat(item.lat),
    lng: parseFloat(item.lon),
    city: item.address?.city || item.address?.town || ...
  }));
};
```

##### 2. `handleLocationChange(e)`
- Debounces user input (300ms delay)
- Updates form data
- Triggers city search

```javascript
const handleLocationChange = (e) => {
  const value = e.target.value;
  setFormData((prev) => ({
    ...prev,
    collectedLocationName: value,
  }));
  
  // Debounce search
  if (window.locationSearchTimeout) {
    clearTimeout(window.locationSearchTimeout);
  }
  
  window.locationSearchTimeout = setTimeout(() => {
    searchCities(value);
  }, 300);
};
```

##### 3. `handleCitySelect(suggestion)`
- Updates location name
- Updates coordinates
- Closes dropdown
- Triggers map update

```javascript
const handleCitySelect = (suggestion) => {
  setFormData((prev) => ({
    ...prev,
    collectedLocationName: suggestion.name,
    collectedLocation: { lat: suggestion.lat, lng: suggestion.lng },
  }));
  setShowSuggestions(false);
};
```

##### 4. `MapUpdater` Component
- Custom React-Leaflet component
- Dynamically updates map center
- Responds to coordinate changes

```javascript
function MapUpdater({ center, zoom }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
}
```

### CSS Styling (`AddRawMaterial.css`)

#### Dropdown Container
```css
.city-suggestions-dropdown {
  position: absolute;
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-height: 250px;
  overflow-y: auto;
  width: calc(100% - 2px);
  z-index: 1000;
  margin-top: 2px;
}
```

#### Suggestion Items
```css
.suggestion-item {
  padding: 12px 15px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s ease;
}

.suggestion-item:hover {
  background-color: #e3f2fd;
}
```

#### Input Wrapper
```css
.location-input-wrapper {
  position: relative;
  width: 100%;
  max-width: 400px;
}
```

## API Integration

### Nominatim API (OpenStreetMap)

#### Search Endpoint
```
https://nominatim.openstreetmap.org/search
```

**Parameters**:
- `q`: Search query + ", Sri Lanka"
- `format`: "json"
- `limit`: 5
- `addressdetails`: 1

**Response Structure**:
```json
[
  {
    "display_name": "Colombo, Western Province, Sri Lanka",
    "lat": "6.9270786",
    "lon": "79.861243",
    "address": {
      "city": "Colombo",
      "state": "Western Province",
      "country": "Sri Lanka"
    }
  }
]
```

#### Reverse Geocoding (Existing)
```
https://nominatim.openstreetmap.org/reverse
```

**Parameters**:
- `lat`: Latitude
- `lon`: Longitude
- `format`: "json"

## Usage Instructions

### For End Users

1. **Navigate to Raw Materials Page**
   - Go to `http://localhost:3000/inventory/add-supply/raw-materials`

2. **Enter City Name**
   - Click on "Collected Location Name" field
   - Start typing a city name (e.g., "Colombo", "Kandy", "Galle")
   - Wait for suggestions to appear

3. **Select City**
   - Click on desired city from dropdown
   - Map will automatically update
   - Pin moves to selected location

4. **Fine-tune Location** (Optional)
   - Drag the map pin to adjust exact location
   - Location name updates automatically

5. **Complete Form**
   - Fill in remaining fields
   - Submit form as usual

### Examples of Searchable Cities

**Major Cities**:
- Colombo
- Kandy
- Galle
- Jaffna
- Negombo
- Trincomalee
- Batticaloa
- Matara
- Kurunegala
- Anuradhapura

**Areas/Districts**:
- Nuwara Eliya
- Ratnapura
- Badulla
- Ampara
- Hambantota

## Testing the Feature

### Prerequisites
1. Frontend server running on `http://localhost:3000`
2. Internet connection (for Nominatim API calls)
3. Modern web browser

### Test Scenarios

#### Test 1: Basic Search
1. Type "Colombo" in location field
2. **Expected**: Dropdown shows Colombo and nearby areas
3. Click on main Colombo entry
4. **Expected**: Map centers on Colombo, pin moves to location

#### Test 2: Partial Matching
1. Type "Kan"
2. **Expected**: Shows Kandy, Kankesanthurai, etc.
3. Select "Kandy"
4. **Expected**: Map updates to Kandy location

#### Test 3: Loading State
1. Type quickly "Galle"
2. **Expected**: Brief "Searching cities..." message
3. Results appear within 1-2 seconds

#### Test 4: No Results
1. Type "xyz123" (invalid city)
2. **Expected**: No dropdown appears
3. Can still enter manually and use map

#### Test 5: Manual Override
1. Select a city from dropdown
2. Manually drag the pin to different location
3. **Expected**: Location name updates via reverse geocoding

### Known Behaviors

#### Debouncing
- Search triggers 300ms after user stops typing
- Prevents excessive API calls
- Provides smooth user experience

#### API Rate Limiting
- Nominatim has usage policies
- For production, consider:
  - Hosting own Nominatim instance
  - Using commercial geocoding service
  - Implementing caching

#### Country Limitation
- Currently searches only in Sri Lanka
- To expand: Remove ", Sri Lanka" from query

## Browser Compatibility

### Fully Supported
✅ Chrome 90+
✅ Firefox 88+
✅ Edge 90+
✅ Safari 14+

### Features Used
- Async/await
- ES6+ JavaScript
- CSS Grid/Flexbox
- Fetch API
- React Hooks

## Performance Considerations

### Optimizations Implemented
1. **Debounced Search**: Reduces API calls
2. **Result Limit**: Maximum 5 suggestions
3. **Lazy Loading**: Suggestions loaded on-demand
4. **Event Cleanup**: Timeouts cleared properly

### Potential Improvements
1. **Caching**: Store recent searches
2. **Offline Support**: Use local city database
3. **Predictive Search**: Show popular cities first
4. **Geolocation**: Auto-detect user's location

## Troubleshooting

### Dropdown Not Appearing
**Causes**:
- Less than 2 characters typed
- No matching cities found
- API connection issue

**Solutions**:
- Type at least 2 characters
- Check internet connection
- Verify browser console for errors

### Map Not Updating
**Causes**:
- MapUpdater component not rendering
- Invalid coordinates
- React-Leaflet version mismatch

**Solutions**:
- Check browser console
- Verify coordinates are valid numbers
- Ensure react-leaflet is properly installed

### Suggestions Not Closing
**Causes**:
- Event handler timing issue
- State update delay

**Solutions**:
- Click outside the dropdown
- Refresh the page
- Check `onBlur` handler

## Security Considerations

### Current Implementation
- Uses HTTPS for API calls
- No sensitive data in requests
- Read-only API operations

### Recommendations for Production
1. **API Key**: Use authenticated geocoding service
2. **Rate Limiting**: Implement frontend rate limiting
3. **Input Validation**: Sanitize user input
4. **CORS**: Ensure proper CORS configuration
5. **Error Handling**: Hide API details from users

## Future Enhancements

### Possible Improvements

1. **Recent Searches**
   - Store last 5 searches
   - Quick access to frequently used locations

2. **Map Styles**
   - Multiple map layer options
   - Satellite view
   - Terrain view

3. **Bulk Location Import**
   - CSV upload with addresses
   - Auto-geocoding

4. **Location Favorites**
   - Save common locations
   - One-click selection

5. **Advanced Filtering**
   - Filter by region/province
   - Filter by location type

6. **Mobile Optimization**
   - Touch-friendly suggestions
   - GPS integration
   - Current location button

## Dependencies

### Required Packages
- `react`: ^18.x
- `react-leaflet`: ^4.x
- `leaflet`: ^1.9.x
- `axios`: For API calls

### External APIs
- **Nominatim** (OpenStreetMap): Free geocoding service

## Code Structure

### File Organization
```
frontend/src/Components/Inventory/
├── AddRawMaterial.js      # Main component with autocomplete
├── AddRawMaterial.css     # Styling with dropdown styles
└── ...
```

### Key Components
1. **AddRawMaterial**: Main form component
2. **MapUpdater**: Dynamic map center updater
3. **City Suggestions Dropdown**: Autocomplete UI

## API Response Examples

### Successful Search Response
```json
[
  {
    "place_id": 12345,
    "display_name": "Colombo, Western Province, Sri Lanka",
    "lat": "6.9270786",
    "lon": "79.861243",
    "address": {
      "city": "Colombo",
      "state": "Western Province",
      "country": "Sri Lanka",
      "country_code": "lk"
    }
  }
]
```

### Component State After Selection
```javascript
{
  collectedLocationName: "Colombo, Western Province, Sri Lanka",
  collectedLocation: {
    lat: 6.9270786,
    lng: 79.861243
  }
}
```

## Contact & Support
For issues or questions about this feature:
- Check browser console for errors
- Verify internet connectivity
- Review Nominatim API status

---

**Last Updated**: October 13, 2025
**Version**: 1.0.0
**Status**: ✅ Fully Implemented and Ready for Testing
**Feature Branch**: feat/invenotry_email
