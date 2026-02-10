$files = "rooms.html", "dining.html", "booking.html", "contact.html"
$pattern = '</head>'
$replacement = '<link rel="stylesheet" href="style.css"></head>'

foreach ($file in $files) {
    (Get-Content $file) -replace $pattern, $replacement | Set-Content $file
}
Write-Host "Added CSS link."
