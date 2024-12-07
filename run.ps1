# Build the project
npm run build

# check if the first argument is empty
if ($args.Length -eq 0) {
    Write-Host "Please provide the target file name"
    exit
}
$target = $args[0]

# check if the target file exists
$targetFile = "dist/$target.js"
if (-not (Test-Path $targetFile)) {
    Write-Host "File $targetFile does not exist"
    exit
}

# echo a separator
Write-Host "----------------------------------------"

# run the target file with rest of the arguments
node $targetFile $args[1..($args.Length - 1)]
