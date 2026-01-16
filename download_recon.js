// Filename: download_recon.js

function downloadReconciliation() {
    // Check if data exists
    if (typeof filteredData === 'undefined' || !filteredData || filteredData.length === 0) {
        Swal.fire("No Data", "There is no data to download.", "warning");
        return;
    }

    // 1. Define Headers
    const header = [
        "AssetID", 
        "Serial No", 
        "Category", 
        "Brand", 
        "Model", 
        "Location", 
        "Status", 
        "Assigned To Name", 
        "Assigned To Emp ID", 
        "Assigned At",  // New Column
        "Remarks"       // New Column
    ];
    
    // 2. Map Data to Rows
    const rows = filteredData.map(item => {
        // --- SPLIT NAME & ID ---
        let rawAssign = item.assignedTo || "";
        let empName = rawAssign;
        let empId = "";

        if (rawAssign.includes("(") && rawAssign.includes(")")) {
            let splitArr = rawAssign.split('(');
            empName = splitArr[0].trim();
            empId = splitArr[1].replace(')', '').trim();
        }

        // --- FORMAT DATE (DD-MM-YYYY) ---
        let finalDate = "";
        if (item.assignedAt) {
            let d = new Date(item.assignedAt);
            if (!isNaN(d.getTime())) {
                let day = String(d.getDate()).padStart(2, '0');
                let month = String(d.getMonth() + 1).padStart(2, '0');
                let year = d.getFullYear();
                finalDate = `${day}-${month}-${year}`;
            } else {
                finalDate = item.assignedAt; // Keep original string if parsing fails
            }
        }

        return [
            item.id || '',
            item.serial || '',
            item.category || '',
            item.brand || '',
            item.model || '',
            item.location || '',
            item.status || '',
            empName,
            empId,
            finalDate,       // Mapped Date
            item.remarks || '' // Mapped Remarks
        ];
    });

    // 3. Add Header
    rows.unshift(header);

    // 4. Convert to CSV
    let csvContent = "data:text/csv;charset=utf-8," 
        + rows.map(e => e.map(i => `"${String(i).replace(/"/g, '""')}"`).join(",")).join("\n");

    // 5. Download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    
    const today = new Date().toISOString().slice(0,10);
    link.setAttribute("download", `Reconciliation_Report_${today}.csv`);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 6. Success
    Swal.fire({
        title: "Downloaded!",
        text: "Report generated successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false
    });
}
