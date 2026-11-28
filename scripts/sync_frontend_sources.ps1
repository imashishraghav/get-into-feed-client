# PowerShell mirror sync: frontend/src -> src
$source = "frontend\src"
$dest = "src"

if (!(Test-Path $source)) {
    Write-Error "Source path $source does not exist!"
    exit 1
}

if (!(Test-Path $dest)) {
    New-Item -ItemType Directory -Path $dest -Force | Out-Null
}

# Copy / update all files from source to dest
Get-ChildItem -Path $source -Recurse | ForEach-Object {
    $relPath = Resolve-Path -Path $_.FullName -Relative
    $relPath = $relPath.Substring(15) # Strip ".\frontend\src\"
    $destPath = Join-Path $dest $relPath

    if ($_.PSIsContainer) {
        if (!(Test-Path $destPath)) {
            New-Item -ItemType Directory -Path $destPath -Force | Out-Null
            Write-Output "Created dir: $destPath"
        }
    } else {
        $shouldCopy = $true
        if (Test-Path $destPath) {
            $srcBytes = [System.IO.File]::ReadAllBytes($_.FullName)
            $destBytes = [System.IO.File]::ReadAllBytes($destPath)
            if ($srcBytes.Length -eq $destBytes.Length) {
                $match = $true
                for ($i = 0; $i -lt $srcBytes.Length; $i++) {
                    if ($srcBytes[$i] -ne $destBytes[$i]) {
                        $match = $false
                        break
                    }
                }
                if ($match) { $shouldCopy = $false }
            }
        }
        if ($shouldCopy) {
            $destDir = Split-Path $destPath -Parent
            if (!(Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir -Force | Out-Null }
            Copy-Item -Path $_.FullName -Destination $destPath -Force
            Write-Output "Synced: $destPath"
        }
    }
}

# Remove orphaned items in dest that do not exist in source
Get-ChildItem -Path $dest -Recurse | ForEach-Object {
    $relPath = Resolve-Path -Path $_.FullName -Relative
    $relPath = $relPath.Substring(6) # Strip ".\src\"
    $srcPath = Join-Path $source $relPath
    if (!(Test-Path $srcPath)) {
        Remove-Item -Path $_.FullName -Recurse -Force
        Write-Output "Removed orphaned: $($_.FullName)"
    }
}

Write-Output "✅ Source synchronization complete: src/ is now bit-for-bit identical to frontend/src/"
