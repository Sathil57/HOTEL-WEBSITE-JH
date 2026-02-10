$images = @{
    "hotel-hero.jpg" = "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    "hotel-interior.jpg" = "https://images.pexels.com/photos/2017802/pexels-photo-2017802.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    "room-deluxe.jpg" = "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    "room-suite.jpg" = "https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    "dining.jpg" = "https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    "food-1.jpg" = "https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    "food-2.jpg" = "https://images.pexels.com/photos/1251208/pexels-photo-1251208.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    "food-3.jpg" = "https://images.pexels.com/photos/3026808/pexels-photo-3026808.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
}

$dest = "c:\Users\Methul Minlaka\Desktop\HOTEL WEBSITE\images"
if (!(Test-Path $dest)) {
    New-Item -ItemType Directory -Force -Path $dest
}

foreach ($key in $images.Keys) {
    if (!(Test-Path "$dest\$key")) {
        Write-Host "Downloading $key..."
        Invoke-WebRequest -Uri $images[$key] -OutFile "$dest\$key"
    } else {
        Write-Host "$key already exists."
    }
}
Write-Host "Done!"
