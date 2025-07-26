# Check all JSON files for validity
Get-ChildItem -Path . -Filter *.json -Recurse | ForEach-Object {
    try {
        $null = Get-Content -Path $_.FullName -Raw | ConvertFrom-Json
        Write-Host "✅ Valid JSON: $($_.FullName)"
    } catch {
        Write-Host "❌ Invalid JSON: $($_.FullName)"
        Write-Host "Error: $_"
    }
} 