$files = @(
    "C:\Users\Ismaila Ngom\Documents\portail-tourisme\src\app\views\other-pages\etape-detail\etape-detail.component.html"
)

foreach ($file in $files) {
    # On lit le contenu (il lira peut-être avec un encodage ANSI local où  est converti en autre chose, on va juste utiliser un regex large)
    $content = Get-Content -Path $file -Raw

    $content = $content -replace 'D[^\w\s]couvrez', 'Découvrez'
    $content = $content -replace '[^\w\s]tapes', 'étapes'
    $content = $content -replace 'Pr[^\w\s]t', 'Prêt'
    $content = $content -replace 'd[^\w\s]marrer', 'démarrer'
    $content = $content -replace "l'[^\w\s]tape", "l'étape"
    $content = $content -replace '[^\w\s]tape', 'étape'
    $content = $content -replace 'd[^\w\s]s', 'dès'
    $content = $content -replace 'd[^\w\s]marche', 'démarche'
    $content = $content -replace 'inform[^\w\s]', 'informé'
    $content = $content -replace 'actualit[^\w\s]s', 'actualités'
    $content = $content -replace 'r[^\w\s]pondre', 'répondre'
    $content = $content -replace 'S[^\w\s]n[^\w\s]gal', 'Sénégal'
    
    # Write back in UTF-8
    [System.IO.File]::WriteAllText($file, $content, [System.Text.Encoding]::UTF8)
}
