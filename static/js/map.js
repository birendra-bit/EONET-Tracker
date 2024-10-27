function toggleFilters() {
    const filtersPanel = document.querySelector('.filters-panel');
    filtersPanel.classList.toggle('collapsed');
}

// Initialize the filters panel
document.addEventListener('DOMContentLoaded', function() {
    const filtersPanel = document.querySelector('.filters-panel');
    const toggleBtn = document.querySelector('.toggle-filters');
    
    // Initialize as expanded
    if (filtersPanel) {
        filtersPanel.classList.remove('collapsed');
    }

    // Add click handler to toggle button
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            toggleFilters();
        });
    }

    // Close overlay when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.map-filters-overlay') && 
            !e.target.closest('.toggle-filters')) {
            filtersPanel.classList.add('collapsed');
        }
    });
});

// Update map when filters change
function updateMapWithFilters() {
    const eventType = document.getElementById('eventType').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const magnitudeValues = document.getElementById('magnitudeSlider').noUiSlider.get();

    // Show loading overlay
    document.querySelector('.loading-overlay').style.display = 'flex';

    // Construct URL with filter parameters
    const params = new URLSearchParams({
        event_type: eventType,
        start_date: startDate,
        end_date: endDate,
        min_magnitude: magnitudeValues[0],
        max_magnitude: magnitudeValues[1]
    });

    // Fetch updated map
    fetch(`/api/map?${params}`)
        .then(response => response.text())
        .then(mapHtml => {
            document.querySelector('.map-container').innerHTML = mapHtml;
            // Re-add the overlays after map update
            addOverlaysToMap();
        })
        .catch(error => console.error('Error updating map:', error))
        .finally(() => {
            document.querySelector('.loading-overlay').style.display = 'none';
        });
}

// Function to re-add overlays after map updates
function addOverlaysToMap() {
    const mapContainer = document.querySelector('.map-container');
    
    // Re-add filter overlay
    if (!mapContainer.querySelector('.map-filters-overlay')) {
        mapContainer.insertAdjacentHTML('beforeend', `
            <div class="map-filters-overlay">
                <!-- Filter overlay content -->
            </div>
        `);
    }
    
    // Re-add legend
    if (!mapContainer.querySelector('.map-legend')) {
        mapContainer.insertAdjacentHTML('beforeend', `
            <div class="map-legend">
                <h4>Event Intensity</h4>
                <div class="legend-item">
                    <span style="color: #FFEB3B">●</span> Low (0-3)
                </div>
                <div class="legend-item">
                    <span style="color: #FF9800">●</span> Medium (3-6)
                </div>
                <div class="legend-item">
                    <span style="color: #F44336">●</span> High (6+)
                </div>
            </div>
        `);
    }
}

// Add event listeners for filter changes
document.querySelectorAll('.filter-group select, .filter-group input').forEach(element => {
    element.addEventListener('change', updateMapWithFilters);
});

if (document.getElementById('magnitudeSlider').noUiSlider) {
    document.getElementById('magnitudeSlider').noUiSlider.on('change', updateMapWithFilters);
}