import { db, collection, getDocs, query, orderBy } from './firebase-config.js';

// Global function to apply filters
window.applyFilters = async function() {
    const loc = document.getElementById('searchLocation').value;
    const type = document.getElementById('searchType').value;
    const budget = parseInt(document.getElementById('searchBudget').value);
    const grid = document.getElementById('propertyGrid');

    grid.innerHTML = "<div class='loader'>Searching...</div>";

    const q = query(collection(db, "properties"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    
    let html = "";
    let found = false;

    querySnapshot.forEach((doc) => {
        const p = doc.data();
        const price = parseInt(p.price);

        // Filter Logic
        if ((loc === "" || p.location === loc) && 
            (type === "" || p.type === type) && 
            (price <= budget)) {
            
            found = true;
            html += `
                <div class="card">
                    <img src="${p.image}" alt="Property">
                    <div class="card-body">
                        <span class="tag">${p.type}</span>
                        <h3>${p.title}</h3>
                        <p><i class="fas fa-map-marker-alt"></i> ${p.location}</p>
                        <div class="price">₹${price.toLocaleString('en-IN')}</div>
                        <a href="tel:${p.mobile}" class="btn-call">Call Owner</a>
                    </div>
                </div>`;
        }
    });

    grid.innerHTML = found ? html : "<p>No properties match your criteria.</p>";
};

// Initial load
window.onload = applyFilters;
// Filter Functionality
function applyFilters() {
    const loc = document.getElementById('searchLocation').value;
    const type = document.getElementById('searchType').value;
    const allProps = JSON.parse(localStorage.getItem('mayra_properties'));

    const filtered = allProps.filter(p => {
        return (loc === "" || p.location === loc) && (type === "" || p.type === type);
    });

    displayProperties(filtered);
}

// Modal Details
function viewDetails(id) {
    const allProps = JSON.parse(localStorage.getItem('mayra_properties'));
    const p = allProps.find(item => item.id == id);
    const modal = document.getElementById('propModal');
    const content = document.getElementById('modalDetails');

    content.innerHTML = `
        <img src="${p.image}" style="width:100%; border-radius:10px; margin-bottom:15px;">
        <h2>${p.title}</h2>
        <p><strong>Location:</strong> ${p.location}</p>
        <p><strong>Area:</strong> ${p.area}</p>
        <p><strong>Price:</strong> ${formatCurrency(p.price)}</p>
        <p style="margin: 15px 0;">${p.desc || 'No additional description provided.'}</p>
        <div style="display:flex; gap:10px;">
            <a href="tel:9512134343" class="btn-search" style="flex:1; text-align:center; text-decoration:none;">
                <i class="fas fa-phone"></i> Call Now
            </a>
            <a href="https://wa.me/919512134343?text=Interest in ${p.title}" class="btn-search" style="flex:1; text-align:center; text-decoration:none; background:#25D366;">
                <i class="fab fa-whatsapp"></i> WhatsApp
            </a>
        </div>
    `;
    modal.style.display = "block";
}

function closeModal() {
    document.getElementById('propModal').style.display = "none";
}

// Load properties when page opens
window.onload = () => {
    const data = JSON.parse(localStorage.getItem('mayra_properties'));
    displayProperties(data);
};
// js/app.js - Loading data from the IndexedDB "Database"

async function loadWebPage() {
    const propertyGrid = document.getElementById('propertyGrid');
    if (!propertyGrid) return;

    // 1. Get properties from our Database
    const dbProperties = await getAllPropertiesFromDB();
    
    // 2. Reverse to show newest first (like MagicBricks)
    const displayList = dbProperties.reverse();

    if (displayList.length === 0) {
        propertyGrid.innerHTML = "<p>No properties found. Be the first to post!</p>";
        return;
    }

    // 3. Render the HTML
    propertyGrid.innerHTML = displayList.map(prop => `
        <div class="card">
            <div class="tag">${prop.status}</div>
            <img src="${prop.image}" alt="Property Image">
            <div class="card-body">
                <span style="font-size: 0.8rem; color: #666;">Posted: ${prop.date}</span>
                <h3>${prop.title}</h3>
                <p><i class="fas fa-map-marker-alt"></i> ${prop.location}, Ahmedabad</p>
                <p><i class="fas fa-th-large"></i> ${prop.area}</p>
                <div class="price">₹${Number(prop.price).toLocaleString('en-IN')}</div>
                <button class="btn-search" style="width:100%" onclick="viewDetails(${prop.id})">View Details</button>
            </div>
        </div>
    `).join('');
}

// Run the loader when the window opens
window.addEventListener('DOMContentLoaded', loadWebPage);
