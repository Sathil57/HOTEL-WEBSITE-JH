$files = "rooms.html", "dining.html", "booking.html", "contact.html"
$pattern = '<link href="https://fonts.googleapis.com/css2\?family=Playfair\+Display:wght@400;700&family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">'
$replacement = '<link rel="stylesheet" href="style.css">'

foreach ($file in $files) {
    (Get-Content $file) -replace $pattern, $replacement | Set-Content $file
}
Write-Host "Updated files."
